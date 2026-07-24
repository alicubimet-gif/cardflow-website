"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowLeft, ShieldAlert } from "lucide-react";
import { authService as apiService } from "@/services/authService";
import { getErrorMessage, formatValidationErrors } from "@/lib/error-handler";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { STUDIO_URL } from "@/lib/config";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!otpCode.trim()) {
      newErrors.otpCode = "Verification code is required.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must meet the minimum requirements.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      // Focus first error
      const keysOrdered = ["email", "otpCode", "password", "confirmPassword"];
      for (const k of keysOrdered) {
        if (newErrors[k]) {
          const el = document.getElementById(k) || document.querySelector(`input[name="${k}"]`) || document.querySelector(`input[type="${k === "email" ? "email" : "password"}"]`);
          if (el) (el as HTMLElement).focus();
          break;
        }
      }
      return;
    }

    setFieldErrors({});
    setIsLoading(true);
    try {
      await apiService.resetPassword({
        email,
        otp_code: otpCode,
        password,
        confirm_password: confirmPassword,
      });
      setSuccess("Password updated successfully! Redirecting to Studio...");
      setTimeout(() => {
        window.location.href = `${STUDIO_URL}/login`;
      }, 2000);
    } catch (err: any) {
      const fieldValidationErrors = formatValidationErrors(err);
      if (Object.keys(fieldValidationErrors).length > 0) {
        const mappedErrors: Record<string, string> = {};
        for (const [key, val] of Object.entries(fieldValidationErrors)) {
          if (key === "otp_code") {
            mappedErrors.otpCode = val;
          } else if (key === "confirm_password") {
            mappedErrors.confirmPassword = val;
          } else {
            mappedErrors[key] = val;
          }
        }
        setFieldErrors(mappedErrors);
        
        // Focus first error field
        const keysOrdered = ["email", "otpCode", "password", "confirmPassword"];
        for (const k of keysOrdered) {
          if (mappedErrors[k]) {
            const el = document.getElementById(k) || document.querySelector(`input[name="${k}"]`);
            if (el) (el as HTMLElement).focus();
            break;
          }
        }
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            Enter your verification code and enter a secure password
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

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="relative">
            <Mail className="absolute left-3.5 top-[36px] w-4 h-4 text-muted animate-pulse" />
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@company.com"
              className="pl-10"
              value={email}
              error={fieldErrors.email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: "" }));
              }}
            />
          </div>

          <Input
            id="otpCode"
            label="6-Digit Recovery OTP"
            placeholder="000000"
            maxLength={6}
            className="text-center font-mono tracking-widest text-lg"
            value={otpCode}
            error={fieldErrors.otpCode}
            onChange={(e) => {
              setOtpCode(e.target.value);
              if (fieldErrors.otpCode) setFieldErrors(prev => ({ ...prev, otpCode: "" }));
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: "" }));
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
                  if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: "" }));
                }}
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-4 py-3" isLoading={isLoading}>
            Reset Password
          </Button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-card-border/60">
          <a href={STUDIO_URL || "/login"} className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Studio
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-[90vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="w-full max-w-[420px] glass rounded-2xl border border-card-border p-8 text-center text-sm text-muted">
          Loading reset password page...
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
