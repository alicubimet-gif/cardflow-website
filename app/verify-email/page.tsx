"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { STUDIO_URL } from "@/lib/config";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [studioRedirectUrl, setStudioRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Verification token is missing.");
      return;
    }

    const verify = async () => {
      setStatus("success");
      const studioUrl = STUDIO_URL;
      const cleanStudioUrl = studioUrl.endsWith("/") ? studioUrl.slice(0, -1) : studioUrl;
      const redirectUrl = `${cleanStudioUrl}/auth/verify?token=${encodeURIComponent(token)}`;
      setStudioRedirectUrl(redirectUrl);

      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1200);
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
        {status === "verifying" && (
          <div className="text-center space-y-6 py-6">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto animate-spin">
              <Loader2 className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                Verifying Your Email
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-md mx-auto animate-pulse">
                Please wait while we verify your account and set up your workspace...
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="text-center space-y-6 py-6">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-950/30 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                Email Verified Successfully!
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-350 font-medium leading-relaxed max-w-md mx-auto">
                We are redirecting you to Zamzarc Studio to finish verification securely.
              </p>
            </div>
            {studioRedirectUrl && (
              <div className="pt-4 max-w-sm mx-auto">
                <Button
                  onClick={() => {
                    window.location.href = studioRedirectUrl;
                  }}
                  className="w-full flex items-center justify-center gap-2"
                >
                  Continue to Studio <ArrowRight size={16} />
                </Button>
              </div>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-6 py-6">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                Verification Failed
              </h1>
              <p className="text-base text-red-600 dark:text-red-400 font-medium leading-relaxed max-w-md mx-auto">
                {errorMessage || "The verification link is invalid or expired."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 max-w-md mx-auto">
              <Button
                onClick={() => {
                  window.location.href = "/register";
                }}
                className="w-full flex items-center justify-center"
              >
                Back to Registration
              </Button>
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
