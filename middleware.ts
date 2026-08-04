import { NextRequest, NextResponse } from "next/server";

function studioBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_STUDIO_URL ||
    process.env.NEXT_PUBLIC_STUDIO_APP_URL ||
    process.env.STUDIO_APP_URL ||
    ""
  ).replace(/\/$/, "");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const studioUrl = studioBaseUrl();
  if (!studioUrl) return NextResponse.next();

  // Redirect legacy /credits and /payment paths to Studio
  if (pathname.startsWith("/credits")) {
    return NextResponse.redirect(new URL("/credits", studioUrl));
  }

  if (pathname.startsWith("/payment")) {
    return NextResponse.redirect(new URL("/credits/packages", studioUrl));
  }

  // Login lives in Studio — website never authenticates users itself
  if (pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login" + request.nextUrl.search, studioUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/credits/:path*", "/payment/:path*", "/login"],
};
