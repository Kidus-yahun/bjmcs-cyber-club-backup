"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Assuming Button is available in the barrel export
import { Button } from "@/components/ui";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fallback for nav if not in siteConfig
  const navLinks = (siteConfig as any).nav || [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Curriculum", href: "/curriculum" },
    { title: "Events", href: "/events" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md transition-all dark:border-slate-800/50 dark:bg-slate-950/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 font-bold text-slate-900 transition-opacity hover:opacity-90 dark:text-slate-100"
        >
          <CyberLogo className="h-9 w-9 text-blue-600 dark:text-cyan-400" />
          <span className="text-xl tracking-tight">{siteConfig.name}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link: any) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-cyan-400"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login" className="hidden lg:flex inline-flex items-center justify-center rounded-lg font-medium px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-200">Log In</Link>
          <Link href="/register" className="inline-flex items-center justify-center rounded-lg font-medium px-4 py-2 text-sm bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all duration-200">Apply Now</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="flex p-2 md:hidden text-slate-600 dark:text-slate-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-6 shadow-lg">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link: any) => (
              <Link
                key={link.title}
                href={link.href}
                className="block text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-cyan-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full justify-center inline-flex items-center rounded-lg font-medium px-4 py-2 text-sm border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-200">Log In</Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full justify-center inline-flex items-center rounded-lg font-medium px-4 py-2 text-sm bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all duration-200">Apply Now</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/** Professional Cyber/Tech Logo */
function CyberLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 2L4 9l2 20 14 9 14-9 2-20-16-7z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 9v22M11 16h18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-900 dark:text-slate-100"
      />
      <circle cx="20" cy="20" r="4" fill="currentColor" />
    </svg>
  );
}
