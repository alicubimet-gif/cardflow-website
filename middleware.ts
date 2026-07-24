import { NextRequest, NextResponse } from "next/server";

const studioUrl = process.env.NEXT_PUBLIC_STUDIO_URL || "";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value || request.cookies.get('refresh_token')?.value;
  if (!studioUrl) return NextResponse.next();

  if (pathname.startsWith("/credits")) {
    return NextResponse.redirect(new URL("/credits", studioUrl));
  }

  if (pathname.startsWith("/payment")) {
    return NextResponse.redirect(new URL("/credits/packages", studioUrl));
  }

  if (pathname.startsWith("/login")) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", studioUrl));
    }
    return NextResponse.redirect(new URL("/login" + request.nextUrl.search, studioUrl));
  }

  if ((pathname.startsWith("/register") || pathname.startsWith("/verify-otp")) && token) {
    return NextResponse.redirect(new URL("/dashboard", studioUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/credits/:path*", "/payment/:path*", "/register", "/verify-otp", "/login"],
};
