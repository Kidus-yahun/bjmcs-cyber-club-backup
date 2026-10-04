import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import UnifiedLoginForm from "./UnifiedLoginForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const token = (await cookies()).get("session")?.value;
  if (token) {
    const payload = await verifyJwt(token);
    if (payload) {
      if (payload.role === "ADMIN") {
        redirect("/admin");
      } else if (payload.role === "STUDENT") {
        redirect("/student");
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Left Half - Branding & Aesthetic */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0a1628] flex-col justify-between overflow-hidden">
        {/* Background Tech Pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="login-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22d3ee" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-grid)" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0a1628] to-transparent" />
        </div>

        <div className="relative z-10 p-12 flex flex-col h-full">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                <ShieldIcon className="h-6 w-6 text-[#22d3ee]" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">BJMCS Cyber Club</span>
            </Link>
          </div>

          <div className="mt-auto max-w-md">
            <blockquote className="space-y-6">
              <p className="text-2xl font-medium text-white leading-snug">
                "Security is a state of mind, not an end state. We build the defenders of tomorrow by challenging the boundaries of today."
              </p>
              <footer className="text-sm font-semibold text-[#22d3ee]">
                — BJMCS Academy Director
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right Half - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 xl:p-24 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden mb-8 flex justify-center">
               <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 dark:bg-slate-800">
                 <ShieldIcon className="h-8 w-8 text-[#22d3ee]" />
               </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Sign in to access your portal, labs, and resources.
            </p>
          </div>
          
          <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <UnifiedLoginForm />
          </div>
        </div>
      </div>
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
