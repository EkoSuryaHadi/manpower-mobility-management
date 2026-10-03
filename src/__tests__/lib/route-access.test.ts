import { describe, it, expect } from "vitest";
import { canAccessRoute } from "@/lib/route-access";

describe("Route Access Control (canAccessRoute)", () => {
  it("SYSTEM_ADMIN has access to all routes", () => {
    expect(canAccessRoute("SYSTEM_ADMIN", "/dashboard")).toBe(true);
    expect(canAccessRoute("SYSTEM_ADMIN", "/users")).toBe(true);
    expect(canAccessRoute("SYSTEM_ADMIN", "/approvals")).toBe(true);
    expect(canAccessRoute("SYSTEM_ADMIN", "/vendors")).toBe(true);
    expect(canAccessRoute("SYSTEM_ADMIN", "/non-existent")).toBe(true);
  });

  it("SUBCONTRACTOR can only access their allowed modules", () => {
    expect(canAccessRoute("SUBCONTRACTOR", "/dashboard")).toBe(true);
    expect(canAccessRoute("SUBCONTRACTOR", "/import")).toBe(true);
    expect(canAccessRoute("SUBCONTRACTOR", "/documents")).toBe(true);
    expect(canAccessRoute("SUBCONTRACTOR", "/documents/expiry")).toBe(true);
    expect(canAccessRoute("SUBCONTRACTOR", "/pre-mobilization")).toBe(true);
    expect(canAccessRoute("SUBCONTRACTOR", "/vendors")).toBe(true);

    // Blocked routes
    expect(canAccessRoute("SUBCONTRACTOR", "/users")).toBe(false);
    expect(canAccessRoute("SUBCONTRACTOR", "/approvals")).toBe(false);
    expect(canAccessRoute("SUBCONTRACTOR", "/mobilization")).toBe(false);
    expect(canAccessRoute("SUBCONTRACTOR", "/on-site")).toBe(false);
    expect(canAccessRoute("SUBCONTRACTOR", "/demobilization")).toBe(false);
    expect(canAccessRoute("SUBCONTRACTOR", "/requirements")).toBe(false);
  });

  it("CONTRACTOR_HR can access HR approval, workers, and pre-mobilization", () => {
    expect(canAccessRoute("CONTRACTOR_HR", "/workers")).toBe(true);
    expect(canAccessRoute("CONTRACTOR_HR", "/approvals")).toBe(true);
    expect(canAccessRoute("CONTRACTOR_HR", "/mobilization")).toBe(true);
    expect(canAccessRoute("CONTRACTOR_HR", "/users")).toBe(false);
  });

  it("CLIENT_APPROVER can access approvals, on-site, and reports, but not user management or import", () => {
    expect(canAccessRoute("CLIENT_APPROVER", "/approvals")).toBe(true);
    expect(canAccessRoute("CLIENT_APPROVER", "/on-site")).toBe(true);
    expect(canAccessRoute("CLIENT_APPROVER", "/reports")).toBe(true);
    expect(canAccessRoute("CLIENT_APPROVER", "/import")).toBe(false);
    expect(canAccessRoute("CLIENT_APPROVER", "/users")).toBe(false);
  });

  it("handles sub-paths correctly", () => {
    expect(canAccessRoute("SUBCONTRACTOR", "/vendors/abc-123")).toBe(true);
    expect(canAccessRoute("SUBCONTRACTOR", "/users/new")).toBe(false);
    expect(canAccessRoute("WFM_OFFICER", "/workers/w-123")).toBe(true);
  });
});
