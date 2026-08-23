"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, MailX, XCircle } from "lucide-react";
import { unsubscribeFromNewsletter } from "@/services/newsletterService";
import { getErrorMessage } from "@/lib/error-handler";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Unsubscribe link is invalid or missing a token.");
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const data = await unsubscribeFromNewsletter(token);
        if (cancelled) return;
        setStatus("success");
        setMessage(data.message || "You have been unsubscribed from the newsletter.");
        setEmail(data.email ?? null);
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setMessage(getErrorMessage(error));
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full space-y-6 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 text-center">
        {status === "loading" ? (
          <>
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Loader2 className="size-8 animate-spin" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                Processing unsubscribe
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Please wait while we update your subscription preferences.
              </p>
            </div>
          </>
        ) : null}

        {status === "success" ? (
          <>
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                Unsubscribed
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
              {email ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {email} will no longer receive newsletter emails.
                </p>
              ) : null}
            </div>
          </>
        ) : null}

        {status === "error" ? (
          <>
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
              <XCircle className="size-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                Unable to unsubscribe
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
            </div>
          </>
        ) : null}

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover transition-colors"
          >
            <MailX className="size-4" />
            Back to Z Cards
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function NewsletterUnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
