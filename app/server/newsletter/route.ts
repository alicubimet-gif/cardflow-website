import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/backend-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(getBackendApiUrl("public/newsletter/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to subscribe.",
      },
      { status: 500 }
    );
  }
}
