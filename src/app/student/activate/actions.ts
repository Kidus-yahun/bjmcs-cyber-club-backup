"use server";

import { db } from "@/lib/db";
import { hashPassword } from "@/lib/passwords";
import { signJwt } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function activateAccount(token: string, password: string) {
  try {
    const student = await db.student.findUnique({
      where: { activationToken: token }
    });

    if (!student || (student.activationExpires && student.activationExpires < new Date())) {
      return { error: "Invalid or expired activation token." };
    }

    // Update account
    const updatedStudent = await db.student.update({
      where: { id: student.id },
      data: {
        passwordHash: hashPassword(password),
        isActive: true,
        activationToken: null,
        activationExpires: null,
      }
    });

    // Auto-login
    const jwt = await signJwt({
      studentId: updatedStudent.id,
      email: updatedStudent.email,
      role: "STUDENT"
    });

    (await cookies()).set("session", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Activation error:", error);
    return { error: "An unexpected error occurred during activation." };
  }

  redirect("/student");
}
