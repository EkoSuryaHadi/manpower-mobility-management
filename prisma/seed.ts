import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with MMS initial data...");

  // 1. Companies
  const clientCompany = await prisma.company.upsert({
    where: { code: "PNG" },
    update: {},
    create: {
      name: "PT Petro Nusantara Global",
      code: "PNG",
      type: "CLIENT",
      address: "Sentra Tower Lt. 28, SCBD, Jakarta Selatan",
      contactEmail: "contracts@petroglobal.co.id",
      contactPhone: "+62-21-555-0101",
    },
  });

  const contractorCompany = await prisma.company.upsert({
    where: { code: "UKK" },
    update: {},
    create: {
      name: "PT Utama Karya Konstruksi",
      code: "UKK",
      type: "MAIN_CONTRACTOR",
      address: "Kawasan Industri Kariangau, Balikpapan",
      contactEmail: "hr.ops@utamakarva.com",
      contactPhone: "+62-542-888-0202",
    },
  });

  const subconCompany = await prisma.company.upsert({
    where: { code: "SMS" },
    update: {},
    create: {
      name: "PT Subcon Mandiri Sejahtera",
      code: "SMS",
      type: "SUBCONTRACTOR",
      address: "Jl. Mulawarman No. 45, Balikpapan",
      contactEmail: "admin@subconmandiri.com",
      contactPhone: "+62-542-777-0303",
    },
  });

  // 2. Projects & Sites
  const project = await prisma.project.upsert({
    where: { code: "PRJ-TGG-02" },
    update: {},
    create: {
      name: "Tangguh LNG Expansion Phase 2",
      code: "PRJ-TGG-02",
      description: "Pengembangan train 3 dan fasilitas rig lepas pantai",
      clientId: clientCompany.id,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2028-12-31"),
      status: "ACTIVE",
    },
  });

  const siteOffshore = await prisma.site.upsert({
    where: { code: "SITE-RIG-A" },
    update: {},
    create: {
      projectId: project.id,
      name: "Offshore Platform Rig Alpha",
      code: "SITE-RIG-A",
      location: "Laut Bintuni, Papua Barat",
      siteType: "OFFSHORE",
    },
  });

  const siteOnshore = await prisma.site.upsert({
    where: { code: "SITE-ONSH-01" },
    update: {},
    create: {
      projectId: project.id,
      name: "Onshore LNG Receiving Terminal",
      code: "SITE-ONSH-01",
      location: "Kawasan Terminal Tanah Merah",
      siteType: "ONSHORE",
    },
  });

  // 3. Demo Users (7 Personas)
  const usersData = [
    {
      email: "admin@mms.local",
      fullName: "Super Administrator",
      role: "SYSTEM_ADMIN",
      companyId: contractorCompany.id,
    },
    {
      email: "vendor@subcon.local",
      fullName: "Hendra Wijaya (Vendor Pic)",
      role: "SUBCONTRACTOR",
      companyId: subconCompany.id,
    },
    {
      email: "hr@contractor.local",
      fullName: "Maya Safitri (Contractor HR)",
      role: "CONTRACTOR_HR",
      companyId: contractorCompany.id,
    },
    {
      email: "hse@contractor.local",
      fullName: "Irwan Pratama (Contractor HSE)",
      role: "CONTRACTOR_HSE",
      companyId: contractorCompany.id,
    },
    {
      email: "approver@client.local",
      fullName: "Bambang Soediro (Client Approver)",
      role: "CLIENT_APPROVER",
      companyId: clientCompany.id,
    },
    {
      email: "siteadmin@rig.local",
      fullName: "Deni Saputra (Site Admin Rig Alpha)",
      role: "SITE_ADMIN",
      companyId: contractorCompany.id,
    },
    {
      email: "management@corp.local",
      fullName: "Linda Kusuma (VP Operations)",
      role: "MANAGEMENT_VIEWER",
      companyId: clientCompany.id,
    },
  ];

  for (const u of usersData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        passwordHash: "password123", // Demo hash
        fullName: u.fullName,
        role: u.role,
        companyId: u.companyId,
      },
    });
  }

  // 4. Document Types
  const docTypes = [
    {
      code: "DOC-ID-KTP",
      name: "Kartu Tanda Penduduk (KTP)",
      category: "IDENTITY",
      defaultValidityDays: 3650,
    },
    {
      code: "DOC-ID-PASS",
      name: "Passport",
      category: "IDENTITY",
      defaultValidityDays: 1825,
    },
    {
      code: "DOC-MED-OGUK",
      name: "Medical Checkup (MCU) Oil & Gas",
      category: "MEDICAL",
      defaultValidityDays: 365,
    },
    {
      code: "DOC-HSE-BOSIET",
      name: "BOSIET with CA-EBS (Offshore Survival)",
      category: "HSE",
      defaultValidityDays: 1460,
    },
    {
      code: "DOC-HSE-K3",
      name: "Basic K3 & General Safework Induction",
      category: "HSE",
      defaultValidityDays: 730,
    },
    {
      code: "DOC-CMP-WELD6G",
      name: "Sertifikat Welder 6G SMAW/GTAW (BNSP/Migas)",
      category: "COMPETENCY",
      defaultValidityDays: 730,
    },
    {
      code: "DOC-CMP-RIGGER",
      name: "Sertifikat Rigger Migas Level 1",
      category: "COMPETENCY",
      defaultValidityDays: 1095,
    },
    {
      code: "DOC-LEG-BPJS",
      name: "BPJS Ketenagakerjaan Aktif",
      category: "INSURANCE",
      defaultValidityDays: 365,
    },
  ];

  const createdDocTypes: Record<string, any> = {};
  for (const dt of docTypes) {
    createdDocTypes[dt.code] = await prisma.documentType.upsert({
      where: { code: dt.code },
      update: {},
      create: dt,
    });
  }

  // 5. Document Requirements (Dynamic Rules)
  // Rule 1: KTP wajib untuk semua pekerja
  await prisma.documentRequirement.create({
    data: {
      name: "Mandatory Identity Verification (KTP)",
      documentTypeId: createdDocTypes["DOC-ID-KTP"].id,
      isMandatory: true,
      isBlocking: true,
      warningDays: 60,
    },
  });

  // Rule 2: Basic K3 Induction wajib untuk seluruh project Tangguh
  await prisma.documentRequirement.create({
    data: {
      name: "Site Safety Induction Compliance",
      projectId: project.id,
      documentTypeId: createdDocTypes["DOC-HSE-K3"].id,
      isMandatory: true,
      isBlocking: true,
      warningDays: 30,
    },
  });

  // Rule 3: BPJS Ketenagakerjaan wajib
  await prisma.documentRequirement.create({
    data: {
      name: "Insurance Protection BPJS TK",
      documentTypeId: createdDocTypes["DOC-LEG-BPJS"].id,
      isMandatory: true,
      isBlocking: true,
      warningDays: 30,
    },
  });

  // Rule 4: Offshore Site Rig Alpha wajib MCU Oil & Gas + BOSIET
  await prisma.documentRequirement.create({
    data: {
      name: "Offshore Medical Fitness (MCU OGUK)",
      siteId: siteOffshore.id,
      documentTypeId: createdDocTypes["DOC-MED-OGUK"].id,
      isMandatory: true,
      isBlocking: true,
      warningDays: 30,
    },
  });

  await prisma.documentRequirement.create({
    data: {
      name: "Offshore Survival Certification (BOSIET)",
      siteId: siteOffshore.id,
      documentTypeId: createdDocTypes["DOC-HSE-BOSIET"].id,
      isMandatory: true,
      isBlocking: true,
      warningDays: 60,
    },
  });

  // Rule 5: Welder Position Requirement
  await prisma.documentRequirement.create({
    data: {
      name: "Welder 6G Certification Compliance",
      position: "Welder",
      documentTypeId: createdDocTypes["DOC-CMP-WELD6G"].id,
      isMandatory: true,
      isBlocking: true,
      warningDays: 45,
    },
  });

  // 6. Approval Workflow (Multi-Stage)
  const workflow = await prisma.approvalWorkflow.upsert({
    where: { code: "STD-MOB-V1" },
    update: {},
    create: {
      name: "Standard 3-Stage Mobilization Approval",
      code: "STD-MOB-V1",
      description: "Subcontractor -> Contractor HR -> Contractor HSE -> Client Approver",
    },
  });

  await prisma.approvalStep.upsert({
    where: {
      workflowId_stepOrder: { workflowId: workflow.id, stepOrder: 1 },
    },
    update: {},
    create: {
      workflowId: workflow.id,
      stepOrder: 1,
      stepName: "Contractor HR Review & Employment Check",
      requiredRole: "CONTRACTOR_HR",
    },
  });

  await prisma.approvalStep.upsert({
    where: {
      workflowId_stepOrder: { workflowId: workflow.id, stepOrder: 2 },
    },
    update: {},
    create: {
      workflowId: workflow.id,
      stepOrder: 2,
      stepName: "Contractor HSE & Medical Verification",
      requiredRole: "CONTRACTOR_HSE",
    },
  });

  await prisma.approvalStep.upsert({
    where: {
      workflowId_stepOrder: { workflowId: workflow.id, stepOrder: 3 },
    },
    update: {},
    create: {
      workflowId: workflow.id,
      stepOrder: 3,
      stepName: "Client Final Mobilization Approval",
      requiredRole: "CLIENT_APPROVER",
    },
  });

  // 7. Sample Workers & Assignments
  // Worker 1: Budi Santoso (100% Ready)
  const w1 = await prisma.worker.create({
    data: {
      employeeNo: "EMP-2026-001",
      fullName: "Budi Santoso",
      nik: "3201123456780001",
      birthDate: new Date("1988-04-15"),
      gender: "MALE",
      contactNumber: "081298765431",
      overallReadinessScore: 100.0,
      status: "ACTIVE",
    },
  });

  const a1 = await prisma.workerAssignment.create({
    data: {
      workerId: w1.id,
      projectId: project.id,
      siteId: siteOffshore.id,
      companyId: subconCompany.id,
      position: "Welder",
      discipline: "PIPING",
      trade: "Welder 6G",
      rotationSchedule: "28/28",
      startDate: new Date("2026-10-01"),
      status: "READY_TO_MOBILIZE",
    },
  });

  // Attach verified documents for Worker 1
  for (const dtCode of ["DOC-ID-KTP", "DOC-HSE-K3", "DOC-LEG-BPJS", "DOC-MED-OGUK", "DOC-HSE-BOSIET", "DOC-CMP-WELD6G"]) {
    const wd = await prisma.workerDocument.create({
      data: {
        workerId: w1.id,
        documentTypeId: createdDocTypes[dtCode].id,
        documentNumber: `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
        issueDate: new Date("2026-01-10"),
        expiryDate: new Date("2027-01-10"),
        verificationStatus: "VERIFIED",
        verifiedAt: new Date("2026-01-15"),
        verifierRemarks: "Dokumen valid dan terverifikasi sesuai standar migas",
      },
    });
    await prisma.documentVersion.create({
      data: {
        workerDocumentId: wd.id,
        fileName: `${dtCode.toLowerCase()}_sample.pdf`,
        fileUrl: `/uploads/${dtCode.toLowerCase()}_sample.pdf`,
        fileSize: 245000,
        mimeType: "application/pdf",
      },
    });
  }

  // Pre-Mobilization Request & Multi-stage Approval Instance for Worker 1 (Budi Santoso)
  const pm1 = await prisma.preMobilization.create({
    data: {
      requestNo: "PM-2026-001",
      assignmentId: a1.id,
      plannedDate: new Date("2026-10-15"),
      readinessScore: 100.0,
      blockingCount: 0,
      status: "SUBMITTED",
      currentStep: "CONTRACTOR_HR",
      submittedAt: new Date("2026-09-28"),
    },
  });

  await prisma.approvalInstance.create({
    data: {
      preMobilizationId: pm1.id,
      workflowId: workflow.id,
      currentStepOrder: 1,
      status: "PENDING",
    },
  });

  // Worker 2: Ahmad Hidayat (Blocked - Missing BOSIET)
  const w2 = await prisma.worker.create({
    data: {
      employeeNo: "EMP-2026-002",
      fullName: "Ahmad Hidayat",
      nik: "3201123456780002",
      birthDate: new Date("1992-08-20"),
      gender: "MALE",
      contactNumber: "081298765432",
      overallReadinessScore: 75.0,
      status: "ACTIVE",
    },
  });

  await prisma.workerAssignment.create({
    data: {
      workerId: w2.id,
      projectId: project.id,
      siteId: siteOffshore.id,
      companyId: subconCompany.id,
      position: "Rigger",
      discipline: "MECHANICAL",
      rotationSchedule: "28/28",
      startDate: new Date("2026-10-01"),
      status: "PRE_MOBILIZATION",
    },
  });

  // Worker 3: Rahmat Kurniawan (On Site Active)
  const w3 = await prisma.worker.create({
    data: {
      employeeNo: "EMP-2026-003",
      fullName: "Rahmat Kurniawan",
      nik: "3201123456780003",
      birthDate: new Date("1985-11-12"),
      gender: "MALE",
      contactNumber: "081298765433",
      overallReadinessScore: 100.0,
      status: "ACTIVE",
    },
  });

  const a3 = await prisma.workerAssignment.create({
    data: {
      workerId: w3.id,
      projectId: project.id,
      siteId: siteOffshore.id,
      companyId: contractorCompany.id,
      position: "Mechanical Tech",
      discipline: "MECHANICAL",
      rotationSchedule: "28/28",
      startDate: new Date("2026-09-01"),
      status: "ON_SITE",
    },
  });

  const pm3 = await prisma.preMobilization.create({
    data: {
      requestNo: "PM-2026-003",
      assignmentId: a3.id,
      plannedDate: new Date("2026-09-01"),
      readinessScore: 100.0,
      blockingCount: 0,
      status: "APPROVED",
      currentStep: "COMPLETED",
      submittedAt: new Date("2026-08-25"),
    },
  });

  await prisma.mobilization.create({
    data: {
      preMobilizationId: pm3.id,
      assignmentId: a3.id,
      travelMethod: "SPEEDBOAT",
      flightOrVehicleNo: "SB-BINTUNI-04",
      departurePoint: "Pelabuhan Bintuni",
      departureDate: new Date("2026-09-01T08:00:00Z"),
      estimatedArrivalDate: new Date("2026-09-01T12:00:00Z"),
      actualArrivalDate: new Date("2026-09-01T11:45:00Z"),
      arrivalConfirmedBy: "Deni Saputra",
      status: "ARRIVED",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
