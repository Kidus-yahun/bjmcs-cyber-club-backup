import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_dev_secret_please_change_in_prod";
const KEY = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  adminId?: string;
  studentId?: string;
  email: string;
  role: "ADMIN" | "STUDENT";
}

export async function signJwt(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(KEY);
}

export async function verifyJwt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, KEY);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}
