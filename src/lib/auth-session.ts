import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { MMSUserRole } from "@/lib/auth";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "mms-dev-fallback-secret"
);

export interface SessionPayload {
  userId: string;
  role: MMSUserRole;
  fullName: string;
  companyId?: string;
}

export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(JWT_SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("mms-session")?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function getSessionFromRequest(req: Request): Promise<SessionPayload | null> {
  // Check Authorization header first (API clients)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return verifySession(authHeader.slice(7));
  }

  // Fallback to cookie (browser)
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/mms-session=([^;]+)/);
  if (match) {
    return verifySession(match[1]);
  }

  return null;
}
