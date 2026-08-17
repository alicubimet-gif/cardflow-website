import type { Metadata } from "next";
import Link from "next/link";
import { PRIVACY_LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Z Cards uses cookies and similar storage. See the Privacy & Policy for the full details.",
};

export default function CookiesPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Cookie Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: {PRIVACY_LAST_UPDATED}</p>
      <div className="mt-8 space-y-4 rounded-2xl border border-card-border bg-card-bg/30 p-6 text-sm leading-relaxed text-muted sm:p-10">
        <p>
          Z Cards uses cookies and similar storage only where they are needed for the website and
          apps to work — for example keeping you signed in, remembering theme or workspace choice,
          and showing a short confirmation after you delete an account.
        </p>
        <p>
          The full description, including account data, retention, and security practices, lives on
          the central{" "}
          <Link href="/privacy" className="font-semibold text-primary hover:underline">
            Privacy &amp; Policy
          </Link>{" "}
          page. That is the policy all Z Cards applications link to.
        </p>
      </div>
    </div>
  );
}
