import { describe, it, expect } from "vitest";
import { uploadWorkerDocumentSchema } from "@/validators/document.schema";

describe("uploadWorkerDocumentSchema", () => {
  const validInput = {
    documentTypeId: "550e8400-e29b-41d4-a716-446655440000",
    documentNumber: "DOC-2026-9999",
    issueDate: "2026-01-10",
    expiryDate: "2027-01-10",
  };

  it("accepts valid input with expiry date", () => {
    const result = uploadWorkerDocumentSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("accepts permanent document without expiry date", () => {
    const result = uploadWorkerDocumentSchema.safeParse({
      ...validInput,
      expiryDate: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid documentTypeId", () => {
    const result = uploadWorkerDocumentSchema.safeParse({
      ...validInput,
      documentTypeId: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty documentNumber", () => {
    const result = uploadWorkerDocumentSchema.safeParse({
      ...validInput,
      documentNumber: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = uploadWorkerDocumentSchema.safeParse({
      ...validInput,
      issueDate: "invalid-date",
    });
    expect(result.success).toBe(false);
  });
});
