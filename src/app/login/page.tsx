import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { db } from "@/lib/db";
import UnifiedLoginForm from "./UnifiedLoginForm";
import Link from "next/link";
import { Terminal, Shield, ArrowUpRight, Lock } from "lucide-react";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ blocked?: string }> }) {
  const { blocked } = await searchParams;
  const token = (await cookies()).get("session")?.value;
  if (token) {
    const payload = await verifyJwt(token);
    if (payload) {
      if (payload.role === "ADMIN") {
        redirect("/admin");
      } else if (payload.role === "STUDENT") {
        const student = payload.studentId
          ? await db.student.findUnique({ where: { id: payload.studentId }, select: { isActive: true, kickedAt: true } })
          : null;
        if (student?.isActive && !student.kickedAt) redirect("/student");
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-[#090a0d] text-[#f4f3ee]">
      {/* Left Column - Editorial Intelligence & Spec (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#060709] border-r border-[#23262d] flex-col justify-between p-12 xl:p-16">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 group text-[#f4f3ee] hover:text-[#ff3700] transition-colors">
            <div className="flex h-8 w-8 items-center justify-center border border-[#ff3700] bg-[#ff3700]/10 text-[#ff3700] font-mono text-xs font-bold">
              G
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-semibold tracking-wider uppercase">
                {siteConfig.name}
              </span>
              <span className="font-mono text-[10px] text-[#828792] tracking-widest uppercase">
                CONSOLE DISPATCH // TERMINAL GATEWAY
              </span>
            </div>
          </Link>
        </div>

        {/* Central Editorial Statement */}
        <div className="max-w-lg space-y-6 my-auto py-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold block">
            // OPERATIONAL DIRECTIVE
          </span>
          <blockquote className="font-serif-display italic text-4xl xl:text-5xl text-[#f4f3ee] leading-tight">
            &ldquo;Security is a disciplined habit of continuous inquiry, not a static compliance checkpoint.&rdquo;
          </blockquote>
          <footer className="font-mono text-xs text-[#828792] pt-4 border-t border-[#1b1e25]">
            &mdash; BGMCS Academy Directorate // Node 01
          </footer>

          {/* Terminal telemetry docket */}
          <div className="p-4 border border-[#23262d] bg-[#0c0e12] font-mono text-[11px] space-y-2 mt-8">
            <div className="text-[#ff3700] font-bold">// ACCESS PARAMETERS</div>
            <div className="text-[#828792] flex justify-between">
              <span>CLEARANCE ROLES:</span>
              <span className="text-[#f4f3ee]">ADMIN &bull; MENTOR &bull; CADET</span>
            </div>
            <div className="text-[#828792] flex justify-between">
              <span>SESSION PROTOCOL:</span>
              <span className="text-[#f4f3ee]">HTTP-ONLY &bull; SHA-256 HMAC</span>
            </div>
            <div className="text-[#828792] flex justify-between">
              <span>ACCESS POLICY:</span>
              <span className="text-[#f4f3ee]">MONITORED FOR DEFENSE LABS</span>
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="font-mono text-[11px] text-[#525866] flex items-center justify-between pt-6 border-t border-[#1b1e25]">
          <span>STATUS: AUTH_DAEMON_ONLINE</span>
          <span>LAT: 11.59 // LON: 37.38</span>
        </div>
      </div>

      {/* Right Column - Utilitarian Console Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 xl:p-20 bg-[#090a0d]">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Header */}
          <div className="lg:hidden text-center space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center border border-[#ff3700] bg-[#ff3700]/10 text-[#ff3700] font-mono text-xs font-bold">
                G
              </div>
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-[#f4f3ee]">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          <div className="border border-[#23262d] bg-[#0c0e12] p-8 sm:p-10 shadow-2xl">
            <div className="mb-6 space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold block">
                // AUTHENTICATION PROTOCOL
              </span>
              <h1 className="font-serif-display italic text-3xl sm:text-4xl text-[#f4f3ee]">
                Member Console <span className="font-sans font-black uppercase text-[#ff3700] not-italic">Login</span>
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#828792] leading-relaxed">
                Enter your student identifier, registered email, or administrator credentials.
              </p>
            </div>

            <UnifiedLoginForm blocked={blocked === "1"} />

            {/* Bottom Redirect */}
            <div className="mt-8 pt-6 border-t border-[#1b1e25] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-[#828792]">
              <span>Not registered yet?</span>
              <Link href="/register" className="text-[#ff3700] hover:underline flex items-center gap-1 font-bold">
                <span>Apply for Cadet Intake</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
