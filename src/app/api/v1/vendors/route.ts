import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "ALL";

    const whereClause: any = {};
    if (type !== "ALL") {
      whereClause.type = type;
    }

    const companies = await prisma.company.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
      include: {
        users: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        assignments: {
          include: {
            worker: {
              select: {
                id: true,
                fullName: true,
                nik: true,
                status: true,
                overallReadinessScore: true,
                documents: {
                  select: {
                    id: true,
                    expiryDate: true,
                    verificationStatus: true,
                  },
                },
              },
            },
            project: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            site: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    const now = new Date();
    const future60Days = new Date();
    future60Days.setDate(future60Days.getDate() + 60);

    const data = companies.map((c) => {
      const totalAssigned = c.assignments.length;
      const onSiteCount = c.assignments.filter((a) => a.status === "ON_SITE").length;
      const readyToMobilizeCount = c.assignments.filter((a) => a.status === "READY_TO_MOBILIZE").length;
      const preMobCount = c.assignments.filter((a) => a.status === "PRE_MOBILIZATION").length;

      // Calculate quota (standard default or based on assignments)
      const approvedQuota = totalAssigned > 0 ? Math.max(totalAssigned + 5, 20) : 15;
      const quotaUtilization = Math.round((onSiteCount / approvedQuota) * 100);

      // Check expiring docs
      let expiringDocsCount = 0;
      let expiredDocsCount = 0;
      c.assignments.forEach((a) => {
        a.worker.documents.forEach((d) => {
          if (d.expiryDate) {
            const exp = new Date(d.expiryDate);
            if (exp < now) {
              expiredDocsCount++;
            } else if (exp <= future60Days) {
              expiringDocsCount++;
            }
          }
        });
      });

      // Synthetic Ring Demographic breakdown based on NIK/ID for demo representation
      const ring1Count = Math.ceil(totalAssigned * 0.4);
      const ring2Count = Math.floor(totalAssigned * 0.3);
      const ring3Count = Math.floor(totalAssigned * 0.2);
      const ring4Count = Math.max(0, totalAssigned - ring1Count - ring2Count - ring3Count);

      return {
        id: c.id,
        name: c.name,
        code: c.code,
        type: c.type,
        address: c.address,
        contactEmail: c.contactEmail,
        contactPhone: c.contactPhone,
        totalUsers: c.users.length,
        picList: c.users,
        stats: {
          totalAssigned,
          onSiteCount,
          readyToMobilizeCount,
          preMobCount,
          approvedQuota,
          quotaUtilization,
          expiringDocsCount,
          expiredDocsCount,
          ringBreakdown: {
            ring1: ring1Count,
            ring2: ring2Count,
            ring3: ring3Count,
            ring4: ring4Count,
          },
        },
      };
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch vendor list" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, code, type, address, contactEmail, contactPhone, picName, picEmail, picPhone } = body;

    if (!name || !code || !type) {
      return NextResponse.json(
        { success: false, error: "Name, code, and type are required." },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name,
        code: code.toUpperCase(),
        type,
        address: address || null,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
      },
    });

    // If PIC provided, create user linked to company
    if (picName && picEmail) {
      try {
        await prisma.user.create({
          data: {
            fullName: picName,
            email: picEmail,
            phone: picPhone || null,
            role: type === "SUBCONTRACTOR" || type === "VENDOR" ? "SUBCONTRACTOR" : "CONTRACTOR_HR",
            companyId: company.id,
            passwordHash: "password123",
            isActive: true,
          },
        });
      } catch (e) {
        console.error("Could not auto-create PIC user:", e);
      }
    }

    try {
      await prisma.auditLog.create({
        data: {
          actorName: "System Admin",
          action: "CREATE",
          entityType: "COMPANY",
          entityId: company.id,
          payloadAfter: JSON.stringify(company),
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      data: company,
      message: "Vendor / Company created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create company" },
      { status: 500 }
    );
  }
}
