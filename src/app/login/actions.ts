"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { signJwt } from "@/lib/auth";
import { verifyPassword } from "@/lib/passwords";

export async function loginAction(formData: FormData) {
  const identifier = formData.get("identifier")?.toString();
  const password = formData.get("password")?.toString();

  if (!identifier || !password) {
    return { error: "Identifier and password are required." };
  }

  try {
    // 1. Try Admin (email or name)
    const adminUser = await db.adminUser.findFirst({
      where: {
        OR: [
          { email: identifier },
          { name: identifier }
        ]
      }
    });

    if (adminUser) {
      if (!verifyPassword(password, adminUser.passwordHash)) {
        return { error: "Invalid credentials." };
      }

      const token = await signJwt({ adminId: adminUser.id, email: adminUser.email, role: "ADMIN" });
      
      const cookieStore = await cookies();
      cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        // No maxAge creates a session cookie (expires on browser close)
        path: "/",
      });

      // Clear legacy cookies
      cookieStore.delete("admin_session");
      cookieStore.delete("student_session");

      redirect("/admin");
    }

    // 2. Try Student (email, application reference, or applicationId)
    const studentUser = await db.student.findFirst({
      where: {
        OR: [
          { email: identifier },
          { application: { reference: identifier } },
          { applicationId: identifier }
        ]
      },
      include: { application: true }
    });

    if (studentUser) {
      if (!studentUser.isActive) {
        return { error: "Account is not active." };
      }
      if (!studentUser.passwordHash || !verifyPassword(password, studentUser.passwordHash)) {
        return { error: "Invalid credentials." };
      }

      const token = await signJwt({ studentId: studentUser.id, email: studentUser.email, role: "STUDENT" });
      
      const cookieStore = await cookies();
      cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      // Clear legacy cookies
      cookieStore.delete("admin_session");
      cookieStore.delete("student_session");

      await db.student.update({
        where: { id: studentUser.id },
        data: { lastLoginAt: new Date() }
      });

      redirect("/student");
    }

    // 3. If neither matched
    return { error: "Invalid credentials." };

  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Login error:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("admin_session");
  cookieStore.delete("student_session");
  redirect("/login");
}
