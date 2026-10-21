import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";
import type { CreateWorkerInput } from "@/validators/worker.schema";
import type { UploadWorkerDocumentInput } from "@/validators/document.schema";
import { calculateWorkerReadiness } from "@/lib/readiness-engine";

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

  async checkDuplicate({ nik, fullName }: { nik?: string; fullName?: string }) {
    const cleanNik = nik?.trim();
    const cleanName = fullName?.trim();

    let nikMatch = null;
    let nameMatch = null;

    if (cleanNik && cleanNik.length >= 10) {
      const found = await prisma.worker.findUnique({
        where: { nik: cleanNik },
        include: {
          assignments: {
            include: { company: true, project: true, site: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      if (found) {
        const lastAssign = found.assignments[0];
        nikMatch = {
          id: found.id,
          fullName: found.fullName,
          nik: found.nik,
          employeeNo: found.employeeNo,
          status: found.status,
          isActive: found.status === "ACTIVE",
          currentAssignment: lastAssign
            ? {
                companyName: lastAssign.company.name,
                projectName: lastAssign.project.name,
                siteName: lastAssign.site.name,
                position: lastAssign.position,
                status: lastAssign.status,
              }
            : null,
        };
      }
    }

    if (cleanName && cleanName.length >= 2) {
      const activeWorkers = await prisma.worker.findMany({
        where: { status: "ACTIVE" },
        include: {
          assignments: {
            include: { company: true, project: true, site: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      const found = activeWorkers.find(
        (w) => w.fullName.trim().toLowerCase() === cleanName.toLowerCase() && w.id !== nikMatch?.id
      );

      if (found) {
        const lastAssign = found.assignments[0];
        nameMatch = {
          id: found.id,
          fullName: found.fullName,
          nik: found.nik,
          employeeNo: found.employeeNo,
          status: found.status,
          isActive: true,
          currentAssignment: lastAssign
            ? {
                companyName: lastAssign.company.name,
                projectName: lastAssign.project.name,
                siteName: lastAssign.site.name,
                position: lastAssign.position,
                status: lastAssign.status,
              }
            : null,
        };
      }
    }

    return {
      hasDuplicate: Boolean((nikMatch && nikMatch.isActive) || nameMatch),
      duplicateNik: Boolean(nikMatch && nikMatch.isActive),
      duplicateName: Boolean(nameMatch),
      nikMatch,
      nameMatch,
    };
  },

  async create(input: CreateWorkerInput, ipAddress?: string, actor?: { id?: string; name?: string }) {
    const cleanNik = input.nik.trim();
    const cleanName = input.fullName.trim();

    // 1. Validasi NIK unik dan status aktif
    const existingNik = await prisma.worker.findUnique({
      where: { nik: cleanNik },
      include: {
        assignments: {
          include: { company: true, project: true, site: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (existingNik) {
      if (existingNik.status === "ACTIVE") {
        const lastAssign = existingNik.assignments[0];
        const locationInfo = lastAssign
          ? `${lastAssign.company.name} di Proyek ${lastAssign.project.name} (${lastAssign.site.name}) sebagai ${lastAssign.position} (Status: ${lastAssign.status})`
          : "penugasan aktif";
        throw new Error(
          `Pekerja dengan NIK ${cleanNik} (${existingNik.fullName}) masih terdaftar dan berstatus AKTIF BEKERJA di ${locationInfo}. Pendaftaran baru tidak dapat dilanjutkan.`
        );
      }
      throw new Error(`Worker dengan NIK ${cleanNik} sudah terdaftar (${existingNik.fullName}) dengan status ${existingNik.status}.`);
    }

    // 2. Validasi Nama dengan status aktif (bila belum dikonfirmasi)
    if (!input.allowDuplicateName) {
      const activeWorkers = await prisma.worker.findMany({
        where: { status: "ACTIVE" },
        include: {
          assignments: {
            include: { company: true, project: true, site: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      const existingActiveName = activeWorkers.find(
        (w) => w.fullName.trim().toLowerCase() === cleanName.toLowerCase()
      );

      if (existingActiveName) {
        const lastAssign = existingActiveName.assignments[0];
        const locationInfo = lastAssign
          ? `${lastAssign.company.name} di Proyek ${lastAssign.project.name} (${lastAssign.site.name}) sebagai ${lastAssign.position}`
          : "penugasan aktif";
        throw new Error(
          `Pekerja dengan nama "${existingActiveName.fullName}" masih berstatus AKTIF BEKERJA di ${locationInfo} (NIK: ${existingActiveName.nik}). Jika ini adalah individu berbeda, mohon aktifkan centang konfirmasi nama serupa.`
        );
      }
    }

    const year = new Date().getFullYear();
    const employeeNo =
      input.employeeNo?.trim() ||
      `EMP-${year}-${Date.now().toString().slice(-6)}`;

    const worker = await prisma.worker.create({
      data: {
        fullName: cleanName,
        nik: cleanNik,
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

  async uploadDocument(
    workerId: string,
    input: UploadWorkerDocumentInput,
    actor?: { id?: string; name?: string },
    ipAddress?: string
  ) {
    const worker = await prisma.worker.findUnique({
      where: { id: workerId },
      include: {
        assignments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!worker) {
      throw new Error("Worker tidak ditemukan");
    }

    const docType = await prisma.documentType.findUnique({
      where: { id: input.documentTypeId },
    });
    if (!docType) {
      throw new Error("Tipe dokumen tidak valid atau tidak ditemukan");
    }

    // Check if worker already has a document of this type
    const existingDoc = await prisma.workerDocument.findFirst({
      where: {
        workerId,
        documentTypeId: input.documentTypeId,
      },
    });

    const issueDate = new Date(input.issueDate);
    const expiryDate = input.expiryDate ? new Date(input.expiryDate) : null;

    let doc;
    if (existingDoc) {
      doc = await prisma.workerDocument.update({
        where: { id: existingDoc.id },
        data: {
          documentNumber: input.documentNumber.trim(),
          issueDate,
          expiryDate,
          verificationStatus: "PENDING",
          verifierRemarks: null,
          verifiedAt: null,
          verifierId: null,
        },
        include: { documentType: true },
      });
    } else {
      doc = await prisma.workerDocument.create({
        data: {
          workerId,
          documentTypeId: input.documentTypeId,
          documentNumber: input.documentNumber.trim(),
          issueDate,
          expiryDate,
          verificationStatus: "PENDING",
        },
        include: { documentType: true },
      });
    }

    // Create Document Version
    const fileName = input.fileName || `${docType.code.toLowerCase()}_sample.pdf`;
    const fileUrl = input.fileUrl || `/uploads/${fileName}`;
    const fileSize = input.fileSize || 250000;
    const mimeType = input.mimeType || "application/pdf";

    await prisma.documentVersion.create({
      data: {
        workerDocumentId: doc.id,
        fileName,
        fileUrl,
        fileSize,
        mimeType,
        uploadedById: actor?.id,
      },
    });

    // Recalculate readiness if worker has active assignment
    let updatedReadiness = worker.overallReadinessScore;
    const currentAssignment = worker.assignments[0];
    if (currentAssignment) {
      try {
        const summary = await calculateWorkerReadiness(currentAssignment.id);
        updatedReadiness = summary.readinessScore;
      } catch (err) {
        // Continue if calculation fails
      }
    }

    await logAuditEvent({
      actorId: actor?.id,
      actorName: actor?.name || "System User",
      action: "UPLOAD",
      entityType: "DOCUMENT",
      entityId: doc.id,
      payloadAfter: { doc, fileName, readinessScore: updatedReadiness },
      ipAddress,
    });

    return {
      document: doc,
      overallReadinessScore: updatedReadiness,
    };
  },
};
