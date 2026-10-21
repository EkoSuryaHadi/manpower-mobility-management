import { describe, it, expect } from "vitest";
import { createWorkerSchema, workerSearchSchema } from "@/validators/worker.schema";

describe("createWorkerSchema", () => {
  const validInput = {
    fullName: "Budi Santoso",
    nik: "3201234567890123",
    birthDate: "1990-05-15",
    gender: "MALE",
    contactNumber: "08123456789",
  };

  it("accepts valid minimum input", () => {
    const result = createWorkerSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects empty fullName", () => {
    const result = createWorkerSchema.safeParse({ ...validInput, fullName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects NIK with wrong length", () => {
    const result = createWorkerSchema.safeParse({ ...validInput, nik: "12345" });
    expect(result.success).toBe(false);
  });

  it("rejects NIK with non-digits", () => {
    const result = createWorkerSchema.safeParse({ ...validInput, nik: "320123456789ABCD" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid gender", () => {
    const result = createWorkerSchema.safeParse({ ...validInput, gender: "OTHER" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = createWorkerSchema.safeParse({ ...validInput, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("accepts empty email string", () => {
    const result = createWorkerSchema.safeParse({ ...validInput, email: "" });
    expect(result.success).toBe(true);
  });

  it("accepts full input with assignment fields", () => {
    const fullInput = {
      ...validInput,
      employeeNo: "EMP-2026-001",
      companyId: "550e8400-e29b-41d4-a716-446655440000",
      projectId: "550e8400-e29b-41d4-a716-446655440001",
      siteId: "550e8400-e29b-41d4-a716-446655440002",
      position: "Welder 6G",
      discipline: "MECHANICAL",
    };
    const result = createWorkerSchema.safeParse(fullInput);
    expect(result.success).toBe(true);
  });

  it("accepts allowDuplicateName boolean flag", () => {
    const result = createWorkerSchema.safeParse({ ...validInput, allowDuplicateName: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.allowDuplicateName).toBe(true);
    }
  });
});

describe("workerSearchSchema", () => {
  it("applies defaults when no params given", () => {
    const result = workerSearchSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.q).toBe("");
  });

  it("coerces string numbers to integers", () => {
    const result = workerSearchSchema.parse({ page: "3", limit: "50" });
    expect(result.page).toBe(3);
    expect(result.limit).toBe(50);
  });

  it("rejects limit > 100", () => {
    const result = workerSearchSchema.safeParse({ limit: "200" });
    expect(result.success).toBe(false);
  });
});
