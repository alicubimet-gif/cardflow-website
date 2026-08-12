"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, ArrowLeft, ShieldAlert } from "lucide-react";
import { authService as apiService } from "@/services/authService";
import { getErrorMessage, formatValidationErrors } from "@/lib/error-handler";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { STUDIO_URL } from "@/lib/config";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const studioLogin = `${(STUDIO_URL || "").replace(/\/$/, "")}/login`;
  const studioReset = token
    ? `${(STUDIO_URL || "").replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`
    : "";

  // Prefer Studio Hub for reset when configured (same account system).
  useEffect(() => {
    if (token && STUDIO_URL) {
      window.location.replace(studioReset);
    }
  }, [token, studioReset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const newErrors: Record<string, string> = {};

    if (!token) {
      newErrors.token = "This reset link is missing a token.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 10) {
      newErrors.password = "Password must be at least 10 characters.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);
    try {
      await apiService.resetPassword({ token, password });
      setSuccess("Password updated successfully! Redirecting to Studio…");
      setTimeout(() => {
        window.location.href = studioLogin || "/";
      }, 1500);
    } catch (err: unknown) {
      const fieldValidationErrors = formatValidationErrors(err);
      if (Object.keys(fieldValidationErrors).length > 0) {
        const mappedErrors: Record<string, string> = {};
        for (const [key, val] of Object.entries(fieldValidationErrors)) {
          if (key === "confirm_password") mappedErrors.confirmPassword = val;
          else mappedErrors[key] = val;
        }
        setFieldErrors(mappedErrors);
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (token && STUDIO_URL) {
    return (
      <div className="min-h-[90vh] flex flex-col items-center justify-center p-4">
        <p className="text-sm text-muted">Opening Studio to reset your password…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] glass rounded-2xl border border-card-border p-8 text-left shadow-2xl relative z-10">
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mt-2">New Password</h2>
          <p className="text-xs text-muted">
            {token
              ? "Choose a secure password for your account."
              : "Open the reset link from your email, or request a new one."}
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-xs font-semibold bg-error/10 border border-error/20 text-error rounded-lg text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 mb-4 text-xs font-semibold bg-success/10 border border-success/20 text-success rounded-lg text-center">
            {success}
          </div>
        )}

        {token && !success ? (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {fieldErrors.token && (
              <p className="text-xs text-error text-center">{fieldErrors.token}</p>
            )}
            <div className="relative">
              <Lock className="absolute left-3.5 top-[36px] w-4 h-4 text-muted" />
              <Input
                id="password"
                label="New Password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={password}
                error={fieldErrors.password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
                }}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-[36px] w-4 h-4 text-muted" />
              <Input
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={confirmPassword}
                error={fieldErrors.confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) {
                    setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }
                }}
              />
            </div>

            <Button type="submit" className="w-full mt-4 py-3" isLoading={isLoading}>
              Reset Password
            </Button>
          </form>
        ) : null}

        <div className="text-center mt-6 pt-4 border-t border-card-border/60 space-y-2">
          {!token && (
            <a
              href="/forgot-password"
              className="block text-xs font-semibold text-primary hover:underline"
            >
              Request a new reset link
            </a>
          )}
          <a
            href={studioLogin || "/"}
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Studio
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[90vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
          <div className="w-full max-w-[420px] glass rounded-2xl border border-card-border p-8 text-center text-sm text-muted">
            Loading reset password page...
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
