"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader2, KeyRound } from "lucide-react";
import { verifyOtp, resendOtp } from "@/services/authService";
import { getErrorMessage } from "@/lib/error-handler";
import Button from "@/components/ui/Button";
import { STUDIO_URL } from "@/lib/config";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const nextParam = searchParams.get("next") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Resend countdown
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!email) {
      router.push("/register");
    }
  }, [email, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (otpError) setOtpError(null);
    // Overwrite the box by taking the last character if typing over an existing one
    const char = value.slice(-1);
    
    // Only allow numeric inputs
    if (char && !/^\d$/.test(char)) return;

    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    if (char && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (otpError) setOtpError(null);
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current is empty, clear the previous input and focus it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        const prevInput = document.getElementById(`otp-${index - 1}`);
        prevInput?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (otpError) setOtpError(null);
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").trim();
    if (pastedData.length !== 6) return;

    const newOtp = pastedData.split("");
    setOtp(newOtp);

    // Focus the last input box
    const lastInput = document.getElementById("otp-5");
    lastInput?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setOtpError("Please enter the complete 6-digit OTP code.");
      const firstEl = document.getElementById("otp-0");
      if (firstEl) firstEl.focus();
      return;
    }

    setIsVerifying(true);
    setError(null);
    setOtpError(null);
    setSuccess(null);

    try {
      const res = await verifyOtp({ email, otp: otpCode });
      if (res && res.success) {
        setSuccess("Account verified! Redirecting you to Studio...");

        const { access, refresh } = res.data || {};



        // Build cross-domain handoff URL for Studio
        const studioUrl = STUDIO_URL;
        const params = new URLSearchParams();
        if (access) params.set("access", access);
        if (refresh) params.set("refresh", refresh);
        // Carry over ?next= for post-purchase flows (e.g. next=buy&package_id=X)
        if (nextParam) params.set("next", nextParam);
        params.set("destination", "/dashboard");

        setTimeout(() => {
          window.location.href = `${studioUrl}/auth/auto-login?${params.toString()}`;
        }, 1500);
      } else {
        const errMsg = getErrorMessage(res);
        if (errMsg.toLowerCase().includes("otp") || errMsg.toLowerCase().includes("code") || errMsg.toLowerCase().includes("incorrect") || errMsg.toLowerCase().includes("expired")) {
          setOtpError(errMsg);
          const firstEl = document.getElementById("otp-0");
          if (firstEl) firstEl.focus();
        } else {
          setError(errMsg);
        }
      }
    } catch (err: any) {
      const errMsg = getErrorMessage(err);
      if (errMsg.toLowerCase().includes("otp") || errMsg.toLowerCase().includes("code") || errMsg.toLowerCase().includes("incorrect") || errMsg.toLowerCase().includes("expired")) {
        setOtpError(errMsg);
        const firstEl = document.getElementById("otp-0");
        if (firstEl) firstEl.focus();
      } else {
        setError(errMsg);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setError(null);
    setOtpError(null);
    setSuccess(null);

    try {
      await resendOtp({ email });
      setSuccess("OTP resent successfully. Please check your email.");
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">

         <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Verify Your Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            We sent a 6-digit verification code to
            <br />
            <span className="font-bold text-slate-700 dark:text-slate-300 mt-2 block">{email}</span>
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-8">
          <div>
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    otpError ? "border-error focus:ring-error/20" : "border-slate-300 dark:border-slate-700"
                  }`}
                  required
                />
              ))}
            </div>
            {otpError && (
              <p className="mt-3 text-[13px] text-error font-medium text-center">
                {otpError}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              isLoading={isVerifying}
              className="w-full flex items-center justify-center gap-2"
            >
              Verify OTP <ShieldCheck size={18} />
            </Button>
          </div>
        </form>

        <div className="text-center pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">
            Didn&apos;t receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={countdown > 0 || isResending}
            className={`text-sm font-bold flex items-center justify-center gap-2 w-full py-2.5 rounded-xl transition-all ${
              countdown > 0 || isResending
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40"
            }`}
          >
            {isResending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : countdown > 0 ? (
              `Resend OTP in ${countdown}s`
            ) : (
              "Resend OTP"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
