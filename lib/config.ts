export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/server';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || APP_URL || 'http://localhost:3000';

/** Canonical public Privacy & Policy URL. Apps should deep-link here. */
export const PRIVACY_POLICY_URL = `${SITE_URL.replace(/\/$/, '')}/privacy`;

/**
 * Studio Hub / Studio App URL.
 * Prefer NEXT_PUBLIC_STUDIO_URL; also accept STUDIO_APP_URL / NEXT_PUBLIC_STUDIO_APP_URL
 * (names used in backend / deployment docs).
 */
export const STUDIO_URL =
  process.env.NEXT_PUBLIC_STUDIO_URL ||
  process.env.NEXT_PUBLIC_STUDIO_APP_URL ||
  process.env.STUDIO_APP_URL ||
  'http://localhost:3001';

export const GOOGLE_MAPS_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || 'https://maps.google.com/?q=Zamirzac+Solutions,+Calicut,+Kerala,+India';

export function getServerApiBase(): string {
  if (typeof window !== 'undefined') return API_BASE;
  return APP_URL ? `${APP_URL.replace(/\/$/, '')}${API_BASE}` : API_BASE;
}

/** Absolute Studio login URL (website never posts credentials itself). */
export function getStudioLoginUrl(search = ''): string {
  const base = STUDIO_URL.replace(/\/$/, '');
  const qs = search.startsWith('?') ? search : search ? `?${search}` : '';
  return `${base}/login${qs}`;
}
