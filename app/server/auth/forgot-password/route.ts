import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/backend-server";

/**
 * POST /server/auth/forgot-password
 * Proxies to: POST /api/v1/auth/password/forgot/
 *
 * Uses X-Client: studio so the emailed reset link opens Studio Hub
 * (`STUDIO_APP_URL/reset-password?token=…`).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required.", errors: { email: ["Email is required."] } },
        { status: 400 },
      );
    }

    let response: Response;
    try {
      response = await fetch(getBackendApiUrl("v1/auth/password/forgot/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client": "studio",
        },
        body: JSON.stringify({ email }),
      });
    } catch (networkError: unknown) {
      console.error("[Proxy /forgot-password] Network error:", networkError);
      return NextResponse.json(
        {
          success: false,
          code: "NETWORK_ERROR",
          message: "Unable to reach the server. Please try again.",
        },
        { status: 503 },
      );
    }

    const text = await response.text();
    let data: Record<string, unknown> = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      /* non-JSON */
    }

    if (response.ok || response.status === 202) {
      return NextResponse.json(
        {
          success: true,
          detail:
            (typeof data.detail === "string" && data.detail) ||
            "If an account exists, a reset email has been sent.",
        },
        { status: 202 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          (typeof data.detail === "string" && data.detail) ||
          (typeof data.message === "string" && data.message) ||
          "Could not send reset email.",
        errors: data.errors,
      },
      { status: response.status >= 400 ? response.status : 400 },
    );
  } catch (error: unknown) {
    console.error("[Proxy /forgot-password] Unhandled error:", error);
    return NextResponse.json(
      { success: false, code: "PROXY_ERROR", message: "An internal error occurred." },
      { status: 500 },
    );
  }
}
