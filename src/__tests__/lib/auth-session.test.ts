/**
 * @vitest-environment node
 */
import { describe, it, expect } from "vitest";
import { createSession, verifySession } from "@/lib/auth-session";

describe("Auth Session (JWT Tokens)", () => {
  it("creates and verifies a valid session token", async () => {
    const payload = {
      userId: "user-123",
      role: "WFM_OFFICER" as const,
      fullName: "Ahmad Rizky Pratama",
      companyId: "comp-456",
    };

    const token = await createSession(payload);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);

    const verified = await verifySession(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe("user-123");
    expect(verified?.role).toBe("WFM_OFFICER");
    expect(verified?.fullName).toBe("Ahmad Rizky Pratama");
    expect(verified?.companyId).toBe("comp-456");
  });

  it("returns null for corrupted or tampered tokens", async () => {
    const payload = {
      userId: "admin-1",
      role: "SYSTEM_ADMIN" as const,
      fullName: "Admin",
    };

    const token = await createSession(payload);
    const tampered = token.slice(0, -6) + "xxxxxx";

    const result = await verifySession(tampered);
    expect(result).toBeNull();
  });

  it("returns null for completely invalid strings", async () => {
    expect(await verifySession("not-a-jwt")).toBeNull();
    expect(await verifySession("")).toBeNull();
  });
});
