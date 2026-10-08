"use client";

import { useRef, useState } from "react";
import { submitRegistration } from "../actions";
import { Button, Input, Alert, Card, CardContent } from "@/components/ui";
import { ProgrammingExperience, WeeklyAvailability } from "@prisma/client";
import { cn } from "@/lib/utils";

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
    <div className="border-b border-slate-100 py-3 last:border-0 dark:border-slate-800">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-800 dark:text-slate-200">{reviewValue(value)}</dd>
    </div>
  );
}

// Inline SVGs
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
);

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
);

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
      return;
    }

    if (step === 4) {
      if (!formData.terms.agreedToAccuracy) {
        setError("Please read the policies and select I agree before continuing.");
        return;
      }
      setError(null);
      setStep(5);
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
      setError("An unexpected error occurred.");
    } finally {
      setIsPending(false);
      submissionStarted.current = false;
    }
  };

  const handleBack = () => setStep(s => Math.max(0, s - 1));

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto border-emerald-500/30 dark:border-emerald-500/20 shadow-2xl shadow-emerald-500/10 bg-white dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-emerald-400 to-cyan-500" />
        <CardContent className="pt-10 pb-12 px-8 text-center space-y-6">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50 dark:ring-emerald-900/10">
            <ShieldCheckIcon className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Application Submitted Successfully</h2>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Application / Reference ID</p>
          <div className="py-6 px-4 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner my-8">
            <p className="text-4xl sm:text-5xl font-mono font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              {success}
            </p>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your application has been received and will be reviewed. We will notify you by email whether you are selected. Submitting an application does not mean you have been accepted.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto border-slate-200 dark:border-slate-800/60 shadow-xl dark:shadow-blue-900/10 bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300">
      <div className="px-6 py-8 sm:p-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="w-full relative flex items-center justify-between">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 ease-in-out"
                style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
            {STEPS.map((s, i) => {
              const isCompleted = i < step;
              const isActive = i === step;
              
              return (
                <div key={s} className="relative z-10 flex flex-col items-center group">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border-2",
                    isCompleted ? "bg-blue-600 border-blue-600 text-white dark:bg-blue-500 dark:border-blue-500" : 
                    isActive ? "bg-white border-blue-600 text-blue-600 dark:bg-slate-900 dark:border-blue-500 dark:text-blue-400 ring-4 ring-blue-100 dark:ring-blue-900/30" : 
                    "bg-white border-slate-300 text-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-500"
                  )}>
                    {isCompleted ? <CheckIcon className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className={cn(
                    "absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-colors duration-200",
                    isCompleted || isActive ? "text-slate-900 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"
                  )}>
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <CardContent className="p-6 sm:p-10 pt-12 sm:pt-14">
        {error && <Alert variant="error" title="Error" className="mb-8">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Identity Details</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Please provide your personal contact information.</p>
              </div>
              
              <div className="space-y-5">
                <Input 
                  label="Full Name" 
                  placeholder="John Doe"
                  required 
                  value={formData.identity.fullName} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((p: any) => ({...p, identity: {...p.identity, fullName: e.target.value}}))} 
                  className="bg-white dark:bg-slate-950"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input 
                    label="Email Address" 
                    placeholder="john@example.com"
                    type="email" 
                    required 
                    value={formData.identity.email} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((p: any) => ({...p, identity: {...p.identity, email: e.target.value}}))} 
                    className="bg-white dark:bg-slate-950"
                  />
                  <Input 
                    label="Phone Number" 
                    placeholder="+1 (555) 000-0000"
                    type="tel" 
                    required 
                    value={formData.identity.phone} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((p: any) => ({...p, identity: {...p.identity, phone: e.target.value}}))} 
                    className="bg-white dark:bg-slate-950"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input 
                    label="Age" 
                    type="number" 
                    min={10} 
                    max={30} 
                    required 
                    value={formData.identity.age} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((p: any) => ({...p, identity: {...p.identity, age: parseInt(e.target.value)}}))} 
                    className="bg-white dark:bg-slate-950"
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
                    <select 
                      required 
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:ring-offset-slate-950 dark:focus-visible:ring-blue-500" 
                      value={formData.identity.gender} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((p: any) => ({...p, identity: {...p.identity, gender: e.target.value}}))}
                    >
                      <option value="" disabled>Select gender...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">School Information</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tell us about your current academic standing.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Grade Level</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100" 
                    value={formData.school.grade} 
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((p: any) => ({...p, school: {...p.school, grade: e.target.value}}))}
                  >
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Section</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100" 
                    value={formData.school.section} 
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((p: any) => ({...p, school: {...p.school, section: e.target.value}}))}
                  >
                    {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Previous Projects (Optional)</h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Project Title</label>
                      <input 
                        type="text"
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                        value={formData.projects[0]?.projectName || ""}
                        onChange={(e) => {
                          const newProjects = [...(formData.projects.length ? formData.projects : [{}])];
                          newProjects[0].projectName = e.target.value;
                          setFormData((p: any) => ({...p, projects: newProjects}));
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Project Links (Comma separated)</label>
                      <input 
                        type="text"
                        placeholder="https://github.com/..., https://..."
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                        value={(formData.projects[0]?.links || []).join(", ")}
                        onChange={(e) => {
                          const newProjects = [...(formData.projects.length ? formData.projects : [{}])];
                          newProjects[0].links = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                          setFormData((p: any) => ({...p, projects: newProjects}));
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Input
                        label="Telegram Username"
                        placeholder="@yourusername"
                        required
                        value={formData.identity.telegramUsername}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((p: any) => ({ ...p, identity: { ...p.identity, telegramUsername: e.target.value } }))}
                        className="bg-white dark:bg-slate-950"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400">Please make sure this Telegram account can be contacted.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Technical Background</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Help us understand your current technical proficiency.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Programming Experience</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100" 
                    value={formData.techBackground.programmingExp} 
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((p: any) => ({...p, techBackground: {...p.techBackground, programmingExp: e.target.value}}))}
                  >
                    <option value="NONE">None - Complete Beginner</option>
                    <option value="BEGINNER">Beginner - Basic scripts</option>
                    <option value="INTERMEDIATE">Intermediate - Built some projects</option>
                    <option value="ADVANCED">Advanced - Highly proficient</option>
                  </select>
                </div>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium text-slate-700 dark:text-slate-300">Programming Languages</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {["Python", "C", "C++", "Java", "JavaScript", "TypeScript", "Bash", "PowerShell", "Other", "None"].map((language) => (
                      <label key={language} className="flex min-h-11 items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900/60">
                        <input
                          type="checkbox"
                          checked={formData.techBackground.programmingLangs.includes(language)}
                          onChange={() => setFormData((previous: any) => {
                            const programmingLangs = toggleChoice(previous.techBackground.programmingLangs, language);
                            return {
                              ...previous,
                              techBackground: {
                                ...previous.techBackground,
                                programmingLangs,
                                programmingLanguageOther: programmingLangs.includes("Other") ? previous.techBackground.programmingLanguageOther : "",
                              },
                            };
                          })}
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span>{language}</span>
                      </label>
                    ))}
                  </div>
                  {formData.techBackground.programmingLangs.includes("Other") && (
                    <Input
                      label="Specify other programming language(s)"
                      placeholder="For example: Go, Rust"
                      required
                      value={formData.techBackground.programmingLanguageOther}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((previous: any) => ({
                        ...previous,
                        techBackground: { ...previous.techBackground, programmingLanguageOther: e.target.value },
                      }))}
                      className="bg-white dark:bg-slate-950"
                    />
                  )}
                </fieldset>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium text-slate-700 dark:text-slate-300">Operating Systems</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {["Windows", "Linux", "macOS", "Other"].map((operatingSystem) => (
                      <label key={operatingSystem} className="flex min-h-11 items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900/60">
                        <input
                          type="checkbox"
                          checked={formData.techBackground.operatingSystems.includes(operatingSystem)}
                          onChange={() => setFormData((previous: any) => {
                            const operatingSystems = toggleChoice(previous.techBackground.operatingSystems, operatingSystem);
                            return {
                              ...previous,
                              techBackground: {
                                ...previous.techBackground,
                                operatingSystems,
                                operatingSystemOther: operatingSystems.includes("Other") ? previous.techBackground.operatingSystemOther : "",
                              },
                            };
                          })}
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span>{operatingSystem}</span>
                      </label>
                    ))}
                  </div>
                  {formData.techBackground.operatingSystems.includes("Other") && (
                    <Input
                      label="Specify other operating system"
                      placeholder="For example: FreeBSD"
                      required
                      value={formData.techBackground.operatingSystemOther}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((previous: any) => ({
                        ...previous,
                        techBackground: { ...previous.techBackground, operatingSystemOther: e.target.value },
                      }))}
                      className="bg-white dark:bg-slate-950"
                    />
                  )}
                </fieldset>
                
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 checked:border-blue-600 checked:bg-blue-600 dark:border-slate-700 dark:checked:border-blue-500 dark:checked:bg-blue-500 transition-all"
                        checked={formData.techBackground.hasStudiedCyber} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((p: any) => ({...p, techBackground: {...p.techBackground, hasStudiedCyber: e.target.checked}}))} 
                      />
                      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                        <CheckIcon className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">I have studied cybersecurity before</span>
                  </label>
                  
                  {formData.techBackground.hasStudiedCyber && (
                    <div className="mt-4 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Describe your cybersecurity studies</label>
                      <textarea 
                        className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                        rows={4} 
                        placeholder="Courses taken, platforms used (e.g., TryHackMe, HackTheBox), topics covered..."
                        value={formData.techBackground.cyberStudyDesc || ""} 
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((p: any) => ({...p, techBackground: {...p.techBackground, cyberStudyDesc: e.target.value}}))} 
                      />
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mt-4">Areas of Cybersecurity Interest (Comma separated)</label>
                      <input
                        type="text"
                        placeholder="Ethical Hacking, Forensics..."
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 mt-1"
                        value={formData.techBackground.cyberTopics.join(", ")}
                        onChange={(e) => setFormData((p: any) => ({...p, techBackground: {...p.techBackground, cyberTopics: e.target.value.split(",").map(s => s.trim()).filter(Boolean)}}))}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Motivation & Projects</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">We want to know what drives your interest in cybersecurity.</p>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                  <p className="text-sm font-medium text-red-800 dark:text-red-400">
                    AI-generated answers are not allowed. Applicants must provide their own original responses. Use of AI-generated or copied responses may result in disqualification.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Why do you want to join the BGMCS Cyber Club?</label>
                  <textarea 
                    className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 placeholder:text-slate-400" 
                    required 
                    minLength={10} 
                    rows={3} 
                    placeholder="Share your inspiration..."
                    value={formData.motivation.motivationJoin} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((p: any) => ({...p, motivation: {...p.motivation, motivationJoin: e.target.value}}))} 
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">What do you hope to learn or achieve?</label>
                  <textarea 
                    className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 placeholder:text-slate-400" 
                    required 
                    minLength={10} 
                    rows={3} 
                    placeholder="Specific skills, concepts, or goals..."
                    value={formData.motivation.motivationLearn} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((p: any) => ({...p, motivation: {...p.motivation, motivationLearn: e.target.value}}))} 
                  />
                </div>
                
                <div className="space-y-1.5 pt-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Weekly Availability</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100" 
                    value={formData.motivation.weeklyAvailability} 
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((p: any) => ({...p, motivation: {...p.motivation, weeklyAvailability: e.target.value}}))}
                  >
                    <option value="LESS_THAN_2_HOURS">Less than 2 hours</option>
                    <option value="HOURS_2_TO_4">2-4 hours</option>
                    <option value="HOURS_4_TO_6">4-6 hours</option>
                    <option value="MORE_THAN_6_HOURS">More than 6 hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Terms & Policies</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review the application terms, privacy information, and authorized lab-use policy.</p>
              </div>
              
              <div className="space-y-3">
                <details className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <summary className="cursor-pointer font-semibold text-slate-900 dark:text-slate-100">Application Terms</summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">I confirm that the information in this application is accurate and truthful. I will follow club rules and understand that applying does not guarantee selection or admission.</p>
                </details>
                <details className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <summary className="cursor-pointer font-semibold text-slate-900 dark:text-slate-100">Privacy Information</summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Information you provide, including contact details and academic or technical responses, will be used by the BGMCS Cyber Club administrators to review your application and, if selected, manage club participation. It will not be displayed publicly as part of the application process.</p>
                </details>
                <details className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <summary className="cursor-pointer font-semibold text-slate-900 dark:text-slate-100">Cybersecurity Ethics & Lab Use</summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Cybersecurity activities must be lawful, ethical, and authorized. Use club labs and learning environments only as instructed; never access, test, disrupt, or collect data from systems without explicit permission. Report suspected security issues responsibly to club administrators.</p>
                </details>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
                <input
                  type="checkbox"
                  required
                  checked={formData.terms.agreedToAccuracy}
                  onChange={(e) => {
                    const agreed = e.target.checked;
                    setFormData((previous: any) => ({
                      ...previous,
                      terms: {
                        agreedToAccuracy: agreed,
                        agreedToRules: agreed,
                        agreedToLegal: agreed,
                        agreedToNoGuarantee: agreed,
                        ethicsAgreement: agreed,
                        termsAgreement: agreed,
                      },
                    }));
                  }}
                  className="mt-0.5 h-5 w-5 accent-blue-600"
                />
                <span className="font-semibold text-slate-900 dark:text-slate-100">I agree</span>
              </label>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                Please review your information carefully. After submitting, you may not be able to edit your application.
              </div>

              <section className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Identity & Contact</h3>
                  <button type="button" onClick={() => setStep(0)} className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">Edit</button>
                </div>
                <dl className="mt-2 grid gap-x-6 sm:grid-cols-2">
                  <ReviewRow label="Full name" value={formData.identity.fullName} />
                  <ReviewRow label="Age" value={formData.identity.age} />
                  <ReviewRow label="Gender" value={formData.identity.gender} />
                  <ReviewRow label="Email" value={formData.identity.email} />
                  <ReviewRow label="Phone" value={formData.identity.phone} />
                  <ReviewRow label="Telegram username" value={formData.identity.telegramUsername} />
                </dl>
              </section>

              <section className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">School & Projects</h3>
                  <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">Edit</button>
                </div>
                <dl className="mt-2 grid gap-x-6 sm:grid-cols-2">
                  <ReviewRow label="Grade" value={formData.school.grade} />
                  <ReviewRow label="Section" value={formData.school.section} />
                </dl>
                {formData.projects.length ? formData.projects.map((project: any, index: number) => (
                  <div key={index} className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <p className="mb-1 text-xs font-bold uppercase text-slate-500">Project {index + 1}</p>
                    <dl className="grid gap-x-6 sm:grid-cols-2">
                      <ReviewRow label="Project title" value={project.projectName} />
                      <ReviewRow label="Description" value={project.description} />
                      <ReviewRow label="Project type" value={project.projectType} />
                      <ReviewRow label="GitHub URL" value={project.githubUrl} />
                      <ReviewRow label="Portfolio URL" value={project.portfolioUrl} />
                      <ReviewRow label="Project links" value={project.links} />
                      <ReviewRow label="Project files" value={project.files} />
                    </dl>
                  </div>
                )) : <p className="mt-3 text-sm text-slate-500">No projects provided.</p>}
              </section>

              <section className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Technical Background</h3>
                  <button type="button" onClick={() => setStep(2)} className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">Edit</button>
                </div>
                <dl className="mt-2 grid gap-x-6 sm:grid-cols-2">
                  <ReviewRow label="Studied cybersecurity before" value={formData.techBackground.hasStudiedCyber} />
                  <ReviewRow label="Cybersecurity studies description" value={formData.techBackground.cyberStudyDesc} />
                  <ReviewRow label="Programming experience" value={formData.techBackground.programmingExp} />
                  <ReviewRow label="Programming languages" value={formData.techBackground.programmingLangs} />
                  <ReviewRow label="Operating systems" value={formData.techBackground.operatingSystems} />
                  <ReviewRow label="Cybersecurity topics" value={formData.techBackground.cyberTopics} />
                  <ReviewRow label="Previous experience" value={formData.techBackground.previousExperience} />
                </dl>
              </section>

              <section className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Motivation & Additional Information</h3>
                  <button type="button" onClick={() => setStep(3)} className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">Edit</button>
                </div>
                <dl className="mt-2 grid gap-x-6 sm:grid-cols-2">
                  <ReviewRow label="Why join" value={formData.motivation.motivationJoin} />
                  <ReviewRow label="What to learn" value={formData.motivation.motivationLearn} />
                  <ReviewRow label="Areas of interest" value={formData.motivation.areasOfInterest} />
                  <ReviewRow label="Weekly availability" value={formData.motivation.weeklyAvailability} />
                  <ReviewRow label="Additional skills" value={formData.additional.additionalSkills} />
                  <ReviewRow label="How they heard about the club" value={formData.additional.howHeardAboutUs} />
                </dl>
              </section>

              <section className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Policy Agreement</h3>
                  <button type="button" onClick={() => setStep(4)} className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">Edit</button>
                </div>
                <dl className="mt-2"><ReviewRow label="I agree to the application terms, privacy information, and cybersecurity ethics/lab-use policy" value={formData.terms.agreedToAccuracy} /></dl>
              </section>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
            {step > 0 ? (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack} 
                disabled={isPending}
                className="w-full sm:w-auto hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : <div className="hidden sm:block"></div>}
            
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              {step < 4 ? (
                <>Next Step <ArrowRightIcon className="w-4 h-4 ml-2" /></>
              ) : step === 4 ? (
                <>Review Application <ArrowRightIcon className="w-4 h-4 ml-2" /></>
              ) : isPending ? (
                "Submitting..."
              ) : (
                <>Confirm & Submit Application <ShieldCheckIcon className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
