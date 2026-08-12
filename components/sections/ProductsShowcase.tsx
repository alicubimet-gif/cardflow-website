"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import {
  formatInr,
  getPublicProducts,
  productImageUrl,
  stockLabel,
  type PublicProduct,
} from "@/services/productService";

function ProductTile({ product }: { product: PublicProduct }) {
  const image = productImageUrl(product);
  const price = Number(product.base_price) || 0;
  const out = product.stock_status === "out";

  return (
    <Link
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
        <h3 className="line-clamp-2 text-sm font-bold text-slate-900 dark:text-white">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
          {product.description || "ID card accessory from Z Cards."}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-black tabular-nums text-slate-900 dark:text-white">
              {formatInr(price)}
            </p>
            <p className="text-[11px] text-slate-500">per {product.unit || "pcs"}</p>
          </div>
          <div className="text-right text-[11px] text-slate-500">
            <p>MOQ {(product.moq || 1).toLocaleString("en-IN")}</p>
            <p className={out ? "text-red-500" : "text-emerald-600"}>{stockLabel(product.stock_status)}</p>
          </div>
        </div>
        <span className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white transition group-hover:bg-blue-700">
          View & order <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default function ProductsShowcase({
  limit = 4,
  title = "ID Cards & Accessories",
  subtitle = "PVC cards, lanyards and print accessories — order directly on WhatsApp.",
  showViewAll = true,
}: {
  limit?: number;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}) {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    void getPublicProducts({ limit })
      .then((rows) => {
        if (!alive) return;
        setProducts(rows);
        setError(null);
      })
      .catch(() => {
        if (!alive) return;
        setError("Unable to load products right now.");
        setProducts([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [limit]);

  if (!loading && !error && products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl font-heading">
            {title}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 sm:text-base">
            {subtitle}
          </p>
        </div>
        {showViewAll ? (
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            View more products <ArrowRight className="size-4" />
          </Link>
        ) : null}
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl border border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      ) : error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/20">
          {error}
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
