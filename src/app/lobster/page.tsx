"use client";

import { useState, useMemo } from "react";
import { getAllModels, getCompanyById } from "@/lib/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Flame, ArrowUpDown, ExternalLink } from "lucide-react";
import codingPlansData from "@/data/coding-plans.json";

const EXCHANGE_RATE = 7.2;

type FilterKey = "all" | "tier-20" | "tier-100" | "tier-200" | "domestic";

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "tier-20", label: "20$档" },
  { key: "tier-100", label: "100$档" },
  { key: "tier-200", label: "200$档" },
  { key: "domestic", label: "国产替代" },
];

interface SubscriptionPlan {
  id: string;
  planId: string;
  name: string;
  description: string;
  currency: string;
  price: number;
  period: string;
  popular: boolean;
  features: string[];
  restrictions: string[];
  discount?: {
    type: string;
    value: number;
    description: string;
  };
  companyId: string;
  companyName: string;
  companyLogo: string;
  companyCountry: string;
  modelId: string;
  modelName: string;
}

function getSubscriptionPlans(): SubscriptionPlan[] {
  const models = getAllModels();
  const plans: SubscriptionPlan[] = [];

  for (const model of models) {
    const company = getCompanyById(model.companyId);
    if (!company) continue;

    for (const plan of model.pricingPlans) {
      if (plan.planType !== "subscription") continue;

      const price = (plan.pricing.price ?? plan.pricing.amount ?? 0) as number;
      const currency = plan.pricing.currency;
      const period = plan.pricing.period;

      // Filter out free plans
      if (price === 0) continue;

      plans.push({
        id: `${model.id}-${plan.id}`,
        planId: plan.id,
        name: plan.name,
        description: plan.description ?? "",
        currency,
        price,
        period,
        popular: plan.popular,
        features: plan.limits?.features ?? [],
        restrictions: plan.limits?.restrictions ?? [],
        discount: plan.discount
          ? {
              type: plan.discount.type,
              value: plan.discount.value,
              description: plan.discount.description,
            }
          : undefined,
        companyId: company.id,
        companyName: company.name,
        companyLogo: company.logo,
        companyCountry: company.country,
        modelId: model.id,
        modelName: model.name,
      });
    }
  }

  return plans;
}

function priceInUSD(plan: SubscriptionPlan): number {
  if (plan.currency === "USD") return plan.price;
  if (plan.currency === "CNY") return plan.price / EXCHANGE_RATE;
  return plan.price;
}

function priceInCNY(plan: SubscriptionPlan): number {
  if (plan.currency === "CNY") return plan.price;
  if (plan.currency === "USD") return plan.price * EXCHANGE_RATE;
  return plan.price;
}

function formatPrice(price: number, currency: string): string {
  if (currency === "CNY") return `¥${price}`;
  if (currency === "USD") return `$${price}`;
  return `${price}`;
}

function getCountryFlag(country: string): string {
  if (country === "美国") return "🇺🇸";
  if (country === "中国") return "🇨🇳";
  return "🌍";
}

/** 根据 companyId 返回对应厂商的 coding 套餐购买 URL */
function getBuyUrlByCompanyId(companyId: string): string {
  // 优先从 coding-plans.json 匹配 providerId 对应的 buyUrl
  const plan = (codingPlansData as { plans: { providerId: string; buyUrl?: string; website?: string }[] }).plans.find(
    (p) => p.providerId === companyId
  );
  if (plan?.buyUrl) return plan.buyUrl;
  if (plan?.website) return plan.website;

  // 硬编码匹配关系
  const urlMap: Record<string, string> = {
    zhipu: "https://www.bigmodel.cn/glm-coding?ic=CWJW4TEIY7",
    openai: "https://chatgpt.com/gg/69c643abc830819a90a58628f3a8b174#pricing",
    anthropic: "https://claude.ai/upgrade?from=menu",
    google: "https://ai.google.dev/pricing",
    moonshot: "https://www.kimi.com/code?track_id=f08ed765-c5b6-436a-ad28-9f97784c6fcd",
    minimax: "https://platform.minimaxi.com/subscribe/token-plan?code=CtXxhdeqpi&source=link",
    // 没有 coding 套餐的厂商，用内部模型页作为 fallback
    bytedance: "/model/doubao",
    baidu: "/model/ernie",
    deepseek: "/model/deepseek",
    alibaba: "/model/qwen",
  };
  return urlMap[companyId] ?? `/model/${companyId}`;
}

