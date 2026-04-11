/**
 * Runtime data helpers.
 *
 * The JSON data in models.json has a shape that differs from the TypeScript
 * types in @/types/model (the data is cast through `unknown`).  These helpers
 * provide safe accessors for the *actual* runtime shape of the data so that
 * components never reach for a field that will be `undefined`.
 */

/* ------------------------------------------------------------------ */
/* Runtime types (matches models.json)                                */
/* ------------------------------------------------------------------ */

export interface RVersion {
  id: string;
  name: string;
  description: string;
  contextLength: number;
  latest: boolean;
  tier: string;
}

export interface RPlanPricing {
  currency: string;
  inputPrice?: number;
  outputPrice?: number;
  unit?: string;
  cacheHitPrice?: number;
  cacheHitUnit?: string;
  price?: number;
  period?: string;
  note?: string;
}

export interface RPlan {
  id: string;
  versionId: string;
  planType: string; // "api" | "subscription"
  name: string;
  description: string;
  pricing: RPlanPricing;
  popular: boolean;
  limits: { features: string[]; restrictions: string[] };
}

export interface RModel {
  id: string;
  name: string;
  nameEn: string;
  companyId: string;
  logo: string;
  website: string;
  description: string;
  longDescription: string;
  capabilities: string[];
  scenarios: string[];
  versions: RVersion[];
  pricingPlans: RPlan[];
  tags: string[];
  featured: boolean;
  active: boolean;
  order: number;
  compliance?: string[];
  privateDeployment?: string;
  free?: boolean;
}

/* ------------------------------------------------------------------ */
/* Safe cast                                                          */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asRModel(raw: any): RModel {
  return raw as RModel;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asRModels(raw: any): RModel[] {
  return raw as RModel[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asRVersion(raw: any): RVersion {
  return raw as RVersion;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asRPlan(raw: any): RPlan {
  return raw as RPlan;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asRVersions(raw: any): RVersion[] {
  return raw as RVersion[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asRPlans(raw: any): RPlan[] {
  return raw as RPlan[];
}

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                 */
/* ------------------------------------------------------------------ */

export function formatContextLength(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(0)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(0)}K`;
  return `${tokens}`;
}

export function formatPrice(
  value: number | undefined,
  currency?: string
): string {
  if (value === undefined || value === null) return "-";
  const sym = currency === "USD" ? "$" : "¥";
  return `${sym}${value}`;
}

export function planTypeLabel(type: string): string {
  switch (type) {
    case "api":
      return "API";
    case "subscription":
      return "订阅";
    case "pay-per-use":
      return "按量付费";
    case "enterprise":
      return "企业";
    default:
      return type;
  }
}

export function tierLabel(tier: string): string {
  switch (tier) {
    case "flagship":
      return "旗舰";
    case "standard":
      return "标准";
    case "budget":
      return "经济";
    case "free":
      return "免费";
    case "reasoning":
      return "推理";
    case "vision":
      return "视觉";
    case "long-context":
      return "长文本";
    case "cost-effective":
      return "经济";
    case "text":
      return "文本";
    default:
      return tier;
  }
}

const COMPANY_COLORS: Record<string, string> = {
  zhipu: "bg-blue-500",
  openai: "bg-emerald-600",
  anthropic: "bg-orange-500",
  google: "bg-blue-600",
  alibaba: "bg-orange-600",
  deepseek: "bg-indigo-500",
  moonshot: "bg-purple-500",
  bytedance: "bg-sky-500",
  baidu: "bg-red-500",
  minimax: "bg-teal-500",
};

export function getCompanyColor(companyId: string): string {
  return COMPANY_COLORS[companyId] || "bg-gray-500";
}

/**
 * Get the starting price info for a model.
 */
export function getStartingPrice(model: RModel): {
  isFree: boolean;
  label: string;
} {
  const hasFree = model.pricingPlans.some(
    (p) =>
      (p.pricing.price === 0 &&
        p.pricing.inputPrice === undefined &&
        p.pricing.outputPrice === undefined) ||
      (p.pricing.inputPrice === 0 && p.pricing.outputPrice === 0)
  );
  if (hasFree) return { isFree: true, label: "免费" };

  let minPrice: number | null = null;
  let currency = "CNY";
  let suffix = "";

  for (const plan of model.pricingPlans) {
    const { pricing } = plan;
    if (pricing.price !== undefined && pricing.price > 0) {
      if (minPrice === null || pricing.price < minPrice) {
        minPrice = pricing.price;
        currency = pricing.currency || "CNY";
        suffix = `/${pricing.period || "月"}`;
      }
    }
    if (pricing.inputPrice !== undefined && pricing.inputPrice > 0) {
      if (minPrice === null || pricing.inputPrice < minPrice) {
        minPrice = pricing.inputPrice;
        currency = pricing.currency || "CNY";
        suffix = "/1M tokens";
      }
    }
  }

  if (minPrice !== null) {
    const symbol = currency === "USD" ? "$" : "¥";
    return { isFree: false, label: `${symbol}${minPrice}${suffix}` };
  }

  return { isFree: false, label: "暂无定价" };
}

/**
 * Get all plans that belong to a specific version.
 */
export function getPlansForVersion(
  model: RModel,
  versionId: string
): RPlan[] {
  return model.pricingPlans.filter((p) => p.versionId === versionId);
}

/**
 * Get the latest version(s) for a model.
 */
export function getLatestVersions(model: RModel): RVersion[] {
  return model.versions.filter((v) => v.latest);
}

/**
 * Get the max context length across all versions.
 */
export function getMaxContext(model: RModel): number {
  if (model.versions.length === 0) return 0;
  return Math.max(...model.versions.map((v) => v.contextLength));
}

/**
 * Get the minimum API input price across all plans that have per-token pricing.
 */
export function getMinInputPrice(
  plans: RPlan[]
): { price: number; currency: string } | null {
  let min: number | null = null;
  let cur = "CNY";
  for (const p of plans) {
    if (p.pricing.inputPrice !== undefined && p.pricing.inputPrice > 0) {
      if (min === null || p.pricing.inputPrice < min) {
        min = p.pricing.inputPrice;
        cur = p.pricing.currency || "CNY";
      }
    }
  }
  return min !== null ? { price: min, currency: cur } : null;
}

/**
 * Get the minimum API output price across all plans that have per-token pricing.
 */
export function getMinOutputPrice(
  plans: RPlan[]
): { price: number; currency: string } | null {
  let min: number | null = null;
  let cur = "CNY";
  for (const p of plans) {
    if (p.pricing.outputPrice !== undefined && p.pricing.outputPrice > 0) {
      if (min === null || p.pricing.outputPrice < min) {
        min = p.pricing.outputPrice;
        cur = p.pricing.currency || "CNY";
      }
    }
  }
  return min !== null ? { price: min, currency: cur } : null;
}
