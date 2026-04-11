import modelsData from "@/data/models.json";
import type { Model, ModelCompany } from "@/types/model";

interface ModelData {
  companies: ModelCompany[];
  models: Model[];
}

// Cast through unknown to handle JSON type mismatches
const data = modelsData as unknown as ModelData;

/** Returns all active models, sorted by their `order` field */
export function getAllModels(): Model[] {
  return data.models
    .filter((m) => m.active !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

/** Returns a single model by id */
export function getModelById(id: string): Model | undefined {
  return data.models.find((m) => m.id === id);
}

/** Returns a company by id */
export function getCompanyById(id: string): ModelCompany | undefined {
  return data.companies.find((c) => c.id === id);
}

/** Returns models matching a given tag filter */
export function getModelsByFilter(filter: string): Model[] {
  const all = getAllModels();
  if (!filter || filter === "全部") return all;
  return all.filter((m) => m.tags.includes(filter));
}

/** Returns models matching given ids for comparison */
export function compareModels(ids: string[]): Model[] {
  return data.models.filter((m) => ids.includes(m.id));
}

/** Simple search: matches query against model name, nameEn, and description */
export function searchModels(query: string): Model[] {
  const q = query.toLowerCase().trim();
  if (!q) return getAllModels();
  return getAllModels().filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.nameEn.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.capabilities.some((c) => c.toLowerCase().includes(q))
  );
}

export type SortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "context-length";

/** Gets the minimum starting price from a model's pricing plans */
export function getMinPrice(model: Model): number {
  if (model.pricingPlans.length === 0) return -1;
  let min = Infinity;
  for (const plan of model.pricingPlans) {
    const p = plan.pricing;
    if ("price" in p && typeof p.price === "number") {
      min = Math.min(min, p.price);
    }
    if ("inputPrice" in p && typeof p.inputPrice === "number") {
      min = Math.min(min, p.inputPrice);
    }
  }
  return min === Infinity ? -1 : min;
}

/** Gets the max context length across all versions */
function getMaxContext(model: Model): number {
  if (model.versions.length === 0) return 0;
  return Math.max(...model.versions.map((v) => v.contextLength));
}

/** Sort models by the given criteria */
export function sortModels(models: Model[], sortBy: SortOption): Model[] {
  const sorted = [...models];
  switch (sortBy) {
    case "recommended":
      return sorted.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return (a.order ?? 999) - (b.order ?? 999);
      });
    case "price-asc":
      return sorted.sort((a, b) => getMinPrice(a) - getMinPrice(b));
    case "price-desc":
      return sorted.sort((a, b) => getMinPrice(b) - getMinPrice(a));
    case "context-length":
      return sorted.sort((a, b) => getMaxContext(b) - getMaxContext(a));
    default:
      return sorted;
  }
}
