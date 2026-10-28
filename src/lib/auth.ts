import { SignJWT, jwtVerify } from "jose";

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || "bgmcs-cyber-club-super-secret-jwt-key-2026-production-fallback";
  return new TextEncoder().encode(secret);
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
