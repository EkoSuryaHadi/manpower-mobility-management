import React from "react";
import { prisma } from "@/lib/prisma";
import { WorkersClient } from "./WorkersClient";

export const dynamic = "force-dynamic";

export default async function WorkersPage({
  searchParams,
}: {
  searchParams?: { q?: string; status?: string; company?: string };
}) {
  const query = searchParams?.q?.toLowerCase() || "";
  const statusFilter = searchParams?.status || "";

  let initialWorkers: any[] = [];
  let companies: any[] = [];
  let projects: any[] = [];
  let sites: any[] = [];

  try {
    const rawWorkers = await prisma.worker.findMany({
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
          statusFilter ? { status: statusFilter } : {},
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

    initialWorkers = rawWorkers.map((w) => ({
      ...w,
      birthDate: w.birthDate.toISOString(),
      createdAt: w.createdAt.toISOString(),
      updatedAt: w.updatedAt.toISOString(),
      assignments: w.assignments.map((a) => ({
        ...a,
        startDate: a.startDate.toISOString(),
        endDate: a.endDate ? a.endDate.toISOString() : null,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      })),
    }));

    companies = await prisma.company.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
        type: true,
      },
    });

    projects = await prisma.project.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    sites = await prisma.site.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
        projectId: true,
      },
    });
  } catch (e) {
    console.error("Error loading workers page data:", e);
  }

  return (
    <WorkersClient
      initialWorkers={initialWorkers}
      companies={companies}
      projects={projects}
      sites={sites}
    />
  );
}
