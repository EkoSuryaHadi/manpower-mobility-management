import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ROLE_PERMISSIONS, type MMSUserRole } from "@/lib/auth";
import { createSession, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/auth-session";
import { logAuditEvent, getClientIp } from "@/lib/audit";
import { errorResponse, serverErrorResponse } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

// --- Simple in-memory brute-force protection (per IP + email) ---
// NOTE: per-process only. Replace with Redis/DB-backed limiter when running multiple instances.
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;
const failedAttempts = new Map<string, { count: number; firstAt: number }>();

function isLockedOut(key: string): boolean {
  const entry = failedAttempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > LOCKOUT_WINDOW_MS) {
    failedAttempts.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILED_ATTEMPTS;
}

function recordFailure(key: string) {
  const entry = failedAttempts.get(key);
  if (!entry || Date.now() - entry.firstAt > LOCKOUT_WINDOW_MS) {
    failedAttempts.set(key, { count: 1, firstAt: Date.now() });
  } else {
    entry.count++;
  }
}

// Used to keep response timing similar when the email does not exist.
const DUMMY_HASH = bcrypt.hashSync("mms-timing-equalizer-not-a-real-password", 10);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Email dan password wajib diisi dengan format yang benar.", 422);
    }

    const { email, password } = parsed.data;
    const ip = getClientIp(req);
    const limiterKey = `${ip}|${email}`;

    if (isLockedOut(limiterKey)) {
      return errorResponse("Terlalu banyak percobaan login gagal. Coba lagi dalam 15 menit.", 429);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: { select: { name: true } } },
    });

    const passwordOk = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

    if (!user || !passwordOk || !user.isActive || !(user.role in ROLE_PERMISSIONS)) {
      recordFailure(limiterKey);
      await logAuditEvent({
        action: "LOGIN_FAILED",
        entityType: "AUTH",
        entityId: email,
        ipAddress: ip,
      });
      // Same message for every failure so attackers cannot enumerate valid emails.
      return errorResponse("Email atau password salah.", 401);
    }

    failedAttempts.delete(limiterKey);

    const token = await createSession({
      userId: user.id,
      role: user.role as MMSUserRole,
      fullName: user.fullName,
      companyId: user.companyId,
    });

    await logAuditEvent({
      actorId: user.id,
      actorName: user.fullName,
      action: "LOGIN_SUCCESS",
      entityType: "AUTH",
      entityId: user.id,
      ipAddress: ip,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        companyName: user.company?.name ?? null,
      },
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    return serverErrorResponse("auth/login", error);
  }
}
