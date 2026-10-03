import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { errorResponse, serverErrorResponse, successResponse } from "@/lib/api-utils";
import { logAuditEvent, getClientIp } from "@/lib/audit";
import bcrypt from "bcryptjs";
import { generateTempPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req, ["VIEW_VENDOR_DASHBOARD", "MANAGE_VENDORS"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "ALL";

    const whereClause: any = {};
    if (type !== "ALL") {
      whereClause.type = type;
    }

    // Role isolation: Subcontractors only see their own company
    if (actor.role === "SUBCONTRACTOR" && actor.companyId) {
      whereClause.id = actor.companyId;
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

      const approvedQuota = totalAssigned > 0 ? Math.max(totalAssigned + 5, 20) : 15;
      const quotaUtilization = Math.round((onSiteCount / approvedQuota) * 100);

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

    return successResponse(data);
  } catch (error) {
    return serverErrorResponse("vendors-list", error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req, ["MANAGE_VENDORS"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const body = await req.json().catch(() => ({}));
    const { name, code, type, address, contactEmail, contactPhone, picName, picEmail, picPhone } = body;

    if (!name || !code || !type) {
      return errorResponse("Name, code, and type are required.", 400);
    }

    const cleanCode = String(code).trim().toUpperCase();
    const existing = await prisma.company.findUnique({ where: { code: cleanCode } });
    if (existing) {
      return errorResponse(`Kode vendor ${cleanCode} sudah digunakan.`, 400);
    }

    const company = await prisma.company.create({
      data: {
        name: String(name).trim(),
        code: cleanCode,
        type: String(type).trim(),
        address: address?.trim() || null,
        contactEmail: contactEmail?.trim() || null,
        contactPhone: contactPhone?.trim() || null,
      },
    });

    // If PIC provided, create user linked to company with secure temp password
    let picUser = null;
    let tempPassword: string | undefined;

    if (picName && picEmail) {
      try {
        const cleanEmail = String(picEmail).trim().toLowerCase();
        tempPassword = generateTempPassword();
        const passwordHash = await bcrypt.hash(tempPassword, 10);

        picUser = await prisma.user.create({
          data: {
            fullName: String(picName).trim(),
            email: cleanEmail,
            phone: picPhone?.trim() || null,
            role: type === "SUBCONTRACTOR" || type === "VENDOR" ? "SUBCONTRACTOR" : "CONTRACTOR_HR",
            companyId: company.id,
            passwordHash,
            isActive: true,
          },
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        });
      } catch (e) {
        console.error("Could not auto-create PIC user:", e);
      }
    }

    await logAuditEvent({
      actorId: actor.id,
      actorName: actor.fullName,
      action: "CREATE",
      entityType: "COMPANY",
      entityId: company.id,
      payloadAfter: { company, picCreated: !!picUser },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({
      success: true,
      data: company,
      picUser,
      picTempPassword: tempPassword,
      message: "Vendor / Company created successfully",
    });
  } catch (error) {
    return serverErrorResponse("vendors-create", error);
  }
}
