import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const status = searchParams.get("status") || "";
    const companyId = searchParams.get("companyId") || "";

    const workers = await prisma.worker.findMany({
      where: {
        AND: [
          query
            ? {
                OR: [
                  { fullName: { contains: query } },
                  { nik: { contains: query } },
                  { employeeNo: { contains: query } },
                ],
              }
            : {},
          status ? { status } : {},
          companyId
            ? {
                assignments: {
                  some: { companyId },
                },
              }
            : {},
        ],
      },
      include: {
        assignments: {
          include: {
            project: true,
            site: true,
            company: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        documents: {
          include: { documentType: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: workers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch workers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      nik,
      employeeNo,
      passportNo,
      birthDate,
      birthPlace,
      gender,
      nationality,
      contactNumber,
      email,
      address,
      companyId,
      projectId,
      siteId,
      position,
      discipline,
      trade,
      rotationSchedule,
      startDate,
    } = body;

    // Validation
    if (!fullName || !nik || !birthDate || !gender || !contactNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Full Name, NIK, Birth Date, Gender, and Contact Number are required.",
        },
        { status: 400 }
      );
    }

    // Check duplicate NIK
    const existingNik = await prisma.worker.findUnique({
      where: { nik },
    });
    if (existingNik) {
      return NextResponse.json(
        {
          success: false,
          error: `Worker dengan NIK ${nik} sudah terdaftar (${existingNik.fullName}).`,
        },
        { status: 400 }
      );
    }

    // Generate Employee No if not provided
    const finalEmployeeNo =
      employeeNo ||
      `EMP-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}${Math.floor(100 + Math.random() * 900)}`;

    const newWorker = await prisma.worker.create({
      data: {
        fullName,
        nik,
        employeeNo: finalEmployeeNo,
        passportNo: passportNo || null,
        birthDate: new Date(birthDate),
        birthPlace: birthPlace || null,
        gender: gender || "MALE",
        nationality: nationality || "INDONESIAN",
        contactNumber,
        email: email || null,
        address: address || null,
        status: "ACTIVE",
        overallReadinessScore: 0.0,
      },
    });

    // Create Initial Assignment if company & project provided
    let createdAssignment: any = null;
    if (companyId && projectId && siteId && position) {
      createdAssignment = await prisma.workerAssignment.create({
        data: {
          workerId: newWorker.id,
          companyId,
          projectId,
          siteId,
          position,
          discipline: discipline || "CIVIL",
          trade: trade || null,
          rotationSchedule: rotationSchedule || "28/28",
          startDate: startDate ? new Date(startDate) : new Date(),
          status: "PLANNED",
        },
        include: {
          company: true,
          project: true,
          site: true,
        },
      });
    }

    // Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          actorName: "HR / WFM Officer",
          action: "CREATE",
          entityType: "WORKER",
          entityId: newWorker.id,
          payloadAfter: JSON.stringify({ worker: newWorker, assignment: createdAssignment }),
          ipAddress: getClientIp(req),
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      data: {
        ...newWorker,
        assignments: createdAssignment ? [createdAssignment] : [],
      },
      message: "Worker berhasil didaftarkan ke Master Manpower!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to register worker" },
      { status: 500 }
    );
  }
}
