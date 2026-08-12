"use client";

import React from "react";
import { Trophy, Flag, Heart, Target } from "lucide-react";
import TeamSection from "@/components/sections/TeamSection";

export default function About() {
  const milestones = [
    {
      year: "2024",
      title: "Founding & Prototypes",
      desc: "Z Cards was founded to eliminate manually compiling static graphic layers in printing workshops, designing a basic online vector composer.",
    },
    {
      year: "2025",
      title: "PDF Compiler Engine V1",
      desc: "Released our custom print-matrix compiler allowing 300 DPI crop-mark calibrated PDF exports. Secured our first 100 print agencies.",
    },
    {
      year: "2026",
      title: "Self-Service & Database Sync",
      desc: "Launched student self-service photo upload portals and Google Sheets automation. Scaled platform capacity to over 5,000,000 prints.",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Millimeter Precision",
      desc: "We ensure visual designs compile identically to physical thermal prints down to the single millimeter mark.",
    },
    {
      icon: Trophy,
      title: "High Reliability",
      desc: "Identity card production represents critical administrative deadlines. We maintain a strict 99.9% API uptime SLA.",
    },
    {
      icon: Heart,
      title: "Client-Centric",
      desc: "We support physical print shop operations directly, providing custom formats, margins, and offline helpers.",
    },
  ];

  return (
    <div className="space-y-24 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <Flag className="w-3.5 h-3.5" /> Our Mission
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Digitizing the ID Card Printing Industry
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            We believe that physical ID card printing should not be held back by archaic desktop
            software. Our goal is to connect designs, rosters, and physical printers into a single
            cloud ecosystem.
          </p>
        </section>

        <section className="space-y-12">
          <h2 className="text-2xl font-bold text-foreground text-center">Our Milestone Timeline</h2>
          <div className="max-w-4xl mx-auto relative border-l border-card-border ml-4 sm:ml-auto">
            {milestones.map((ms, idx) => (
              <div key={idx} className="mb-10 ml-6 relative">
                <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background" />
                <div className="p-6 rounded-xl border border-card-border bg-card-bg/30 text-left">
                  <span className="font-mono text-xs font-bold text-primary">{ms.year}</span>
                  <h3 className="font-bold text-base text-foreground mt-1">{ms.title}</h3>
                  <p className="text-xs text-muted leading-relaxed mt-2">{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <h2 className="text-2xl font-bold text-foreground text-center">Our Core Operating Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-card-border bg-card-bg/25 text-left space-y-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <v.icon className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">{v.title}</h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <TeamSection
        title="Meet the Print-Tech Innovators"
        subtitle="The engineering, product, and support minds behind Z Cards's layout compilers."
      />
    </div>
  );
}
