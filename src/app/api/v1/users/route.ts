import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logAuditEvent, getClientIp } from "@/lib/audit";
import { requireAuth } from "@/lib/auth-guard";
import { generateTempPassword, MIN_PASSWORD_LENGTH } from "@/lib/password";
import { errorResponse, serverErrorResponse, successResponse } from "@/lib/api-utils";
import { ROLE_PERMISSIONS, type MMSUserRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req, ["MANAGE_USERS"]);
    if (auth.error) return auth.error;

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        isActive: true,
        companyId: true,
        company: {
          select: {
            id: true,
            name: true,
            code: true,
            type: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(users);
  } catch (error) {
    return serverErrorResponse("users-list", error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req, ["MANAGE_USERS"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const body = await req.json().catch(() => ({}));
    const { email, fullName, role, companyId, phone, password } = body;

    if (!email || !fullName || !role) {
      return errorResponse("Email, Full Name, and Role are required.", 400);
    }

    if (!(role in ROLE_PERMISSIONS)) {
      return errorResponse("Role tidak valid.", 422);
    }

    // Check existing email
    const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existing) {
      return errorResponse(`Email ${email} sudah terdaftar.`, 400);
    }

    const tempPassword = password?.trim() || generateTempPassword();
    if (tempPassword.length < MIN_PASSWORD_LENGTH) {
      return errorResponse(`Password minimal ${MIN_PASSWORD_LENGTH} karakter.`, 422);
    }

    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        role: role as MMSUserRole,
        companyId: companyId || null,
        phone: phone?.trim() || null,
        passwordHash,
        isActive: true,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            code: true,
            type: true,
          },
        },
      },
    });

    const { passwordHash: _, ...safeUser } = newUser;

    await logAuditEvent({
      actorId: actor.id,
      actorName: actor.fullName,
      action: "CREATE",
      entityType: "USER",
      entityId: newUser.id,
      payloadAfter: safeUser,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({
      success: true,
      data: safeUser,
      tempPassword: password ? undefined : tempPassword,
      message: "User created successfully",
    });
  } catch (error) {
    return serverErrorResponse("users-create", error);
  }
}
