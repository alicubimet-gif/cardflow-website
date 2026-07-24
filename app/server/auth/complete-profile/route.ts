import { NextRequest, NextResponse } from "next/server";
import { proxyRequest } from "@/lib/serverProxy";

export async function POST(req: NextRequest) {
  // Read existing access and refresh tokens from the request cookies
  const access_token = req.cookies.get("access_token")?.value || "";
  const refresh_token = req.cookies.get("refresh_token")?.value || "";

  // Call the proxyRequest helper to forward POST request to backend /api/auth/complete-profile/
  const response = await proxyRequest(req, "/api/auth/complete-profile/");

  if (response.ok) {
    try {
      const text = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { detail: text };
      }

      // Read final tokens from the response cookies (set by proxyRequest) or fallback to request cookies
      const finalAccess = response.cookies.get("access_token")?.value || access_token;
      const finalRefresh = response.cookies.get("refresh_token")?.value || refresh_token;

      // Append them to the JSON response data
      data.access_token = finalAccess;
      data.refresh_token = finalRefresh;
      data.access = finalAccess;
      data.refresh = finalRefresh;

      // Create new NextResponse with appended JSON data, keeping original status and headers
      const nextRes = new NextResponse(JSON.stringify(data), {
        status: response.status,
        headers: response.headers,
      });

      // Explicitly set the tokens as cookies on the new response object
      response.cookies.getAll().forEach((cookie) => {
        nextRes.cookies.set(cookie.name, cookie.value, {
          path: cookie.path,
          domain: cookie.domain,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          maxAge: cookie.maxAge,
          sameSite: cookie.sameSite,
        });
      });

      return nextRes;
    } catch (err) {
      console.error("Error in complete-profile route proxy handler:", err);
    }
  }

  return response;
}
