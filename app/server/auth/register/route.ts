import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/config";

/**
 * Legacy passthrough — prefer `/server/auth/register-subscriber`.
 * Forwards to ZCards public studio registration.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(getBackendApiUrl("public/auth/register/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server proxy error" },
      { status: 500 }
    );
  }
}
