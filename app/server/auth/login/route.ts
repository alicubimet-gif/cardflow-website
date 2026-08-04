import { NextRequest, NextResponse } from "next/server";

/**
 * Website login does not call the API.
 * Redirect any accidental hits on this proxy to the Studio login page.
 */
export async function POST(_req: NextRequest) {
  const studioUrl = (
    process.env.NEXT_PUBLIC_STUDIO_URL ||
    process.env.NEXT_PUBLIC_STUDIO_APP_URL ||
    process.env.STUDIO_APP_URL ||
    "http://localhost:3001"
  ).replace(/\/$/, "");
  return NextResponse.redirect(new URL("/login", studioUrl), 303);
}

export async function GET(req: NextRequest) {
  const studioUrl = (
    process.env.NEXT_PUBLIC_STUDIO_URL ||
    process.env.NEXT_PUBLIC_STUDIO_APP_URL ||
    process.env.STUDIO_APP_URL ||
    "http://localhost:3001"
  ).replace(/\/$/, "");
  return NextResponse.redirect(new URL("/login" + req.nextUrl.search, studioUrl), 303);
}
