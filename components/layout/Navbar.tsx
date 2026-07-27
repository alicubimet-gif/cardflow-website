"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ChevronRight, ChevronDown,
  LayoutDashboard, Wallet, User, Settings, LogOut,
} from "lucide-react";
import { useBranding } from "@/components/branding-provider";
import { clearTokens } from "@/lib/auth";
import { apiClient } from "@/lib/apiClient";
import { STUDIO_URL } from "@/lib/config";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { brandSettings } = useBranding();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const studioUrl = STUDIO_URL;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Check auth state on mount using me API directly
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userRes = await apiClient.get("/api/auth/me/");
        const userData = userRes.data || userRes;
        if (userData && userData.email) {
          setAuthenticated(true);
          setUser(userData.data || userData);
        } else {
          setAuthenticated(false);
          setUser(null);
        }
      } catch (e) {
        setAuthenticated(false);
        setUser(null);
      }
    };
    checkAuth();
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Disable body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout/").catch(() => {});
    } catch (_) {}
    clearTokens();
    setAuthenticated(false);
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
  };

  // Derive initials from user data
  const getInitials = () => {
    if (user?.name) {
      const parts = user.name.trim().split(" ");
      return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : parts[0].substring(0, 2).toUpperCase();
    }
    if (user?.email) return user.email[0].toUpperCase();
    return "U";
  };

  const profileDropdownLinks = [
    { label: "Dashboard", href: `${studioUrl}/dashboard`, icon: LayoutDashboard, external: true },
    { label: "Credits & Billing", href: `${studioUrl}/credits`, icon: Wallet, external: true },
    { label: "Profile", href: `${studioUrl}/profile`, icon: User, external: true },
    { label: "Settings", href: `${studioUrl}/settings`, icon: Settings, external: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm py-3.5 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo area */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <span className="font-sans font-extrabold text-lg tracking-tight font-heading text-[#2563EB]">
                Zamzarc
              </span>
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
              {authenticated ? (
                /* ── Authenticated: Profile Dropdown ── */
                <div className="relative" ref={dropdownRef}>
                  <button
                    id="navbar-profile-btn"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2.5 py-1.5 px-3 rounded-full border border-slate-200 hover:border-[#2563EB]/30 hover:bg-blue-50/40 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {getInitials()}
                    </div>
                    <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate hidden sm:block">
                      {user?.name || user?.email || "Account"}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
                      >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                          <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "Account"}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user?.email || ""}</p>
                        </div>

                        {/* Nav Links */}
                        <div className="py-1.5">
                          {profileDropdownLinks.map((item) => (
                            <a
                              key={item.label}
                              href={item.href}
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#2563EB] transition-colors"
                            >
                              <item.icon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                              {item.label}
                            </a>
                          ))}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-slate-100 py-1.5">
                          <button
                            id="navbar-logout-btn"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5 shrink-0" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* ── Guest: Create Account + Book Demo ── */
                <>
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
                </>
              )}
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
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <span className="font-sans font-extrabold text-lg tracking-tight text-[#2563EB]">
                  Zamzarc
                </span>
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
                  ...(!authenticated ? [{ name: "Sign In", href: `${studioUrl}/login`, isExternal: true }] : []),
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

                {/* Authenticated mobile links */}
                {authenticated && (
                  <div className="pt-4 border-t border-gray-100 space-y-1">
                    {profileDropdownLinks.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors"
                      >
                        <item.icon className="w-4 h-4 shrink-0 text-slate-400" />
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-6 border-t border-gray-100 space-y-3 bg-gray-50/50">
                {authenticated ? (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm">
                        {getInitials()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{user?.name || "Account"}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{user?.email || ""}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setIsOpen(false); handleLogout(); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
