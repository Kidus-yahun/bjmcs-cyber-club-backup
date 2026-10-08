import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowUpRight, Terminal } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const telegramUrl = "https://t.me/bgmcscyberclub";
  const email = "contact@bgmcscyberclub.org";

  return (
    <footer className="border-t border-[#23262d] bg-[#060709] text-[#828792]">
      {/* Top Ledger Strip */}
      <div className="border-b border-[#23262d] py-3 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-[#ff3700]" />
            <span className="text-[#f4f3ee] uppercase tracking-wider font-semibold">
              FIELD REGISTRY // {siteConfig.name}
            </span>
            <span className="text-[#3a3f4a] hidden sm:inline">|</span>
            <span className="text-[#828792] hidden sm:inline">
              OPERATIONAL NODE: ADDIS ABABA / ETHIOPIA
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#828792]">
            <span>COHORT CYCLE: 2026/27</span>
            <span>SEC_LEVEL: PUBLIC_FACING</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-7 w-7 items-center justify-center border border-[#ff3700] bg-[#ff3700]/10 text-[#ff3700] font-mono text-xs font-bold">
                  G
                </div>
                <span className="font-mono text-base font-bold uppercase tracking-wider text-[#f4f3ee]">
                  {siteConfig.name}
                </span>
              </div>
              <p className="font-sans text-sm text-[#828792] max-w-md leading-relaxed">
                An autonomous student-led offensive security laboratory and defense research division.
                Training technical operators in reverse engineering, applied cryptanalysis, distributed systems defense,
                and adversarial penetration.
              </p>
            </div>

            <div className="p-4 border border-[#23262d] bg-[#0c0e12] font-mono text-xs space-y-1.5 max-w-md">
              <div className="text-[#ff3700] font-semibold">// NOTICE OF ACADEMIC INTEGRITY</div>
              <p className="text-[#828792] text-[11px] leading-normal">
                All security tools, exercises, and wargame simulations operate under strict authorization protocols
                in isolated sandboxes. Unsanctioned exploitation is fundamentally prohibited.
              </p>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Directory Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#f4f3ee] font-semibold">
              // INDEX
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              <li>
                <a href="#disciplines" className="text-[#828792] hover:text-[#f4f3ee] transition-colors">
                  01. Divisions
                </a>
              </li>
              <li>
                <a href="#blueprint" className="text-[#828792] hover:text-[#f4f3ee] transition-colors">
                  02. 3-Phase Blueprint
                </a>
              </li>
              <li>
                <a href="#dossier" className="text-[#828792] hover:text-[#f4f3ee] transition-colors">
                  03. Lab Specifications
                </a>
              </li>
              <li>
                <a href="#admissions" className="text-[#828792] hover:text-[#f4f3ee] transition-colors">
                  04. Application Ledger
                </a>
              </li>
            </ul>
          </div>

          {/* Access Portals (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#f4f3ee] font-semibold">
              // ACCESS
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              <li>
                <Link href="/register" className="text-[#ff3700] hover:underline flex items-center gap-1">
                  Candidate Application <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[#828792] hover:text-[#f4f3ee] transition-colors">
                  Student Terminal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#828792] hover:text-[#f4f3ee] transition-colors">
                  Directorate Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Channels (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#f4f3ee] font-semibold">
              // CHANNELS
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="text-[#828792] hover:text-[#f4f3ee] transition-colors block truncate"
                >
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#828792] hover:text-[#f4f3ee] transition-colors flex items-center gap-1"
                >
                  Telegram Dispatch <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Metadata & Copyright */}
        <div className="mt-16 pt-8 border-t border-[#23262d] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#525866]">
          <div>
            &copy; {year} {siteConfig.name}. ARCHIVAL ACCESS GRANTED.
          </div>
          <div className="flex items-center gap-4">
            <span>HASH: 8F2B.99CE.BGMCS</span>
            <span className="text-[#ff3700]">NO TRACKERS // RAW HTML & TS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
