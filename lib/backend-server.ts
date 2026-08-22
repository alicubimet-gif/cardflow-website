/**
 * Server-only backend URL helpers.
 * Use BACKEND_URL (never NEXT_PUBLIC_*) so the API origin is not bundled for the browser.
 */

export function normalizeBackendUrl(value?: string | null): string {
  return String(value || "")
    .trim()
    .replace(/\/$/, "")
    .replace(/\/api$/, "");
}

export function getBackendUrl(): string {
  return normalizeBackendUrl(process.env.BACKEND_URL || "");
}

export function getBackendApiUrl(path = ""): string {
  const backendUrl = getBackendUrl();
  if (!backendUrl) {
    throw new Error("BACKEND_URL is required for server-side API proxying.");
  }
  const cleanPath = path.replace(/^\/+/, "");
  return `${backendUrl}/api/${cleanPath}`;
}
