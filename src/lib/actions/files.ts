import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
export async function uploadFile(file: File): Promise<{ success: boolean; filename?: string; error?: string }> {
  try {
    if (!file || file.size === 0) {
      return { success: false, error: "Empty file" };
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      return { success: false, error: "File too large (max 10MB)" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeFileName}`;
    
    // Store in root /storage/uploads folder
    const path = join(process.cwd(), "storage", "uploads", uniqueFileName);
    
    await writeFile(path, buffer);
    return { success: true, filename: uniqueFileName };
  } catch (err) {
    console.error("File upload error:", err);
    return { success: false, error: "Upload failed" };
  }
}
