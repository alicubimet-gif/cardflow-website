import { NextRequest, NextResponse } from "next/server";

const studioUrl = process.env.NEXT_PUBLIC_STUDIO_URL || "";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!studioUrl) return NextResponse.next();

  // Redirect legacy /credits and /payment paths to Studio
  if (pathname.startsWith("/credits")) {
    return NextResponse.redirect(new URL("/credits", studioUrl));
  }

  if (pathname.startsWith("/payment")) {
    return NextResponse.redirect(new URL("/credits/packages", studioUrl));
  }

  // Redirect /login to Studio login (the website has no login page of its own)
  if (pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login" + request.nextUrl.search, studioUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/credits/:path*", "/payment/:path*", "/login"],
};