function matchesFilter(plan: SubscriptionPlan, filter: FilterKey): boolean {
  if (filter === "all") return true;
  if (filter === "domestic") return plan.currency === "CNY" && plan.price > 0;

  const usd = priceInUSD(plan);
  if (filter === "tier-20") return usd >= 15 && usd <= 30;
  if (filter === "tier-100") return usd >= 80 && usd <= 120;
  if (filter === "tier-200") return usd >= 150;
  return true;
}

function computeYearlyPrice(plan: SubscriptionPlan): number | null {
  if (!plan.discount) return null;
  const monthly = plan.price;
  // Discount types like "包季9折/包年8折" or percentage-based
  const desc = plan.discount.description ?? "";
  const type = plan.discount.type ?? "";
  const val = plan.discount.value ?? 0;

  if (type.includes("年") || desc.includes("年")) {
    // If description mentions annual, parse the monthly equivalent
    const match = desc.match(/(\d+\.?\d*)元\/月/);
    if (match) return parseFloat(match[1]) * 12;
    // fallback: use discount value as percentage off
    if (val > 0 && val < 100) return monthly * 12 * (1 - val / 100);
    return null;
  }
  return null;
}

// Pre-compute all plans at module level
const allPlans = getSubscriptionPlans();

export default function LobsterPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sortAsc, setSortAsc] = useState(true);

  const filteredPlans = useMemo(() => {
    let result = allPlans.filter((p) => matchesFilter(p, filter));
    result.sort((a, b) => {
      const diff = priceInUSD(a) - priceInUSD(b);
      return sortAsc ? diff : -diff;
    });
    return result;
  }, [filter, sortAsc]);

  const stats = useMemo(() => {
    const total = allPlans.length;
    const cnyPrices = allPlans
      .map((p) => priceInCNY(p))
      .filter((p) => p > 0);
    const minCNY = cnyPrices.length > 0 ? Math.min(...cnyPrices) : 0;
    return { total, minCNY };
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/[0.04] via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,var(--color-primary)/0.08,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
            <Flame className="size-3" />
            <span>高端订阅</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            龙虾套餐
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {" "}国际 AI 订阅精选
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            聚焦 OpenAI、Anthropic、Google 等国际顶尖 AI 厂商的付费订阅方案，
            以及 GLM Coding Plan 等高性价比替代
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {stats.total} 个订阅方案
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              最低 ¥{stats.minCNY}/月起
            </span>
          </div>
        </div>
      </section>

      {/* Filter + Sort Bar */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {FILTER_OPTIONS.map((opt) => (
              <Button
                key={opt.key}
                variant={filter === opt.key ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs px-3 whitespace-nowrap filter-btn min-h-[36px]"
                onClick={() => setFilter(opt.key)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs shrink-0"
            onClick={() => setSortAsc(!sortAsc)}
          >
            <ArrowUpDown className="size-3 mr-1" />
            价格 {sortAsc ? "↑ 低到高" : "↓ 高到低"}
          </Button>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredPlans.map((plan) => (
            <SubscriptionCard key={plan.id} plan={plan} />
          ))}
        </div>
        {filteredPlans.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            该分类下暂无订阅方案
          </div>
        )}
      </section>

      {/* Comparison Table */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          订阅方案对比
        </h2>
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                  套餐名
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                  月价
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                  年价
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                  核心特点
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                  限制
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map((plan) => {
                const yearly = computeYearlyPrice(plan);
                return (
                  <tr
                    key={plan.id}
                    className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={plan.companyLogo}
                          alt={plan.companyName}
                          width={20}
                          height={20}
                          className="size-5 shrink-0 rounded object-contain"
                        />
                        <div>
                          <span className="font-medium text-foreground">
                            {plan.name}
                          </span>
                          {plan.popular && (
                            <Badge
                              variant="secondary"
                              className="ml-1.5 text-[10px] bg-primary/10 text-primary border-0 px-1.5 py-0"
                            >
                              热门
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-semibold text-foreground">
                        {formatPrice(plan.price, plan.currency)}/{plan.period === "month" ? "月" : plan.period === "year" ? "年" : plan.period}
                      </span>
                      {plan.currency === "USD" && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          (≈¥{priceInCNY(plan).toFixed(0)})
                        </span>
                      )}
                      {plan.currency === "CNY" && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          (≈${priceInUSD(plan).toFixed(1)})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                      {yearly ? (
                        <>
                          <span className="text-foreground font-medium">
                            ¥{yearly.toFixed(0)}
                          </span>
                          {plan.currency === "USD" && (
                            <span className="ml-1">
                              (${(yearly / EXCHANGE_RATE).toFixed(0)})
                            </span>
                          )}
                        </>
                      ) : plan.discount ? (
                        <span>{plan.discount.description}</span>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {plan.features.slice(0, 3).map((f) => (
                          <span
                            key={f}
                            className="inline-flex items-center gap-0.5 rounded bg-muted/60 px-1.5 py-0.5 text-xs text-muted-foreground"
                          >
                            {f}
                          </span>
                        ))}
                        {plan.features.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{plan.features.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {plan.restrictions.length > 0
                          ? plan.restrictions.map((r) => (
                              <span
                                key={r}
                                className="inline-flex items-center gap-0.5 rounded bg-muted/40 px-1.5 py-0.5 text-xs text-muted-foreground/80"
                              >
                                {r}
                              </span>
                            ))
                          : <span className="text-xs text-muted-foreground">-</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ========== Card Component ========== */

function SubscriptionCard({ plan }: { plan: SubscriptionPlan }) {
  const convertedUSD = priceInUSD(plan);
  const convertedCNY = priceInCNY(plan);
  const yearly = computeYearlyPrice(plan);

  return (
    <Card
      className={`group relative transition-all duration-300 border-border/60 bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.04] h-full flex flex-col overflow-hidden card-hover ${
        plan.popular ? "ring-1 ring-primary/30 border-primary/20" : ""
      }`}
    >
      {/* Popular top bar */}
      {plan.popular && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-primary" />
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={plan.companyLogo}
              alt={plan.companyName}
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-full object-contain bg-muted/50 p-0.5"
            />
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-foreground truncate leading-tight">
                {plan.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-muted-foreground">
                  {plan.companyName}
                </span>
                <span className="text-xs" title={plan.companyCountry}>
                  {getCountryFlag(plan.companyCountry)}
                </span>
              </div>
            </div>
          </div>
          {plan.popular && (
            <Badge
              variant="secondary"
              className="shrink-0 text-xs bg-primary/10 text-primary border-0"
            >
              热门
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        {/* Price */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(plan.price, plan.currency)}
            </span>
            <span className="text-sm text-muted-foreground">
              /{plan.period === "month" ? "月" : plan.period === "year" ? "年" : plan.period}
            </span>
          </div>
          {/* Converted price */}
          {plan.currency === "USD" && (
            <p className="text-xs text-muted-foreground mt-0.5">
              ≈ ¥{convertedCNY.toFixed(0)}/月
            </p>
          )}
          {plan.currency === "CNY" && (
            <p className="text-xs text-muted-foreground mt-0.5">
              ≈ ${convertedUSD.toFixed(1)}/月
            </p>
          )}
        </div>

        {/* Description */}
        {plan.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {plan.description}
          </p>
        )}

        {/* Discount */}
        {plan.discount && (
          <div className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
            <p className="text-xs font-medium text-primary">
              {plan.discount.type}
            </p>
            <p className="text-xs text-primary/70 mt-0.5">
              {plan.discount.description}
            </p>
          </div>
        )}

        {/* Features */}
        {plan.features.length > 0 && (
          <div>
            <p className="text-xs font-medium text-foreground mb-1.5">包含功能</p>
            <ul className="space-y-1">
              {plan.features.slice(0, 5).map((f) => (
                <li key={f} className="flex items-start gap-1.5">
                  <Check className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground">{f}</span>
                </li>
              ))}
              {plan.features.length > 5 && (
                <li className="text-xs text-muted-foreground pl-5">
                  +{plan.features.length - 5} 更多功能
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Restrictions */}
        {plan.restrictions.length > 0 && (
          <div>
            <p className="text-xs font-medium text-foreground mb-1.5">使用限制</p>
            <ul className="space-y-1">
              {plan.restrictions.map((r) => (
                <li key={r} className="flex items-start gap-1.5">
                  <AlertCircle className="size-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground/70">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      {/* Footer with yearly price */}
      <div className="border-t border-border/50 px-6 py-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {yearly ? `年付 ¥${yearly.toFixed(0)}` : "月付订阅"}
        </span>
        {(() => {
          const buyUrl = getBuyUrlByCompanyId(plan.companyId);
          const isExternal = buyUrl.startsWith("http");
          return (
            <a
              href={buyUrl}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`text-xs font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1${
                isExternal ? " underline underline-offset-2" : ""
              }`}
            >
              {isExternal && <ExternalLink className="size-3" />}
              立即订阅
            </a>
          );
        })()}
      </div>
    </Card>
  );
}
