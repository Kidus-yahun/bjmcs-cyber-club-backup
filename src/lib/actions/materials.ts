"use server";

import { db } from "@/lib/db";
import { MaterialStatus, AssignmentTargetType } from "@prisma/client";
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

export async function createLearningMaterial(data: {
  title: string;
  description?: string;
  category: string;
  url: string;
  resourceType: string;
  status: MaterialStatus;
  targetType: AssignmentTargetType;
  groupId?: string;
  studentId?: string;
}) {
  await checkAdminSession();
  
  const material = await db.learningMaterial.create({
    data: {
      title: data.title,
      description: data.description || null,
      category: data.category,
      url: data.url,
      resourceType: data.resourceType,
      status: data.status,
      targets: {
        create: {
          targetType: data.targetType,
          groupId: data.groupId || null,
          studentId: data.studentId || null,
        }
      }
    }
  });

  await logAction("CREATE_MATERIAL", `Material ID: ${material.id}`);
  revalidatePath("/admin/materials");
  return material;
}
