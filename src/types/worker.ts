import type { WorkerStatus, AssignmentStatus, Gender, Discipline } from "@/constants";

export interface WorkerListItem {
  id: string;
  fullName: string;
  nik: string;
  employeeNo: string;
  birthDate: string;
  gender: Gender;
  status: WorkerStatus;
  overallReadinessScore: number;
  assignments: AssignmentSummary[];
}

export interface AssignmentSummary {
  id: string;
  position: string;
  discipline: Discipline;
  status: AssignmentStatus;
  rotationSchedule: string | null;
  company: { name: string; type: string } | null;
  project: { name: string; code: string } | null;
  site: { name: string; code: string } | null;
}

export interface WorkerCreateInput {
  fullName: string;
  nik: string;
  employeeNo?: string;
  passportNo?: string;
  birthDate: string;
  birthPlace?: string;
  gender: Gender;
  nationality?: string;
  contactNumber: string;
  email?: string;
  address?: string;
  companyId?: string;
  projectId?: string;
  siteId?: string;
  position?: string;
  discipline?: Discipline;
  trade?: string;
  rotationSchedule?: string;
  startDate?: string;
}
