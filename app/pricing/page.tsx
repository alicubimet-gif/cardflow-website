"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, Sparkles, ArrowRight, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import LoadingState from "@/components/loading-state";
import ApiError from "@/components/api-error";
import { getPublicPricing } from "@/services/pricingService";
import { STUDIO_URL } from "@/lib/config";

interface CreditPackage {
  id: string;
  package_name: string;
  credits: number;
  price: string | number;
  currency: string;
  description: string;
  is_popular: boolean;
  status: string;
}

export default function Pricing() {
  const router = useRouter();
  const { showToast } = useToast();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoadingId, setCheckoutLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/server/auth/session");
        const data = await res.json();
        setIsAuthenticated(!!data?.isAuthenticated);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkSession();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const pricing: any = await getPublicPricing();
      let parsedPackages: any[] = [];
      if (pricing && pricing.data && Array.isArray(pricing.data)) {
        parsedPackages = pricing.data;
      }
      const filtered = parsedPackages.filter((pkg: any) => pkg.status === "active");
      filtered.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
      setPackages(filtered);
    } catch (err: any) {
      setError("Unable to load pricing plans. Please try again later.");
      showToast("Unable to load pricing plans. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCheckout = async (pkgId: string) => {
    setCheckoutLoadingId(pkgId);

    const studioUrl = STUDIO_URL;

    if (isAuthenticated) {
      // Already authenticated — go directly to Studio credit packages
      window.location.href = `${studioUrl}/credits/packages?package_id=${pkgId}`;
      return;
    }

    // Not authenticated — redirect to register with context preserved
    showToast("Please create an account to purchase credits.", "info");
    router.push(`/register?next=buy&package_id=${pkgId}`);
    setCheckoutLoadingId(null);
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white font-heading">
          Premium Credit Packages
        </h1>
        <p className="text-lg text-gray-500 dark:text-slate-400 font-medium">
          All accounts come with unlimited templates design access. Pay only for the credits you need. No subscriptions, no yearly fees.
        </p>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="py-8">
          <LoadingState message="Loading packages..." />
        </div>
      )}

      {/* GET packages API Error state */}
      {!loading && error && (
        <div className="py-8">
          <ApiError 
            title="Unable to load pricing" 
            message={error} 
            onRetry={fetchPackages} 
          />
        </div>
      )}

      {/* API Empty state */}
      {!loading && !error && packages.length === 0 && (
        <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm max-w-md mx-auto space-y-3.5">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 text-blue-500 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">No active packages available.</h3>
          </div>
        </div>
      )}

      {/* Package configuration listings (Real Backend packages only) */}
      {!loading && !error && packages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-4">
          {packages.map((pkg) => {
            const currencySymbol = pkg.currency?.toLowerCase() === 'usd' ? '$' : '₹';
            
            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl p-8 border bg-white dark:bg-slate-900 flex flex-col justify-between shadow-md transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-lg ${
                  pkg.is_popular
                    ? "border-[#2563EB] ring-2 ring-[#2563EB]/25"
                    : "border-gray-200 dark:border-slate-800"
                }`}
              >
                {pkg.is_popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-[#2563EB] text-white flex items-center gap-1.5 shadow-sm">
                    <Sparkles size={10} className="fill-current" /> Most Popular
                  </span>
                )}

                <div className="text-left space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-heading">{pkg.package_name}</h3>
                      <p className="text-xs text-gray-500 dark:text-slate-405 leading-relaxed mt-2 min-h-[40px] font-medium">{pkg.description}</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white mr-1">{currencySymbol}</span>
                    <span className="text-5xl font-black text-gray-900 dark:text-white font-heading tracking-tight">
                      {typeof pkg.price === 'number' ? pkg.price.toLocaleString('en-IN') : parseFloat(pkg.price as string).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-slate-500 font-bold tracking-wider uppercase ml-1.5">/ one-time</span>
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-slate-800 my-2" />

                  <div className="flex items-center gap-2.5 bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100/60 dark:border-blue-900/30 text-[#2563EB] dark:text-blue-400 p-4 rounded-xl shadow-inner">
                    <Wallet size={20} className="shrink-0 text-blue-500 dark:text-blue-400" />
                    <span className="font-extrabold text-base tracking-wide">{pkg.credits.toLocaleString()} Credits</span>
                  </div>

                  <ul className="space-y-3 text-xs text-gray-500 dark:text-slate-400 font-semibold pt-2">
                    <li className="flex items-start gap-2 leading-relaxed">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Credits never expire</span>
                    </li>
                    <li className="flex items-start gap-2 leading-relaxed">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Unlimited design templates access</span>
                    </li>
                    <li className="flex items-start gap-2 leading-relaxed">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Deducted only upon print/download approval</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    disabled={checkoutLoadingId !== null}
                    className="w-full justify-center py-3 flex items-center gap-2 transition-all font-extrabold text-xs uppercase tracking-wider h-11 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: pkg.is_popular ? "#2563EB" : "transparent",
                      color: pkg.is_popular ? "#FFFFFF" : "#374151",
                      border: pkg.is_popular ? "none" : "1px solid #D1D5DB"
                    }}
                    onMouseEnter={(e) => {
                      if (pkg.is_popular) e.currentTarget.style.backgroundColor = "#1D4ED8";
                      else e.currentTarget.style.backgroundColor = "#F9FAFB";
                    }}
                    onMouseLeave={(e) => {
                      if (pkg.is_popular) e.currentTarget.style.backgroundColor = "#2563EB";
                      else e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => handleCheckout(pkg.id)}
                  >
                    Buy Now <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
