"use client";

import React, { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowRight, AlertTriangle, Mail } from "lucide-react";
import { SignupSchema, SignupInput } from "@/lib/schemas";
import { registerSubscriber } from "@/services/authService";
import { getErrorMessage, formatValidationErrors } from "@/lib/error-handler";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { STUDIO_URL } from "@/lib/config";

function RegisterForm() {
  const searchParams = useSearchParams();

  const studioUrl = STUDIO_URL;
  const cleanStudioUrl = studioUrl.endsWith('/') ? studioUrl.slice(0, -1) : studioUrl;
  const params = searchParams.toString();
  const loginUrl = params ? `${cleanStudioUrl}/login?${params}` : `${cleanStudioUrl}/login`;

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [accountExists, setAccountExists] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
    },
  });

  const onSubmit = async (data: SignupInput) => {
    setSubmitError(null);
    try {
      const res = await registerSubscriber(data);
      if (res && res.success) {
        setIsSubmitted(true);
      } else {
        if (res.code === "ACCOUNT_EXISTS") {
          setAccountExists(true);
          return;
        }
        const validationErrors = formatValidationErrors(res);
        if (Object.keys(validationErrors).length > 0) {
          Object.entries(validationErrors).forEach(([field, msg]) => {
            setError(field as any, { type: "server", message: msg });
          });
        } else {
          setSubmitError(getErrorMessage(res));
        }
      }
    } catch (err: any) {
      if (err.code === "ACCOUNT_EXISTS" || err.data?.code === "ACCOUNT_EXISTS") {
        setAccountExists(true);
        return;
      }
      const validationErrors = formatValidationErrors(err);
      if (Object.keys(validationErrors).length > 0) {
        Object.entries(validationErrors).forEach(([field, msg]) => {
          setError(field as any, { type: "server", message: msg });
        });
      } else {
        setSubmitError(getErrorMessage(err));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8 bg-white dark:bg-[#111827] p-8 sm:p-12 rounded-[24px] shadow-xl border border-slate-200 dark:border-white/[0.08]">
        {isSubmitted ? (
          <div className="text-center space-y-6 py-6">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-950/30 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
                Check Your Email!
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-md mx-auto">
                We&apos;ve sent a secure login link to your email address.<br />
                Click <strong>&ldquo;Verify &amp; Open Studio&rdquo;</strong> in the email to access
                your workspace. The link expires in&nbsp;20&nbsp;minutes.
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                No password required — you&apos;ll be signed in automatically.
              </p>
            </div>
          </div>
        ) : accountExists ? (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:amber-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
                An account with this email already exists.
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed max-w-md mx-auto">
                You already have a Z Cards account.<br />
                Please login through Z Cards Studio.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 max-w-sm mx-auto">
              <Button
                onClick={() => {
                  window.location.href = loginUrl;
                }}
                className="w-full flex items-center justify-center gap-2"
              >
                Go To Login <ArrowRight size={16} />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAccountExists(false);
                }}
                className="w-full flex items-center justify-center border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Use Different Email
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center space-y-3">
              <div className="flex justify-center mb-6">
                <img src="/branding/logo-dark.png" alt="Z Cards Logo" className="h-8 object-contain block dark:hidden" />
                <img src="/branding/logo-light.png" alt="Z Cards Logo" className="h-8 object-contain hidden dark:block" />
              </div>
              <h1 className="text-[32px] font-bold text-slate-900 dark:text-slate-100 font-heading leading-tight">
                Create an Account
              </h1>
              <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
                Join Z Cards and start designing your ID cards.
              </p>
            </div>

            {submitError && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  placeholder="Full Name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@company.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  type="tel"
                  inputMode="numeric"
                  placeholder="9876543210"
                  error={errors.phone?.message}
                  {...register("phone", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    }
                  })}
                />
                <Input
                  label="Company Name"
                  placeholder="Company Name"
                  error={errors.company?.message}
                  {...register("company")}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full flex items-center justify-center gap-2"
                >
                  Create Account <ArrowRight size={18} />
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
          </>
        )}
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
