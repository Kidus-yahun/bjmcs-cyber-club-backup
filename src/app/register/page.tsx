import { Metadata } from "next";
import { db } from "@/lib/db";
import { RegistrationForm } from "./_components/RegistrationForm";
import { siteConfig } from "@/config/site";
import { AlertCircle, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Candidate Application",
  description: "Apply to join the BGMCS Cyber Club",
};

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
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

  return (
    <div className="min-h-screen py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#090a0d] text-[#f4f3ee]">
      {/* Editorial Page Masthead */}
      <div className="max-w-4xl mx-auto mb-10 text-center space-y-4">
        <div className="inline-flex items-center gap-2 border border-[#23262d] bg-[#111317] px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[#828792]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff3700] animate-pulse" />
          <span>RECRUITMENT DOSSIER</span>
          <span className="text-[#3a3f4a]">&bull;</span>
          <span className="text-[#f4f3ee]">COHORT 2026/27</span>
        </div>

        <h1 className="font-serif-display italic text-5xl sm:text-6xl lg:text-7xl text-[#f4f3ee] tracking-tight">
          Apply to{" "}
          <span className="font-sans font-black uppercase text-[#ff3700] not-italic block mt-1">
            BGMCS Cyber Club
          </span>
        </h1>

        <p className="font-sans text-sm sm:text-base text-[#828792] max-w-2xl mx-auto leading-relaxed">
          We look for analytical stamina, intellectual honesty, and genuine passion for computer systems. Complete your candidate application below for admission into the BGMCS research laboratory.
        </p>
      </div>

      {isClosed ? (
        <div className="max-w-2xl mx-auto border border-[#23262d] bg-[#0c0e12] p-8 sm:p-12 text-center font-mono">
          <div className="mx-auto w-12 h-12 mb-6 flex items-center justify-center border border-[#ff3700] bg-[#ff3700]/10 text-[#ff3700]">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#f4f3ee] mb-3">
            {isPastDeadline ? "Application Deadline Expired" : "Admissions Cycle Sealed"}
          </h2>
          <p className="text-xs text-[#828792] leading-relaxed max-w-md mx-auto mb-6">
            {isPastDeadline
              ? "The submission window for the current cohort has officially closed. Applications are undergoing faculty review."
              : "Registration is not currently accepting incoming cadet dossiers. Announcements for future intakes will be dispatched via official channels."}
          </p>
          <div className="inline-block border border-[#23262d] bg-[#111317] px-5 py-2 text-xs text-[#828792]">
            STATUS: QUEUED FOR NEXT INTAKE CYCLE
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <RegistrationForm />
        </div>
      )}
    </div>
  );
}
