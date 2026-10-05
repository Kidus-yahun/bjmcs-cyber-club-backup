"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { logAction } from "./audit";

async function checkAdminSession() {
  const token = (await cookies()).get("session")?.value;
  if (!token) throw new Error("Unauthorized");
  const payload = await verifyJwt(token);
  if (!payload || payload.role !== "ADMIN") throw new Error("Unauthorized");
  return payload;
}

export async function assignGroup(studentId: string, groupId: string | null) {
  try {
    await checkAdminSession();
    await db.student.update({
      where: { id: studentId },
      data: { groupId }
    });
    await logAction("ASSIGN_GROUP", `Student ${studentId} -> Group ${groupId || "None"}`);
    revalidatePath("/admin/students");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function kickStudent(studentId: string, reason?: string) {
  try {
    const admin = await checkAdminSession();
    const student = await db.student.findUnique({
      where: { id: studentId },
      include: { application: true },
    });

    if (!student || student.kickedAt || student.application.status !== "SELECTED") {
      return { success: false, error: "This student is not currently active and selected." };
    }

    const kickedAt = new Date();
    const removalReason = reason?.trim() || null;
    const actionTarget = JSON.stringify({
      studentId: student.id,
      name: student.application.fullName,
      email: student.email,
      reason: removalReason,
    });

    await db.$transaction(async (tx) => {
      await tx.student.update({
        where: { id: student.id },
        data: { isActive: false, kickedAt, kickedReason: removalReason },
      });
      await tx.application.update({
        where: { id: student.applicationId },
        data: { status: "NOT_SELECTED", statusUpdatedAt: kickedAt },
      });
      await tx.auditLog.create({
        data: { actor: `ADMIN:${admin.adminId}`, action: "KICK_STUDENT", target: actionTarget },
      });
    });

    revalidatePath("/admin/students");
    revalidatePath("/admin/students/kicked");
    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${student.applicationId}`);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to kick student:", error);
    return { success: false, error: "Failed to deactivate student." };
  }
}

export async function restoreStudent(studentId: string) {
  try {
    const admin = await checkAdminSession();
    const student = await db.student.findUnique({
      where: { id: studentId },
      include: { application: true },
    });

    if (!student || !student.kickedAt || student.isActive) {
      return { success: false, error: "This student is not currently kicked." };
    }

    await db.$transaction(async (tx) => {
      await tx.student.update({
        where: { id: student.id },
        data: { isActive: true, kickedAt: null, kickedReason: null },
      });
      await tx.application.update({
        where: { id: student.applicationId },
        data: { status: "SELECTED", statusUpdatedAt: new Date() },
      });
      await tx.auditLog.create({
        data: {
          actor: `ADMIN:${admin.adminId}`,
          action: "RESTORE_STUDENT",
          target: JSON.stringify({ studentId: student.id, name: student.application.fullName, email: student.email }),
        },
      });
    });

    revalidatePath("/admin/students");
    revalidatePath("/admin/students/kicked");
    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${student.applicationId}`);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to restore student:", error);
    return { success: false, error: "Failed to restore student." };
  }
}

export async function permanentlyDeleteKickedStudent(studentId: string) {
  try {
    const admin = await checkAdminSession();
    const student = await db.student.findUnique({
      where: { id: studentId },
      include: { application: true },
    });

    if (!student || !student.kickedAt || student.isActive) {
      return { success: false, error: "Only kicked students can be permanently deleted." };
    }

    await db.$transaction(async (tx) => {
      await tx.auditLog.create({
        data: {
          actor: `ADMIN:${admin.adminId}`,
          action: "PERMANENTLY_DELETE_STUDENT",
          target: JSON.stringify({
            studentId: student.id,
            name: student.application.fullName,
            email: student.email,
            reason: student.kickedReason,
          }),
        },
      });
      await tx.student.delete({ where: { id: student.id } });
    });

    revalidatePath("/admin/students");
    revalidatePath("/admin/students/kicked");
    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${student.applicationId}`);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to permanently delete kicked student:", error);
    return { success: false, error: "Failed to permanently delete student." };
  }
}
