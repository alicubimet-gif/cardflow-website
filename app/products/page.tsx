"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Package, Search } from "lucide-react";
import LoadingState from "@/components/loading-state";
import ApiError from "@/components/api-error";
import {
  formatInr,
  getPublicProducts,
  productImageUrl,
  stockLabel,
  type PublicProduct,
} from "@/services/productService";

export default function ProductsPage() {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getPublicProducts();
      setProducts(rows);
    } catch {
      setError("Unable to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean) as string[]),
  ).sort();

  const filtered = products.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q);
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
          Product Store
        </h1>
        <p className="text-base font-medium text-slate-500 dark:text-slate-400 sm:text-lg">
          PVC cards, lanyards and ID accessories. Choose a product and order on WhatsApp —
          our team will confirm pricing and delivery.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none ring-blue-500/30 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/30 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingState message="Loading products..." />
      ) : error ? (
        <ApiError message={error} onRetry={() => void load()} />
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/40">
          No products match your filters.
        </p>
      ) : (
        <>
          <p className="text-sm text-slate-500">
            {filtered.length} product{filtered.length === 1 ? "" : "s"} available
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => {
              const image = productImageUrl(product);
              const out = product.stock_status === "out";
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="relative grid h-40 place-items-center overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
                    ) : (
                      <Package className="size-10 text-slate-400" />
                    )}
                    {product.category ? (
                      <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm dark:bg-slate-950/80 dark:text-slate-200">
                        {product.category}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h2 className="line-clamp-2 text-sm font-bold text-slate-900 dark:text-white">
                      {product.name}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                      {product.description || "ID card accessory from Z Cards."}
                    </p>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xl font-black tabular-nums text-slate-900 dark:text-white">
                          {formatInr(product.base_price)}
                        </p>
                        <p className="text-[11px] text-slate-500">per {product.unit || "pcs"}</p>
                      </div>
                      <div className="text-right text-[11px] text-slate-500">
                        <p>MOQ {(product.moq || 1).toLocaleString("en-IN")}</p>
                        <p className={out ? "text-red-500" : "text-emerald-600"}>
                          {stockLabel(product.stock_status)}
                        </p>
                      </div>
                    </div>
                    <span className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white transition group-hover:bg-blue-700">
                      View & order <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
