"use client";

import React, { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, ArrowRight, Building, Phone, Sparkles, Loader2 } from "lucide-react";
import { CompleteProfileSchema, CompleteProfileInput } from "@/lib/schemas";
import { authService } from "@/services/authService";
import { getErrorMessage, formatValidationErrors } from "@/lib/error-handler";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { STUDIO_URL } from "@/lib/config";

function CompleteProfileForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CompleteProfileInput>({
    resolver: zodResolver(CompleteProfileSchema),
    defaultValues: {
      company_name: "",
      phone: "",
    },
  });

  const onSubmit = async (data: CompleteProfileInput) => {
    setSubmitError(null);
    setSuccessMessage(null);
    try {
      const res = await authService.completeProfile({
        company_name: data.company_name,
        phone: data.phone,
      });

      setSuccessMessage("Profile completed! Handoff to Studio in progress...");

      // Read access and refresh tokens returned by proxy route
      const access = res.access_token || res.access || "";
      const refresh = res.refresh_token || res.refresh || "";
      const studioUrl = STUDIO_URL;

      // Redirect to cross-domain auto-login bridge
      if (access && refresh) {
        const params = new URLSearchParams();
        params.set("access", access);
        params.set("refresh", refresh);
        params.set("destination", "/dashboard");
        
        setTimeout(() => {
          window.location.href = `${studioUrl}/auth/auto-login?${params.toString()}`;
        }, 1200);
      } else {
        // Fallback if tokens are not directly available (rely on cookies on the domain)
        setTimeout(() => {
          window.location.href = `${studioUrl}/dashboard`;
        }, 1200);
      }
    } catch (err: any) {
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Decorative premium background elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-4000" />

      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 relative z-10">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20 transform rotate-3 hover:rotate-12 transition-transform duration-300">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Just a few more details to set up your Z Cards Studio workspace.
          </p>
        </div>

        {submitError && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium">
            {submitError}
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-3.5 top-[38px] text-slate-400 dark:text-slate-500">
                <Building className="w-4 h-4" />
              </span>
              <Input
                label="Company Name"
                placeholder="Acme Corporation"
                className="pl-10"
                error={errors.company_name?.message}
                {...register("company_name")}
              />
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-[38px] text-slate-400 dark:text-slate-500">
                <Phone className="w-4 h-4" />
              </span>
              <Input
                label="Phone Number"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                placeholder="90000000000"
                className="pl-10"
                error={errors.phone?.message}
                {...register("phone", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  }
                })}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full flex items-center justify-center gap-2 group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/10 hover:shadow-blue-500/25 transition-all duration-300"
            >
              Complete setup 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure 256-bit encryption. Your workspace is private.</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
      <CompleteProfileForm />
    </Suspense>
  );
}
