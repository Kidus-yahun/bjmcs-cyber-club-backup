"use server";

import { db } from "@/lib/db";
import { TaskStatus, AssignmentTargetType, SubmissionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

async function checkAdminSession() {
  const token = (await cookies()).get("session")?.value;
  if (!token) throw new Error("Unauthorized");
  const payload = await verifyJwt(token);
  if (!payload || payload.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function createTask(data: {
  title: string;
  description: string;
  instructions: string;
  deadline: Date;
  status: TaskStatus;
  allowLateSubmissions: boolean;
  attachmentUrl?: string;
  targetType: AssignmentTargetType;
  groupId?: string;
  studentId?: string;
}) {
  await checkAdminSession();
  const task = await db.task.create({
    data: {
      title: data.title,
      description: data.description,
      instructions: data.instructions,
      deadline: data.deadline,
      status: data.status,
      allowLateSubmissions: data.allowLateSubmissions,
      attachmentUrl: data.attachmentUrl || null,
      assignments: {
        create: {
          targetType: data.targetType,
          groupId: data.groupId || null,
          studentId: data.studentId || null,
        }
      }
    }
  });

  revalidatePath("/admin/tasks");
  return task;
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  await checkAdminSession();
  await db.task.update({
    where: { id: taskId },
    data: { status }
  });
  revalidatePath("/admin/tasks");
}

export async function gradeSubmission(submissionId: string, points: number, feedback: string) {
  await checkAdminSession();
  await db.$transaction([
    db.score.upsert({
      where: { submissionId },
      update: { points, feedback },
      create: { submissionId, points, feedback }
    }),
    db.submission.update({
      where: { id: submissionId },
      data: { status: SubmissionStatus.GRADED }
    })
  ]);
  
  revalidatePath("/admin/tasks");
}
