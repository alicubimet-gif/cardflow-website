import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(getBackendApiUrl("auth/verify-otp/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    const nextRes = NextResponse.json(data, { status: response.status });

    if (response.ok && data.data) {
      const { access, refresh } = data.data;
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        // Using Domain ensures the cookie is sent to all subdomains (e.g. studio.cardflow.app)
        ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
      };

      if (access) nextRes.cookies.set("access_token", access, cookieOptions);
      if (refresh) nextRes.cookies.set("refresh_token", refresh, cookieOptions);
    }

    return nextRes;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Internal server proxy error" },
      { status: 500 }
    );
  }
}
