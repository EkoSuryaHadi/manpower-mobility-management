import React from "react";
import { prisma } from "@/lib/prisma";
import { VendorManagementClient } from "./VendorManagementClient";

export const dynamic = "force-dynamic";

export default async function VendorsPage() {
  let companiesWithStats: any[] = [];

  try {
    const rawCompanies = await prisma.company.findMany({
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
                  },
                },
              },
            },
            site: true,
          },
        },
      },
    });

    const now = new Date();
    const future60Days = new Date();
    future60Days.setDate(future60Days.getDate() + 60);

    companiesWithStats = rawCompanies.map((c) => {
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
  } catch (error) {
    console.error("Error loading vendors:", error);
  }

  return <VendorManagementClient initialCompanies={companiesWithStats} />;
}
