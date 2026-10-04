"use server";

import { db } from "@/lib/db";
import { AnnouncementStatus, AssignmentTargetType } from "@prisma/client";
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

export async function createAnnouncement(data: {
  title: string;
  content: string;
  status: AnnouncementStatus;
  publishedAt?: Date;
  expiresAt?: Date;
  targetType: AssignmentTargetType;
  groupId?: string;
  studentId?: string;
}) {
  await checkAdminSession();
  
  const announcement = await db.announcement.create({
    data: {
      title: data.title,
      content: data.content,
      status: data.status,
      publishedAt: data.publishedAt || (data.status === "PUBLISHED" ? new Date() : null),
      expiresAt: data.expiresAt || null,
      targets: {
        create: {
          targetType: data.targetType,
          groupId: data.groupId || null,
          studentId: data.studentId || null,
        }
      }
    }
  });

  await logAction("CREATE_ANNOUNCEMENT", `Announcement ID: ${announcement.id}`);
  revalidatePath("/admin/announcements");
  return announcement;
}
