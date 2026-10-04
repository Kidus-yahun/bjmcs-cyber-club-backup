"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { AttendanceStatus, TaskStatus, MaterialStatus, SubmissionStatus } from "@prisma/client";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

// Basic auth check wrapper
async function verifyAdmin() {
  const token = (await cookies()).get("session")?.value;
  if (!token) throw new Error("Unauthorized");
  const payload = await verifyJwt(token);
  if (!payload || payload.role !== "ADMIN") throw new Error("Unauthorized");
  return payload;
}

// Removed obsolete task and attendance methods that were moved to actions/tasks.ts and actions/attendance.ts

// === MATERIALS ===

export async function createMaterial(data: { title: string; description?: string; category: string; url: string; status: MaterialStatus }) {
  await verifyAdmin();
  await db.learningMaterial.create({ data });
  revalidatePath("/admin/materials");
  return { success: true };
}

export async function updateMaterial(id: string, data: { title: string; description?: string; category: string; url: string; status: MaterialStatus }) {
  await verifyAdmin();
  await db.learningMaterial.update({ where: { id }, data });
  revalidatePath("/admin/materials");
  return { success: true };
}
