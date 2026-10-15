import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { writeFile, readFile, stat, unlink, mkdir } from "fs/promises";
import { existsSync, createReadStream } from "fs";
import { join } from "path";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

export function isR2Configured(): boolean {
  return Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);
}

function getR2Client(): S3Client {
  if (!isR2Configured()) {
    throw new Error("Cloudflare R2 is not configured in environment variables.");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID!,
      secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
  });
}

function getMimeType(filename: string): string {
  if (filename.endsWith(".pdf")) return "application/pdf";
  if (filename.match(/\.(jpg|jpeg)$/i)) return "image/jpeg";
  if (filename.match(/\.png$/i)) return "image/png";
  if (filename.match(/\.zip$/i)) return "application/zip";
  if (filename.match(/\.tar\.gz$/i)) return "application/gzip";
  if (filename.match(/\.txt$/i)) return "text/plain";
  return "application/octet-stream";
}

export async function uploadFileToStorage(
  originalFileName: string,
  buffer: Buffer,
  mimeType?: string
): Promise<{ success: boolean; filename?: string; error?: string }> {
  try {
    const safeFileName = originalFileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeFileName}`;
    const contentType = mimeType || getMimeType(originalFileName);

    if (isR2Configured()) {
      const client = getR2Client();
      await client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: uniqueFileName,
          Body: buffer,
          ContentType: contentType,
        })
      );
      return { success: true, filename: uniqueFileName };
    }

    // Fallback for local development if R2 credentials are not set
    const uploadDir = join(process.cwd(), "storage", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    const localPath = join(uploadDir, uniqueFileName);
    await writeFile(localPath, buffer);

    return { success: true, filename: uniqueFileName };
  } catch (error: any) {
    console.error("Storage upload error:", error);
    return { success: false, error: error?.message || "File upload failed" };
  }
}

export async function getFileFromStorage(filename: string): Promise<{
  success: boolean;
  stream?: any;
  buffer?: Buffer;
  contentType: string;
  contentLength?: number;
  error?: string;
}> {
  try {
    if (filename.includes("..") || filename.includes("/")) {
      return { success: false, error: "Invalid filename", contentType: "text/plain" };
    }

    const contentType = getMimeType(filename);

    if (isR2Configured()) {
      const client = getR2Client();
      const response = await client.send(
        new GetObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: filename,
        })
      );

      // Convert R2 response stream to Web ReadableStream or Node buffer
      const byteArray = await response.Body?.transformToByteArray();
      if (!byteArray) {
        return { success: false, error: "Empty object from storage", contentType };
      }

      const buffer = Buffer.from(byteArray);
      return {
        success: true,
        buffer,
        contentType: response.ContentType || contentType,
        contentLength: response.ContentLength || buffer.length,
      };
    }

    // Fallback for local development
    const localPath = join(process.cwd(), "storage", "uploads", filename);
    if (!existsSync(localPath)) {
      return { success: false, error: "File not found", contentType };
    }

    const fileStat = await stat(localPath);
    const stream = createReadStream(localPath);

    return {
      success: true,
      stream,
      contentType,
      contentLength: fileStat.size,
    };
  } catch (error: any) {
    console.error("Storage get error:", error);
    return { success: false, error: error?.message || "File retrieval failed", contentType: "text/plain" };
  }
}
