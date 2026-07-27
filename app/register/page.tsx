"use client";

import React, { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowRight, AlertTriangle, Mail, RefreshCw } from "lucide-react";
import { SignupSchema, SignupInput } from "@/lib/schemas";
import { registerSubscriber } from "@/services/authService";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { STUDIO_URL } from "@/lib/config";
import { ThemeLogo } from "@/components/theme-logo";

// ── Field name mapping ────────────────────────────────────────────────────────
// The backend returns errors keyed by its field names. Map them to the form's
// field names so setError() highlights the correct input.
const BACKEND_FIELD_MAP: Record<string, keyof SignupInput> = {
  email: "email",
  phone: "phone",
  name: "name",
  first_name: "name",
  last_name: "name",
  company: "company",
  company_name: "company",
};

// ── Human-readable messages for known error codes ─────────────────────────────
function getCodeMessage(code: string | null): string {
  switch (code) {
    case "NETWORK_ERROR":
      return "Unable to connect to the server. Please check your internet connection and try again.";
    case "RATE_LIMITED":
      return "Too many registration attempts. Please wait a few minutes and try again.";
    case "SERVER_ERROR":
      return "A server error occurred. Please try again in a moment.";
    case "PROXY_ERROR":
    case "INVALID_RESPONSE":
      return "An unexpected error occurred. Please try again.";
    default:
      return "";
  }
}

function RegisterForm() {
  const searchParams = useSearchParams();

  const studioUrl = STUDIO_URL;
  const cleanStudioUrl = studioUrl.endsWith("/") ? studioUrl.slice(0, -1) : studioUrl;
  const params = searchParams.toString();
  const loginUrl = params
    ? `${cleanStudioUrl}/login?${params}`
    : `${cleanStudioUrl}/login`;

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [accountExists, setAccountExists] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { name: "", email: "", phone: "", company: "" },
  });

  const onSubmit = async (data: SignupInput) => {
    setSubmitError(null);

    try {
      const res = await registerSubscriber(data);

      // Success: proxy wraps the 201 as { success: true }
      if (res?.success === true) {
        reset(); // clear form — do not keep personal data in state
        setIsSubmitted(true);
        return;
      }

      // success field missing but no error thrown — treat as success if status was ok
      // (shouldn't happen with the new proxy, but be defensive)
      if (res && !res.success && res.code === "ACCOUNT_EXISTS") {
        setAccountExists(true);
        return;
      }

      // Unexpected non-success response (no throw) — show message
      setSubmitError(
        res?.message || "Registration could not be completed. Please try again."
      );
    } catch (err: any) {
      // ── ACCOUNT_EXISTS ─────────────────────────────────────────────────────
      if (err.code === "ACCOUNT_EXISTS") {
        setAccountExists(true);
        return;
      }

      // ── Known error codes (network, rate limit, server) ────────────────────
      const codeMessage = getCodeMessage(err.code);
      if (codeMessage) {
        setSubmitError(codeMessage);
        return;
      }

      // ── Field-level validation errors (from DRF, surfaced by apiClient) ────
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        let hasFieldMatch = false;
        for (const [backendField, message] of Object.entries(err.fieldErrors as Record<string, string>)) {
          const formField = BACKEND_FIELD_MAP[backendField];
          if (formField) {
            setError(formField, { type: "server", message });
            hasFieldMatch = true;
          }
        }
        if (!hasFieldMatch) {
          // Non-field errors — show in the general alert
          const firstMsg = Object.values(err.fieldErrors as Record<string, string>)[0];
          setSubmitError(firstMsg || "Validation failed. Please check your entries.");
        }
        return;
      }

      // ── Generic fallback ───────────────────────────────────────────────────
      const message =
        err.message && err.message !== "Something went wrong"
          ? err.message
          : err.status === 0
          ? "Unable to connect to the server. Please check your internet connection."
          : err.status >= 500
          ? "A server error occurred. Please try again shortly."
          : err.status === 429
          ? "Too many attempts. Please wait a moment and try again."
          : "Registration failed. Please try again.";

      setSubmitError(message);
    }
  };

  // ── Submitted: email sent confirmation ────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white dark:bg-[#111827] p-8 sm:p-12 rounded-[24px] shadow-xl border border-slate-200 dark:border-white/[0.08]">
          <div className="text-center space-y-6 py-6">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-950/30 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
                Check Your Email!
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-md mx-auto">
                We&apos;ve sent a secure setup link to your email address.
                <br />
                Click{" "}
                <strong>&ldquo;Complete Setup&rdquo;</strong> in the email to
                access your workspace.
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                The link expires in&nbsp;24&nbsp;hours. Check your spam folder
                if it doesn&apos;t arrive.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Account already exists ─────────────────────────────────────────────────
  if (accountExists) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white dark:bg-[#111827] p-8 sm:p-12 rounded-[24px] shadow-xl border border-slate-200 dark:border-white/[0.08]">
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
                Account Already Exists
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed max-w-md mx-auto">
                You already have a Zamzarc account.
                <br />
                Please sign in through Zamzarc Studio.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 max-w-sm mx-auto">
              <Button
                onClick={() => { window.location.href = loginUrl; }}
                className="w-full flex items-center justify-center gap-2"
              >
                Go To Login <ArrowRight size={16} />
              </Button>
              <Button
                variant="outline"
                onClick={() => setAccountExists(false)}
                className="w-full flex items-center justify-center border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Use Different Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration form ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8 bg-white dark:bg-[#111827] p-8 sm:p-12 rounded-[24px] shadow-xl border border-slate-200 dark:border-white/[0.08]">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-6">
            <ThemeLogo width={140} height={36} priority />
          </div>
          <h1 className="text-[32px] font-bold text-slate-900 dark:text-slate-100 font-heading leading-tight">
            Create an Account
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
            Join Zamzarc and start designing your ID cards.
          </p>
        </div>

        {/* General error alert */}
        {submitError && (
          <div
            role="alert"
            className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium"
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{submitError}</p>
              {submitError.toLowerCase().includes("connection") && (
                <button
                  type="button"
                  onClick={() => setSubmitError(null)}
                  className="mt-2 text-red-600 dark:text-red-400 underline text-xs font-semibold hover:no-underline"
                >
                  Dismiss and try again
                </button>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              id="register-name"
              label="Full Name"
              placeholder="John Smith"
              autoComplete="name"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              id="register-email"
              label="Email Address"
              type="email"
              placeholder="john@company.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              id="register-phone"
              label="Phone Number"
              type="tel"
              inputMode="numeric"
              placeholder="9876543210"
              autoComplete="tel"
              maxLength={10}
              error={errors.phone?.message}
              {...register("phone", {
                onChange: (e) => {
                  // Strip non-digits, cap at 10 chars
                  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
                },
              })}
            />
            <Input
              id="register-company"
              label="Company Name"
              placeholder="Acme Corp"
              autoComplete="organization"
              error={errors.company?.message}
              {...register("company")}
            />
          </div>

          <div className="pt-2">
            <Button
              id="register-submit"
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className="w-full flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Creating Account…
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure 256-bit encryption. Your data is safe.</span>
          </div>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href={loginUrl}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
