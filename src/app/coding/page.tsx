"use client";

import { useMemo } from "react";
import { getAllCodingPlans } from "@/lib/coding-plans";
import { Code2, ExternalLink } from "lucide-react";
import Link from "next/link";

const allPlans = getAllCodingPlans();

interface ProviderGroup {
  providerId: string;
  providerName: string;
  providerLogo: string;
  website: string;
  buyUrl: string;
  plans: (typeof allPlans)[number][];
  // Fields that are the same across all plans in this provider
  models: string[];
  modelsNote: string;
  supportedTools: string[];
  toolCount: string;
  contextLength: string;
}

function groupByProvider(plans: (typeof allPlans)[number][]): ProviderGroup[] {
  const map = new Map<string, ProviderGroup>();

  for (const p of plans) {
    if (!map.has(p.providerId)) {
      map.set(p.providerId, {
        providerId: p.providerId,
        providerName: p.providerName,
        providerLogo: p.providerLogo,
        website: p.website,
        buyUrl: p.buyUrl,
        plans: [],
        models: p.models,
        modelsNote: p.modelsNote || "",
        supportedTools: p.supportedTools,
        toolCount: p.toolCount,
        contextLength: p.contextLength,
      });
    }
    map.get(p.providerId)!.plans.push(p);
  }

  return Array.from(map.values());
}

const TIER_LABELS: Record<string, string> = {
  lite: "Lite",
  pro: "Pro",
  max: "Max",
  ultra: "Ultra",
};

const TIER_CLASS: Record<string, string> = {
  lite: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  pro: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  max: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  ultra: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
};

function formatPrice(plan: (typeof allPlans)[number]): string {
  if (plan.pricing.currency === "USD") {
    const cny = Math.round(plan.pricing.price * 7.25);
    return `$${plan.pricing.price}/月 (≈¥${cny})`;
  }
  return `¥${plan.pricing.price}/月`;
}

export default function CodingPlansPage() {
  const providers = useMemo(() => groupByProvider(allPlans), []);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/[0.04] via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,var(--color-primary)/0.08,transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 sm:pb-14 sm:pt-18 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-5">
            <Code2 className="size-3" />
            <span>{allPlans.length} 个套餐 · {providers.length} 家厂商</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            AI 编程套餐
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"> 横向对比</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            按厂商分类，一行一个套餐，配额与价格一目了然
          </p>
        </div>
      </section>

      {/* Provider Sections */}
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="space-y-8">
          {providers.map((group) => (
            <ProviderSection key={group.providerId} group={group} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProviderSection({ group }: { group: ProviderGroup }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
      {/* Provider Header */}
      <div className="px-5 py-4 border-b border-border/50 bg-muted/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: logo + name + meta */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={group.providerLogo}
              alt={group.providerName}
              width={36}
              height={36}
              className="size-9 shrink-0 rounded-full object-contain bg-muted/50"
            />
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-foreground leading-tight">
                {group.providerName}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  模型: {group.models.slice(0, 4).join("、")}
                  {group.models.length > 4 && ` +${group.models.length - 4}`}
                </span>
                <span>·</span>
                <span>{group.contextLength} 上下文</span>
                <span>·</span>
                <span>{group.toolCount} 工具</span>
              </div>
            </div>
          </div>

          {/* Right: tools + buy link */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex flex-wrap gap-1 max-w-[280px]">
              {group.supportedTools.slice(0, 6).map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center rounded-md bg-muted/60 px-1.5 py-0.5 text-[11px] text-muted-foreground"
                >
                  {tool}
                </span>
              ))}
              {group.supportedTools.length > 6 && (
                <span className="text-[11px] text-muted-foreground">
                  +{group.supportedTools.length - 6}
                </span>
              )}
            </div>
            <a
              href={group.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              前往购买
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Plans Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-xs text-muted-foreground">
              <th className="px-5 py-2.5 text-left font-medium w-[90px]">档位</th>
              <th className="px-5 py-2.5 text-left font-medium">配额</th>
              <th className="px-5 py-2.5 text-left font-medium hidden sm:table-cell">等效用量</th>
              <th className="px-5 py-2.5 text-left font-medium hidden lg:table-cell">亮点</th>
              <th className="px-5 py-2.5 text-right font-medium w-[140px]">价格</th>
            </tr>
          </thead>
          <tbody>
            {group.plans.map((plan, idx) => (
              <PlanRow
                key={plan.id}
                plan={plan}
                isLast={idx === group.plans.length - 1}
                defaultModelsNote={group.modelsNote}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlanRow({
  plan,
  isLast,
  defaultModelsNote,
}: {
  plan: (typeof allPlans)[number];
  isLast: boolean;
  defaultModelsNote: string;
}) {
  const tierLabel = TIER_LABELS[plan.tier] || plan.tier;
  const tierClass = TIER_CLASS[plan.tier] || TIER_CLASS.pro;

  return (
    <tr
      className={`border-b border-border/30 transition-colors hover:bg-muted/20 ${
        isLast ? "border-b-0" : ""
      } ${plan.popular ? "bg-primary/[0.03]" : ""}`}
    >
      {/* Tier */}
      <td className="px-5 py-3">
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${tierClass}`}
        >
          {tierLabel}
        </span>
        {plan.popular && (
          <span className="ml-1.5 text-[10px] font-medium text-primary">
            热门
          </span>
        )}
      </td>

      {/* Quota */}
      <td className="px-5 py-3 text-muted-foreground">
        <span className="text-foreground font-medium">
          {plan.quota.promptsPer5h
            ? `${plan.quota.promptsPer5h.toLocaleString()} 次/5h`
            : plan.quota.description.split("，")[0]}
        </span>
        {plan.quota.promptsPerWeek && (
          <span className="ml-2 text-xs text-muted-foreground">
            {plan.quota.promptsPerWeek.toLocaleString()} 次/周
          </span>
        )}
      </td>

      {/* Claude Equivalent */}
      <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">
        {plan.claudeProEquivalent}
      </td>

      {/* Highlights */}
      <td className="px-5 py-3 hidden lg:table-cell">
        {plan.pricing.discount ? (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {plan.pricing.discount}
          </span>
        ) : plan.modelsNote && plan.modelsNote !== defaultModelsNote ? (
          <span className="text-xs text-muted-foreground">
            {plan.modelsNote}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            {plan.mcpFeatures[0]}
          </span>
        )}
      </td>

      {/* Price */}
      <td className="px-5 py-3 text-right whitespace-nowrap">
        <span className="text-base font-bold text-foreground">
          {formatPrice(plan)}
        </span>
      </td>
    </tr>
  );
}
