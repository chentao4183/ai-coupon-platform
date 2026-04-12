"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Check,
  ExternalLink,
  Zap,
  ArrowRight,
  Info,
} from "lucide-react";
import type { CodingPlan } from "@/types/coding-plan";
import { formatCodingPlanPrice } from "@/lib/coding-plans";

const TIER_STYLES: Record<string, { label: string; className: string }> = {
  lite: {
    label: "Lite",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  pro: {
    label: "Pro",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  max: {
    label: "Max",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  ultra: {
    label: "Ultra",
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
};

function normalizeToCNY(plan: CodingPlan): number {
  const monthly =
    plan.pricing.period === "year"
      ? plan.pricing.price / 12
      : plan.pricing.price;
  return plan.pricing.currency === "USD" ? monthly * 7.25 : monthly;
}

function formatCNYPrice(cny: number): string {
  return `¥${cny.toFixed(0)}`;
}

interface CodingPlanCardProps {
  plan: CodingPlan;
}

export function CodingPlanCard({ plan }: CodingPlanCardProps) {
  const tierStyle = TIER_STYLES[plan.tier] || TIER_STYLES.pro;
  const cnyMonthly = normalizeToCNY(plan);

  return (
    <Card
      className={`group relative transition-all duration-300 border-border/60 bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.04] h-full flex flex-col overflow-hidden card-hover ${
        plan.popular ? "ring-1 ring-primary/20" : ""
      }`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-primary" />
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={plan.providerLogo}
              alt={plan.providerName}
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-full object-contain bg-muted/50"
            />
            <div className="min-w-0">
              <CardTitle className="text-base truncate">
                {plan.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {plan.providerName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold ${tierStyle.className}`}
            >
              {tierStyle.label}
            </span>
            {plan.popular && (
              <Badge
                variant="secondary"
                className="text-xs bg-primary/10 text-primary border-0"
              >
                热门
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">
            {formatCodingPlanPrice(plan)}
          </span>
          <span className="text-sm text-muted-foreground">/月</span>
          {plan.pricing.currency === "USD" && (
            <span className="text-xs text-muted-foreground">
              (≈{formatCNYPrice(cnyMonthly)}/月)
            </span>
          )}
        </div>

        {/* Discount */}
        {plan.pricing.discount && (
          <p className="text-xs text-primary">{plan.pricing.discount}</p>
        )}

        {/* Quota */}
        <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Zap className="size-3.5 text-amber-500" />
            <span className="text-xs font-medium text-foreground">配额</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {plan.quota.description}
          </p>
        </div>

        {/* Models */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs font-medium text-foreground">模型</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {plan.models.map((model) => (
              <Badge
                key={model}
                variant="outline"
                className="text-xs font-normal"
              >
                {model}
              </Badge>
            ))}
          </div>
          {plan.modelsNote && (
            <p className="text-xs text-muted-foreground mt-1">
              {plan.modelsNote}
            </p>
          )}
        </div>

        {/* Tools */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs font-medium text-foreground">
              支持工具
            </span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                {plan.supportedTools.join("、")}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-wrap gap-1">
            {plan.supportedTools.slice(0, 4).map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-0.5 rounded-md bg-muted/50 px-1.5 py-0.5 text-xs text-muted-foreground"
              >
                <Check className="size-2.5" />
                {tool}
              </span>
            ))}
            {plan.supportedTools.length > 4 && (
              <span className="inline-flex items-center rounded-md bg-muted/50 px-1.5 py-0.5 text-xs text-muted-foreground">
                +{plan.supportedTools.length - 4} 更多
              </span>
            )}
          </div>
        </div>

        {/* Best for */}
        <p className="text-xs text-muted-foreground italic">
          适合: {plan.bestFor}
        </p>

        {/* Comparison note */}
        {plan.claudeProEquivalent && (
          <div className="flex items-center gap-1.5 text-xs text-primary/80">
            <ArrowRight className="size-3" />
            <span>{plan.claudeProEquivalent}</span>
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <div className="border-t border-border/50 px-6 py-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          上下文 {plan.contextLength}
        </span>
        <a
          href={plan.buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          前往购买
          <ExternalLink className="size-3" />
        </a>
      </div>
    </Card>
  );
}
