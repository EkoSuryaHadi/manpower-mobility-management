import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("navigation exposes the complete mobility workflow from the approved reference", async () => {
  const shell = await source("components/app-shell.tsx");
  for (const label of ["Dashboard", "Workers", "Documents", "Pre-Mob", "Approvals", "Mobilization", "Demobilization", "Reports", "Admin"]) {
    assert.match(shell, new RegExp(`\\b${label}\\b`), `missing navigation item: ${label}`);
  }
});

test("executive dashboard includes the approved operational panels", async () => {
  const dashboard = await source("app/dashboard/page.tsx");
  for (const panel of ["Manpower by Site", "Assignment Status", "Workforce Activity", "Recent Activities"]) {
    assert.match(dashboard, new RegExp(panel), `missing dashboard panel: ${panel}`);
  }
});

test("reference workflow pages provide documents, readiness and requirement management", async () => {
  const expected = [
    ["app/documents/page.tsx", "Document Center"],
    ["app/pre-mob/page.tsx", "Pre-Mobilization Checklist"],
    ["app/admin/page.tsx", "Requirement Master"],
  ];
  for (const [path, heading] of expected) {
    const page = await source(path);
    assert.match(page, new RegExp(heading), `missing page heading: ${heading}`);
  }
});

test("worker profile and reports preserve the reference information hierarchy", async () => {
  const workers = await source("app/workers/page.tsx");
  assert.match(workers, /Worker Profile/);
  assert.match(workers, /Readiness Score/);
  const reports = await source("app/reports/page.tsx");
  assert.match(reports, /Workforce Demography/);
  assert.match(reports, /Manpower by Site/);
});
