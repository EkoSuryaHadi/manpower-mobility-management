/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WorkerService } from "@/services/worker.service";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    worker: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    documentType: {
      findUnique: vi.fn(),
    },
    workerDocument: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    documentVersion: {
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/audit", () => ({
  logAuditEvent: vi.fn().mockResolvedValue({}),
}));

vi.mock("@/lib/readiness-engine", () => ({
  calculateWorkerReadiness: vi.fn().mockResolvedValue({
    readinessScore: 50,
  }),
}));

describe("WorkerService.uploadDocument", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockWorker = {
    id: "worker-eko",
    fullName: "Eko Suryahadi",
    overallReadinessScore: 0,
    assignments: [
      { id: "assign-1", status: "PLANNED" },
    ],
  };

  const mockDocType = {
    id: "dt-ktp",
    code: "DOC-ID-KTP",
    name: "Kartu Tanda Penduduk (KTP)",
  };

  it("creates new document and version with PENDING status", async () => {
    (prisma.worker.findUnique as any).mockResolvedValue(mockWorker);
    (prisma.documentType.findUnique as any).mockResolvedValue(mockDocType);
    (prisma.workerDocument.findFirst as any).mockResolvedValue(null);
    (prisma.workerDocument.create as any).mockResolvedValue({
      id: "doc-1",
      workerId: "worker-eko",
      documentTypeId: "dt-ktp",
      documentNumber: "6472589745580001",
      verificationStatus: "PENDING",
      documentType: mockDocType,
    });
    (prisma.documentVersion.create as any).mockResolvedValue({
      id: "ver-1",
      fileName: "ktp_sample.pdf",
    });

    const result = await WorkerService.uploadDocument(
      "worker-eko",
      {
        documentTypeId: "dt-ktp",
        documentNumber: "6472589745580001",
        issueDate: "2020-01-01",
        expiryDate: null,
      },
      { id: "user-1", name: "Admin" }
    );

    expect(prisma.workerDocument.create).toHaveBeenCalled();
    expect(prisma.documentVersion.create).toHaveBeenCalled();
    expect(result.document.verificationStatus).toBe("PENDING");
    expect(result.overallReadinessScore).toBe(50);
  });

  it("updates existing document if re-uploaded", async () => {
    (prisma.worker.findUnique as any).mockResolvedValue(mockWorker);
    (prisma.documentType.findUnique as any).mockResolvedValue(mockDocType);
    (prisma.workerDocument.findFirst as any).mockResolvedValue({
      id: "doc-existing",
      documentTypeId: "dt-ktp",
    });
    (prisma.workerDocument.update as any).mockResolvedValue({
      id: "doc-existing",
      verificationStatus: "PENDING",
      documentType: mockDocType,
    });
    (prisma.documentVersion.create as any).mockResolvedValue({
      id: "ver-2",
    });

    const result = await WorkerService.uploadDocument(
      "worker-eko",
      {
        documentTypeId: "dt-ktp",
        documentNumber: "6472589745580002",
        issueDate: "2021-01-01",
        expiryDate: null,
      }
    );

    expect(prisma.workerDocument.update).toHaveBeenCalled();
    expect(result.document.verificationStatus).toBe("PENDING");
  });

  it("throws error if worker does not exist", async () => {
    (prisma.worker.findUnique as any).mockResolvedValue(null);

    await expect(
      WorkerService.uploadDocument("worker-unknown", {
        documentTypeId: "dt-ktp",
        documentNumber: "1234",
        issueDate: "2020-01-01",
      })
    ).rejects.toThrow("Worker tidak ditemukan");
  });
});
