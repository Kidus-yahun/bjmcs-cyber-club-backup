"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/app/login/actions";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, Shield } from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { title: "Dashboard", href: "/student" },
    { title: "Profile", href: "/student/profile" },
    { title: "Announcements", href: "/student/announcements" },
    { title: "Tasks & Submissions", href: "/student/tasks" },
    { title: "Attendance", href: "/student/attendance" },
    { title: "Results", href: "/student/results" },
    { title: "Materials", href: "/student/materials" },
    { title: "Certificate", href: "/student/certificate" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="bg-white/80 backdrop-blur-md dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/student" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
            <Shield className="h-6 w-6 text-blue-600 dark:text-cyan-500" />
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
              Student Portal
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.title}
                  href={link.href}
                  prefetch={false}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap",
                    isActive 
                      ? "bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-cyan-400" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  )}
                >
                  {link.title}
                </Link>
              );
            })}
            <div className="pl-4 ml-2 border-l border-slate-200 dark:border-slate-800">
              <form action={logoutAction}>
                <Button type="submit" variant="ghost" size="sm" className="text-slate-500 hover:text-red-600 dark:hover:text-red-400">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="flex p-2 lg:hidden text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 shadow-lg absolute w-full left-0 top-16">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.title}
                    href={link.href}
                    prefetch={false}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-md text-base font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-slate-800/50 dark:text-cyan-400"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                    )}
                  >
                    {link.title}
                  </Link>
                );
              })}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <form action={logoutAction}>
                  <Button type="submit" variant="outline" className="w-full justify-center text-slate-700 dark:text-slate-300">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </form>
              </div>
            </nav>
          </div>
        )}
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
