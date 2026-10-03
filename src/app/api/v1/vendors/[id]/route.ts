import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { errorResponse, serverErrorResponse, successResponse } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req, ["VIEW_VENDOR_DASHBOARD", "MANAGE_VENDORS"]);
    if (auth.error) return auth.error;
    const actor = auth.user;

    const { id } = params;

    // Subcontractor can only view their own vendor dashboard
    if (actor.role === "SUBCONTRACTOR" && actor.companyId && actor.companyId !== id) {
      return errorResponse("Anda tidak memiliki akses ke vendor ini.", 403);
    }

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
          },
        },
        assignments: {
          orderBy: { createdAt: "desc" },
          include: {
            worker: {
              include: {
                documents: {
                  include: {
                    documentType: true,
                  },
                },
              },
            },
            project: true,
            site: true,
            preMobilizations: {
              take: 1,
              orderBy: { createdAt: "desc" },
            },
          },
        },
        projects: true,
      },
    });

    if (!company) {
      return errorResponse("Company / Vendor tidak ditemukan.", 404);
    }

    const now = new Date();
    const future60Days = new Date();
    future60Days.setDate(future60Days.getDate() + 60);

    const totalAssigned = company.assignments.length;
    const onSiteCount = company.assignments.filter((a) => a.status === "ON_SITE").length;
    const readyToMobilizeCount = company.assignments.filter((a) => a.status === "READY_TO_MOBILIZE").length;
    const preMobCount = company.assignments.filter((a) => a.status === "PRE_MOBILIZATION").length;
    const plannedCount = company.assignments.filter((a) => a.status === "PLANNED").length;

    const approvedQuota = totalAssigned > 0 ? Math.max(totalAssigned + 8, 25) : 20;
    const quotaUtilization = Math.round((onSiteCount / approvedQuota) * 100);

    const expiredDocs: any[] = [];
    const expiringSoonDocs: any[] = [];

    company.assignments.forEach((a) => {
      a.worker.documents.forEach((d) => {
        if (d.expiryDate) {
          const exp = new Date(d.expiryDate);
          const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const docItem = {
            id: d.id,
            workerId: a.worker.id,
            workerName: a.worker.fullName,
            nik: a.worker.nik,
            documentType: d.documentType.name,
            documentCode: d.documentType.code,
            documentNumber: d.documentNumber,
            expiryDate: d.expiryDate,
            daysRemaining: diffDays,
            position: a.position,
            siteName: a.site.name,
          };

          if (diffDays < 0) {
            expiredDocs.push(docItem);
          } else if (diffDays <= 60) {
            expiringSoonDocs.push(docItem);
          }
        }
      });
    });

    const ring1 = Math.ceil(totalAssigned * 0.45);
    const ring2 = Math.floor(totalAssigned * 0.25);
    const ring3 = Math.floor(totalAssigned * 0.20);
    const ring4 = Math.max(0, totalAssigned - ring1 - ring2 - ring3);

    return successResponse({
      ...company,
      stats: {
        totalAssigned,
        onSiteCount,
        readyToMobilizeCount,
        preMobCount,
        plannedCount,
        approvedQuota,
        quotaUtilization,
        expiredDocs,
        expiringSoonDocs,
        ringBreakdown: {
          ring1,
          ring2,
          ring3,
          ring4,
          ring1Percent: totalAssigned > 0 ? Math.round((ring1 / totalAssigned) * 100) : 0,
          ring2Percent: totalAssigned > 0 ? Math.round((ring2 / totalAssigned) * 100) : 0,
          ring3Percent: totalAssigned > 0 ? Math.round((ring3 / totalAssigned) * 100) : 0,
          ring4Percent: totalAssigned > 0 ? Math.round((ring4 / totalAssigned) * 100) : 0,
        },
      },
    });
  } catch (error) {
    return serverErrorResponse("vendor-detail", error);
  }
}
