import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";
import type { CreateWorkerInput } from "@/validators/worker.schema";

interface ListWorkersParams {
  q?: string;
  status?: string;
  companyId?: string;
  page: number;
  limit: number;
}

export const WorkerService = {
  async list({ q, status, companyId, page, limit }: ListWorkersParams) {
    const where = {
      AND: [
        q
          ? { OR: [
              { fullName: { contains: q } },
              { nik: { contains: q } },
              { employeeNo: { contains: q } },
            ] }
          : {},
        status ? { status } : {},
        companyId ? { assignments: { some: { companyId } } } : {},
      ],
    };

    const [workers, total] = await Promise.all([
      prisma.worker.findMany({
        where,
        include: {
          assignments: {
            include: { project: true, site: true, company: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          documents: { include: { documentType: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.worker.count({ where }),
    ]);

    return { workers, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  },

  async getById(id: string) {
    return prisma.worker.findUnique({
      where: { id },
      include: {
        assignments: {
          include: { project: true, site: true, company: true },
          orderBy: { createdAt: "desc" },
        },
        documents: {
          include: { documentType: true, versions: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  async create(input: CreateWorkerInput, ipAddress?: string, actor?: { id?: string; name?: string }) {
    const existing = await prisma.worker.findUnique({ where: { nik: input.nik } });
    if (existing) {
      throw new Error(`Worker dengan NIK ${input.nik} sudah terdaftar (${existing.fullName}).`);
    }

    const year = new Date().getFullYear();
    const employeeNo =
      input.employeeNo?.trim() ||
      `EMP-${year}-${Date.now().toString().slice(-6)}`;

    const worker = await prisma.worker.create({
      data: {
        fullName: input.fullName,
        nik: input.nik,
        employeeNo,
        passportNo: input.passportNo || null,
        birthDate: new Date(input.birthDate),
        birthPlace: input.birthPlace || null,
        gender: input.gender,
        nationality: input.nationality || "INDONESIAN",
        contactNumber: input.contactNumber,
        email: input.email || null,
        address: input.address || null,
        status: "ACTIVE",
        overallReadinessScore: 0.0,
      },
    });

    let assignment = null;
    if (input.companyId && input.projectId && input.siteId && input.position) {
      assignment = await prisma.workerAssignment.create({
        data: {
          workerId: worker.id,
          companyId: input.companyId,
          projectId: input.projectId,
          siteId: input.siteId,
          position: input.position,
          discipline: input.discipline || "CIVIL",
          trade: input.trade || null,
          rotationSchedule: input.rotationSchedule || "28/28",
          startDate: input.startDate ? new Date(input.startDate) : new Date(),
          status: "PLANNED",
        },
        include: { company: true, project: true, site: true },
      });
    }

    await logAuditEvent({
      actorId: actor?.id,
      actorName: actor?.name || "HR / WFM Officer",
      action: "CREATE",
      entityType: "WORKER",
      entityId: worker.id,
      payloadAfter: { worker, assignment },
      ipAddress,
    });

    return { ...worker, assignments: assignment ? [assignment] : [] };
  },
};
