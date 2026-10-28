"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { signJwt } from "@/lib/auth";
import { verifyPassword } from "@/lib/passwords";

export async function loginAction(formData: FormData) {
  const identifier = formData.get("identifier")?.toString()?.trim();
  const password = formData.get("password")?.toString();

  if (!identifier || !password) {
    return { error: "Identifier and password are required." };
  }

  let redirectTo: string | null = null;

  try {
    // 1. Try Admin (email or name, case-insensitive check if possible)
    const adminUser = await db.adminUser.findFirst({
      where: {
        OR: [
          { email: identifier },
          { email: identifier.toLowerCase() },
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
        path: "/",
      });

      // Clear legacy cookies
      cookieStore.delete("admin_session");
      cookieStore.delete("student_session");

      redirectTo = "/admin";
    } else {
      // 2. Try Student (email, application reference, or applicationId)
      const studentUser = await db.student.findFirst({
        where: {
          OR: [
            { email: identifier },
            { email: identifier.toLowerCase() },
            { application: { reference: identifier } },
            { applicationId: identifier }
          ]
        },
        include: { application: true }
      });

      if (studentUser) {
        if (!studentUser.passwordHash || !verifyPassword(password, studentUser.passwordHash)) {
          return { error: "Invalid credentials." };
        }
        if (studentUser.kickedAt) {
          return {
            blocked: true,
            error: "Your Cyber Club account has been deactivated by an administrator. Please contact the Cyber Club administrators if you believe this was a mistake.",
          };
        }
        if (!studentUser.isActive) {
          return { error: "Account is not active." };
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

        redirectTo = "/student";
      } else {
        return { error: "Invalid credentials." };
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred." };
  }

  if (redirectTo) {
    redirect(redirectTo);
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("admin_session");
  cookieStore.delete("student_session");
  redirect("/login");
}
