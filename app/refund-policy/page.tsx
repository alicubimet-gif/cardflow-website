import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-start justify-start text-left">
      <h1 className="text-4xl font-black text-slate-900 tracking-tight font-heading mb-4">Refund Policy</h1>
      <p className="text-slate-500 max-w-2xl">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-8 p-8 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-sm italic w-full text-center">
        Legal copy placeholder...
      </div>
    </div>
  );
}
