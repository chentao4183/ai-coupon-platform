import codingPlansData from "@/data/coding-plans.json";
import type { CodingPlan, CodingPlansData } from "@/types/coding-plan";

// Re-export types for consumers
export type { CodingPlan } from "@/types/coding-plan";

const data = codingPlansData as unknown as CodingPlansData;

/** Returns all coding plans */
export function getAllCodingPlans(): CodingPlan[] {
  return data.plans;
}

/** Returns a single coding plan by id */
export function getCodingPlanById(id: string): CodingPlan | undefined {
  return data.plans.find((p) => p.id === id);
}

/** Returns plans filtered by provider */
export function getCodingPlansByProvider(providerId: string): CodingPlan[] {
  return data.plans.filter((p) => p.providerId === providerId);
}

/** Returns plans filtered by tier */
export function getCodingPlansByTier(tier: string): CodingPlan[] {
  if (tier === "all") return data.plans;
  return data.plans.filter((p) => p.tier === tier);
}

/** Returns plans filtered by tag */
export function getCodingPlansByTag(tag: string): CodingPlan[] {
  if (!tag || tag === "全部") return data.plans;
  return data.plans.filter((p) => p.tags.includes(tag));
}

/** Returns popular/recommended plans */
export function getPopularCodingPlans(): CodingPlan[] {
  return data.plans.filter((p) => p.popular);
}

/** Returns unique providers */
export function getCodingPlanProviders(): {
  id: string;
  name: string;
  logo: string;
}[] {
  const map = new Map<string, { id: string; name: string; logo: string }>();
  for (const plan of data.plans) {
    if (!map.has(plan.providerId)) {
      map.set(plan.providerId, {
        id: plan.providerId,
        name: plan.providerName,
        logo: plan.providerLogo,
      });
    }
  }
  return Array.from(map.values());
}

/** Returns unique tags */
export function getCodingPlanTags(): string[] {
  const tags = new Set<string>();
  for (const plan of data.plans) {
    for (const tag of plan.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags);
}

export type CodingPlanSortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "value";

/**
 * Normalize price to CNY per month for comparison.
 * USD rate is approximate (7.25).
 */
function normalizeToCNY(plan: CodingPlan): number {
  const monthly =
    plan.pricing.period === "year"
      ? plan.pricing.price / 12
      : plan.pricing.price;
  return plan.pricing.currency === "USD" ? monthly * 7.25 : monthly;
}

/** Sort coding plans */
export function sortCodingPlans(
  plans: CodingPlan[],
  sortBy: CodingPlanSortOption
): CodingPlan[] {
  const sorted = [...plans];
  switch (sortBy) {
    case "recommended":
      return sorted.sort((a, b) => {
        if (a.popular !== b.popular) return a.popular ? -1 : 1;
        return normalizeToCNY(a) - normalizeToCNY(b);
      });
    case "price-asc":
      return sorted.sort((a, b) => normalizeToCNY(a) - normalizeToCNY(b));
    case "price-desc":
      return sorted.sort((a, b) => normalizeToCNY(b) - normalizeToCNY(a));
    case "value":
      // Best value = lowest price per claude-pro-equivalent
      return sorted.sort((a, b) => {
        const aVal =
          a.claudeProPriceRatio > 0
            ? normalizeToCNY(a) / a.claudeProPriceRatio
            : Infinity;
        const bVal =
          b.claudeProPriceRatio > 0
            ? normalizeToCNY(b) / b.claudeProPriceRatio
            : Infinity;
        return aVal - bVal;
      });
    default:
      return sorted;
  }
}

/** Format price with currency symbol */
export function formatCodingPlanPrice(plan: CodingPlan): string {
  const sym = plan.pricing.currency === "USD" ? "$" : "¥";
  return `${sym}${plan.pricing.price}`;
}

/** Format normalized CNY price */
export function formatCNYPrice(cny: number): string {
  return `¥${cny.toFixed(0)}`;
}

/** Check if a plan supports a specific tool */
export function planSupportsTool(plan: CodingPlan, tool: string): boolean {
  return plan.supportedTools.some(
    (t) => t.toLowerCase() === tool.toLowerCase()
  );
}

/** Get all unique supported tools across all plans */
export function getAllSupportedTools(): string[] {
  const tools = new Set<string>();
  for (const plan of data.plans) {
    for (const tool of plan.supportedTools) {
      tools.add(tool);
    }
  }
  return Array.from(tools).sort();
}
