import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Mail, Send } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  const telegramUrl = (siteConfig as any).contact?.telegram || "https://t.me/bjmcscyberclub";
  const email = (siteConfig as any).contact?.email || "contact@bjmcscyberclub.org";
  const navLinks = (siteConfig as any).nav || [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Curriculum", href: "/curriculum" },
    { title: "Events", href: "/events" },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-slate-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 40 40"
                fill="none"
                className="h-8 w-8 text-blue-600"
                aria-hidden="true"
              >
                <path d="M20 2L4 9l2 20 14 9 14-9 2-20-16-7z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 9v22M11 16h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-100" />
                <circle cx="20" cy="20" r="4" fill="currentColor" />
              </svg>
              <span className="text-lg tracking-tight">{siteConfig.name}</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              {siteConfig.description} Equipping the next generation of cybersecurity professionals.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-slate-100 uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link: any) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-sm transition-colors hover:text-blue-500">
                    {link.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/login" className="text-sm transition-colors hover:text-blue-500">
                  Student Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-slate-100 uppercase">
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-3 text-sm transition-colors hover:text-blue-500">
                  <Mail className="h-4 w-4 text-slate-500" />
                  {email}
                </a>
              </li>
              <li>
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm transition-colors hover:text-blue-500">
                  <Send className="h-4 w-4 text-slate-500" />
                  Telegram Channel
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-slate-100 uppercase">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm transition-colors hover:text-blue-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm transition-colors hover:text-blue-500">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-sm transition-colors hover:text-blue-500">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-800/60 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-slate-600">Built for excellence in cybersecurity.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
