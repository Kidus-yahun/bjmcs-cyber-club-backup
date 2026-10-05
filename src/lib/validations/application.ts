import { z } from "@/lib/validation";
import { ProgrammingExperience, WeeklyAvailability } from "@prisma/client";

export const GRADES = ["9", "10", "11", "12"] as const;
export const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"] as const;
export const PROGRAMMING_LANGUAGE_OPTIONS = ["Python", "C", "C++", "Java", "JavaScript", "TypeScript", "Bash", "PowerShell", "Other", "None"] as const;
export const OPERATING_SYSTEM_OPTIONS = ["Windows", "Linux", "macOS", "Other"] as const;

export const IdentitySchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  age: z.number().int().min(10, "Age must be at least 10").max(30, "Age must be under 30"),
  gender: z.string().min(1, "Please specify your gender").max(50),
  phone: z.string().regex(/^\+?[0-9\s\-()]{9,20}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address"),
  telegramUsername: z.string().trim().min(5, "Telegram username must be at least 5 characters").max(33, "Telegram username must be at most 32 characters, with an optional @").regex(/^@?[A-Za-z][A-Za-z0-9_]{4,31}$/, "Enter a valid Telegram username"),
});

export const SchoolSchema = z.object({
  grade: z.enum(GRADES, { message: "Invalid grade selected" }),
  section: z.enum(SECTIONS, { message: "Invalid section selected" }),
});

export const TechBackgroundSchema = z.object({
  hasStudiedCyber: z.boolean(),
  cyberStudyDesc: z.string().max(1000).optional().nullable(),
  programmingExp: z.nativeEnum(ProgrammingExperience),
  programmingLangs: z.array(z.enum(PROGRAMMING_LANGUAGE_OPTIONS)).max(PROGRAMMING_LANGUAGE_OPTIONS.length),
  programmingLanguageOther: z.string().trim().max(200).optional().default(""),
  operatingSystems: z.array(z.enum(OPERATING_SYSTEM_OPTIONS)).max(OPERATING_SYSTEM_OPTIONS.length),
  operatingSystemOther: z.string().trim().max(100).optional().default(""),
  cyberTopics: z.array(z.string()).max(20),
  previousExperience: z.array(z.string()).max(20),
}).superRefine((data, context) => {
  if (new Set(data.programmingLangs).size !== data.programmingLangs.length) {
    context.addIssue({ code: "custom", path: ["programmingLangs"], message: "Do not select the same language more than once." });
  }
  if (data.programmingLangs.includes("None") && data.programmingLangs.length > 1) {
    context.addIssue({ code: "custom", path: ["programmingLangs"], message: "Select None or programming languages, not both." });
  }
  if (data.operatingSystems.includes("Other") && !data.operatingSystemOther.trim()) {
    context.addIssue({ code: "custom", path: ["operatingSystemOther"], message: "Specify the other operating system." });
  }
  if (data.programmingLangs.includes("Other") && !data.programmingLanguageOther.trim()) {
    context.addIssue({ code: "custom", path: ["programmingLanguageOther"], message: "Specify the other programming language(s)." });
  }
});

export const MotivationSchema = z.object({
  motivationJoin: z.string().min(10, "Please provide more detail").max(2000),
  motivationLearn: z.string().min(10, "Please provide more detail").max(2000),
  areasOfInterest: z.array(z.string()).max(20),
  weeklyAvailability: z.nativeEnum(WeeklyAvailability),
});

export const ProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(1000).optional().nullable(),
  projectType: z.string().max(50).optional().nullable(),
  githubUrl: z.union([z.string().url("Must be a valid URL"), z.literal(""), z.null()]).optional(),
  portfolioUrl: z.union([z.string().url("Must be a valid URL"), z.literal(""), z.null()]).optional(),
  links: z.array(z.string().url("Must be a valid URL")).max(10).optional().default([]),
  files: z.array(z.string()).max(10).optional().default([]),
});

export const AdditionalSchema = z.object({
  additionalSkills: z.string().max(1000).optional().nullable(),
  howHeardAboutUs: z.string().max(200).optional().nullable(),
});

export const TermsSchema = z.object({
  agreedToAccuracy: z.boolean().refine((val) => val === true, { message: "You must agree to this declaration" }),
  agreedToRules: z.boolean().refine((val) => val === true, { message: "You must agree to the club rules" }),
  agreedToLegal: z.boolean().refine((val) => val === true, { message: "You must agree to legal/ethical guidelines" }),
  agreedToNoGuarantee: z.boolean().refine((val) => val === true, { message: "You must acknowledge this statement" }),
  ethicsAgreement: z.boolean().refine((val) => val === true, { message: "You must agree to the ethics policy" }),
  termsAgreement: z.boolean().refine((val) => val === true, { message: "You must agree to the terms policy" }),
});

export const CompleteApplicationSchema = z.object({
  identity: IdentitySchema,
  school: SchoolSchema,
  techBackground: TechBackgroundSchema,
  motivation: MotivationSchema,
  projects: z.array(ProjectSchema).max(10, "Maximum of 10 projects allowed"),
  additional: AdditionalSchema,
  terms: TermsSchema,
});

export type CompleteApplicationPayload = z.infer<typeof CompleteApplicationSchema>;
