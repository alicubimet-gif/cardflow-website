import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/config";

/**
 * GET /server/pricing
 *
 * Proxies to: GET /api/public/packages/
 *
 * Normalises the ZCards package payload into the shape the Pricing / Home UI
 * already expects so the pages do not need UI changes:
 *   { data: [{ id, package_name, credits, price, currency, description,
 *              is_popular, status, display_order }] }
 */
export async function GET() {
  try {
    const res = await fetch(getBackendApiUrl("public/packages/"), {
      cache: "no-store",
    });

    const text = await res.text();
    let payload: any = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      return NextResponse.json(
        { success: false, message: "Unable to load pricing plans." },
        { status: 502 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            payload?.detail ||
            payload?.message ||
            "Unable to load pricing plans.",
        },
        { status: res.status }
      );
    }

    const results: any[] = Array.isArray(payload?.results)
      ? payload.results
      : Array.isArray(payload)
        ? payload
        : [];

    // Highlight the mid-priced active package as "popular" for marketing cards.
    const midIndex = results.length > 1 ? Math.floor(results.length / 2) : -1;

    const data = results.map((pkg, index) => ({
      id: pkg.id,
      package_name: pkg.name ?? pkg.package_name ?? "",
      credits: pkg.credits ?? pkg.total_credits ?? 0,
      price: pkg.price,
      currency: pkg.currency || "INR",
      description: pkg.description || "",
      is_popular: Boolean(pkg.is_popular) || index === midIndex,
      status: pkg.is_active === false ? "inactive" : "active",
      display_order: pkg.sort_order ?? pkg.display_order ?? index,
    }));

    return NextResponse.json({ data }, { status: 200 });
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
