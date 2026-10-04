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

export async function createGroup(name: string, mentorId?: string) {
  await checkAdminSession();
  const group = await db.group.create({
    data: { name, mentorId: mentorId || null }
  });
  await logAction("CREATE_GROUP", `Group: ${name}`);
  revalidatePath("/admin/groups");
  return group;
}

export async function updateGroup(id: string, name: string, mentorId?: string) {
  await checkAdminSession();
  await db.group.update({
    where: { id },
    data: { name, mentorId: mentorId || null }
  });
  await logAction("UPDATE_GROUP", `Group ID: ${id}`);
  revalidatePath("/admin/groups");
}

export async function createMentor(name: string, email?: string) {
  await checkAdminSession();
  const mentor = await db.mentor.create({
    data: { name, email }
  });
  await logAction("CREATE_MENTOR", `Mentor: ${name}`);
  revalidatePath("/admin/groups");
  return mentor;
}
