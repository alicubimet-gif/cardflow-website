import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/config";

/**
 * GET /server/products/[id]
 * Proxies to: GET /api/public/products/{id}/
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product id is required." },
        { status: 400 },
      );
    }

    const res = await fetch(getBackendApiUrl(`public/products/${id}/`), {
      cache: "no-store",
    });
    const text = await res.text();
    let payload: any = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      return NextResponse.json(
        { success: false, message: "Unable to load product." },
        { status: 502 },
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message: payload?.detail || payload?.message || "Product not found.",
        },
        { status: res.status },
      );
    }

    return NextResponse.json({ data: payload }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to load product." },
      { status: 500 },
    );
  }
}
