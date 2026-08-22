/**
 * Rewrite backend storage URLs to same-origin website proxy paths.
 * Keeps the Django API origin out of public HTML/JSON served to browsers.
 */

const STORAGE_FILE_PATH =
  /(?:https?:\/\/[^/]+)?\/api\/v1\/storage\/files\/([0-9a-f-]{36})\/content\/?/gi;

export function publicMediaUrl(fileId: string): string {
  return `/server/media/files/${fileId}/content/`;
}

export function rewriteStorageUrl(value: string): string {
  if (!value) return value;
  return value.replace(STORAGE_FILE_PATH, (_match, fileId: string) => publicMediaUrl(fileId));
}

export function sanitizePublicPayload<T>(payload: T): T {
  if (payload == null) return payload;

  if (typeof payload === "string") {
    return rewriteStorageUrl(payload) as T;
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizePublicPayload(item)) as T;
  }

  if (typeof payload === "object") {
    const next: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
      next[key] = sanitizePublicPayload(value);
    }
    return next as T;
  }

  return payload;
}
