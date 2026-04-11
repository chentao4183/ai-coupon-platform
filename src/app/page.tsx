"use client";

import { useState, useCallback } from "react";
import { getAllModels } from "@/lib/data";
import { ModelCard } from "@/components/home/ModelCard";
import { ModelFilters } from "@/components/home/ModelFilters";
import { Calculator, GitCompareArrows, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Model = any;

const allModels = getAllModels();

const QUICK_LINKS = [
  { icon: GitCompareArrows, label: "模型对比", href: "/compare", desc: "横向对比参数与价格" },
  { icon: Sparkles, label: "智能推荐", href: "/recommend", desc: "根据需求推荐模型" },
  { icon: Calculator, label: "成本计算", href: "/calculator", desc: "预估使用成本" },
];

export default function HomePage() {
  const [filteredModels, setFilteredModels] = useState<Model[]>(allModels);

  const handleFilteredChange = useCallback((models: Model[]) => {
    setFilteredModels(models);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/[0.04] via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,var(--color-primary)/0.08,transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
            <Zap className="size-3" />
            <span>覆盖 {allModels.length} 款主流大模型，持续更新中</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            AI 大模型
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"> 价格与能力 </span>
            全景对比
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            精确到每百万 Token 的定价数据，帮助开发者和企业做出最优选择
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

      {/* Content */}
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Filters */}
        <ModelFilters models={allModels} onFilteredChange={handleFilteredChange} />

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
      </section>
    </div>
  );
}
