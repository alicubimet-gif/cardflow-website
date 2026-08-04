import { getServerApiBase } from "./config";

/**
 * Lightweight public API request helper for the cardflow-website.
 *
 * Routes through the Next.js server-side proxy (/server/*) which forwards
 * requests to the Django backend. Does NOT attach access tokens — all
 * website endpoints are public or handled by the proxy.
 *
 * Throws an enriched error on:
 *   - Non-2xx HTTP responses
 *   - Responses where { success: false } AND the HTTP status is also an error
 *
 * Does NOT throw when the HTTP status is 2xx even if the body has no
 * `success` field (e.g. the backend returns {detail: "..."} on 201).
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const base = typeof window !== "undefined" ? "" : getServerApiBase();
  const url = endpoint.startsWith("http") ? endpoint : `${base}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch (networkError: any) {
    // Fetch itself failed — no network connection, DNS failure, etc.
    const error: any = new Error(
      "Unable to connect to the server. Please check your internet connection."
    );
    error.code = "NETWORK_ERROR";
    error.status = 0;
    error.data = null;
    throw error;
  }

  // Parse JSON — guard against empty or non-JSON bodies
  let data: any = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    // Non-JSON body (plain text, HTML error pages, etc.)
    const text = await response.text().catch(() => "");
    data = text ? { detail: text } : null;
  }

  // ── Success: 2xx status ────────────────────────────────────────────────────
  // The proxy wraps all successful backend responses in {success: true, ...}.
  // We do NOT throw just because a `success` field is absent on a 2xx response.
  if (response.ok) {
    return data as T;
  }

  // ── Error: non-2xx status ──────────────────────────────────────────────────
  // Build an enriched error the catch blocks and error handlers can inspect.
  const errorMessage =
    data?.message ||
    data?.detail ||
    data?.error ||
    `Request failed with status ${response.status}`;

  const error: any = new Error(errorMessage);
  error.code = data?.code ?? null;
  error.status = response.status;
  error.data = data;

  // Surface field-level DRF validation errors for direct setError() calls
  if (
    (response.status === 400 || response.status === 409 || response.status === 422) &&
    data &&
    typeof data === "object"
  ) {
    // If the proxy wraps errors as { errors: {...} }, unwrap them
    const fieldErrors = data.errors ?? data;
    const fields: Record<string, string> = {};
    for (const [key, value] of Object.entries(fieldErrors)) {
      if (["success", "message", "detail", "code", "errors", "type", "title", "status"].includes(key)) continue;
      const msg = Array.isArray(value) ? String(value[0]) : String(value);
      fields[key] = msg;
    }
    if (Object.keys(fields).length > 0) {
      error.fieldErrors = fields;
    }
  }

  throw error;
}
