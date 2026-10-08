"use client";

import { useRef, useState } from "react";
import { submitRegistration } from "../actions";
import { ProgrammingExperience, WeeklyAvailability } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Check, ArrowRight, ArrowLeft, ShieldAlert, CheckCircle2, Copy } from "lucide-react";

const STEPS = ["Identity", "School", "Tech", "Motivation", "Terms", "Review"];

function reviewValue(value: unknown): string {
  if (Array.isArray(value)) return value.length ? value.map(String).join(", ") : "None provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value.trim() || "Not provided";
  return "Not provided";
}

function ReviewRow({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="border-b border-[#1b1e25] py-3 last:border-0">
      <dt className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#828792]">{label}</dt>
      <dd className="mt-1 font-mono text-xs whitespace-pre-wrap break-words text-[#f4f3ee]">{reviewValue(value)}</dd>
    </div>
  );
}

function toggleChoice(current: string[], choice: string): string[] {
  if (choice === "None") return current.includes("None") ? [] : ["None"];
  const choices = current.filter((value) => value !== "None");
  return choices.includes(choice)
    ? choices.filter((value) => value !== choice)
    : [...choices, choice];
}

export function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const submissionStarted = useRef(false);

  const [formData, setFormData] = useState<any>({
    identity: { fullName: "", age: 15, gender: "", phone: "", email: "", telegramUsername: "" },
    school: { grade: "9", section: "A" },
    techBackground: {
      hasStudiedCyber: false,
      cyberStudyDesc: "",
      programmingExp: "NONE",
      programmingLangs: [],
      programmingLanguageOther: "",
      operatingSystems: [],
      operatingSystemOther: "",
      cyberTopics: [],
      previousExperience: []
    },
    motivation: {
      motivationJoin: "",
      motivationLearn: "",
      areasOfInterest: [],
      weeklyAvailability: "HOURS_2_TO_4"
    },
    projects: [],
    additional: { additionalSkills: "", howHeardAboutUs: "" },
    terms: {
      agreedToAccuracy: false,
      agreedToRules: false,
      agreedToLegal: false,
      agreedToNoGuarantee: false,
      ethicsAgreement: false,
      termsAgreement: false
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(s => s + 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    if (step === 4) {
      if (!formData.terms.agreedToAccuracy) {
        setError("Please review and accept the ethics and lab terms before continuing.");
        return;
      }
      setError(null);
      setStep(5);
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    if (submissionStarted.current) return;
    submissionStarted.current = true;
    
    setError(null);
    setIsPending(true);

    try {
      const result = await submitRegistration(formData);
      if (result.success) {
        setSuccess(result.reference || "Unknown Reference");
      } else {
        setError(result.error || "Submission failed.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred during submission.");
    } finally {
      setIsPending(false);
      submissionStarted.current = false;
    }
  };

  const handleBack = () => {
    setStep(s => Math.max(0, s - 1));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCopyReference = () => {
    if (success) {
      navigator.clipboard.writeText(success);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto border-2 border-[#ff3700] bg-[#0c0e12] p-8 sm:p-12 text-[#f4f3ee] font-mono shadow-2xl">
        <div className="flex items-center gap-2 text-[#ff3700] text-xs font-bold uppercase tracking-wider mb-4">
          <CheckCircle2 className="w-5 h-5" />
          <span>APPLICATION DOSSIER LODGED // STATUS: QUEUED</span>
        </div>

        <h2 className="font-serif-display italic text-3xl sm:text-4xl text-[#f4f3ee] mb-3">
          Submission Confirmed
        </h2>

        <p className="font-sans text-sm text-[#828792] leading-relaxed mb-6">
          Your cadet application has been filed in the BGMCS admissions registry. Retain your unique tracking identifier for account activation and interview verification.
        </p>

        <div className="p-5 border border-[#23262d] bg-[#07080b] flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] text-[#828792] uppercase block tracking-wider">OFFICIAL REFERENCE NUMBER</span>
            <span className="text-xl sm:text-2xl font-bold text-[#ff3700] tracking-widest">{success}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyReference}
            className="inline-flex items-center gap-2 border border-[#23262d] bg-[#111317] px-4 py-2 text-xs font-bold uppercase text-[#f4f3ee] hover:border-[#ff3700] transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "COPIED" : "COPY CODE"}</span>
          </button>
        </div>

        <div className="border-t border-[#1b1e25] pt-6 space-y-3 text-xs text-[#828792]">
          <div className="text-[#f4f3ee] font-bold uppercase">// NEXT PROTOCOL</div>
          <p className="leading-relaxed">
            1. An automated confirmation dispatch has been routed to your email address: <strong className="text-[#f4f3ee]">{formData.identity.email}</strong>.
          </p>
          <p className="leading-relaxed">
            2. The technical review committee reviews applications on a rolling basis. You will receive an invitation to join the onboarding challenge via email &amp; Telegram.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#23262d] bg-[#0c0e12] text-[#f4f3ee] shadow-2xl">
      {/* Bespoke Segmented Technical Progress Ledger */}
      <div className="border-b border-[#23262d] bg-[#08090c]">
        <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-[#23262d] font-mono text-[11px]">
          {STEPS.map((stepName, i) => {
            const isCompleted = i < step;
            const isActive = i === step;
            
            return (
              <div
                key={stepName}
                className={cn(
                  "p-3 sm:p-3.5 flex items-center justify-between transition-colors",
                  isActive
                    ? "bg-[#14171e] text-[#f4f3ee] border-b-2 sm:border-b-0 sm:border-t-2 border-[#ff3700]"
                    : isCompleted
                    ? "bg-[#0c0e12] text-[#828792]"
                    : "text-[#4b5160] bg-[#08090c]"
                )}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className={cn(
                    "font-bold",
                    isActive ? "text-[#ff3700]" : isCompleted ? "text-[#828792]" : "text-[#3a3f4a]"
                  )}>
                    0{i + 1}.
                  </span>
                  <span className="uppercase tracking-wider truncate font-semibold">
                    {stepName}
                  </span>
                </div>
                {isCompleted && (
                  <Check className="w-3.5 h-3.5 text-[#ff3700] flex-shrink-0 ml-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Body */}
      <div className="p-6 sm:p-10 lg:p-12">
        {error && (
          <div className="mb-8 border border-red-500/40 bg-red-950/20 p-4 font-mono text-xs text-red-400 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold block uppercase tracking-wider mb-0.5">VALIDATION WARNING</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* STEP 0: IDENTITY */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="border-b border-[#23262d] pb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold block mb-1">
                  // 01. CANDIDATE PROFILE &amp; TELEMETRY
                </span>
                <h2 className="font-serif-display italic text-2xl sm:text-3xl text-[#f4f3ee]">
                  Identity &amp; Contact Coordinates
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#828792] mt-1">
                  Ensure all communication coordinates are valid for verification dispatches.
                </p>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dawit Haile"
                    value={formData.identity.fullName}
                    onChange={(e) => setFormData((p: any) => ({ ...p, identity: { ...p.identity, fullName: e.target.value } }))}
                    className="w-full border border-[#23262d] bg-[#07080b] px-4 py-3 font-sans text-sm text-[#f4f3ee] placeholder-[#4b5160] focus:border-[#ff3700] focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="cadet@example.com"
                      value={formData.identity.email}
                      onChange={(e) => setFormData((p: any) => ({ ...p, identity: { ...p.identity, email: e.target.value } }))}
                      className="w-full border border-[#23262d] bg-[#07080b] px-4 py-3 font-sans text-sm text-[#f4f3ee] placeholder-[#4b5160] focus:border-[#ff3700] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+251 90 000 0000"
                      value={formData.identity.phone}
                      onChange={(e) => setFormData((p: any) => ({ ...p, identity: { ...p.identity, phone: e.target.value } }))}
                      className="w-full border border-[#23262d] bg-[#07080b] px-4 py-3 font-sans text-sm text-[#f4f3ee] placeholder-[#4b5160] focus:border-[#ff3700] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                      Age *
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={35}
                      required
                      value={formData.identity.age}
                      onChange={(e) => setFormData((p: any) => ({ ...p, identity: { ...p.identity, age: parseInt(e.target.value) || 0 } }))}
                      className="w-full border border-[#23262d] bg-[#07080b] px-4 py-3 font-sans text-sm text-[#f4f3ee] placeholder-[#4b5160] focus:border-[#ff3700] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                      Gender *
                    </label>
                    <select
                      required
                      value={formData.identity.gender}
                      onChange={(e) => setFormData((p: any) => ({ ...p, identity: { ...p.identity, gender: e.target.value } }))}
                      className="w-full border border-[#23262d] bg-[#07080b] px-4 py-3 font-sans text-sm text-[#f4f3ee] focus:border-[#ff3700] focus:outline-none transition-colors"
                    >
                      <option value="" disabled>Select gender...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                      Telegram Username *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="@handle"
                      value={formData.identity.telegramUsername}
                      onChange={(e) => setFormData((p: any) => ({ ...p, identity: { ...p.identity, telegramUsername: e.target.value } }))}
                      className="w-full border border-[#23262d] bg-[#07080b] px-4 py-3 font-sans text-sm text-[#f4f3ee] placeholder-[#4b5160] focus:border-[#ff3700] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: SCHOOL */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-[#23262d] pb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold block mb-1">
                  // 02. ACADEMIC DIVISION &amp; ARTIFACTS
                </span>
                <h2 className="font-serif-display italic text-2xl sm:text-3xl text-[#f4f3ee]">
                  Current Academic Cohort
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#828792] mt-1">
                  Input your class division and any prior software artifacts or repositories.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                    Grade Level *
                  </label>
                  <select
                    value={formData.school.grade}
                    onChange={(e) => setFormData((p: any) => ({ ...p, school: { ...p.school, grade: e.target.value } }))}
                    className="w-full border border-[#23262d] bg-[#07080b] px-4 py-3 font-sans text-sm text-[#f4f3ee] focus:border-[#ff3700] focus:outline-none transition-colors"
                  >
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                    Section *
                  </label>
                  <select
                    value={formData.school.section}
                    onChange={(e) => setFormData((p: any) => ({ ...p, school: { ...p.school, section: e.target.value } }))}
                    className="w-full border border-[#23262d] bg-[#07080b] px-4 py-3 font-sans text-sm text-[#f4f3ee] focus:border-[#ff3700] focus:outline-none transition-colors"
                  >
                    {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map(s => (
                      <option key={s} value={s}>Section {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Project Specimen */}
              <div className="border border-[#23262d] bg-[#090b0e] p-6 space-y-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[#ff3700] font-bold">// TECHNICAL SPECIMEN (OPTIONAL)</span>
                  <span className="text-[#525866]">CODE REPOSITORIES / WRITE-UPS</span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                      Project or Tool Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Port Scanner, Keylogger Analyzer, Web App"
                      value={formData.projects[0]?.projectName || ""}
                      onChange={(e) => {
                        const newProjects = [...(formData.projects.length ? formData.projects : [{}])];
                        newProjects[0].projectName = e.target.value;
                        setFormData((p: any) => ({ ...p, projects: newProjects }));
                      }}
                      className="w-full border border-[#23262d] bg-[#07080b] px-4 py-2.5 font-sans text-sm text-[#f4f3ee] placeholder-[#4b5160] focus:border-[#ff3700] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                      Repository or Demo Links
                    </label>
                    <input
                      type="text"
                      placeholder="https://github.com/yourname/tool"
                      value={(formData.projects[0]?.links || []).join(", ")}
                      onChange={(e) => {
                        const newProjects = [...(formData.projects.length ? formData.projects : [{}])];
                        newProjects[0].links = e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean);
                        setFormData((p: any) => ({ ...p, projects: newProjects }));
                      }}
                      className="w-full border border-[#23262d] bg-[#07080b] px-4 py-2.5 font-sans text-sm text-[#f4f3ee] placeholder-[#4b5160] focus:border-[#ff3700] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TECH BACKGROUND */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-[#23262d] pb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold block mb-1">
                  // 03. TECHNICAL CAPABILITIES &amp; ENVIRONMENT
                </span>
                <h2 className="font-serif-display italic text-2xl sm:text-3xl text-[#f4f3ee]">
                  Baseline Tooling &amp; Stack
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#828792] mt-1">
                  Be honest about your current level. Complete beginners are evaluated on curiosity and stamina.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                    Programming Experience Level *
                  </label>
                  <select
                    value={formData.techBackground.programmingExp}
                    onChange={(e) => setFormData((p: any) => ({ ...p, techBackground: { ...p.techBackground, programmingExp: e.target.value } }))}
                    className="w-full border border-[#23262d] bg-[#07080b] px-4 py-3 font-sans text-sm text-[#f4f3ee] focus:border-[#ff3700] focus:outline-none transition-colors"
                  >
                    <option value="NONE">None &mdash; Complete Beginner (Zero Code Experience)</option>
                    <option value="BEGINNER">Beginner &mdash; Basic logic / Simple scripts</option>
                    <option value="INTERMEDIATE">Intermediate &mdash; Built standalone applications or tools</option>
                    <option value="ADVANCED">Advanced &mdash; Fluent in systems/assembly or low-level programming</option>
                  </select>
                </div>

                {/* Languages Toggle Grid */}
                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                    Languages Familiar With (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {["Python", "C", "C++", "Java", "JavaScript", "TypeScript", "Bash", "PowerShell", "Other", "None"].map((lang) => {
                      const isSelected = formData.techBackground.programmingLangs.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setFormData((prev: any) => {
                            const programmingLangs = toggleChoice(prev.techBackground.programmingLangs, lang);
                            return {
                              ...prev,
                              techBackground: {
                                ...prev.techBackground,
                                programmingLangs,
                                programmingLanguageOther: programmingLangs.includes("Other") ? prev.techBackground.programmingLanguageOther : "",
                              },
                            };
                          })}
                          className={cn(
                            "p-2.5 font-mono text-xs text-left border transition-all flex items-center justify-between",
                            isSelected
                              ? "border-[#ff3700] bg-[#ff3700]/10 text-[#f4f3ee] font-bold"
                              : "border-[#23262d] bg-[#07080b] text-[#828792] hover:border-[#828792]"
                          )}
                        >
                          <span>{lang}</span>
                          {isSelected && <span className="text-[#ff3700]">&bull;</span>}
                        </button>
                      );
                    })}
                  </div>
                  {formData.techBackground.programmingLangs.includes("Other") && (
                    <input
                      type="text"
                      placeholder="Specify other languages (e.g. Rust, Go, Zig)..."
                      required
                      value={formData.techBackground.programmingLanguageOther}
                      onChange={(e) => setFormData((prev: any) => ({
                        ...prev,
                        techBackground: { ...prev.techBackground, programmingLanguageOther: e.target.value }
                      }))}
                      className="w-full mt-2 border border-[#23262d] bg-[#07080b] px-4 py-2 font-sans text-sm text-[#f4f3ee] focus:border-[#ff3700] focus:outline-none"
                    />
                  )}
                </div>

                {/* Operating Systems Toggle Grid */}
                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                    Primary Operating Systems
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Linux", "Windows", "macOS", "Other"].map((os) => {
                      const isSelected = formData.techBackground.operatingSystems.includes(os);
                      return (
                        <button
                          key={os}
                          type="button"
                          onClick={() => setFormData((prev: any) => {
                            const operatingSystems = toggleChoice(prev.techBackground.operatingSystems, os);
                            return {
                              ...prev,
                              techBackground: {
                                ...prev.techBackground,
                                operatingSystems,
                                operatingSystemOther: operatingSystems.includes("Other") ? prev.techBackground.operatingSystemOther : "",
                              },
                            };
                          })}
                          className={cn(
                            "p-2.5 font-mono text-xs text-left border transition-all flex items-center justify-between",
                            isSelected
                              ? "border-[#ff3700] bg-[#ff3700]/10 text-[#f4f3ee] font-bold"
                              : "border-[#23262d] bg-[#07080b] text-[#828792] hover:border-[#828792]"
                          )}
                        >
                          <span>{os}</span>
                          {isSelected && <span className="text-[#ff3700]">&bull;</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cyber Experience Toggle */}
                <div className="border border-[#23262d] bg-[#07080b] p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.techBackground.hasStudiedCyber}
                      onChange={(e) => setFormData((p: any) => ({ ...p, techBackground: { ...p.techBackground, hasStudiedCyber: e.target.checked } }))}
                      className="w-4 h-4 accent-[#ff3700]"
                    />
                    <span className="font-mono text-xs uppercase tracking-wider text-[#f4f3ee]">
                      I have conducted prior cybersecurity studies / labs
                    </span>
                  </label>

                  {formData.techBackground.hasStudiedCyber && (
                    <div className="mt-4 space-y-3 pt-3 border-t border-[#1b1e25]">
                      <label className="font-mono text-xs uppercase tracking-wider text-[#828792] block">
                        Detail prior lab platforms or courses (e.g. TryHackMe, PortSwigger, CTFs):
                      </label>
                      <textarea
                        rows={3}
                        value={formData.techBackground.cyberStudyDesc || ""}
                        onChange={(e) => setFormData((p: any) => ({ ...p, techBackground: { ...p.techBackground, cyberStudyDesc: e.target.value } }))}
                        className="w-full border border-[#23262d] bg-[#090b0e] p-3 font-sans text-sm text-[#f4f3ee] focus:border-[#ff3700] focus:outline-none"
                        placeholder="Mention ranks, room titles, or challenge categories..."
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MOTIVATION */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-[#23262d] pb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold block mb-1">
                  // 04. PURPOSE &amp; OPERATIONAL CADENCE
                </span>
                <h2 className="font-serif-display italic text-2xl sm:text-3xl text-[#f4f3ee]">
                  Candidate Motivation &amp; Integrity
                </h2>
                <div className="mt-3 p-3 border border-red-500/40 bg-red-950/20 font-mono text-xs text-red-300">
                  // DIRECTIVE: AI-generated or copied answers are filtered and automatically rejected. Write candidly in your own words.
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                    Why do you want to join the BGMCS Cyber Club? *
                  </label>
                  <textarea
                    required
                    minLength={10}
                    rows={4}
                    placeholder="Describe what drives your interest in systems security and defense..."
                    value={formData.motivation.motivationJoin}
                    onChange={(e) => setFormData((p: any) => ({ ...p, motivation: { ...p.motivation, motivationJoin: e.target.value } }))}
                    className="w-full border border-[#23262d] bg-[#07080b] p-4 font-sans text-sm text-[#f4f3ee] focus:border-[#ff3700] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                    What specific skills or concepts do you intend to master? *
                  </label>
                  <textarea
                    required
                    minLength={10}
                    rows={4}
                    placeholder="e.g. Reverse engineering binaries, kernel exploit defense, cryptographic protocols..."
                    value={formData.motivation.motivationLearn}
                    onChange={(e) => setFormData((p: any) => ({ ...p, motivation: { ...p.motivation, motivationLearn: e.target.value } }))}
                    className="w-full border border-[#23262d] bg-[#07080b] p-4 font-sans text-sm text-[#f4f3ee] focus:border-[#ff3700] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
                    Dedicated Weekly Availability *
                  </label>
                  <select
                    value={formData.motivation.weeklyAvailability}
                    onChange={(e) => setFormData((p: any) => ({ ...p, motivation: { ...p.motivation, weeklyAvailability: e.target.value } }))}
                    className="w-full border border-[#23262d] bg-[#07080b] px-4 py-3 font-sans text-sm text-[#f4f3ee] focus:border-[#ff3700] focus:outline-none"
                  >
                    <option value="LESS_THAN_2_HOURS">Less than 2 hours (Not recommended for lab completion)</option>
                    <option value="HOURS_2_TO_4">2 &ndash; 4 hours per week</option>
                    <option value="HOURS_4_TO_6">4 &ndash; 6 hours per week</option>
                    <option value="MORE_THAN_6_HOURS">6+ hours per week (Optimal for active CTF cadet)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TERMS & POLICIES */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border-b border-[#23262d] pb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold block mb-1">
                  // 05. AUTHORIZED LAB USE &amp; ETHICAL COMPLIANCE
                </span>
                <h2 className="font-serif-display italic text-2xl sm:text-3xl text-[#f4f3ee]">
                  Operating Rules &amp; Non-Negotiables
                </h2>
              </div>

              <div className="space-y-4">
                <div className="border border-[#23262d] bg-[#07080b] p-5 space-y-2">
                  <div className="font-mono text-xs text-[#ff3700] font-bold">// 01. CODE OF DEFENSIVE ETHICS</div>
                  <p className="font-sans text-xs text-[#828792] leading-relaxed">
                    Club exploit toolchains, payloads, and simulated exercises are restricted strictly to approved BGMCS virtual test ranges. Launching attacks or scans against external entities, educational institutions, or third parties without explicit authorization results in immediate expulsion and referral to disciplinary authorities.
                  </p>
                </div>

                <div className="border border-[#23262d] bg-[#07080b] p-5 space-y-2">
                  <div className="font-mono text-xs text-[#ff3700] font-bold">// 02. TRUTHFULNESS &amp; INTEGRITY</div>
                  <p className="font-sans text-xs text-[#828792] leading-relaxed">
                    All telemetry, age credentials, and technical experience listed in this dossier must be authentic. Plagiarized write-ups or misrepresentation disqualifies the candidate permanently.
                  </p>
                </div>

                <div className="border border-[#23262d] bg-[#07080b] p-5 space-y-2">
                  <div className="font-mono text-xs text-[#ff3700] font-bold">// 03. PRIVACY GUARANTEE</div>
                  <p className="font-sans text-xs text-[#828792] leading-relaxed">
                    Your contact information and technical assessments are accessed exclusively by BGMCS administration for cohort selection. No candidate telemetry is published or shared externally.
                  </p>
                </div>

                <label className="flex items-start gap-3 p-4 border border-[#ff3700] bg-[#ff3700]/5 cursor-pointer mt-6">
                  <input
                    type="checkbox"
                    required
                    checked={formData.terms.agreedToAccuracy}
                    onChange={(e) => setFormData((p: any) => ({
                      ...p,
                      terms: {
                        ...p.terms,
                        agreedToAccuracy: e.target.checked,
                        agreedToRules: e.target.checked,
                        agreedToLegal: e.target.checked,
                        agreedToNoGuarantee: e.target.checked,
                        ethicsAgreement: e.target.checked,
                        termsAgreement: e.target.checked
                      }
                    }))}
                    className="w-4 h-4 accent-[#ff3700] mt-0.5"
                  />
                  <span className="font-mono text-xs text-[#f4f3ee] leading-relaxed font-semibold">
                    I have read, understood, and solemnly bind myself to the BGMCS Cybersecurity Ethics Policy and Laboratory Usage Guidelines.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="border-b border-[#23262d] pb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ff3700] font-bold block mb-1">
                  // 06. DOSSIER AUDIT &amp; SUBMISSION
                </span>
                <h2 className="font-serif-display italic text-2xl sm:text-3xl text-[#f4f3ee]">
                  Final Verification
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#828792] mt-1">
                  Confirm all values before locking your application in the registry.
                </p>
              </div>

              <div className="border border-[#23262d] bg-[#07080b] p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#23262d]">
                    <span className="font-mono text-xs text-[#ff3700] font-bold">// IDENTITY</span>
                    <button type="button" onClick={() => setStep(0)} className="font-mono text-xs text-[#828792] hover:text-[#f4f3ee] underline">EDIT</button>
                  </div>
                  <dl className="grid sm:grid-cols-2 gap-x-6">
                    <ReviewRow label="Full Name" value={formData.identity.fullName} />
                    <ReviewRow label="Age" value={formData.identity.age} />
                    <ReviewRow label="Email" value={formData.identity.email} />
                    <ReviewRow label="Phone" value={formData.identity.phone} />
                    <ReviewRow label="Telegram" value={formData.identity.telegramUsername} />
                    <ReviewRow label="Gender" value={formData.identity.gender} />
                  </dl>
                </div>

                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#23262d]">
                    <span className="font-mono text-xs text-[#ff3700] font-bold">// ACADEMICS</span>
                    <button type="button" onClick={() => setStep(1)} className="font-mono text-xs text-[#828792] hover:text-[#f4f3ee] underline">EDIT</button>
                  </div>
                  <dl className="grid sm:grid-cols-2 gap-x-6">
                    <ReviewRow label="Grade" value={formData.school.grade} />
                    <ReviewRow label="Section" value={formData.school.section} />
                    <ReviewRow label="Project" value={formData.projects[0]?.projectName} />
                    <ReviewRow label="Links" value={(formData.projects[0]?.links || []).join(", ")} />
                  </dl>
                </div>

                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#23262d]">
                    <span className="font-mono text-xs text-[#ff3700] font-bold">// TECHNICAL PROFICIENCY</span>
                    <button type="button" onClick={() => setStep(2)} className="font-mono text-xs text-[#828792] hover:text-[#f4f3ee] underline">EDIT</button>
                  </div>
                  <dl className="grid sm:grid-cols-2 gap-x-6">
                    <ReviewRow label="Experience" value={formData.techBackground.programmingExp} />
                    <ReviewRow label="Languages" value={formData.techBackground.programmingLangs} />
                    <ReviewRow label="Operating Systems" value={formData.techBackground.operatingSystems} />
                    <ReviewRow label="Studied Cyber" value={formData.techBackground.hasStudiedCyber} />
                  </dl>
                </div>

                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#23262d]">
                    <span className="font-mono text-xs text-[#ff3700] font-bold">// MOTIVATION</span>
                    <button type="button" onClick={() => setStep(3)} className="font-mono text-xs text-[#828792] hover:text-[#f4f3ee] underline">EDIT</button>
                  </div>
                  <dl className="grid sm:grid-cols-2 gap-x-6">
                    <ReviewRow label="Why Join" value={formData.motivation.motivationJoin} />
                    <ReviewRow label="Focus Goals" value={formData.motivation.motivationLearn} />
                    <ReviewRow label="Weekly Commitment" value={formData.motivation.weeklyAvailability} />
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Navigation CTAs */}
          <div className="border-t border-[#23262d] pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 font-mono">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isPending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#23262d] bg-[#111317] px-6 py-3 text-xs text-[#828792] hover:text-[#f4f3ee] hover:border-[#828792] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>PREVIOUS PHASE</span>
              </button>
            ) : <div className="hidden sm:block" />}

            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ff3700] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#ff5419] transition-all shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50"
            >
              {step < 4 ? (
                <>
                  <span>CONTINUE TO 0{step + 2}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : step === 4 ? (
                <>
                  <span>AUDIT APPLICATION DOSSIER</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : isPending ? (
                "LODGING DOSSIER..."
              ) : (
                <>
                  <span>CONFIRM &amp; LODGE CADET APPLICATION</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
