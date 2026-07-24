export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/server';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || APP_URL || 'http://localhost:3000';
export const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || 'http://localhost:3001';
export const GOOGLE_MAPS_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || 'https://maps.google.com/?q=Zamirzac+Solutions,+Calicut,+Kerala,+India';

export function normalizeBackendUrl(value?: string | null): string {
  return String(value || '').trim().replace(/\/$/, '').replace(/\/api$/, '');
}

export function getBackendUrl(): string {
  return normalizeBackendUrl(
    process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ''
  );
}

export function getServerApiBase(): string {
  if (typeof window !== 'undefined') return API_BASE;
  return APP_URL ? `${APP_URL.replace(/\/$/, '')}${API_BASE}` : API_BASE;
}

export function getBackendApiUrl(path = ''): string {
  const backendUrl = getBackendUrl();
  if (!backendUrl) {
    throw new Error('BACKEND_URL or NEXT_PUBLIC_BACKEND_URL is required.');
  }
  const cleanPath = path.replace(/^\/+/, '');
  return `${backendUrl}/api/${cleanPath}`;
}
