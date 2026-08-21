import React from "react";
import { CreditCard, Layers, Sparkles, Wallet } from "lucide-react";
import {
  cardsCovered,
  costPerCredit,
  formatMoney,
  type CreditRates,
} from "@/lib/creditPricing";

type Props = {
  credits: number;
  price: string | number;
  currencySymbol?: string;
  rates: CreditRates;
  compact?: boolean;
};

/**
 * Per-package breakdown: cost of 1 credit + how many cards each type covers.
 */
export function PackageCreditDetails({
  credits,
  price,
  currencySymbol = "₹",
  rates,
  compact = false,
}: Props) {
  const perCredit = costPerCredit(price, credits);
  const singleCards = cardsCovered(credits, rates.single);
  const doubleCards = cardsCovered(credits, rates.double);
  const dynamicCards = cardsCovered(credits, rates.dynamic);

  const rows = [
    {
      key: "single",
      label: "One-side cards",
      hint: `${rates.single} credit${rates.single === 1 ? "" : "s"} each`,
      count: singleCards,
      Icon: CreditCard,
    },
    {
      key: "double",
      label: "Double-side cards",
      hint: `${rates.double} credits each`,
      count: doubleCards,
      Icon: Layers,
    },
    {
      key: "dynamic",
      label: "Double-side + dynamic",
      hint: `${rates.dynamic} credits each`,
      count: dynamicCards,
      Icon: Sparkles,
    },
  ] as const;

  return (
    <div className={compact ? "space-y-2.5" : "space-y-3"}>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100/80 bg-emerald-50/70 px-3.5 py-2.5 dark:border-emerald-900/40 dark:bg-emerald-950/30">
        <div className="flex items-center gap-2 min-w-0">
          <Wallet size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
            1 credit costs
          </span>
        </div>
        <span className="font-heading text-sm font-black tabular-nums text-emerald-700 dark:text-emerald-300">
          {formatMoney(perCredit, currencySymbol)}
        </span>
      </div>

      <ul className="space-y-1.5">
        {rows.map(({ key, label, hint, count, Icon }) => (
          <li
            key={key}
            className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/50"
          >
            <div className="flex min-w-0 items-center gap-2">
              <Icon size={14} className="shrink-0 text-blue-500 dark:text-blue-400" />
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  {label}
                </p>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  {hint}
                </p>
              </div>
            </div>
            <span className="shrink-0 font-heading text-xs font-black tabular-nums text-slate-900 dark:text-white">
              ≈ {count.toLocaleString("en-IN")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Shared legend for how credits map to card types. */
export function CreditRatesLegend({ rates }: { rates: CreditRates }) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        How credits are used
      </p>
      <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
        Credits are deducted when a card is approved for print — not for designing templates.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-950">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">One-side</p>
          <p className="font-heading text-lg font-black text-slate-900 dark:text-white">
            {rates.single}{" "}
            <span className="text-xs font-bold text-slate-500">
              credit{rates.single === 1 ? "" : "s"}
            </span>
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-950">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Double-side</p>
          <p className="font-heading text-lg font-black text-slate-900 dark:text-white">
            {rates.double} <span className="text-xs font-bold text-slate-500">credits</span>
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-950">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            Double + dynamic
          </p>
          <p className="font-heading text-lg font-black text-slate-900 dark:text-white">
            {rates.dynamic} <span className="text-xs font-bold text-slate-500">credits</span>
          </p>
        </div>
      </div>
    </div>
  );
}
