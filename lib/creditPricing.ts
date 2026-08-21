/** Platform credit rates for card approvals (credits charged per card type). */
export type CreditRates = {
  single: number;
  double: number;
  dynamic: number;
};

export const DEFAULT_CREDIT_RATES: CreditRates = {
  single: 1,
  double: 2,
  dynamic: 3,
};

export function parseCreditRates(raw: unknown): CreditRates {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_CREDIT_RATES };
  const row = raw as Record<string, unknown>;
  const num = (key: string, fallback: number) => {
    const n = Number(row[key]);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
  };
  return {
    single: num("single", DEFAULT_CREDIT_RATES.single),
    double: num("double", DEFAULT_CREDIT_RATES.double),
    dynamic: num("dynamic", DEFAULT_CREDIT_RATES.dynamic),
  };
}

export function packagePriceNumber(price: string | number): number {
  const n = typeof price === "number" ? price : parseFloat(price);
  return Number.isFinite(n) ? n : 0;
}

/** Rupees (or currency units) per single credit for this package. */
export function costPerCredit(price: string | number, credits: number): number {
  const total = packagePriceNumber(price);
  const qty = Math.max(0, Number(credits) || 0);
  if (qty <= 0 || total <= 0) return 0;
  return total / qty;
}

export function cardsCovered(credits: number, rate: number): number {
  const qty = Math.max(0, Number(credits) || 0);
  const cost = Math.max(1, Number(rate) || 1);
  return Math.floor(qty / cost);
}

export function formatMoney(
  amount: number,
  currencySymbol = "₹",
  fractionDigits = 2,
): string {
  if (!Number.isFinite(amount) || amount <= 0) return `${currencySymbol}0`;
  return `${currencySymbol}${amount.toLocaleString("en-IN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}
