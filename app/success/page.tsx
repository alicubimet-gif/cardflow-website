import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 tracking-tight font-heading mb-3">Action Successful</h1>
      <p className="text-slate-500 mb-8">Your request has been processed successfully.</p>
      <Link href="/" className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-bold text-sm hover:bg-[#1D4ED8] transition-colors">
        Return Home
      </Link>
    </div>
  );
}
