export const DISCIPLINES = {
  CIVIL: "CIVIL",
  MECHANICAL: "MECHANICAL",
  ELECTRICAL: "ELECTRICAL",
  INSTRUMENTATION: "INSTRUMENTATION",
  PIPING: "PIPING",
  HSE: "HSE",
  DRILLING: "DRILLING",
  LOGISTICS: "LOGISTICS",
  ADMIN: "ADMIN",
} as const;
export type Discipline = (typeof DISCIPLINES)[keyof typeof DISCIPLINES];

export const SITE_TYPES = {
  ONSHORE: "ONSHORE",
  OFFSHORE: "OFFSHORE",
  REMOTE: "REMOTE",
  FABRICATION_YARD: "FABRICATION_YARD",
} as const;
export type SiteType = (typeof SITE_TYPES)[keyof typeof SITE_TYPES];

export const COMPANY_TYPES = {
  CLIENT: "CLIENT",
  MAIN_CONTRACTOR: "MAIN_CONTRACTOR",
  SUBCONTRACTOR: "SUBCONTRACTOR",
  VENDOR: "VENDOR",
} as const;
export type CompanyType = (typeof COMPANY_TYPES)[keyof typeof COMPANY_TYPES];

export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
} as const;
export type Gender = (typeof GENDER)[keyof typeof GENDER];

export const TRAVEL_METHODS = {
  FLIGHT: "FLIGHT",
  SPEEDBOAT: "SPEEDBOAT",
  BUS: "BUS",
  CHARTER: "CHARTER",
} as const;
export type TravelMethod = (typeof TRAVEL_METHODS)[keyof typeof TRAVEL_METHODS];

export const DEMOB_REASONS = {
  CONTRACT_END: "CONTRACT_END",
  ROTATION_LEAVE: "ROTATION_LEAVE",
  MEDICAL_EVACUATION: "MEDICAL_EVACUATION",
  RESIGNATION: "RESIGNATION",
  DISMISSAL: "DISMISSAL",
} as const;
export type DemobReason = (typeof DEMOB_REASONS)[keyof typeof DEMOB_REASONS];

export const ROTATION_SCHEDULES = {
  "28/28": "28/28",
  "14/14": "14/14",
  "5/2": "5/2",
  "6/1": "6/1",
} as const;
export type RotationSchedule = (typeof ROTATION_SCHEDULES)[keyof typeof ROTATION_SCHEDULES];
