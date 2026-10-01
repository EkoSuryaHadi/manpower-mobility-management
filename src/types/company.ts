import type { CompanyType } from "@/constants";

export interface CompanySummary {
  id: string;
  name: string;
  code: string;
  type: CompanyType;
}

export interface ProjectSummary {
  id: string;
  name: string;
  code: string;
}

export interface SiteSummary {
  id: string;
  name: string;
  code: string;
  siteType: string;
}

export interface OptionItem {
  id: string;
  name: string;
  code?: string;
  type?: string;
  projectId?: string;
}
