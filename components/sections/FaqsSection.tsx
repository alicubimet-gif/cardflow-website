"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import Accordion from "@/components/ui/Accordion";
import { getPublicFaqs, type PublicFAQ } from "@/services/marketingService";

export default function FaqsSection({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [items, setItems] = useState<PublicFAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    void getPublicFaqs()
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

  const accordionItems = items.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  return (
    <section className={compact ? "w-full" : "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"}>
      {!compact ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 space-y-3"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2 font-heading">
            <HelpCircle className="w-7 h-7 text-blue-600 dark:text-blue-400" /> Frequently Asked
            Questions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Everything you need to know about the Z Cards SaaS platform and printing engine.
          </p>
        </motion.div>
      ) : null}

      {loading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Accordion items={accordionItems} />
        </motion.div>
      )}
    </section>
  );
}
