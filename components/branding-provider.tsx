'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface BrandSettings {
  platform_name: string;
  tagline: string;
  company_name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  success_color: string;
  warning_color: string;
  danger_color: string;
  background_color: string;
  card_background_color: string;
  border_color: string;
  logo_url: string;
  logo_dark_url: string;
  logo_light_url: string;
  logo_icon_url: string;
  favicon_url: string;
}

const defaultBrandSettings: BrandSettings = {
  platform_name: "Zamzarc",
  tagline: "Smart ID Card Management & Printing Platform",
  company_name: "Zamzarc",
  primary_color: "#2563EB",
  secondary_color: "#0F172A",
  accent_color: "#14B8A6",
  success_color: "#22C55E",
  warning_color: "#F59E0B",
  danger_color: "#EF4444",
  background_color: "#FFFFFF",
  card_background_color: "#FFFFFF",
  border_color: "#E5E7EB",
  logo_url: "/logo.png",
  logo_dark_url: "/logo.png",
  logo_light_url: "/logo.png",
  logo_icon_url: "/logo.png",
  favicon_url: "/favicon.ico"
};

interface BrandingContextType {
  brandSettings: BrandSettings;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isLoading: boolean;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [brandSettings] = useState<BrandSettings>(defaultBrandSettings);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    root.style.setProperty('--primary', brandSettings.primary_color);
    root.style.setProperty('--secondary', brandSettings.secondary_color);
    root.style.setProperty('--accent', brandSettings.accent_color);
    root.style.setProperty('--success', brandSettings.success_color);
    root.style.setProperty('--error', brandSettings.danger_color);
    
    root.style.setProperty('--background', theme === 'dark' ? '#030712' : brandSettings.background_color);
    root.style.setProperty('--card-bg', theme === 'dark' ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.7)');
    root.style.setProperty('--card-border', theme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(226, 232, 240, 0.8)');
    root.style.setProperty('--muted-bg', theme === 'dark' ? '#1f2937' : '#f1f5f9');
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--foreground', '#f3f4f6');
      root.style.setProperty('--muted', '#9ca3af');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--foreground', '#0b0f19');
      root.style.setProperty('--muted', '#64748b');
    }

    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = brandSettings.favicon_url;
  }, [brandSettings, theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <BrandingContext.Provider value={{ brandSettings, theme, toggleTheme, isLoading }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}
