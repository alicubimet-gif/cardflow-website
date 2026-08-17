import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(getBackendApiUrl("public/demo-request/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({
      success: false,
      message: "Unable to request demo.",
    }));

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to request demo.",
      },
      { status: 500 }
    );
  }
}
