/**
 * API 按量付费数据提取和工具函数
 * 从 models.json 中提取所有 planType="api" 的定价计划
 */
import modelsData from "@/data/models.json";
import type { Model, ModelCompany } from "@/types/model";

interface ModelData {
  companies: ModelCompany[];
  models: Model[];
}

const data = modelsData as unknown as ModelData;

/** API 按量付费计划（扁平化提取） */
export interface ApiPricingRow {
  id: string;
  modelName: string;
  modelNameEn: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  companyCountry: string;
  planName: string;
  planDescription?: string;
  inputPrice: number;
  outputPrice: number;
  cacheHitPrice?: number;
  currency: string;
  unit: string;
  versionTier?: string;
  contextLength?: number;
  popular: boolean;
  features: string[];
  restrictions: string[];
  modelTags: string[];
  /** 换算为 USD/1M tokens 的输入价格 */
  inputPriceUSD: number;
  /** 换算为 USD/1M tokens 的输出价格 */
  outputPriceUSD: number;
  /** 最新版本的 MMLU 分数 (0-100) */
  mmluScore?: number;
}

const CNY_TO_USD = 1 / 7.25;

/** 从所有模型中提取 API 按量付费计划 */
export function getAllApiPricing(): ApiPricingRow[] {
  const rows: ApiPricingRow[] = [];

  for (const model of data.models) {
    const company = data.companies.find((c) => c.id === model.companyId);
    if (!company) continue;

    for (const plan of model.pricingPlans) {
      // Only API / pay-per-use plans
      if (plan.planType !== "api" && plan.planType !== "pay-per-use") continue;

      const pricing = plan.pricing as Record<string, unknown>;
      const inputPrice = (pricing.inputPrice as number) ?? 0;
      const outputPrice = (pricing.outputPrice as number) ?? 0;
      const cacheHitPrice = (pricing.cacheHitPrice as number) ?? undefined;
      const currency = (pricing.currency as string) ?? "CNY";
      const unit = (pricing.unit as string) ?? "1M tokens";

      // Find the version for context length and tier
      const version = model.versions.find((v) => v.id === plan.versionId);

      const isCNY = currency === "CNY";
      const inputPriceUSD = isCNY ? inputPrice * CNY_TO_USD : inputPrice;
      const outputPriceUSD = isCNY ? outputPrice * CNY_TO_USD : outputPrice;

      rows.push({
        id: plan.id,
        modelName: model.name,
        modelNameEn: model.nameEn,
        companyId: model.companyId,
        companyName: company.name,
        companyLogo: company.logo,
        companyCountry: company.country,
        planName: plan.name,
        planDescription: (plan as unknown as Record<string, unknown>).description as string | undefined,
        inputPrice,
        outputPrice,
        cacheHitPrice,
        currency,
        unit,
        versionTier: version
          ? (version as unknown as Record<string, unknown>).tier as string | undefined
          : undefined,
        contextLength: version?.contextLength,
        popular: plan.popular,
        features: plan.limits?.features ?? [],
        restrictions: plan.limits?.restrictions ?? [],
        modelTags: model.tags,
        inputPriceUSD: Math.round(inputPriceUSD * 1000) / 1000,
        outputPriceUSD: Math.round(outputPriceUSD * 1000) / 1000,
        mmluScore: (() => {
          const latest = model.versions.find((v) => v.isLatest);
          if (!latest) return undefined;
          const bm = (latest as unknown as Record<string, unknown>).benchmarks as Record<string, number> | undefined;
          return bm?.mmlu;
        })(),
      });
    }
  }

  return rows;
}

/** 获取所有公司（用于筛选） */
export function getApiPricingCompanies(): {
  id: string;
  name: string;
  country: string;
}[] {
  const seen = new Set<string>();
  const rows = getAllApiPricing();
  for (const r of rows) {
    if (!seen.has(r.companyId)) {
      seen.add(r.companyId);
    }
  }
  return data.companies
    .filter((c) => seen.has(c.id))
    .map((c) => ({ id: c.id, name: c.name, country: c.country }));
}

/** 获取所有模型标签（用于筛选） */
export function getApiPricingTags(): string[] {
  const tags = new Set<string>();
  const rows = getAllApiPricing();
  for (const r of rows) {
    for (const tag of r.modelTags) {
      tags.add(tag);
    }
  }
  return Array.from(tags);
}

export type ApiPricingSortOption =
  | "recommended"
  | "input-asc"
  | "input-desc"
  | "output-asc"
  | "output-desc"
  | "value";

/** 排序 API 定价行 */
export function sortApiPricing(
  rows: ApiPricingRow[],
  sortBy: ApiPricingSortOption
): ApiPricingRow[] {
  const sorted = [...rows];
  switch (sortBy) {
    case "recommended":
      return sorted.sort((a, b) => {
        if (a.popular !== b.popular) return a.popular ? -1 : 1;
        return a.inputPriceUSD - b.inputPriceUSD;
      });
    case "input-asc":
      return sorted.sort((a, b) => a.inputPriceUSD - b.inputPriceUSD);
    case "input-desc":
      return sorted.sort((a, b) => b.inputPriceUSD - a.inputPriceUSD);
    case "output-asc":
      return sorted.sort((a, b) => a.outputPriceUSD - b.outputPriceUSD);
    case "output-desc":
      return sorted.sort((a, b) => b.outputPriceUSD - a.outputPriceUSD);
    case "value":
      // 综合评分 = (input+output)均价，越低越好
      return sorted.sort((a, b) => {
        const aAvg = (a.inputPriceUSD + a.outputPriceUSD) / 2;
        const bAvg = (b.inputPriceUSD + b.outputPriceUSD) / 2;
        return aAvg - bAvg;
      });
    default:
      return sorted;
  }
}

/** 格式化价格 */
export function formatApiPrice(price: number, currency: string): string {
  if (price === 0) return "免费";
  const sym = currency === "CNY" ? "¥" : "$";
  return `${sym}${price}`;
}

/** 格式化 USD 价格 */
export function formatUSDPrice(price: number): string {
  if (price === 0) return "免费";
  return `$${price.toFixed(2)}`;
}
