"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export async function logAction(action: string, target?: string) {
  try {
    const token = (await cookies()).get("session")?.value;
    if (!token) return;
    
    const payload = await verifyJwt(token);
    if (!payload) return;
    
    let actor = "SYSTEM";
    if (payload.role === "ADMIN") actor = "ADMIN";
    if (payload.role === "STUDENT") actor = `STUDENT:${payload.studentId}`;
    
    await db.auditLog.create({
      data: {
        actor,
        action,
        target
      }
    });
  } catch (e) {
    // Audit log should not crash main request
    console.error("Audit log failed", e);
  }
}
