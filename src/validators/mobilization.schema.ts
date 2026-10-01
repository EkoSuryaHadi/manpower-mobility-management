import { z } from "zod";
import { TRAVEL_METHODS } from "@/constants";

export const createPreMobSchema = z.object({
  assignmentId: z.string().uuid("Assignment ID must be a valid UUID"),
});

export type CreatePreMobInput = z.infer<typeof createPreMobSchema>;

export const createMobilizationSchema = z.object({
  preMobilizationId: z.string().uuid(),
  assignmentId: z.string().uuid(),
  travelMethod: z.enum(Object.values(TRAVEL_METHODS) as [string, ...string[]]),
  flightOrVehicleNo: z.string().min(1, "Flight/vehicle number is required"),
  departurePoint: z.string().min(1, "Departure point is required"),
  departureDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
  estimatedArrivalDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
});

export const arrivalConfirmSchema = z.object({
  confirmedBy: z.string().min(1, "Confirmed by is required"),
});
