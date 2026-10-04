import { siteConfig } from "@/config/site";
import { db } from "@/lib/db";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  let settings = null;
  try {
    settings = await db.registrationSettings.findUnique({
      where: { id: "default" },
    });
  } catch (error) {
    console.error("Failed to fetch registration settings:", error);
  }

  const isOpen = settings?.isOpen ?? false;
  const isPastDeadline = settings?.deadline ? new Date() > settings?.deadline : false;
  
  const isClosed = !isOpen || isPastDeadline;
  let statusText = "Registration is currently open.";
  if (!isOpen) {
    statusText = "Registration is currently closed.";
  } else if (isPastDeadline) {
    statusText = "Registration deadline has passed.";
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="relative flex flex-col items-center justify-center min-h-[90vh] text-center overflow-hidden bg-[#0a1628]">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22d3ee" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-900/50 border border-[#22d3ee]/30 shadow-[0_0_30px_rgba(34,211,238,0.2)] backdrop-blur-sm">
            <ShieldIcon className="h-12 w-12 text-[#22d3ee]" />
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-6 drop-shadow-lg">
            {siteConfig.name}
          </h1>

          <p className="mt-4 max-w-2xl text-xl text-slate-300 font-light">
            {siteConfig.description}
          </p>

          <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:gap-6">
            <div className="flex flex-col items-center">
              {isClosed ? (
                <span className="rounded-md bg-slate-700 px-8 py-4 text-base font-semibold text-white cursor-not-allowed opacity-70 border border-slate-600">
                  Apply Now
                </span>
              ) : (
                <Link
                  href="/register"
                  className="rounded-md bg-[#2563eb] px-8 py-4 text-base font-semibold text-white hover:bg-[#3b82f6] shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-200"
                >
                  Apply Now
                </Link>
              )}
              <p className="mt-3 text-sm font-medium text-[#22d3ee] italic bg-[#0a1628]/80 px-3 py-1 rounded-full border border-[#22d3ee]/20">
                {statusText}
              </p>
            </div>
            
            <Link
              href="/login"
              className="rounded-md border border-slate-600 bg-transparent px-8 py-4 text-base font-semibold text-white hover:bg-slate-800 hover:border-slate-400 transition-all duration-200"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mb-6">
                Forging the Next Generation of Cyber Defenders
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                BJMCS Cyber Club is an elite organization dedicated to exploring the depths of cybersecurity. We provide a rigorous, hands-on environment where members can hone their skills in defensive architecture, offensive operations, and critical vulnerability research.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Through our comprehensive programs, state-of-the-art infrastructure, and community of passionate professionals, we bridge the gap between academic theory and real-world application.
              </p>
            </div>
            <div className="relative aspect-square lg:aspect-auto lg:h-[500px] rounded-2xl bg-gradient-to-br from-[#0a1628] to-[#1e293b] p-8 overflow-hidden shadow-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#22d3ee] via-transparent to-transparent"></div>
               <div className="relative z-10 grid grid-cols-3 gap-4 w-full h-full p-4">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Core Divisions
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Specialized pathways designed for comprehensive skill development.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Offensive Security",
                desc: "Penetration testing, exploit development, and adversary simulation.",
                icon: <SwordIcon className="h-8 w-8 text-[#ef4444]" />
              },
              {
                title: "Defensive Operations",
                desc: "Incident response, threat hunting, and infrastructure hardening.",
                icon: <ShieldIcon className="h-8 w-8 text-[#3b82f6]" />
              },
              {
                title: "Applied Cryptography",
                desc: "Secure communications, protocol analysis, and encryption implementation.",
                icon: <KeyIcon className="h-8 w-8 text-[#8b5cf6]" />
              },
              {
                title: "CTF Competition",
                desc: "Competitive hacking, rapid problem solving, and reverse engineering.",
                icon: <FlagIcon className="h-8 w-8 text-[#10b981]" />
              }
            ].map((prog, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-lg border border-slate-100 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 group-hover:scale-110 transition-transform duration-300">
                  {prog.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{prog.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{prog.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section id="why-join" className="py-24 bg-white dark:bg-slate-900">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Why Join BJMCS?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">01</span>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Hands-on Experience</h4>
                <p className="text-slate-600 dark:text-slate-400">Apply theoretical concepts in our custom-built virtual ranges and lab environments.</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">02</span>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Industry Mentorship</h4>
                <p className="text-slate-600 dark:text-slate-400">Learn directly from alumni and professionals currently operating in the cybersecurity sector.</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">03</span>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Exclusive Network</h4>
                <p className="text-slate-600 dark:text-slate-400">Join a tight-knit community of like-minded individuals dedicated to technical excellence.</p>
              </div>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 bg-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-cta" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-cta)" />
          </svg>
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
            Ready to Secure the Future?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Take the first step towards mastering the art of cybersecurity.
          </p>
          {isClosed ? (
              <span className="inline-block rounded-md bg-slate-700 px-10 py-4 text-lg font-semibold text-white cursor-not-allowed opacity-70">
                Applications Closed
              </span>
            ) : (
              <Link
                href="/register"
                className="inline-block rounded-md bg-[#2563eb] px-10 py-4 text-lg font-semibold text-white hover:bg-[#3b82f6] shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-200"
              >
                Apply for Membership
              </Link>
          )}
        </div>
      </section>
    </div>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function SwordIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" />
      <line x1="19" y1="21" x2="21" y2="19" />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
      <path d="m21 3-6 6w3h4V3z" />
      <circle cx="8" cy="15" r="4" />
      <line x1="10.8" y1="12.2" x2="16" y2="7" />
    </svg>
  );
}

function FlagIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}
