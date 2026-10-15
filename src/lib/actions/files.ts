import { uploadFileToStorage } from "@/lib/storage";

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

    return await uploadFileToStorage(file.name, buffer, file.type);
  } catch (err: any) {
    console.error("File upload error:", err);
    return { success: false, error: err?.message || "Upload failed" };
  }
}
