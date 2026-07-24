import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

/**
 * GET /server/auth/session
 * Checks if the HttpOnly cookie `access_token` or `refresh_token` exists on the client request.
 * Returns 200 OK with { isAuthenticated: true } or { isAuthenticated: false }.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value || request.cookies.get("refresh_token")?.value;
    if (!token) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { isAuthenticated: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { isAuthenticated: false, message: "Internal server error" },
      { status: 200 }
    );
  }
}
