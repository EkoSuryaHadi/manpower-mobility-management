import { z } from "zod";
import { WORKER_STATUS, GENDER, DISCIPLINES } from "@/constants";

export const createWorkerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(255),
  nik: z.string().regex(/^\d{16}$/, "NIK must be exactly 16 digits"),
  employeeNo: z.string().optional(),
  passportNo: z.string().optional(),
  birthDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date format"),
  birthPlace: z.string().optional(),
  gender: z.enum([GENDER.MALE, GENDER.FEMALE]),
  nationality: z.string().default("INDONESIAN"),
  contactNumber: z.string().min(8, "Contact number must be at least 8 characters").max(20),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  // Optional assignment fields
  companyId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  siteId: z.string().uuid().optional(),
  position: z.string().optional(),
  discipline: z.enum(Object.values(DISCIPLINES) as [string, ...string[]]).optional(),
  trade: z.string().optional(),
  rotationSchedule: z.string().optional(),
  startDate: z.string().optional(),
  allowDuplicateName: z.boolean().optional(),
});

export type CreateWorkerInput = z.infer<typeof createWorkerSchema>;

export const workerSearchSchema = z.object({
  q: z.string().optional().default(""),
  status: z.enum(Object.values(WORKER_STATUS) as [string, ...string[]]).optional(),
  companyId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
