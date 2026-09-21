import { prisma } from "./prisma";

export interface AssignmentContext {
  projectId: string;
  siteId: string;
  companyId: string;
  position: string;
  discipline: string;
  trade?: string | null;
}

/**
 * Dynamic Document Requirements Evaluator
 * Compiles all applicable document rules for a specific assignment context
 */
export async function getApplicableRequirements(context: AssignmentContext) {
  // Fetch active requirement rules matching any matching dimension or global (null)
  const allActiveRules = await prisma.documentRequirement.findMany({
    where: { isActive: true },
    include: { documentType: true },
  });

  const matchingRequirements = allActiveRules.filter((rule) => {
    // If rule has a specific projectId, it must match
    if (rule.projectId && rule.projectId !== context.projectId) return false;

    // If rule has a specific siteId, it must match
    if (rule.siteId && rule.siteId !== context.siteId) return false;

    // If rule has a specific companyId, it must match
    if (rule.companyId && rule.companyId !== context.companyId) return false;

    // If rule has a specific position, it must match case-insensitively
    if (rule.position && rule.position.toLowerCase() !== context.position.toLowerCase()) {
      return false;
    }

    // If rule has a specific discipline, it must match
    if (rule.discipline && rule.discipline.toLowerCase() !== context.discipline.toLowerCase()) {
      return false;
    }

    // If rule has a specific trade, it must match
    if (rule.trade && (!context.trade || rule.trade.toLowerCase() !== context.trade.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Deduplicate by documentTypeId (more specific rule overrides less specific rule if needed)
  const uniqueByDocType = new Map<string, typeof matchingRequirements[0]>();
  for (const req of matchingRequirements) {
    // If not already in map or if current rule is more specific (e.g. site or position specific), keep it
    if (!uniqueByDocType.has(req.documentTypeId)) {
      uniqueByDocType.set(req.documentTypeId, req);
    } else {
      const existing = uniqueByDocType.get(req.documentTypeId)!;
      const currentSpecificity = (req.siteId ? 2 : 0) + (req.position ? 2 : 0) + (req.projectId ? 1 : 0);
      const existingSpecificity = (existing.siteId ? 2 : 0) + (existing.position ? 2 : 0) + (existing.projectId ? 1 : 0);
      if (currentSpecificity > existingSpecificity) {
        uniqueByDocType.set(req.documentTypeId, req);
      }
    }
  }

  return Array.from(uniqueByDocType.values());
}
