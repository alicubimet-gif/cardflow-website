import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/backend-server";

/**
 * POST /server/auth/register-subscriber
 *
 * Proxies to: POST /api/public/auth/register/
 *
 * Website form fields → ZCards StudioRegisterSerializer:
 *   name     → full_name
 *   email    → email
 *   phone    → mobile
 *   company  → studio_name
 *
 * Normalised proxy responses (keeps existing register UI working):
 *   201 → { success: true, detail, registration_id?, email?, studio_name? }
 *   409 email_taken → { success: false, code: "ACCOUNT_EXISTS", message }
 *   400/422 validation → { success: false, message, errors }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendPayload: Record<string, string> = {
      full_name: String(body.name || body.full_name || "").trim(),
      email: String(body.email || "").trim().toLowerCase(),
      mobile: String(body.phone || body.mobile || "").trim(),
      studio_name: String(body.company || body.studio_name || "").trim(),
    };

    let response: Response;
    try {
      response = await fetch(getBackendApiUrl("public/auth/register/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendPayload),
      });
    } catch (networkError: unknown) {
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
        {
          success: false,
          code: "INVALID_RESPONSE",
          message: "The server returned an unexpected response. Please try again.",
        },
        { status: 502 }
      );
    }

    if (response.status === 201) {
      return NextResponse.json(
        {
          success: true,
          detail:
            data.detail ||
            "Registration created. Check your email to verify your account.",
          registration_id: data.registration_id,
          email: data.email,
          studio_name: data.studio_name,
        },
        { status: 201 }
      );
    }

    const code = typeof data?.code === "string" ? data.code : "";
    const errors = data?.errors && typeof data.errors === "object" ? data.errors : data;

    // Duplicate email — keep ACCOUNT_EXISTS for the existing register UI card
    if (
      response.status === 409 &&
      (code === "email_taken" ||
        String(data?.detail || "")
          .toLowerCase()
          .includes("email already"))
    ) {
      return NextResponse.json(
        {
          success: false,
          code: "ACCOUNT_EXISTS",
          message: data.detail || "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    // Duplicate studio name → map to company field for the form
    if (response.status === 409 && code === "studio_name_taken") {
      return NextResponse.json(
        {
          success: false,
          message: data.detail || "A studio with this name already exists.",
          errors: { company: [data.detail || "This company / studio name is already taken."] },
        },
        { status: 400 }
      );
    }

    if (response.status === 400 || response.status === 422) {
      // Remap ZCards field names → website form field names
      const mappedErrors: Record<string, unknown> = {};
      const source =
        (data?.errors && typeof data.errors === "object" && !Array.isArray(data.errors)
          ? data.errors
          : null) ||
        (errors && typeof errors === "object" && !Array.isArray(errors) ? errors : {});
      for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
        if (["type", "title", "status", "detail", "code", "errors", "success", "message"].includes(key)) {
          continue;
        }
        if (key === "full_name") mappedErrors.name = value;
        else if (key === "mobile") mappedErrors.phone = value;
        else if (key === "studio_name") mappedErrors.company = value;
        else mappedErrors[key] = value;
      }

      const firstFieldMessage = Object.values(mappedErrors)
        .map((value) => (Array.isArray(value) ? String(value[0]) : String(value)))
        .find((msg) => msg && !msg.startsWith("{"));

      return NextResponse.json(
        {
          success: false,
          message:
            firstFieldMessage ||
            (typeof data.detail === "string" && !data.detail.startsWith("{")
              ? data.detail
              : null) ||
            data.message ||
            "Please correct the highlighted fields.",
          errors: Object.keys(mappedErrors).length ? mappedErrors : source,
        },
        { status: 400 }
      );
    }

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

    return NextResponse.json(
      {
        success: false,
        code: code || undefined,
        message: data?.detail || data?.message || "Registration failed. Please try again.",
        errors: data?.errors,
      },
      { status: response.status }
    );
  } catch (error: unknown) {
    console.error("[Proxy /register-subscriber] Unhandled error:", error);
    return NextResponse.json(
      { success: false, code: "PROXY_ERROR", message: "An internal error occurred. Please try again." },
      { status: 500 }
    );
  }
}
