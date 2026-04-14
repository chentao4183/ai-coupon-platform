"use client";

import { useState, useCallback, useMemo } from "react";
import { getAllModels } from "@/lib/data";
import { ModelCard } from "@/components/home/ModelCard";
import { ModelFilters } from "@/components/home/ModelFilters";
import { AnimatedNumber } from "@/components/animated-number";

import {
  Code2,
  Zap,
  GitCompareArrows,
  Sparkles,
  Calculator,
  ArrowRight,
  Building2,
  Layers,
  CreditCard,
  Globe,
} from "lucide-react";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Model = any;

const allModels = getAllModels();

// Featured models for the overview section
const featuredModels = allModels.filter((m) => m.featured);

// Compute stats from data
const stats = (() => {
  const companyIds = new Set(allModels.map((m) => m.companyId));
  const modelSeriesCount = allModels.length;
  let subscriptionCount = 0;
  let apiCount = 0;
  for (const model of allModels) {
    for (const plan of model.pricingPlans || []) {
      if (plan.planType === "subscription") subscriptionCount++;
      if (plan.planType === "api") apiCount++;
    }
  }
  return {
    companies: companyIds.size,
    modelSeries: modelSeriesCount,
    subscriptions: subscriptionCount,
    apiPricings: apiCount,
  };
})();

const QUICK_LINKS = [
  { icon: GitCompareArrows, label: "模型对比", href: "/compare", desc: "横向对比参数与价格" },
  { icon: Sparkles, label: "智能推荐", href: "/recommend", desc: "根据需求推荐模型" },
  { icon: Calculator, label: "成本计算", href: "/calculator", desc: "预估使用成本" },
];

const CTA_ENTRIES = [
  {
    icon: Code2,
    title: "编程套餐",
    desc: "按月订阅，无限调用",
    href: "/coding",
    gradient: "from-blue-500/10 to-indigo-500/10",
    borderHover: "hover:border-blue-400/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: "Subscription",
  },
  {
    icon: Zap,
    title: "API 按量付费",
    desc: "按量计费，精确到百万Token",
    href: "/pricing",
    gradient: "from-amber-500/10 to-orange-500/10",
    borderHover: "hover:border-amber-400/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    badge: "Pay-as-you-go",
  },
];

const STAT_CARDS = [
  { icon: Building2, label: "覆盖厂商", value: stats.companies, unit: "家" },
  { icon: Layers, label: "模型系列", value: stats.modelSeries, unit: "个" },
  { icon: CreditCard, label: "订阅套餐", value: stats.subscriptions, unit: "个" },
  { icon: Globe, label: "API 定价", value: stats.apiPricings, unit: "个" },
];

export default function HomePage() {
  const [filteredModels, setFilteredModels] = useState<Model[]>(featuredModels);

  const handleFilteredChange = useCallback((models: Model[]) => {
    setFilteredModels(models);
  }, []);

  const isShowingAll = useMemo(() => {
    return filteredModels.length === allModels.length || filteredModels.length > featuredModels.length;
  }, [filteredModels]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/[0.04] via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,var(--color-primary)/0.08,transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
            <Zap className="size-3" />
            <span>覆盖 {stats.companies} 家厂商 {stats.modelSeries} 款模型，持续更新中</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            AI 大模型
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"> 价格与能力 </span>
            全景对比
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            一站式查看编程套餐与 API 按量付费，帮助开发者和企业做出最优选择
          </p>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-2.5 rounded-xl border border-border/80 bg-card/80 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card hover:shadow-md"
              >
                <link.icon className="size-4 text-primary/70 transition-colors group-hover:text-primary" />
                <span>{link.label}</span>
                <span className="hidden text-xs text-muted-foreground sm:inline">— {link.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Two CTA Entries */}
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 stagger-fade-in">
          {CTA_ENTRIES.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className={`group relative flex items-center gap-5 rounded-2xl border border-border/60 bg-gradient-to-br ${entry.gradient} p-6 transition-all duration-300 ${entry.borderHover} hover:shadow-lg hover:shadow-primary/[0.04] card-hover`}
            >
              <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-background/80 shadow-sm ring-1 ring-border/40`}>
                <entry.icon className={`size-6 ${entry.iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">{entry.title}</h3>
                  <span className="rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-border/40">
                    {entry.badge}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{entry.desc}</p>
              </div>
              <ArrowRight className="size-5 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-1 group-hover:text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 stagger-fade-in">
            {STAT_CARDS.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm card-hover"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                  <stat.icon className="size-5 text-primary/70" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground tabular-nums">
                    <AnimatedNumber value={stat.value} />
                    <span className="ml-0.5 text-sm font-normal text-muted-foreground">{stat.unit}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Models */}
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">精选模型</h2>
            {!isShowingAll && (
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                查看全部 {allModels.length} 个模型 →
                <ArrowRight className="size-3.5" />
              </Link>
            )}
          </div>

          {/* Filters */}
          <ModelFilters models={featuredModels} onFilteredChange={handleFilteredChange} />

          {/* Results count */}
          <div className="mt-6 mb-4 text-sm text-muted-foreground">
            共 {filteredModels.length} 个模型
          </div>

          {/* Model Grid */}
          {filteredModels.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredModels.map((model: Model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">未找到匹配的模型，请尝试其他搜索条件</p>
            </div>
          )}

          {/* View all link (bottom) */}
          {!isShowingAll && filteredModels.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card/80 px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-card hover:shadow-md"
              >
                查看全部 {allModels.length} 个模型 →
                <ArrowRight className="size-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
