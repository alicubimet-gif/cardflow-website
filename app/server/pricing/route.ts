import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/config";

function highestBenefitIndex(packages: Array<{ credits?: number; total_credits?: number; price?: number | string }>) {
  let best = -1;
  let bestScore = -1;
  let bestCredits = -1;
  packages.forEach((pkg, index) => {
    const credits = Math.max(Number(pkg.credits ?? pkg.total_credits) || 0, 0);
    const price = Math.max(Number(pkg.price) || 0, 0);
    const score = credits <= 0 ? 0 : price <= 0 ? Number.POSITIVE_INFINITY : credits / price;
    if (score > bestScore || (score === bestScore && credits > bestCredits)) {
      best = index;
      bestScore = score;
      bestCredits = credits;
    }
  });
  return best;
}

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

    // Highlight the highest-benefit pack (most credits per rupee, then most credits).
    const popularIndex = highestBenefitIndex(results);

    const data = results.map((pkg, index) => ({
      id: pkg.id,
      package_name: pkg.name ?? pkg.package_name ?? "",
      credits: pkg.credits ?? pkg.total_credits ?? 0,
      price: pkg.price,
      currency: pkg.currency || "INR",
      description: pkg.description || "",
      is_popular: index === popularIndex,
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
