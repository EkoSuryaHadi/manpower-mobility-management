import { describe, it, expect } from "vitest";
import { createDemobSchema } from "@/validators/demobilization.schema";

describe("createDemobSchema", () => {
  const validInput = {
    assignmentId: "550e8400-e29b-41d4-a716-446655440000",
    reason: "CONTRACT_END",
    plannedDepartureDate: "2026-12-01",
  };

  it("accepts valid input", () => {
    const result = createDemobSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects invalid UUID", () => {
    const result = createDemobSchema.safeParse({ ...validInput, assignmentId: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid reason", () => {
    const result = createDemobSchema.safeParse({ ...validInput, reason: "INVALID_REASON" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid date", () => {
    const result = createDemobSchema.safeParse({ ...validInput, plannedDepartureDate: "not-a-date" });
    expect(result.success).toBe(false);
  });
});
