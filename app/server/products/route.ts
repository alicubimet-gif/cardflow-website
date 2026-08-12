import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/config";

/**
 * GET /server/products
 * Proxies to: GET /api/public/products/
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const qs = searchParams.toString();
    const path = qs ? `public/products/?${qs}` : "public/products/";

    const res = await fetch(getBackendApiUrl(path), { cache: "no-store" });
    const text = await res.text();
    let payload: any = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      return NextResponse.json(
        { success: false, message: "Unable to load products." },
        { status: 502 },
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message: payload?.detail || payload?.message || "Unable to load products.",
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
      { success: false, message: "Unable to load products." },
      { status: 500 },
    );
  }
}
