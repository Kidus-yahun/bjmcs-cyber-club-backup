"use server";

import { db } from "@/lib/db";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { ApplicationStatus } from "@prisma/client";
import { sendSelectionEmail } from "@/lib/services/email";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

async function verifyAdmin() {
  const token = (await cookies()).get("session")?.value;
  if (!token) throw new Error("Unauthorized");
  const payload = await verifyJwt(token);
  if (!payload || payload.role !== "ADMIN") throw new Error("Unauthorized");
  return payload;
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  try {
    await verifyAdmin();
    const application = await db.application.findUnique({ where: { id } });
    if (!application) return { success: false, error: "Application not found" };

    const isTransitioningToSelected = status === "SELECTED" && application.status !== "SELECTED";

    // 1. Update primary status
    await db.application.update({
      where: { id },
      data: {
        status,
        statusUpdatedAt: new Date(),
      },
    });

    // 2. Trigger email workflow if transitioning to SELECTED
    if (isTransitioningToSelected && application.selectionEmailStatus !== "SENT") {
      await processSelectionEmail(id);
    }

    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${id}`);
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: "Failed to update application status." };
  }
}

export async function processSelectionEmail(id: string) {
  try {
    await verifyAdmin();
    const application = await db.application.findUnique({ where: { id }, include: { student: true } });
    if (!application || application.status !== "SELECTED") {
      return { success: false, error: "Invalid state for email sending." };
    }

    if (application.selectionEmailStatus === "SENT") {
      return { success: false, error: "Acceptance email has already been sent for this application." };
    }

    // 1. Provision or update student account with activation token
    let activationToken = application.student?.activationToken;
    
    if (!application.student) {
      activationToken = randomBytes(32).toString("hex");
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7); // 7 days from now

      await db.student.create({
        data: {
          applicationId: application.id,
          email: application.email,
          activationToken,
          activationExpires: expirationDate,
          isActive: false
        }
      });
    } else if (!application.student.isActive && !application.student.activationToken) {
      // Regenerate token if they have an inactive account but no token somehow
      activationToken = randomBytes(32).toString("hex");
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      await db.student.update({
        where: { id: application.student.id },
        data: { activationToken, activationExpires: expirationDate }
      });
    }

    // Mark as attempted
    await db.application.update({
      where: { id },
      data: { emailAttemptedAt: new Date() }
    });

    // Attempt delivery
    const result = await sendSelectionEmail(
      application.email, 
      application.fullName, 
      application.reference,
      activationToken || undefined
    );

    if (result.success) {
      await db.application.update({
        where: { id },
        data: {
          selectionEmailStatus: "SENT",
          emailSentAt: new Date(),
          emailError: null
        }
      });
      revalidatePath(`/admin/applications/${id}`);
      return { success: true };
    } else {
      await db.application.update({
        where: { id },
        data: {
          selectionEmailStatus: "FAILED",
          emailError: result.error || "Unknown delivery error"
        }
      });
      revalidatePath(`/admin/applications/${id}`);
      return { success: false, error: result.error };
    }
  } catch (error: any) {
    console.error("Critical error in processSelectionEmail:", error);
    return { success: false, error: "Internal server error during email processing." };
  }
}
