"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MessageSquare, X } from "lucide-react";

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const actions = [
    {
      name: "WhatsApp",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      color: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20",
      href: "https://wa.me/15550199234",
    },
    {
      name: "Call Now",
      icon: <Phone className="w-5 h-5" />,
      color: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20",
      href: "tel:+15550199234",
    },
    {
      name: "Email Us",
      icon: <Mail className="w-5 h-5" />,
      color: "bg-teal-500 hover:bg-teal-600 shadow-teal-500/20",
      href: "mailto:support@zamirzac.com",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-center gap-3">
      {/* Floating expanded actions */}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col gap-3 mb-1">
            {actions.map((act, idx) => (
              <motion.a
                key={act.name}
                href={act.href}
                target={act.name === "WhatsApp" ? "_blank" : undefined}
                rel={act.name === "WhatsApp" ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, scale: 0.8, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 15 }}
                transition={{ duration: 0.25, delay: (actions.length - 1 - idx) * 0.05 }}
                className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform ${act.color}`}
                title={act.name}
              >
                {act.icon}
              </motion.a>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Primary Toggle Action Button */}
      <button
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-200 ${
          isOpen ? "bg-slate-800 hover:bg-slate-900 shadow-slate-800/20" : "bg-[#2563EB] hover:bg-blue-700 shadow-blue-500/25"
        }`}
        aria-label="Toggle contact quick actions"
      >
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </motion.span>
      </button>
    </div>
  );
}
