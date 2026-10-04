import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { createReadStream, existsSync } from "fs";
import { stat } from "fs/promises";
import { verifyJwt } from "@/lib/auth";

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

    // Both Admin and Students can access files for now (Admin checks student submissions, Student checks their own/project files)
    
    const filePath = join(process.cwd(), "storage", "uploads", filename);
    if (!existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileStat = await stat(filePath);
    
    // Determine content type based on extension
    let contentType = "application/octet-stream";
    if (filename.endsWith(".pdf")) contentType = "application/pdf";
    else if (filename.match(/\.(jpg|jpeg)$/i)) contentType = "image/jpeg";
    else if (filename.match(/\.png$/i)) contentType = "image/png";

    // Read file stream
    const stream = createReadStream(filePath);
    
    // We cast to any because Next.js NextResponse can accept node readable streams in Node.js runtime
    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileStat.size.toString(),
        "Content-Disposition": `inline; filename="${filename}"`
      },
    });
  } catch (error) {
    console.error("File download error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
