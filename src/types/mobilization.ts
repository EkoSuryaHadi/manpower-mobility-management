import type { MobilizationStatus, DemobStatus, PreMobStatus, TravelMethod, DemobReason } from "@/constants";

export interface PreMobilizationRecord {
  id: string;
  requestNo: string;
  assignmentId: string;
  plannedDate: string;
  readinessScore: number;
  blockingCount: number;
  status: PreMobStatus;
  currentStep: string;
  submittedAt: string | null;
}

export interface MobilizationRecord {
  id: string;
  preMobilizationId: string;
  assignmentId: string;
  travelMethod: TravelMethod;
  flightOrVehicleNo: string;
  departurePoint: string;
  departureDate: string;
  estimatedArrivalDate: string;
  actualArrivalDate: string | null;
  status: MobilizationStatus;
}

export interface DemobilizationRecord {
  id: string;
  assignmentId: string;
  reason: DemobReason;
  requestDate: string;
  plannedDepartureDate: string;
  actualDepartureDate: string | null;
  status: DemobStatus;
  clearanceItems: ClearanceItemRecord[];
}

export interface ClearanceItemRecord {
  id: string;
  itemName: string;
  category: string;
  isCleared: boolean;
  clearedBy: string | null;
  clearedAt: string | null;
  remarks: string | null;
}
