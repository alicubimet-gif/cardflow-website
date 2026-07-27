import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/config";

/**
 * POST /server/auth/register-subscriber
 *
 * Proxies to: POST /api/auth/register/
 *
 * Backend (CompanySignupSerializer) expects:
 *   company_name  string  required
 *   first_name    string  required
 *   last_name     string  required
 *   email         string  required
 *   phone         string  optional
 *
 * On success (201) the backend returns:
 *   { "detail": "Company registered successfully. Please check your email to complete setup." }
 *
 * This proxy normalises the response to:
 *   { success: true, detail: "..." }          — on 201
 *   { success: false, code: "ACCOUNT_EXISTS" } — on duplicate email 400
 *   { success: false, message: "...", errors: {...} } — on other 400 validation errors
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Split "Full Name" → first_name + last_name for the backend serializer
    const nameParts = (body.name || "").trim().split(/\s+/);
    const first_name = nameParts[0] || "";
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "-";

    // Build the exact payload the CompanySignupSerializer expects
    const backendPayload: Record<string, string> = {
      company_name: (body.company || "").trim(),
      first_name,
      last_name,
      email: (body.email || "").trim().toLowerCase(),
      phone: (body.phone || "").trim(),
    };

    let response: Response;
    try {
      response = await fetch(getBackendApiUrl("auth/register/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendPayload),
      });
    } catch (networkError: any) {
      console.error("[Proxy /register-subscriber] Network error reaching backend:", networkError);
      return NextResponse.json(
        {
          success: false,
          code: "NETWORK_ERROR",
          message: "Unable to reach the server. Please check your connection and try again.",
        },
        { status: 503 }
      );
    }

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("[Proxy /register-subscriber] Backend returned non-JSON:", text.slice(0, 200));
      return NextResponse.json(
        { success: false, code: "INVALID_RESPONSE", message: "The server returned an unexpected response. Please try again." },
        { status: 502 }
      );
    }

    // ── 201 Created — registration succeeded ──────────────────────────────────
    if (response.status === 201) {
      return NextResponse.json(
        {
          success: true,
          detail: data.detail || "Registration successful. Please check your email to complete setup.",
        },
        { status: 201 }
      );
    }

    // ── 400 Validation errors ─────────────────────────────────────────────────
    if (response.status === 400 && data && typeof data === "object") {
      // Duplicate email — show the "Account Already Exists" card
      const emailErrors: string[] = Array.isArray(data.email) ? data.email : [];
      const isDuplicate = emailErrors.some(
        (msg) =>
          typeof msg === "string" &&
          (msg.toLowerCase().includes("already exists") ||
            msg.toLowerCase().includes("already registered") ||
            msg.toLowerCase().includes("already taken"))
      );
      if (isDuplicate) {
        return NextResponse.json(
          {
            success: false,
            code: "ACCOUNT_EXISTS",
            message: "An account with this email already exists.",
          },
          { status: 400 }
        );
      }

      // Other field-level validation errors — pass them through as-is so the
      // frontend can display them on the correct form fields.
      return NextResponse.json(
        {
          success: false,
          message: data.detail || data.message || "Please correct the highlighted fields.",
          errors: data,
        },
        { status: 400 }
      );
    }

    // ── 429 Rate limit ────────────────────────────────────────────────────────
    if (response.status === 429) {
      return NextResponse.json(
        {
          success: false,
          code: "RATE_LIMITED",
          message: "Too many registration attempts. Please wait a few minutes and try again.",
        },
        { status: 429 }
      );
    }

    // ── 5xx Server errors ─────────────────────────────────────────────────────
    if (response.status >= 500) {
      console.error("[Proxy /register-subscriber] Backend error:", response.status, text.slice(0, 500));
      return NextResponse.json(
        {
          success: false,
          code: "SERVER_ERROR",
          message: "A server error occurred. Our team has been notified. Please try again shortly.",
        },
        { status: 502 }
      );
    }

    // ── Fallthrough — pass other responses verbatim ────────────────────────────
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[Proxy /register-subscriber] Unhandled error:", error);
    return NextResponse.json(
      { success: false, code: "PROXY_ERROR", message: "An internal error occurred. Please try again." },
      { status: 500 }
    );
  }
}
