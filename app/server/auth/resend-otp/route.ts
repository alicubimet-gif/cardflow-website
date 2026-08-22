import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/backend-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(getBackendApiUrl("auth/resend-otp/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Internal server proxy error" },
      { status: 500 }
    );
  }
}
