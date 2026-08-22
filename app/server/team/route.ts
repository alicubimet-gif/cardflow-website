import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/backend-server";
import { sanitizePublicPayload } from "@/lib/public-media";

export async function GET() {
  try {
    const res = await fetch(getBackendApiUrl("public/team/"), { cache: "no-store" });
    const text = await res.text();
    let payload: any = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      return NextResponse.json(
        { success: false, message: "Unable to load team." },
        { status: 502 },
      );
    }
    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message: payload?.detail || payload?.message || "Unable to load team.",
        },
        { status: res.status },
      );
    }
    const results = Array.isArray(payload?.results)
      ? payload.results
      : Array.isArray(payload)
        ? payload
        : [];
    return NextResponse.json({ data: sanitizePublicPayload(results) }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to load team." },
      { status: 500 },
    );
  }
}
