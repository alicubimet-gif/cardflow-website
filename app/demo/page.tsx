"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, FileText, CheckCircle, Sparkles } from "lucide-react";
import { EnquirySchema, EnquiryInput } from "@/lib/schemas";
import { authService as apiService } from "@/services/authService";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { formatValidationErrors, getErrorMessage } from "@/lib/error-handler";

function EnquiryContent() {
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(EnquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      cardVolume: "",
      interest: "",
      message: "",
    },
  });

  // Pre-fill interest from URL parameter if present (e.g. ?interest=Agency)
  useEffect(() => {
    const interestParam = searchParams.get("interest");
    if (interestParam) {
      setValue("interest", interestParam);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: EnquiryInput) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const response = await apiService.submitEnquiry(data);
      if (response.success) {
        setSubmitSuccess(response.message);
        reset();
      } else {
        const validationErrors = formatValidationErrors(response);
        if (Object.keys(validationErrors).length > 0) {
          Object.entries(validationErrors).forEach(([field, msg]) => {
            setError(field as any, { type: "server", message: msg });
          });
        } else {
          setSubmitError(getErrorMessage(response));
        }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* HEADER SECTION */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <Sparkles className="w-3.5 h-3.5" /> High Volume Enterprise Consultation
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Custom Layouts & Bulk Rates
        </h1>
        <p className="text-lg text-muted">
          Need white-labeled portals, local on-premises servers, or more than 10,000 prints per month? Submit an enquiry for a custom contract.
        </p>
      </section>

      {/* ENQUIRY CARD */}
      <section className="max-w-3xl mx-auto rounded-2xl border border-card-border bg-card-bg/25 p-8 text-left">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <FileText className="w-5.5 h-5.5 text-primary" /> Enterprise Enquiry Details
        </h2>

        {submitSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-success/15 border border-success/35 text-success flex items-start gap-3">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Enquiry Submitted!</h4>
              <p className="text-xs leading-normal mt-1">{submitSuccess}</p>
            </div>
          </div>
        )}

        {submitError && (
          <div className="mb-6 p-4 rounded-xl bg-error/15 border border-error/35 text-error flex items-start gap-3">
            <span className="w-5 h-5 shrink-0 rounded-full bg-error text-white font-bold flex items-center justify-center text-xs">!</span>
            <div>
              <h4 className="font-bold text-sm">Error Logging Enquiry</h4>
              <p className="text-xs leading-normal mt-1">{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Contact Person Name"
              placeholder="Riyas Ahmed"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Work Email Address"
              type="email"
              placeholder="riyas@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Direct Phone Number"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              placeholder="90000000000"
              error={errors.phone?.message}
              {...register("phone", {
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
                }
              })}
            />
            <Input
              label="Company Name"
              placeholder="Malabar Print Hub"
              error={errors.company?.message}
              {...register("company")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {/* Card Volume */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Est. Monthly Card Prints
              </label>
              <select
                className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.cardVolume ? "border-error focus:ring-error/20" : "border-card-border focus:border-primary"
                } text-foreground`}
                {...register("cardVolume")}
              >
                <option value="">Select print volume...</option>
                <option value="1-500">1 to 500 cards</option>
                <option value="501-2000">501 to 2,000 cards</option>
                <option value="2001-10000">2,001 to 10,000 cards</option>
                <option value="10000+">More than 10,000 cards</option>
              </select>
              {errors.cardVolume?.message && (
                <p className="text-xs text-error font-medium mt-1">{errors.cardVolume.message}</p>
              )}
            </div>

            {/* Area of Interest */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Core Requirement
              </label>
              <select
                className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.interest ? "border-error focus:ring-error/20" : "border-card-border focus:border-primary"
                } text-foreground`}
                {...register("interest")}
              >
                <option value="">Select primary interest...</option>
                <option value="Enterprise SaaS">Enterprise Bulk SaaS Workspace</option>
                <option value="On-Premises">On-Premises / Offline Printing Client</option>
                <option value="Custom Design Services">Custom Template Design & Mapping</option>
                <option value="Agency Partnership">Agency Partnership / Wholesale Reselling</option>
              </select>
              {errors.interest?.message && (
                <p className="text-xs text-error font-medium mt-1">{errors.interest.message}</p>
              )}
            </div>
          </div>

          <div className="text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Describe your Custom printing workflow
            </label>
            <textarea
              rows={4}
              placeholder="Specify special card specs, custom fonts, offline printer configurations, or whitelist requirements..."
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.message
                  ? "border-error focus:ring-error/20 focus:border-error"
                  : "border-card-border focus:ring-primary/20 focus:border-primary"
              } text-foreground placeholder:text-muted/60`}
              {...register("message")}
            />
            {errors.message?.message && (
              <p className="mt-1 text-xs text-error font-medium flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-error" /> {errors.message.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button type="submit" isLoading={isSubmitting} className="w-full flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Send Enquiry Form
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function Enquiry() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-sm text-muted">
        Loading enquiry form...
      </div>
    }>
      <EnquiryContent />
    </Suspense>
  );
}
