"use client";

import React from "react";
import { Shield } from "lucide-react";
import { useBranding } from "@/components/branding-provider";

export default function Privacy() {
  const { brandSettings } = useBranding();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <Shield className="w-3.5 h-3.5" /> Privacy
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted">
          {brandSettings.platform_name} by {brandSettings.company_name}
        </p>
      </div>
      
      <div className="prose dark:prose-invert max-w-none border border-card-border bg-card-bg/30 rounded-2xl p-8 sm:p-12 space-y-6 text-sm text-muted leading-relaxed">
        <p>
          At {brandSettings.platform_name}, we value your privacy and are committed to protecting your personal data. This Privacy Policy describes how we collect, use, and share your information when you use our platform.
        </p>
        
        <h2 className="text-lg font-bold text-foreground mt-6">1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us when creating an account, uploading templates, importing member rosters (students or employees), and executing transactions. This includes your name, email address, company or school details, payment information, and physical address.
        </p>
        
        <h2 className="text-lg font-bold text-foreground mt-6">2. How We Use Your Information</h2>
        <p>
          We use the information we collect to operate, maintain, and improve our services, facilitate the creation and printing of ID cards, process transactions, and communicate with you about updates, promotions, and security alerts.
        </p>
        
        <h2 className="text-lg font-bold text-foreground mt-6">3. Data Retention and Security</h2>
        <p>
          All data uploaded to {brandSettings.platform_name} is securely stored in centralized databases. We implement industry-standard encryption and security measures to protect your data from unauthorized access, loss, or disclosure.
        </p>
        
        <h2 className="text-lg font-bold text-foreground mt-6">4. Cookies and Local Storage</h2>
        <p>
          We use functional local storage keys such as session tokens to maintain your authentication state and preferences. We do not use persistent local database stores as a source of truth for business entity data.
        </p>
      </div>
    </div>
  );
}
