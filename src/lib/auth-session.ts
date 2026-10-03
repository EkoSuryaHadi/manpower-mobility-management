import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { MMSUserRole } from "@/lib/auth";

export const SESSION_COOKIE = "mms-session";
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours

const DEV_FALLBACK_SECRET = "mms-dev-only-insecure-secret-never-use-in-production";

/**
 * Resolve the JWT signing key lazily so a missing secret fails loudly in production
 * instead of silently falling back to a guessable value.
 */
function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET must be set (minimum 32 characters) in production.");
    }
    return new TextEncoder().encode(secret || DEV_FALLBACK_SECRET);
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: string;
  role: MMSUserRole;
  fullName: string;
  companyId?: string | null;
}

export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ["HS256"] });
    if (typeof payload.userId !== "string" || typeof payload.role !== "string") return null;
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
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
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  if (match) {
    return verifySession(decodeURIComponent(match[1]));
  }

  return null;
}
