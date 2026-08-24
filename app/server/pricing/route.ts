import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/backend-server";
import { DEFAULT_CREDIT_RATES, parseCreditRates } from "@/lib/creditPricing";

function highestPackageIndex(packages: Array<{ credits?: number; total_credits?: number; price?: number | string }>) {
  let best = -1;
  let bestCredits = -1;
  let bestPrice = -1;
  packages.forEach((pkg, index) => {
    const credits = Math.max(Number(pkg.credits ?? pkg.total_credits) || 0, 0);
    const price = Math.max(Number(pkg.price) || 0, 0);
    if (credits > bestCredits || (credits === bestCredits && price > bestPrice)) {
      best = index;
      bestCredits = credits;
      bestPrice = price;
    }
  });
  return best;
}

/**
 * GET /server/pricing
 *
 * Proxies to: GET /api/public/packages/
 *
 * Returns:
 *   { data: [...packages], credit_rates: { single, double, dynamic } }
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

    const popularIndex = highestPackageIndex(results);

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

    const credit_rates = parseCreditRates(payload?.credit_rates ?? DEFAULT_CREDIT_RATES);

    return NextResponse.json({ data, credit_rates }, { status: 200 });
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
