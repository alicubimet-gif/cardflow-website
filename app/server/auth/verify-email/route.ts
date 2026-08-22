import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/backend-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    const response = await fetch(
      `${getBackendApiUrl("auth/verify-email/")}?token=${encodeURIComponent(token || "")}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[Proxy Verify Email Error]", error);
    return NextResponse.json(
      { success: false, message: "Internal server proxy error" },
      { status: 500 }
    );
  }
}
