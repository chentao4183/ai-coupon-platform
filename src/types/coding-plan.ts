/**
 * TypeScript types for coding-plans.json
 * 编程专用套餐对比数据
 */

export interface CodingPlanPricing {
  currency: "CNY" | "USD";
  price: number;
  period: "month" | "year";
  discount?: string;
}

export interface CodingPlanQuota {
  promptsPer5h: number | null;
  promptsPerWeek: number | null;
  description: string;
}

export interface CodingPlan {
  id: string;
  providerId: string;
  providerName: string;
  providerLogo: string;
  name: string;
  tier: "lite" | "pro" | "max" | "ultra";
  pricing: CodingPlanPricing;
  quota: CodingPlanQuota;
  models: string[];
  modelsNote?: string;
  supportedTools: string[];
  toolCount: string;
  mcpFeatures: string[];
  contextLength: string;
  website: string;
  buyUrl: string;
  tags: string[];
  bestFor: string;
  pros: string[];
  cons: string[];
  popular: boolean;
  /** 相对于 Claude Pro 的等效用量倍数 */
  claudeProEquivalent: string;
  /** 相对于 Claude Pro 的价格比 */
  claudeProPriceRatio: number;
}

export interface CodingPlansData {
  lastUpdated: string;
  description: string;
  plans: CodingPlan[];
}
