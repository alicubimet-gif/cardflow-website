"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import { authService as apiService } from "@/services/authService";
import { getErrorMessage } from "@/lib/error-handler";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { STUDIO_URL } from "@/lib/config";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setEmailError(null);

    if (!email.trim()) {
      setEmailError("Email is required.");
      const el = document.querySelector('input[type="email"]') as HTMLInputElement;
      if (el) el.focus();
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      const el = document.querySelector('input[type="email"]') as HTMLInputElement;
      if (el) el.focus();
      return;
    }

    setIsLoading(true);

    try {
      await apiService.forgotPassword({ email });
      setSuccess("Verification code sent! Loading password reset screen...");
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err: any) {
      const errMsg = getErrorMessage(err);
      if (errMsg.toLowerCase().includes("email") || errMsg.toLowerCase().includes("account") || errMsg.toLowerCase().includes("user")) {
        setEmailError(errMsg);
        const el = document.querySelector('input[type="email"]') as HTMLInputElement;
        if (el) el.focus();
      } else {
        setError(errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] glass rounded-2xl border border-card-border p-8 text-left shadow-2xl relative z-10">
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mt-2">Password Recovery</h2>
          <p className="text-xs text-muted">
            Enter your registered email address to receive a recovery OTP
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
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              className="pl-10"
              value={email}
              error={emailError || undefined}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
            />
          </div>

          <Button type="submit" className="w-full mt-4 py-3" isLoading={isLoading}>
            Send Verification Code
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
