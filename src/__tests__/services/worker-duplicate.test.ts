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
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    workerAssignment: {
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

describe("WorkerService Duplicate & Active Worker Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockActiveWorker = {
    id: "worker-1",
    fullName: "Hendra Pratama",
    nik: "3201123456780001",
    employeeNo: "EMP-2026-001",
    status: "ACTIVE",
    assignments: [
      {
        id: "assign-1",
        position: "Welder 6G",
        status: "ON_SITE",
        company: { name: "PT Utama Karya Konstruksi" },
        project: { name: "Tangguh LNG Expansion Phase 2" },
        site: { name: "Offshore Platform Rig Alpha" },
      },
    ],
  };

  describe("checkDuplicate", () => {
    it("detects active worker by NIK and returns assignment details", async () => {
      (prisma.worker.findUnique as any).mockResolvedValue(mockActiveWorker);
      (prisma.worker.findMany as any).mockResolvedValue([]);

      const result = await WorkerService.checkDuplicate({
        nik: "3201123456780001",
      });

      expect(result.duplicateNik).toBe(true);
      expect(result.hasDuplicate).toBe(true);
      expect(result.nikMatch?.fullName).toBe("Hendra Pratama");
      expect(result.nikMatch?.currentAssignment?.companyName).toBe("PT Utama Karya Konstruksi");
      expect(result.nikMatch?.currentAssignment?.position).toBe("Welder 6G");
    });

    it("detects active worker by Name and returns assignment details", async () => {
      (prisma.worker.findUnique as any).mockResolvedValue(null);
      (prisma.worker.findMany as any).mockResolvedValue([mockActiveWorker]);

      const result = await WorkerService.checkDuplicate({
        fullName: "Hendra Pratama",
      });

      expect(result.duplicateName).toBe(true);
      expect(result.hasDuplicate).toBe(true);
      expect(result.nameMatch?.fullName).toBe("Hendra Pratama");
      expect(result.nameMatch?.currentAssignment?.projectName).toBe("Tangguh LNG Expansion Phase 2");
    });

    it("returns false when no duplicate found", async () => {
      (prisma.worker.findUnique as any).mockResolvedValue(null);
      (prisma.worker.findMany as any).mockResolvedValue([]);

      const result = await WorkerService.checkDuplicate({
        nik: "3201999999990000",
        fullName: "New Unique Worker",
      });

      expect(result.duplicateNik).toBe(false);
      expect(result.duplicateName).toBe(false);
      expect(result.hasDuplicate).toBe(false);
    });
  });

  describe("create worker active protection", () => {
    it("blocks registration when NIK is already active with informative error", async () => {
      (prisma.worker.findUnique as any).mockResolvedValue(mockActiveWorker);

      await expect(
        WorkerService.create({
          fullName: "Hendra Pratama",
          nik: "3201123456780001",
          birthDate: "1992-04-10",
          gender: "MALE",
          nationality: "Indonesian",
          contactNumber: "08123456789",
        })
      ).rejects.toThrow(/masih terdaftar dan berstatus AKTIF BEKERJA/);
    });

    it("blocks registration when Name matches an active worker without confirmation", async () => {
      (prisma.worker.findUnique as any).mockResolvedValue(null);
      (prisma.worker.findMany as any).mockResolvedValue([mockActiveWorker]);

      await expect(
        WorkerService.create({
          fullName: "Hendra Pratama",
          nik: "3201999988880001",
          birthDate: "1995-01-01",
          gender: "MALE",
          nationality: "Indonesian",
          contactNumber: "08123456789",
          allowDuplicateName: false,
        })
      ).rejects.toThrow(/masih berstatus AKTIF BEKERJA/);
    });

    it("allows registration when Name matches an active worker if allowDuplicateName is true", async () => {
      (prisma.worker.findUnique as any).mockResolvedValue(null);
      (prisma.worker.create as any).mockResolvedValue({
        id: "worker-new-2",
        fullName: "Hendra Pratama",
        nik: "3201999988880001",
        employeeNo: "EMP-2026-999",
        status: "ACTIVE",
      });

      const worker = await WorkerService.create({
        fullName: "Hendra Pratama",
        nik: "3201999988880001",
        birthDate: "1995-01-01",
        gender: "MALE",
        nationality: "Indonesian",
        contactNumber: "08123456789",
        allowDuplicateName: true,
      });

      expect(worker.id).toBe("worker-new-2");
      expect(prisma.worker.create).toHaveBeenCalled();
    });
  });
});
