import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/config";

/**
 * POST /server/auth/register
 * Proxies to the configured backend auth/register endpoint.
 *
 * Accepts { name, email, phone, company }.
 * Backend generates a magic-link token and sends it to the user's email.
 * No password is transmitted or stored in the URL.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const nameParts = (body.name || "").trim().split(/\s+/);
    const first_name = nameParts[0] || "";
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "-";

    const backendPayload = {
      ...body,
      first_name,
      last_name,
      company_name: body.company || "",
    };

    const response = await fetch(
      getBackendApiUrl("auth/register/"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendPayload),
      }
    );

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("[Proxy /register-subscriber Error] Backend returned non-JSON:", text);
      return NextResponse.json(
        { success: false, message: "Backend server returned an invalid response.", detail: text },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[Proxy /register-subscriber Error]", error);
    return NextResponse.json(
      { success: false, message: "Internal server proxy error.", error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
