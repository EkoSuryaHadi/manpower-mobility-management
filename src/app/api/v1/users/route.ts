import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
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

    const newUser = await prisma.user.create({
      data: {
        email,
        fullName,
        role,
        companyId: companyId || null,
        phone: phone || null,
        passwordHash: password || "demo12345",
        isActive: true,
      },
      include: {
        company: true,
      },
    });

    // Create audit log
    try {
      await prisma.auditLog.create({
        data: {
          actorName: "System Admin",
          action: "CREATE",
          entityType: "USER",
          entityId: newUser.id,
          payloadAfter: JSON.stringify(newUser),
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      data: newUser,
      message: "User created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
