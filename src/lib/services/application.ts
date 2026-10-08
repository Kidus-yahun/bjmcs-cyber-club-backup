import { db } from "@/lib/db";
import { CompleteApplicationPayload } from "@/lib/validations/application";

async function generateReferenceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  let unique = false;
  let reference = "";
  let attempts = 0;

  while (!unique && attempts < 10) {
    const randomPart = Math.floor(10000 + Math.random() * 90000);
    reference = `BGMCS-${year}-${randomPart}`;
    const existing = await db.application.findUnique({
      where: { reference },
      select: { id: true },
    });
    if (!existing) unique = true;
    attempts++;
  }

  if (!unique) throw new Error("Failed to generate a unique reference number after 10 attempts.");
  return reference;
}

export async function createApplication(data: CompleteApplicationPayload) {
  const reference = await generateReferenceNumber();
  const programmingLangs: string[] = data.techBackground.programmingLangs
    .filter((language) => language !== "None" && language !== "Other");
  if (data.techBackground.programmingLangs.includes("Other")) {
    programmingLangs.push(
      ...data.techBackground.programmingLanguageOther
        .split(",")
        .map((language) => language.trim())
        .filter(Boolean)
        .map((language) => `Other: ${language}`)
    );
  }

  const operatingSystems: string[] = data.techBackground.operatingSystems
    .filter((operatingSystem) => operatingSystem !== "Other");
  if (data.techBackground.operatingSystems.includes("Other")) {
    operatingSystems.push(`Other: ${data.techBackground.operatingSystemOther.trim()}`);
  }

  const application = await db.application.create({
    data: {
      reference,
      fullName: data.identity.fullName,
      age: data.identity.age,
      gender: data.identity.gender,
      phone: data.identity.phone,
      email: data.identity.email,
      telegramUsername: data.identity.telegramUsername,

      grade: data.school.grade,
      section: data.school.section,

      hasStudiedCyber: data.techBackground.hasStudiedCyber,
      cyberStudyDesc: data.techBackground.cyberStudyDesc,
      programmingExp: data.techBackground.programmingExp,
      programmingLangs,
      operatingSystems,
      cyberTopics: data.techBackground.cyberTopics,
      previousExperience: data.techBackground.previousExperience,

      motivationJoin: data.motivation.motivationJoin,
      motivationLearn: data.motivation.motivationLearn,
      areasOfInterest: data.motivation.areasOfInterest,
      weeklyAvailability: data.motivation.weeklyAvailability,

      additionalSkills: data.additional.additionalSkills,
      howHeardAboutUs: data.additional.howHeardAboutUs,

      agreedToAccuracy: data.terms.agreedToAccuracy,
      agreedToRules: data.terms.agreedToRules,
      agreedToLegal: data.terms.agreedToLegal,
      agreedToNoGuarantee: data.terms.agreedToNoGuarantee,
      ethicsAgreement: data.terms.ethicsAgreement,
      termsAgreement: data.terms.termsAgreement,
      termsAcceptedAt: new Date(),

      projects: {
        create: data.projects.map((p) => ({
          projectName: p.projectName,
          description: p.description,
          projectType: p.projectType,
          githubUrl: p.githubUrl || null,
          portfolioUrl: p.portfolioUrl || null,
          links: p.links || [],
          files: p.files || [],
        })),
      },
    },
  });

  return application;
}
