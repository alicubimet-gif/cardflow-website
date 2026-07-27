import React from 'react';

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-black text-slate-900 tracking-tight font-heading mb-4">Zamzarc Blog</h1>
      <p className="text-slate-500 max-w-2xl">Latest news, updates, and tutorials.</p>
      <div className="mt-8 p-8 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-sm italic w-full">
        Content coming soon...
      </div>
    </div>
  );
}
