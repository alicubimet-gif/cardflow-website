"use client";

import React, { useState } from "react";
import Link from "next/link";
import { STUDIO_URL, GOOGLE_MAPS_URL } from "@/lib/config";
import { Heart, Mail, CheckCircle, Phone, MapPin, ArrowUp } from "lucide-react";
import { ThemeLogo } from "@/components/theme-logo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-card-border/80 pt-16 pb-8 transition-colors duration-300 relative overflow-hidden">
      {/* Subtle decorative glowing background circle (SaaS style) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4 group inline-flex" aria-label="Z Cards Home">
                <ThemeLogo
                  width={130}
                  height={32}
                  className="h-8 w-auto transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span className="font-sans font-extrabold text-lg tracking-tight text-foreground dark:text-white font-heading">
                  <span className="text-primary">Z Cards</span>
                </span>
              </Link>
              <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
                Z Cards is a premium modern ID card management and printing platform designed for colleges, schools, corporate branches, and professional printing agencies.
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className="mb-6 max-w-sm">
              <h5 className="text-xs font-bold text-slate-800 dark:text-zinc-300 uppercase tracking-wider mb-3 font-heading">
                Subscribe to our newsletter
              </h5>
              {subscribed ? (
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-455" />
                  <span>Thank you! You have successfully subscribed.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email address for newsletter"
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white transition-all"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md active:scale-98 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-primary/10 dark:hover:bg-primary/20 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:scale-105 active:scale-95 transition-all duration-200 border border-slate-200/50 dark:border-zinc-800/50"
                aria-label="Follow Z Cards on Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-primary/10 dark:hover:bg-primary/20 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:scale-105 active:scale-95 transition-all duration-200 border border-slate-200/50 dark:border-zinc-800/50"
                aria-label="Connect with Z Cards on LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-primary/10 dark:hover:bg-primary/20 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:scale-105 active:scale-95 transition-all duration-200 border border-slate-200/50 dark:border-zinc-800/50"
                aria-label="Like Z Cards on Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-primary/10 dark:hover:bg-primary/20 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:scale-105 active:scale-95 transition-all duration-200 border border-slate-200/50 dark:border-zinc-800/50"
                aria-label="Follow Z Cards on Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583 0.07-4.849 0.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200 uppercase tracking-wider mb-4 font-heading">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-zinc-400">
              <li>
                <Link href="/features" className="hover:text-primary dark:hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary dark:hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-200">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary dark:hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <a href={`${STUDIO_URL}/login`} className="hover:text-primary dark:hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-200">
                  Z Cards Studio
                </a>
              </li>
              <li>
                <Link href="/features#mobile" className="hover:text-primary dark:hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-200">
                  Verify App
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200 uppercase tracking-wider mb-4 font-heading">
              Services
            </h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-zinc-400">
              <li>
                <Link href="/features#design" className="hover:text-primary dark:hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-200">
                  Card Design Studio
                </Link>
              </li>
              <li>
                <Link href="/features#printing" className="hover:text-primary dark:hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-200">
                  Bulk Card Printing
                </Link>
              </li>
              <li>
                <Link href="/features#branches" className="hover:text-primary dark:hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-200">
                  Branch Management
                </Link>
              </li>
              <li>
                <Link href="/features#nfc" className="hover:text-primary dark:hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-200">
                  NFC Card Integration
                </Link>
              </li>
              <li>
                <Link href="/features#agencies" className="hover:text-primary dark:hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-200">
                  Printing Agencies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200 uppercase tracking-wider mb-4 font-heading">
              Contact
            </h4>
            <address className="not-italic space-y-4 text-sm text-slate-500 dark:text-zinc-400">
              <div className="flex items-start gap-2.5 group">
                <Mail className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                <div>
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-0.5">Email</span>
                  <a href="mailto:info@zamirzac.com" className="hover:text-primary dark:hover:text-primary transition-colors font-medium">
                    info@zamirzac.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2.5 group">
                <Phone className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                <div>
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-0.5">Phone</span>
                  <a href="tel:+918891633035" className="hover:text-primary dark:hover:text-primary transition-colors font-medium">
                    +91 88916 33035
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2.5 group">
                <MapPin className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                <div>
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-0.5">Location</span>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-primary transition-colors block"
                  >
                    Zamirzac Solutions, Calicut, Kerala, India
                  </a>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline mt-1"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </address>
          </div>
        </div>

        {/* Lower footer with Divider */}
        <div className="pt-8 border-t border-card-border/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-500 dark:text-zinc-500 flex flex-wrap items-center gap-1.5 justify-center md:justify-start">
            <span>&copy; {new Date().getFullYear()} Z Cards. All rights reserved.</span>
            <span className="hidden md:inline text-slate-300 dark:text-zinc-800">|</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" /> for card makers
            </span>
          </p>
          
          <nav className="flex items-center gap-6 text-xs text-slate-500 dark:text-zinc-400 flex-wrap justify-center" aria-label="Footer legal and utilities">
            <Link href="/privacy" className="hover:text-primary dark:hover:text-primary transition-colors">
              Privacy &amp; Policy
            </Link>
            <Link href="/terms" className="hover:text-primary dark:hover:text-primary transition-colors">
              Terms
            </Link>
            <button 
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 hover:dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-350 text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm border border-slate-200/50 dark:border-zinc-850"
              aria-label="Scroll back to top of the page"
            >
              Back to Top <ArrowUp className="w-3 h-3" />
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
