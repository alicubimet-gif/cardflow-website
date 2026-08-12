"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, Minus, Package, Plus } from "lucide-react";
import LoadingState from "@/components/loading-state";
import ApiError from "@/components/api-error";
import Button from "@/components/ui/Button";
import { productWhatsAppUrl } from "@/lib/whatsapp";
import {
  formatInr,
  getPublicProduct,
  productImageUrl,
  productSpecs,
  stockLabel,
  type PublicProduct,
} from "@/services/productService";

const GST_RATE = 0.18;

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : "";
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const row = await getPublicProduct(id);
      setProduct(row);
      setQuantity(Math.max(1, row.moq || 1));
      setActiveImage(0);
    } catch {
      setError("Product not found or unavailable.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) return [] as string[];
    return (product.images || [])
      .map((img) => (typeof img === "string" ? img : img?.url || ""))
      .filter(Boolean);
  }, [product]);

  const unitPrice = Number(product?.base_price) || 0;
  const gstRate = ((product?.gst_rate ?? 18) / 100) || GST_RATE;
  const subtotal = unitPrice * quantity;
  const gst = Math.round(subtotal * gstRate);
  const total = subtotal + gst;
  const outOfStock = product?.stock_status === "out";
  const belowMoq = product ? quantity < (product.moq || 1) : false;
  const specs = product ? productSpecs(product.specs) : [];
  const cover = gallery[activeImage] || productImageUrl(product || ({ images: [] } as PublicProduct));

  const orderOnWhatsApp = () => {
    if (!product || outOfStock) return;
    const url = productWhatsAppUrl({
      name: product.name,
      quantity,
      unit: product.unit || "pcs",
      unitPrice,
      total,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <LoadingState message="Loading product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <ApiError message={error || "Product not found."} onRetry={() => void load()} />
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
          <ArrowLeft className="size-4" /> Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
      >
        <ArrowLeft className="size-4" /> Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="relative grid h-72 place-items-center bg-slate-100 dark:bg-slate-800 sm:h-96">
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cover}
                  alt={product.name}
                  className="absolute inset-0 size-full object-contain bg-slate-50 dark:bg-slate-900"
                />
              ) : (
                <Package className="size-16 text-slate-400" />
              )}
            </div>
            {gallery.length > 1 ? (
              <div className="flex gap-2 p-3">
                {gallery.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`relative h-14 w-20 overflow-hidden rounded-xl ring-2 transition ${
                      activeImage === i ? "ring-blue-600" : "ring-transparent hover:ring-slate-300"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2">
              {product.category ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {product.category}
                </span>
              ) : null}
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                {stockLabel(product.stock_status)}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
              {product.name}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {product.description || "Order this product on WhatsApp and our sales team will confirm."}
            </p>

            {specs.length > 0 ? (
              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Specifications</p>
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  {specs.map((s) => (
                    <div
                      key={`${s.label}-${s.value}`}
                      className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/60"
                    >
                      <Check className="mt-0.5 size-3.5 shrink-0 text-blue-600" />
                      <div>
                        <dt className="text-xs text-slate-500">{s.label}</dt>
                        <dd className="font-medium text-slate-900 dark:text-white">{s.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
        </div>

        <div className="h-fit space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-24">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Order this product</p>
            <p className="mt-1 text-xs text-slate-500">
              Minimum order quantity {(product.moq || 1).toLocaleString("en-IN")} {product.unit || "pcs"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - (product.moq || 1)))}
              className="grid size-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="h-10 flex-1 rounded-xl border border-slate-200 bg-transparent text-center tabular-nums outline-none ring-blue-500/30 focus:ring-2 dark:border-slate-700"
            />
            <button
              type="button"
              onClick={() => setQuantity(quantity + (product.moq || 1))}
              className="grid size-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>
          {belowMoq ? (
            <p className="text-xs text-amber-600">
              Quantity is below the MOQ of {(product.moq || 1).toLocaleString("en-IN")}.
            </p>
          ) : null}

          <div className="space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-500">Price (per {product.unit || "pcs"})</span>
              <span className="tabular-nums">{formatInr(unitPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="tabular-nums">{formatInr(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">GST ({Math.round(gstRate * 100)}%)</span>
              <span className="tabular-nums">{formatInr(gst)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-black tabular-nums">{formatInr(total)}</span>
            </div>
          </div>

          <Button
            type="button"
            className="w-full py-3"
            disabled={outOfStock}
            onClick={orderOnWhatsApp}
          >
            {outOfStock ? "Out of stock" : "Order on WhatsApp"}
          </Button>
          <p className="text-center text-[11px] text-slate-500">
            Opens WhatsApp with your order details for +91 88916 33035.
          </p>
        </div>
      </div>
    </div>
  );
}
