"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { title: "01. Divisions", href: "#disciplines" },
    { title: "02. Blueprint", href: "#blueprint" },
    { title: "03. Lab Dossier", href: "#dossier" },
    { title: "04. Admissions", href: "#admissions" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#23262d] bg-[#090a0d]/95 backdrop-blur-sm transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Masthead badge */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-3 group text-[#f4f3ee] hover:text-[#ff3700] transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center border border-[#ff3700] bg-[#ff3700]/10 text-[#ff3700] font-mono text-xs font-bold tracking-wider">
              G
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-semibold tracking-wider uppercase text-[#f4f3ee]">
                {siteConfig.name}
              </span>
              <span className="font-mono text-[10px] text-[#828792] tracking-widest uppercase">
                DEFENSE & RESEARCH CELL
              </span>
            </div>
          </Link>
          
          <div className="hidden xl:flex items-center gap-2 border-l border-[#23262d] pl-6 py-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[#ff3700] animate-pulse"></span>
            <span className="font-mono text-[11px] text-[#828792] tracking-wider uppercase">
              STATUS: NOMINAL // INTAKE OPEN
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="font-mono text-xs text-[#828792] uppercase tracking-wider transition-colors hover:text-[#f4f3ee]"
            >
              {link.title}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center border border-[#23262d] bg-[#111317] px-4 py-2 font-mono text-xs font-medium text-[#f4f3ee] hover:border-[#828792] transition-colors"
          >
            MEMBER LOGIN
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center bg-[#ff3700] px-4 py-2 font-mono text-xs font-bold text-black hover:bg-[#ff5419] transition-colors shadow-sm"
          >
            APPLY NOW &rarr;
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="flex p-2 md:hidden text-[#828792] hover:text-[#f4f3ee]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#23262d] bg-[#0d0f13] px-6 py-6">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="font-mono text-xs uppercase tracking-wider text-[#828792] hover:text-[#ff3700]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.title}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-[#23262d]">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center border border-[#23262d] bg-[#111317] py-2.5 font-mono text-xs text-[#f4f3ee]"
              >
                MEMBER LOGIN
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center bg-[#ff3700] py-2.5 font-mono text-xs font-bold text-black"
              >
                APPLY NOW &rarr;
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
