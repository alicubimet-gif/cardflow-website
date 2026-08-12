"use client";

import React from "react";
import FaqsSection from "@/components/sections/FaqsSection";

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 min-h-[60vh]">
      <div className="text-center mb-10 space-y-3">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight font-heading">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Find answers to common questions about our platform.
        </p>
      </div>
      <FaqsSection compact />
    </div>
  );
}
