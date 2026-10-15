import { SignJWT, jwtVerify } from "jose";

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  
  if (process.env.NODE_ENV === "production") {
    if (!secret || secret === "fallback_dev_secret_please_change_in_prod") {
      throw new Error(
        "CRITICAL SECURITY CONFIGURATION ERROR: JWT_SECRET must be set to a strong random key in production environment variables."
      );
    }
    return new TextEncoder().encode(secret);
  }

  return new TextEncoder().encode(secret || "fallback_dev_secret_please_change_in_prod");
}

export interface SessionPayload {
  adminId?: string;
  studentId?: string;
  email: string;
  role: "ADMIN" | "STUDENT";
}

export async function signJwt(payload: SessionPayload): Promise<string> {
  const key = getJwtSecretKey();
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function verifyJwt(token: string): Promise<SessionPayload | null> {
  try {
    const key = getJwtSecretKey();
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}
