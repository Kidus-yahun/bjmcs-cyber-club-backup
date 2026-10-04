"use server";

import { db } from "@/lib/db";
import { AttendanceStatus, SessionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

async function checkAdminSession() {
  const token = (await cookies()).get("session")?.value;
  if (!token) throw new Error("Unauthorized");
  const payload = await verifyJwt(token);
  if (!payload || payload.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function createAttendanceSession(data: { date: Date, title: string, groupId?: string }) {
  await checkAdminSession();
  // Prevent duplicate for same date/title/group
  const startOfDay = new Date(data.date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(data.date);
  endOfDay.setHours(23, 59, 59, 999);

  const existing = await db.attendanceSession.findFirst({
    where: {
      title: data.title,
      groupId: data.groupId || null,
      date: {
        gte: startOfDay,
        lte: endOfDay
      }
    }
  });

  if (existing) {
    throw new Error("An attendance session with this title already exists for this day.");
  }

  const session = await db.attendanceSession.create({
    data: {
      date: data.date,
      title: data.title,
      groupId: data.groupId || null,
      status: SessionStatus.OPEN
    }
  });
  revalidatePath("/admin/attendance");
  return session;
}

export async function updateSessionStatus(sessionId: string, status: SessionStatus) {
  await checkAdminSession();
  await db.attendanceSession.update({
    where: { id: sessionId },
    data: { status }
  });
  revalidatePath("/admin/attendance");
}

export async function markAttendance(sessionId: string, studentId: string, status: AttendanceStatus, notes?: string) {
  await checkAdminSession();
  await db.attendance.upsert({
    where: {
      studentId_sessionId: {
        studentId,
        sessionId
      }
    },
    update: {
      status,
      notes
    },
    create: {
      studentId,
      sessionId,
      status,
      notes,
    }
  });
  revalidatePath("/admin/attendance");
}

export async function deleteAttendanceSession(sessionId: string) {
  await checkAdminSession();
  await db.attendanceSession.delete({
    where: { id: sessionId }
  });
  revalidatePath("/admin/attendance");
}
