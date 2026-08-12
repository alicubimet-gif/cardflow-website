"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPublicTeam, type PublicTeamMember } from "@/services/marketingService";

export default function TeamSection({
  title = "Meet the team",
  subtitle = "The people building Z Cards for schools, corporates and print studios.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const [members, setMembers] = useState<PublicTeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    void getPublicTeam()
      .then((rows) => {
        if (alive) setMembers(rows);
      })
      .catch(() => {
        if (alive) setMembers([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!loading && members.length === 0) return null;

  return (
    <section className="bg-white dark:bg-slate-950 py-20 border-y border-slate-100 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl font-heading">
            {title}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 sm:text-base">
            {subtitle}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {members.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-left space-y-4"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500/20 bg-slate-200 dark:bg-slate-700">
                  {member.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="grid size-full place-items-center text-lg font-bold text-slate-500">
                      {member.name.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-none">
                    {member.name}
                  </h3>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1 block">
                    {member.role}
                  </span>
                </div>
                {member.bio ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {member.bio}
                  </p>
                ) : null}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
