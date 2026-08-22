import { NextRequest, NextResponse } from "next/server";
import { getBackendApiUrl, getBackendUrl } from "./backend-server";

export async function proxyRequest(req: NextRequest, backendPath: string) {
  const backendUrl = getBackendUrl();
  if (!backendUrl) {
    return NextResponse.json(
      { success: false, message: "BACKEND_URL is required for server-side API proxying." },
      { status: 500 }
    );
  }
  const url = `${backendUrl}${backendPath}`;
  
  try {
    const headers = new Headers(req.headers);
    headers.delete("host");
    
    // Extract access_token cookie if present and set Authorization header
    const token = req.cookies.get("access_token")?.value;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const init: RequestInit = {
      method: req.method,
      headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      if (backendPath.includes("logout")) {
        const refreshToken = req.cookies.get("refresh_token")?.value;
        init.body = JSON.stringify({ refresh: refreshToken || "" });
      } else {
        const body = await req.text();
        init.body = body;
      }
    }

    let response = await fetch(url, init);
    
    let refreshedAccess: string | null = null;
    let refreshedRefresh: string | null = null;

    // Auto-refresh access token if expired and retry original request
    // Exclude auth endpoints themselves to prevent recursive refresh loops
    const isAuthEndpoint = backendPath.includes('login') ||
      backendPath.includes('refresh') ||
      backendPath.includes('logout') ||
      backendPath.includes('google-login');

    if (response.status === 401 && !isAuthEndpoint) {
      const refreshToken = req.cookies.get("refresh_token")?.value;
      if (refreshToken) {
        try {
          const refreshRes = await fetch(getBackendApiUrl("auth/refresh/"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
            cache: "no-store",
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newAccess = refreshData.access || refreshData.data?.access;
            const newRefresh = refreshData.refresh || refreshData.data?.refresh;

            if (newAccess) {
              refreshedAccess = newAccess;
              if (newRefresh) refreshedRefresh = newRefresh;

              // Re-authenticate and retry original request
              headers.set("Authorization", `Bearer ${newAccess}`);
              response = await fetch(url, init);
            }
          } else {
            // Refresh token expired or blacklisted — clear credentials
            const nextRes = NextResponse.json(
              { success: false, message: "Session expired. Please sign in again." },
              { status: 401 }
            );
            // Clear cookies properly with maxAge:0
            nextRes.cookies.set('access_token', '', { maxAge: 0, path: '/' });
            nextRes.cookies.set('refresh_token', '', { maxAge: 0, path: '/' });
            return nextRes;
          }
        } catch (refreshErr) {
          // Proceed to return original 401
        }
      }
    }

    // Read the response
    const data = await response.text();
    
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", response.headers.get("Content-Type") || "application/json");

    let parsedData: any = null;
    const contentType = response.headers.get("Content-Type") || "";
    
    if (contentType.includes("application/json")) {
      try {
        parsedData = JSON.parse(data);
      } catch (e) {}
    }

    const nextRes = new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
    };

    const setAuthCookies = (resObj: NextResponse, access: string | null, refresh: string | null) => {
      if (access) {
        resObj.cookies.set("access_token", access, {
          ...cookieOptions,
          maxAge: 60 * 15, // 15 mins
        });
      }
      if (refresh) {
        resObj.cookies.set("refresh_token", refresh, {
          ...cookieOptions,
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }
    };

    // Set cookies from either refreshed credentials or raw response data
    let access = refreshedAccess;
    let refresh = refreshedRefresh;

    if (parsedData) {
      if (parsedData.access) access = parsedData.access;
      if (parsedData.refresh) refresh = parsedData.refresh;
      if (parsedData.data?.access) access = parsedData.data.access;
      if (parsedData.data?.refresh) refresh = parsedData.data.refresh;
    }

    setAuthCookies(nextRes, access, refresh);

    // If logout, clear cookies
    if (backendPath.includes("logout")) {
      nextRes.cookies.set('access_token', '', { maxAge: 0, path: '/' });
      nextRes.cookies.set('refresh_token', '', { maxAge: 0, path: '/' });
    }

    return nextRes;
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server proxy error." },
      { status: 500 }
    );
  }
}
