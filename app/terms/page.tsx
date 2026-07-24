"use client";

import React from "react";
import { FileText } from "lucide-react";
import { useBranding } from "@/components/branding-provider";

export default function Terms() {
  const { brandSettings } = useBranding();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <FileText className="w-3.5 h-3.5" /> Terms
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="text-sm text-muted">
          {brandSettings.platform_name} by {brandSettings.company_name}
        </p>
      </div>
      
      <div className="prose dark:prose-invert max-w-none border border-card-border bg-card-bg/30 rounded-2xl p-8 sm:p-12 space-y-6 text-sm text-muted leading-relaxed">
        <p>
          Welcome to {brandSettings.platform_name}. By accessing or using our services, you agree to comply with and be bound by the following Terms of Service.
        </p>
        
        <h2 className="text-lg font-bold text-foreground mt-6">1. User Accounts and Account Security</h2>
        <p>
          You must maintain the confidentiality of your credentials. You are responsible for all activities occurring under your account. You agree to notify us immediately of any unauthorized use of your account.
        </p>
        
        <h2 className="text-lg font-bold text-foreground mt-6">2. Permitted Use</h2>
        <p>
          You may use our platform solely for lawful purposes associated with managing ID cards and printing operations. You agree not to upload fraudulent data, unauthorized profiles, or malicious code.
        </p>
        
        <h2 className="text-lg font-bold text-foreground mt-6">3. Wallet Credits and Billing</h2>
        <p>
          Wallet credits purchased on our platform are non-refundable and hold no monetary value outside the {brandSettings.platform_name} ecosystem. Purchases and transactions are final unless required by law.
        </p>
        
        <h2 className="text-lg font-bold text-foreground mt-6">4. Intellectual Property</h2>
        <p>
          The designs, layout variable compilers, and all visual materials developed on this site belong to {brandSettings.company_name} and are protected under copyright laws.
        </p>
      </div>
    </div>
  );
}
