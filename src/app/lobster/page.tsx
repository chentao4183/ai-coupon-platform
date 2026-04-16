"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getAllModels, getCompanyById } from "@/lib/data";
import { Check, AlertCircle, Flame, ArrowUpDown, ExternalLink, GitCompareArrows } from "lucide-react";
import codingPlansData from "@/data/coding-plans.json";

const EXCHANGE_RATE = 7.2;

type FilterKey = "all" | "cny-under100" | "cny-100-300" | "cny-300-500" | "cny-over500" | "domestic";

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "cny-under100", label: "¥100以内" },
  { key: "cny-100-300", label: "¥100-300" },
  { key: "cny-300-500", label: "¥300-500" },
  { key: "cny-over500", label: "¥500以上" },
  { key: "domestic", label: "国产替代" },
];

/** 价格区间引导文案 */
const PRICE_RANGE_GUIDANCE: Record<string, { title: string; description: string; compareParam: string }> = {
  "cny-under100": {
    title: "入门首选",
    description: "满足日常编程需求，轻量级使用场景的性价比之选",
    compareParam: "under100",
  },
  "cny-100-300": {
    title: "性价比之选",
    description: "功能与价格的最佳平衡，适合大多数开发者的主力方案",
    compareParam: "100-300",
  },
  "cny-300-500": {
    title: "专业级工具",
    description: "适合重度使用者，充足的配额应对大型项目开发",
    compareParam: "300-500",
  },
  "cny-over500": {
    title: "旗舰体验",
    description: "追求极致性能，享受最高优先级和最大使用额度",
    compareParam: "over500",
  },
};

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

  const cny = priceInCNY(plan);
  if (filter === "cny-under100") return cny > 0 && cny < 100;
  if (filter === "cny-100-300") return cny >= 100 && cny <= 300;
  if (filter === "cny-300-500") return cny > 300 && cny <= 500;
  if (filter === "cny-over500") return cny > 500;
  return true;
}

