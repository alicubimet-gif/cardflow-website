import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ApiErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ApiError({ title = "Request Failed", message, onRetry }: ApiErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl shadow-sm max-w-md mx-auto text-center space-y-4 animate-in fade-in zoom-in duration-200">
      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-455">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider font-heading">
          {title}
        </h3>
        <p className="text-xs text-rose-700 dark:text-rose-400 font-semibold leading-relaxed">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all hover:scale-102 hover:shadow-md active:scale-98 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Request
        </button>
      )}
    </div>
  );
}
