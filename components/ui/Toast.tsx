"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<any>).detail;
      if (detail) {
        const msg = typeof detail === "string" ? detail : detail.message;
        const type = typeof detail === "string" ? "info" : (detail.type || "info");
        showToast(msg, type);
      }
    };

    window.addEventListener("cardflow:toast", handleToast);
    return () => window.removeEventListener("cardflow:toast", handleToast);
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "error": return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case "info": return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBg = (type: ToastType) => {
    switch (type) {
      case "success": return "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-200";
      case "error": return "bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/30 text-rose-900 dark:text-rose-200";
      case "warning": return "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/30 text-amber-900 dark:text-amber-200";
      case "info": return "bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/30 text-blue-900 dark:text-blue-200";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${getBg(toast.type)}`}
            >
              <div className="shrink-0 mt-0.5">{getIcon(toast.type)}</div>
              <div className="flex-1 text-xs font-semibold leading-relaxed">{toast.message}</div>
              <button 
                onClick={() => removeToast(toast.id)} 
                className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
