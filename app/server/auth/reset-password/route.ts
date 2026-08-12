import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/config";

/**
 * POST /server/auth/reset-password
 * Proxies to: POST /api/v1/auth/password/reset/
 *
 * Body: { token, password } (confirm_password optional, validated client-side).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token || "").trim();
    const password = String(body.password || "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Reset token is required.", errors: { token: ["Required."] } },
        { status: 400 },
      );
    }
    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required.",
          errors: { password: ["Password is required."] },
        },
        { status: 400 },
      );
    }

    let response: Response;
    try {
      response = await fetch(getBackendApiUrl("v1/auth/password/reset/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client": "studio",
        },
        body: JSON.stringify({ token, password }),
      });
    } catch (networkError: unknown) {
      console.error("[Proxy /reset-password] Network error:", networkError);
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

    if (response.ok) {
      return NextResponse.json(
        {
          success: true,
          detail:
            (typeof data.detail === "string" && data.detail) || "Password has been reset.",
        },
        { status: 200 },
      );
    }

    const errors =
      data.errors && typeof data.errors === "object" ? (data.errors as Record<string, unknown>) : undefined;

    return NextResponse.json(
      {
        success: false,
        message:
          (typeof data.detail === "string" && data.detail) ||
          (typeof data.message === "string" && data.message) ||
          "Could not reset password.",
        errors,
        code: typeof data.code === "string" ? data.code : undefined,
      },
      { status: response.status >= 400 ? response.status : 400 },
    );
  } catch (error: unknown) {
    console.error("[Proxy /reset-password] Unhandled error:", error);
    return NextResponse.json(
      { success: false, code: "PROXY_ERROR", message: "An internal error occurred." },
      { status: 500 },
    );
  }
}
