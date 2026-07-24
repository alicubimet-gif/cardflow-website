'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 tracking-tight font-heading mb-3">Something Went Wrong</h1>
      <p className="text-slate-500 mb-8">We encountered an unexpected error processing your request.</p>
      <div className="flex gap-4">
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
          Try Again
        </button>
        <Link href="/" className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-bold text-sm hover:bg-[#1D4ED8] transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
