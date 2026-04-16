"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RModel, RVersion, RPlan } from "@/lib/helpers";
import { formatPrice, planTypeLabel, formatContextLength, tierLabel } from "@/lib/helpers";

/* ------------------------------------------------------------------ */
/* PlanType badge colour helper                                       */
/* ------------------------------------------------------------------ */

function planTypeVariant(type: string): "default" | "secondary" | "outline" {
  switch (type) {
    case "api":
      return "default";
    case "subscription":
      return "secondary";
    case "enterprise":
      return "outline";
    default:
      return "outline";
  }
}

/* ------------------------------------------------------------------ */
/* PricingPlanRow                                                     */
/* ------------------------------------------------------------------ */

function PricingPlanRow({ plan }: { plan: RPlan }) {
  const hasPerToken =
    plan.pricing.inputPrice !== undefined ||
    plan.pricing.outputPrice !== undefined;
  const hasSubscription = plan.pricing.price !== undefined;

  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2">
      {/* Plan header */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium">{plan.name}</span>
        <Badge variant={planTypeVariant(plan.planType)} className="text-xs">
          {planTypeLabel(plan.planType)}
        </Badge>
        {plan.popular && (
          <Badge
            variant="outline"
            className="text-xs border-apple-accent/30 text-apple-accent"
          >
            热门
          </Badge>
        )}
      </div>

      {plan.description && (
        <p className="text-xs text-muted-foreground">{plan.description}</p>
      )}

      {/* Pricing */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
        {hasPerToken && (
          <>
            <div>
              <span className="text-muted-foreground">输入: </span>
              <span className="font-medium">
                {formatPrice(plan.pricing.inputPrice, plan.pricing.currency)}
              </span>
              <span className="text-xs text-muted-foreground"> /1M tokens</span>
            </div>
            <div>
              <span className="text-muted-foreground">输出: </span>
              <span className="font-medium">
                {formatPrice(plan.pricing.outputPrice, plan.pricing.currency)}
              </span>
              <span className="text-xs text-muted-foreground"> /1M tokens</span>
            </div>
          </>
        )}
        {hasSubscription && (
          <div>
            <span className="text-muted-foreground">价格: </span>
            <span className="font-medium">
              {formatPrice(plan.pricing.price, plan.pricing.currency)}
            </span>
            <span className="text-xs text-muted-foreground">
              /{plan.pricing.period === "year" ? "年" : "月"}
            </span>
          </div>
        )}
      </div>

      {/* Cache price */}
      {plan.pricing.cacheHitPrice !== undefined &&
        plan.pricing.cacheHitPrice > 0 && (
          <div className="rounded-md bg-apple-accent/10 px-2 py-1">
            <span className="text-xs text-apple-accent">
              缓存命中:{" "}
              {formatPrice(plan.pricing.cacheHitPrice, plan.pricing.currency)}{" "}
              /1M tokens
              <span className="ml-1 opacity-70">(节省约 {(100 - Math.round((plan.pricing.cacheHitPrice / ((plan.pricing.inputPrice || 1))) * 100))}%)</span>
            </span>
          </div>
        )}

      {/* Features & Restrictions */}
      <div className="flex flex-wrap gap-1">
        {plan.limits.features.slice(0, 6).map((f) => (
          <span
            key={f}
            className="inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary"
          >
            {f}
          </span>
        ))}
      </div>
      {plan.limits.restrictions.length > 0 && (
        <div className="text-xs text-muted-foreground">
          限制: {plan.limits.restrictions.join("、")}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* VersionCard (exported)                                             */
/* ------------------------------------------------------------------ */

export interface VersionCardProps {
  version: RVersion;
  plans: RPlan[];
  model: RModel;
}

export function VersionCard({ version, plans, model }: VersionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 flex-wrap">
          <CardTitle className="text-base">{version.name}</CardTitle>
          {version.latest && (
            <Badge className="text-xs">最新</Badge>
          )}
          <Badge variant="outline" className="text-xs font-normal">
            {tierLabel(version.tier)}
          </Badge>
        </div>
        {version.description && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {version.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick version stats */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
          <span>
            上下文:{" "}
            <span className="text-foreground font-medium">
              {formatContextLength(version.contextLength)}
            </span>
          </span>
        </div>

        {/* Pricing plans */}
        {plans.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">定价方案</h4>
            {plans.map((plan) => (
              <PricingPlanRow key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
