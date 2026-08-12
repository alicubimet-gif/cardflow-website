import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/config";

async function proxyPublicList(backendPath: string, label: string) {
  try {
    const res = await fetch(getBackendApiUrl(backendPath), { cache: "no-store" });
    const text = await res.text();
    let payload: any = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      return NextResponse.json(
        { success: false, message: `Unable to load ${label}.` },
        { status: 502 },
      );
    }
    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message: payload?.detail || payload?.message || `Unable to load ${label}.`,
        },
        { status: res.status },
      );
    }
    const results = Array.isArray(payload?.results)
      ? payload.results
      : Array.isArray(payload)
        ? payload
        : [];
    return NextResponse.json({ data: results }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: `Unable to load ${label}.` },
      { status: 500 },
    );
  }
}

export async function GET() {
  return proxyPublicList("public/testimonials/", "testimonials");
}
