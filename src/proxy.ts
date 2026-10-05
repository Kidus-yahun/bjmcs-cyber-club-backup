import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/auth";
import { db } from "@/lib/db";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let them activate without token
  if (pathname.startsWith("/student/activate")) {
    return NextResponse.next();
  }

  // Handle old login paths by redirecting to the unified login page
  if (pathname === "/admin/login" || pathname === "/student/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect /admin and /student routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/student")) {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = await verifyJwt(token);

    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("session");
      return response;
    }

    if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/student", request.url));
    }

    if (pathname.startsWith("/student") && payload.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (pathname.startsWith("/student") && payload.role === "STUDENT") {
      const student = payload.studentId
        ? await db.student.findUnique({ where: { id: payload.studentId }, select: { isActive: true, kickedAt: true } })
        : null;

      if (!student || !student.isActive || student.kickedAt) {
        const response = NextResponse.redirect(new URL("/login?blocked=1", request.url));
        response.cookies.delete("session");
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};
