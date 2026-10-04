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
