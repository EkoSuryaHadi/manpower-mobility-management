import { z } from "zod";
import { DEMOB_REASONS } from "@/constants";

export const createDemobSchema = z.object({
  assignmentId: z.string().uuid("Assignment ID must be a valid UUID"),
  reason: z.enum(Object.values(DEMOB_REASONS) as [string, ...string[]]),
  plannedDepartureDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
});

export type CreateDemobInput = z.infer<typeof createDemobSchema>;

export const clearanceUpdateSchema = z.object({
  isCleared: z.boolean(),
  clearedBy: z.string().optional(),
  remarks: z.string().optional(),
});
