import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/config";

export async function GET() {
  try {
    const res = await fetch(
      getBackendApiUrl("credits/public/pricing/"),
      { cache: "no-store" }
    );

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to load pricing plans.",
      },
      { status: 500 }
    );
  }
}
