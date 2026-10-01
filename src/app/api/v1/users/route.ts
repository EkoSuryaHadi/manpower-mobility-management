import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getClientIp } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, fullName, role, companyId, phone, password } = body;

    if (!email || !fullName || !role) {
      return NextResponse.json(
        { success: false, error: "Email, Full Name, and Role are required." },
        { status: 400 }
      );
    }

    // Check existing email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Email ${email} sudah terdaftar.` },
        { status: 400 }
      );
    }

    const rawPassword = password || "ChangeMe123!";
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        fullName,
        role,
        companyId: companyId || null,
        phone: phone || null,
        passwordHash,
        isActive: true,
      },
      include: {
        company: true,
      },
    });

    const { passwordHash: _, ...safeUser } = newUser;

    // Create audit log with IP
    try {
      await prisma.auditLog.create({
        data: {
          actorName: "System Admin",
          action: "CREATE",
          entityType: "USER",
          entityId: newUser.id,
          payloadAfter: JSON.stringify(safeUser),
          ipAddress: getClientIp(req),
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      data: safeUser,
      message: "User created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
