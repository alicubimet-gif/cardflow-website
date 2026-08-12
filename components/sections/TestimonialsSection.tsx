"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import {
  getPublicTestimonials,
  type PublicTestimonial,
} from "@/services/marketingService";

export default function TestimonialsSection() {
  const [items, setItems] = useState<PublicTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    void getPublicTestimonials()
      .then((rows) => {
        if (alive) setItems(rows);
      })
      .catch(() => {
        if (alive) setItems([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="bg-slate-50 dark:bg-slate-900/30 py-20 border-y border-slate-100 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl font-heading">
            Loved by Teams Worldwide
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
            Hear from administrative leads, card makers, and printing agencies using Z Cards.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {items.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover-glow"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4 text-amber-500">
                    {[...Array(Math.max(1, Math.min(5, t.rating || 5)))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-350 italic leading-relaxed font-medium">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="size-11 shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    {t.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.photo_url}
                        alt={t.author}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="grid size-full place-items-center text-sm font-bold text-slate-500">
                        {t.author.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.author}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
