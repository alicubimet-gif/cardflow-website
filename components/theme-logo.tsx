"use client";

/**
 * ThemeLogo — shared, theme-aware logo component.
 *
 * Assets:
 *   /branding/logo-dark.png  → dark-coloured logo  → visible in LIGHT mode
 *   /branding/logo-light.png → light-coloured logo → visible in DARK  mode
 *
 * Hydration strategy:
 *   During SSR and the first client render, `isLoading` from BrandingProvider
 *   is true. We render a same-size placeholder skeleton during that window so
 *   the server HTML and the initial client HTML are identical. After mount the
 *   correct logo is shown without any flash or hydration warning.
 */

import Image from "next/image";
import { useBranding } from "@/components/branding-provider";

interface ThemeLogoProps {
  /** Rendered width in pixels (both logos use the same dimensions). */
  width?: number;
  /** Rendered height in pixels. */
  height?: number;
  /** Extra Tailwind / CSS classes applied to the <Image> element. */
  className?: string;
  /** Pass true for above-the-fold logos to trigger LCP preloading. */
  priority?: boolean;
}

export function ThemeLogo({
  width = 140,
  height = 36,
  className = "",
  priority = false,
}: ThemeLogoProps) {
  const { theme, isLoading } = useBranding();

  // Render a fixed-size skeleton while the client hasn't resolved the theme
  // yet. This keeps the server and initial client HTML identical, preventing
  // React hydration mismatches.
  if (isLoading) {
    return (
      <div
        aria-hidden
        style={{ width, height }}
        className="rounded-md animate-pulse bg-slate-200 dark:bg-slate-700 shrink-0"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <Image
      src={isDark ? "/branding/logo-light.png" : "/branding/logo-dark.png"}
      alt="Zamzarc"
      width={width}
      height={height}
      priority={priority}
      className={`object-contain shrink-0 ${className}`}
    />
  );
}
