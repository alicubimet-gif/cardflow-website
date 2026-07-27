"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { STUDIO_URL } from "@/lib/config";
import { ThemeLogo } from "@/components/theme-logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const studioUrl = STUDIO_URL;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Disable body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm py-3.5 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo area */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
<<<<<<< HEAD
              <ThemeLogo width={120} height={32} priority className="transition-transform group-hover:scale-[1.02]" />
=======
              <span className="font-sans font-extrabold text-lg tracking-tight font-heading text-[#2563EB]">
                Zamirzac
              </span>
>>>>>>> 9f620f4d47fd86a96bc1be7a40c7debe38f2ca50
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative text-[13px] font-bold tracking-wide uppercase transition-colors duration-150 hover:text-[#2563EB] ${
                      isActive ? "text-[#2563EB] font-black" : "text-gray-500"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavBorder"
                        className="absolute left-0 right-0 -bottom-1 h-0.5 bg-[#2563EB] rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href={`${studioUrl}/login`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-150"
              >
                Sign In
              </a>
              <Link
                href="/register"
                id="navbar-create-account-btn"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl text-white transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98 duration-150"
                style={{ backgroundColor: "#2563EB" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
              >
                Sign Up <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.25 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer Header */}
<<<<<<< HEAD
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-700">
                <ThemeLogo width={110} height={28} />
=======
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <span className="font-sans font-extrabold text-lg tracking-tight text-[#2563EB]">
                  Zamirzac
                </span>
>>>>>>> 9f620f4d47fd86a96bc1be7a40c7debe38f2ca50
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 px-6 py-6 space-y-4 overflow-y-auto">
                {[
                  { name: "Home", href: "/" },
                  { name: "Features", href: "/features" },
                  { name: "Pricing", href: "/pricing" },
                  { name: "Contact", href: "/contact" },
                  { name: "Sign In", href: `${studioUrl}/login`, isExternal: true },
                ].map((link) => {
                  const isActive = pathname === link.href;
                  if (link.isExternal) {
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block py-2.5 text-sm font-bold uppercase tracking-wider transition-colors border-b border-gray-50 text-gray-600 hover:text-[#2563EB]"
                      >
                        {link.name}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block py-2.5 text-sm font-bold uppercase tracking-wider transition-colors border-b border-gray-50 ${
                        isActive ? "text-[#2563EB]" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-6 border-t border-gray-100 space-y-3 bg-gray-50/50">
                <a
                  href={`${studioUrl}/login`}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Sign In
                </a>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 text-xs font-extrabold uppercase tracking-wider rounded-xl text-white shadow-md transition-all duration-150"
                  style={{ backgroundColor: "#2563EB" }}
                >
                  Sign Up
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
