"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

async function getStudentSession() {
  const token = (await cookies()).get("session")?.value;
  if (!token) throw new Error("Unauthorized");
  const payload = await verifyJwt(token);
  if (!payload || payload.role !== "STUDENT" || !payload.studentId) {
    throw new Error("Unauthorized");
  }

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    select: { isActive: true, kickedAt: true },
  });
  if (!student?.isActive || student.kickedAt) throw new Error("Unauthorized");

  return payload.studentId;
}

export async function submitTask(taskId: string, formData: FormData) {
  const studentId = await getStudentSession();
  
  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task || task.status !== "PUBLISHED") {
    throw new Error("Task not available");
  }

  const isLate = new Date() > task.deadline;
  if (isLate && !task.allowLateSubmissions) {
    throw new Error("Submissions are locked. Late submissions are not allowed for this task.");
  }
  
  const contentText = formData.get("content")?.toString() || "";
  const studentNote = formData.get("studentNote")?.toString() || null;
  const linksRaw = formData.get("links")?.toString();
  const links = linksRaw ? JSON.parse(linksRaw) : [];
  
  const file = formData.get("file") as File | null;
  let fileUrl = null;
  let originalFileName = null;
  
  const existing = await db.submission.findUnique({ where: { studentId_taskId: { studentId, taskId } } });

  if (file && file.size > 0) {
    if (file.size > 10 * 1024 * 1024) throw new Error("File size must not exceed 10 MB.");
    
    // We import fs dynamically to avoid issues
    const { writeFile } = require("fs/promises");
    const { join } = require("path");
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeFileName}`;
    const path = join(process.cwd(), "storage", "uploads", uniqueFileName);
    
    await writeFile(path, buffer);
    fileUrl = uniqueFileName;
    originalFileName = file.name;
  } else if (existing) {
    fileUrl = existing.fileUrl;
    originalFileName = existing.originalFileName;
  }

  await db.submission.upsert({
    where: { studentId_taskId: { studentId, taskId } },
    update: {
      content: contentText,
      studentNote,
      links,
      fileUrl,
      originalFileName,
      status: existing?.status === "GRADED" ? "GRADED" : (isLate ? "LATE" : "SUBMITTED"),
    },
    create: {
      studentId,
      taskId,
      content: contentText,
      studentNote,
      links,
      fileUrl,
      originalFileName,
      status: isLate ? "LATE" : "SUBMITTED",
      submissionType: "LINK"
    }
  });
}

import { verifyPassword, hashPassword } from "@/lib/passwords";

export async function changePassword(currentPass: string, newPass: string) {
  const studentId = await getStudentSession();
  
  const student = await db.student.findUnique({ where: { id: studentId } });
  if (!student || !student.passwordHash) {
    return { error: "Account error." };
  }

  const isValid = verifyPassword(currentPass, student.passwordHash);
  if (!isValid) {
    return { error: "Incorrect current password." };
  }

  await db.student.update({
    where: { id: studentId },
    data: { passwordHash: hashPassword(newPass) }
  });

  return { success: true };
}

export async function markMessageRead(messageId: string) {
  const studentId = await getStudentSession();
  
  await db.message.updateMany({
    where: { id: messageId, studentId },
    data: { isRead: true }
  });

  return { success: true };
}
