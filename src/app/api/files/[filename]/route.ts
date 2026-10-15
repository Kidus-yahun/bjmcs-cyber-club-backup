import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import { db } from "@/lib/db";
import { getFileFromStorage } from "@/lib/storage";

export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params;
    if (!filename || filename.includes("..") || filename.includes("/")) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    // Verify auth
    const token = request.cookies.get("session")?.value;
    if (!token) return new NextResponse("Unauthorized", { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload) return new NextResponse("Unauthorized", { status: 401 });

    if (payload.role === "STUDENT") {
      const student = payload.studentId
        ? await db.student.findUnique({ where: { id: payload.studentId }, select: { isActive: true, kickedAt: true } })
        : null;
      if (!student?.isActive || student.kickedAt) return new NextResponse("Forbidden", { status: 403 });
    }

    // Retrieve file from Cloudflare R2 (or local fallback)
    const fileResult = await getFileFromStorage(filename);
    if (!fileResult.success) {
      return new NextResponse(fileResult.error || "File not found", { status: 404 });
    }

    const headers: Record<string, string> = {
      "Content-Type": fileResult.contentType,
      "Content-Disposition": `inline; filename="${filename}"`,
    };

    if (fileResult.contentLength) {
      headers["Content-Length"] = fileResult.contentLength.toString();
    }

    if (fileResult.buffer) {
      return new NextResponse(new Uint8Array(fileResult.buffer), { headers });
    }

    if (fileResult.stream) {
      return new NextResponse(fileResult.stream as any, { headers });
    }

    return new NextResponse("File content unavailable", { status: 404 });
  } catch (error) {
    console.error("File download error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