/** 获取方案所属的价格区间 key */
function getPriceRange(plan: SubscriptionPlan): FilterKey | null {
  if (plan.currency === "CNY" && plan.price > 0) return "domestic";
  const cny = priceInCNY(plan);
  if (cny > 0 && cny < 100) return "cny-under100";
  if (cny >= 100 && cny <= 300) return "cny-100-300";
  if (cny > 300 && cny <= 500) return "cny-300-500";
  if (cny > 500) return "cny-over500";
  return null;
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

  /** "全部" 模式下按价格区间分组 */
  const groupedPlans = useMemo(() => {
    if (filter !== "all") return null;
    const groups: { key: FilterKey; label: string; plans: SubscriptionPlan[] }[] = [];
    const rangeKeys: FilterKey[] = ["cny-under100", "cny-100-300", "cny-300-500", "cny-over500", "domestic"];
    const labels: Record<string, string> = {
      "cny-under100": "¥100以内",
      "cny-100-300": "¥100-300",
      "cny-300-500": "¥300-500",
      "cny-over500": "¥500以上",
      domestic: "国产替代",
    };
    for (const key of rangeKeys) {
      const plans = filteredPlans.filter((p) => {
        const range = getPriceRange(p);
        return range === key;
      });
      if (plans.length > 0) {
        groups.push({ key, label: labels[key] ?? key, plans });
      }
    }
    return groups;
  }, [filter, filteredPlans]);

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
      <section className="bg-[#000000]">
        <div className="mx-auto flex min-h-[420px] max-w-[980px] flex-col items-center justify-center px-6 py-20 text-center sm:min-h-[480px] sm:py-28">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 mb-6">
            <Flame className="size-3" />
            <span>{stats.total} 个订阅方案 · 最低 ¥{stats.minCNY}/月起</span>
          </div>
          <h1 className="heading-hero text-white">
            龙虾套餐
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[21px] font-normal leading-relaxed text-white/80">
            聚焦 OpenAI、Anthropic、Google 等国际顶尖 AI 厂商的付费订阅方案，以及 GLM Coding Plan 等高性价比替代。
          </p>
        </div>
      </section>

      {/* Filter + Sort Bar - T10 Apple 风格 */}
      <section className="mx-auto w-full max-w-[var(--content-max-width)] px-4 pb-6 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                className={`label-text whitespace-nowrap px-4 py-2 rounded-[11px] transition-colors cursor-pointer ${
                  filter === opt.key
                    ? "text-apple-accent bg-apple-accent/10"
                    : "text-apple-text-secondary bg-apple-surface-elevated hover:bg-apple-surface-elevated/80"
                }`}
                onClick={() => setFilter(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            className="caption-text inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] text-apple-text-secondary bg-apple-surface-elevated hover:bg-apple-surface-elevated/80 transition-colors cursor-pointer shrink-0"
            onClick={() => setSortAsc(!sortAsc)}
          >
            <ArrowUpDown className="size-3.5" />
            价格 {sortAsc ? "↑ 低到高" : "↓ 高到低"}
          </button>
        </div>
      </section>

      {/* Cards Grid - T9 Apple 风格 */}
      <section className="mx-auto w-full max-w-[var(--content-max-width)] px-4 pb-6 sm:px-6">
        {groupedPlans ? (
          /* "全部" 模式：按价格区间分组显示 */
          groupedPlans.map((group) => {
            const guidance = PRICE_RANGE_GUIDANCE[group.key];
            return (
              <div key={group.key} className="mb-12 last:mb-0">
                {/* 区间标题 + 引导文案 */}
                <div className="mb-5">
                  <div className="flex items-center justify-between">
                    <h2 className="heading-card text-foreground">{group.label}</h2>
                    {guidance && (
                      <Link
                        href={`/compare?range=${guidance.compareParam}`}
                        className="inline-flex items-center gap-1 caption-text text-apple-link hover:text-apple-accent transition-colors"
                      >
                        <GitCompareArrows className="size-3.5" />
                        查看同类对比
                      </Link>
                    )}
                  </div>
                  {guidance && (
                    <p className="mt-1.5 caption-text text-apple-text-tertiary">
                      {guidance.title} · {guidance.description}
                    </p>
                  )}
                  {!guidance && group.key === "domestic" && (
                    <p className="mt-1.5 caption-text text-apple-text-tertiary">
                      国产替代 · 高性价比国产品牌，支持丰富编程工具生态
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {group.plans.map((plan) => (
                    <SubscriptionCard key={plan.id} plan={plan} priceRangeKey={group.key} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          /* 单一筛选模式 */
          <>
            {/* 筛选器引导文案 */}
            {PRICE_RANGE_GUIDANCE[filter] && (
              <div className="mb-5 flex items-center justify-between">
                <p className="caption-text text-apple-text-tertiary">
                  {PRICE_RANGE_GUIDANCE[filter].title} · {PRICE_RANGE_GUIDANCE[filter].description}
                </p>
                <Link
                  href={`/compare?range=${PRICE_RANGE_GUIDANCE[filter].compareParam}`}
                  className="inline-flex items-center gap-1 caption-text text-apple-link hover:text-apple-accent transition-colors"
                >
                  <GitCompareArrows className="size-3.5" />
                  查看同类对比
                </Link>
              </div>
            )}
            {filter === "domestic" && (
              <div className="mb-5">
                <p className="caption-text text-apple-text-tertiary">
                  国产替代 · 高性价比国产品牌，支持丰富编程工具生态
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredPlans.map((plan) => (
                <SubscriptionCard key={plan.id} plan={plan} priceRangeKey={filter} />
              ))}
            </div>
          </>
        )}
        {filteredPlans.length === 0 && (
          <div className="py-20 text-center text-apple-text-tertiary">
            该分类下暂无订阅方案
          </div>
        )}
      </section>

      {/* Comparison Table - Apple 风格 */}
      <section className="mx-auto w-full max-w-[var(--content-max-width)] px-4 pb-12 sm:px-6">
        <h2 className="heading-card text-foreground mb-5">
          订阅方案对比
        </h2>
        <div className="overflow-x-auto rounded-2xl bg-apple-surface-elevated">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-apple-divider">
                <th className="label-text px-5 py-3.5 text-left text-apple-text-tertiary whitespace-nowrap">
                  套餐名
                </th>
                <th className="label-text px-5 py-3.5 text-left text-apple-text-tertiary whitespace-nowrap">
                  月价
                </th>
                <th className="label-text px-5 py-3.5 text-left text-apple-text-tertiary whitespace-nowrap">
                  年价
                </th>
                <th className="label-text px-5 py-3.5 text-left text-apple-text-tertiary whitespace-nowrap">
                  核心特点
                </th>
                <th className="label-text px-5 py-3.5 text-left text-apple-text-tertiary whitespace-nowrap">
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
                    className="border-b border-apple-divider last:border-0 hover:bg-apple-accent/[0.03] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
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
                            <span className="ml-1.5 text-[10px] font-medium text-apple-accent">
                              热门
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-semibold text-foreground">
                        {formatPrice(plan.price, plan.currency)}/{plan.period === "month" ? "月" : plan.period === "year" ? "年" : plan.period}
                      </span>
                      {plan.currency === "USD" && (
                        <span className="ml-1 text-xs text-apple-text-tertiary">
                          (≈¥{priceInCNY(plan).toFixed(0)})
                        </span>
                      )}
                      {plan.currency === "CNY" && (
                        <span className="ml-1 text-xs text-apple-text-tertiary">
                          (≈${priceInUSD(plan).toFixed(1)})
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-apple-text-tertiary">
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
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {plan.features.slice(0, 3).map((f) => (
                          <span
                            key={f}
                            className="inline-flex items-center rounded-[6px] bg-apple-accent/[0.06] px-2 py-0.5 text-xs text-apple-text-secondary"
                          >
                            {f}
                          </span>
                        ))}
                        {plan.features.length > 3 && (
                          <span className="text-xs text-apple-text-tertiary">
                            +{plan.features.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {plan.restrictions.length > 0
                          ? plan.restrictions.map((r) => (
                              <span
                                key={r}
                                className="inline-flex items-center rounded-[6px] bg-apple-surface px-2 py-0.5 text-xs text-apple-text-tertiary"
                              >
                                {r}
                              </span>
                            ))
                          : <span className="text-xs text-apple-text-tertiary">-</span>}
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

/* ========== Card Component - T9 Apple 风格重构 ========== */

function SubscriptionCard({ plan, priceRangeKey }: { plan: SubscriptionPlan; priceRangeKey?: FilterKey }) {
  const convertedUSD = priceInUSD(plan);
  const convertedCNY = priceInCNY(plan);
  const yearly = computeYearlyPrice(plan);

  const compareUrl = priceRangeKey && PRICE_RANGE_GUIDANCE[priceRangeKey]
    ? `/compare?range=${PRICE_RANGE_GUIDANCE[priceRangeKey].compareParam}`
    : null;

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-apple-surface-elevated transition-colors duration-200 hover:bg-apple-surface-elevated/80 ${
        plan.popular ? "border-l-2 border-apple-accent" : ""
      }`}
    >
      <div className="flex flex-1 flex-col p-6 pb-4">
        {/* 价格 - 视觉中心，超大字号 */}
        <div className="mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-[40px] font-semibold leading-none tracking-tight text-foreground">
              {formatPrice(plan.price, plan.currency)}
            </span>
            <span className="text-sm text-apple-text-tertiary">
              /{plan.period === "month" ? "月" : plan.period === "year" ? "年" : plan.period}
            </span>
          </div>
          {/* 转换价格 */}
          {plan.currency === "USD" && (
            <p className="mt-1 caption-text text-apple-text-tertiary">
              ≈ ¥{convertedCNY.toFixed(0)}/月
            </p>
          )}
          {plan.currency === "CNY" && (
            <p className="mt-1 caption-text text-apple-text-tertiary">
              ≈ ${convertedUSD.toFixed(1)}/月
            </p>
          )}
        </div>

        {/* 公司名称 + 套餐名 */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={plan.companyLogo}
            alt={plan.companyName}
            width={20}
            height={20}
            className="size-5 shrink-0 rounded object-contain"
          />
          <span className="text-sm font-medium text-foreground truncate">
            {plan.companyName}
          </span>
          <span className="text-xs" title={plan.companyCountry}>
            {getCountryFlag(plan.companyCountry)}
          </span>
          <span className="text-apple-text-tertiary">·</span>
          <span className="caption-text text-apple-text-tertiary truncate">
            {plan.name}
          </span>
          {plan.popular && (
            <span className="ml-auto shrink-0 label-text text-apple-accent">
              热门
            </span>
          )}
        </div>

        {/* 折扣信息 */}
        {plan.discount && (
          <div className="mb-3 rounded-xl bg-apple-accent/[0.06] px-4 py-2.5">
            <p className="text-xs font-medium text-apple-accent">
              {plan.discount.type}
            </p>
            <p className="mt-0.5 caption-text text-apple-text-secondary">
              {plan.discount.description}
            </p>
          </div>
        )}

        {/* 包含功能 - 限制 3-5 项 */}
        {plan.features.length > 0 && (
          <div className="mb-3">
            <p className="label-text text-apple-text-tertiary mb-2">包含功能</p>
            <ul className="space-y-1">
              {plan.features.slice(0, 4).map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="size-3.5 text-apple-accent shrink-0 mt-0.5" />
                  <span className="caption-text text-apple-text-secondary">{f}</span>
                </li>
              ))}
              {plan.features.length > 4 && (
                <li className="caption-text text-apple-text-tertiary pl-5">
                  +{plan.features.length - 4} 更多
                </li>
              )}
            </ul>
          </div>
        )}

        {/* 使用限制 - 限制 3 项 */}
        {plan.restrictions.length > 0 && (
          <div className="mb-3">
            <p className="label-text text-apple-text-tertiary mb-2">使用限制</p>
            <ul className="space-y-1">
              {plan.restrictions.slice(0, 3).map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <AlertCircle className="size-3.5 text-apple-text-tertiary shrink-0 mt-0.5" />
                  <span className="caption-text text-apple-text-tertiary">{r}</span>
                </li>
              ))}
              {plan.restrictions.length > 3 && (
                <li className="caption-text text-apple-text-tertiary pl-5">
                  +{plan.restrictions.length - 3} 更多
                </li>
              )}
            </ul>
          </div>
        )}

        {/* 年付 / 对比链接 */}
        <div className="mt-auto flex items-center gap-3 pt-2">
          <span className="caption-text text-apple-text-tertiary">
            {yearly ? `年付 ¥${yearly.toFixed(0)}` : "月付订阅"}
          </span>
          {compareUrl && (
            <Link
              href={compareUrl}
              className="inline-flex items-center gap-1 caption-text text-apple-link hover:text-apple-accent transition-colors"
            >
              <GitCompareArrows className="size-3" />
              同类对比
            </Link>
          )}
        </div>
      </div>

      {/* 立即订阅按钮 - 固定在卡片底部 */}
      <div className="px-6 pb-6 pt-2">
        {(() => {
          const buyUrl = getBuyUrlByCompanyId(plan.companyId);
          const isExternal = buyUrl.startsWith("http");
          return (
            <a
              href={buyUrl}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-apple-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              立即订阅
              {isExternal && <ExternalLink className="size-3.5" />}
            </a>
          );
        })()}
      </div>
    </div>
  );
}
