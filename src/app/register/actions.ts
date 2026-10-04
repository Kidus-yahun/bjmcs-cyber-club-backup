"use server";

import { db } from "@/lib/db";
import { createApplication } from "@/lib/services/application";
import { CompleteApplicationSchema, CompleteApplicationPayload } from "@/lib/validations/application";

export type ActionState = {
  success?: boolean;
  reference?: string;
  error?: string;
};

export async function submitRegistration(data: CompleteApplicationPayload): Promise<ActionState> {
  try {
    const settings = await db.registrationSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings?.isOpen) {
      return { success: false, error: "Registration is currently closed." };
    }

    if (settings.deadline && new Date() > settings.deadline) {
      return { success: false, error: "The registration deadline has passed." };
    }

    const result = CompleteApplicationSchema.safeParse(data);
    if (!result.success) {
      return { success: false, error: "Invalid form data. Please check your inputs." };
    }

    const application = await createApplication(result.data);

    return {
      success: true,
      reference: application.reference,
    };
  } catch (error) {
    console.error("Submission failed:", error);
    return { success: false, error: "An unexpected error occurred. Please try again later." };
  }
}

