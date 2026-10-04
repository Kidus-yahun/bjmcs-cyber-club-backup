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

export async function toggleRegistrationStatus(isOpen: boolean) {
  try {
    await checkAdminSession();
    
    await db.registrationSettings.upsert({
      where: { id: "default" },
      update: { isOpen },
      create: { id: "default", isOpen }
    });

    await logAction(isOpen ? "OPEN_REGISTRATION" : "CLOSE_REGISTRATION", "Registration Settings");
    
    revalidatePath("/");
    revalidatePath("/register");
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to toggle registration:", error);
    return { success: false, error: "Failed to update registration status." };
  }
}
