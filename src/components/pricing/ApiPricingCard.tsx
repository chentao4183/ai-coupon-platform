"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatApiPrice, formatUSDPrice, type ApiPricingRow } from "@/lib/api-pricing";
import { Sparkles, Check, Zap } from "lucide-react";

const TIER_STYLES: Record<string, { label: string; className: string }> = {
  free: {
    label: "免费",
    className: "bg-apple-accent/10 text-apple-accent",
  },
  "cost-effective": {
    label: "经济",
    className: "bg-apple-surface-elevated text-apple-text-secondary",
  },
  standard: {
    label: "标准",
    className: "bg-apple-surface-elevated text-apple-text-secondary",
  },
  flagship: {
    label: "旗舰",
    className: "bg-apple-accent/10 text-apple-accent",
  },
};

interface ApiPricingCardProps {
  row: ApiPricingRow;
}

export function ApiPricingCard({ row }: ApiPricingCardProps) {
  const isFree = row.inputPrice === 0 && row.outputPrice === 0;
  const tierStyle = TIER_STYLES[row.versionTier ?? ""] ?? null;

  return (
    <Card
      className={`group transition-all duration-300 bg-apple-surface-elevated hover:bg-apple-surface-elevated/80 h-full flex flex-col overflow-hidden card-hover ${
        isFree ? "ring-1 ring-apple-accent/20" : ""
      } ${row.popular ? "ring-1 ring-apple-accent/20" : ""}`}
    >
      {/* Top accent */}
      {(isFree || row.popular) && (
        <div
          className={`h-0.5 ${
            isFree ? "bg-apple-accent" : "bg-apple-accent"
          }`}
        />
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={row.companyLogo}
              alt={row.companyName}
              width={28}
              height={28}
              className="size-7 shrink-0 rounded-full object-contain bg-muted/50"
            />
            <div className="min-w-0">
              <CardTitle className="text-sm truncate">{row.planName}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {row.companyName} · {row.modelNameEn}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {tierStyle && (
              <span
                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ${tierStyle.className}`}
              >
                {tierStyle.label}
              </span>
            )}
            {row.popular && (
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
        {/* Prices */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-apple-bg p-2.5">
            <p className="text-xs text-muted-foreground mb-0.5">输入价格</p>
            <p className={`text-lg font-bold ${isFree ? "text-apple-accent" : "text-foreground"}`}>
              {isFree ? "免费" : formatUSDPrice(row.inputPriceUSD)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatApiPrice(row.inputPrice, row.currency)}/1M tokens
            </p>
          </div>
          <div className="rounded-lg bg-apple-bg p-2.5">
            <p className="text-xs text-muted-foreground mb-0.5">输出价格</p>
            <p className={`text-lg font-bold ${isFree ? "text-apple-accent" : "text-foreground"}`}>
              {isFree ? "免费" : formatUSDPrice(row.outputPriceUSD)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatApiPrice(row.outputPrice, row.currency)}/1M tokens
            </p>
          </div>
        </div>

        {/* Cache price */}
        {row.cacheHitPrice != null && (
          <div className="flex items-center gap-1.5 text-xs text-apple-accent">
            <Zap className="size-3" />
            <span>
              缓存命中: {formatApiPrice(row.cacheHitPrice, row.currency)}/1M tokens
            </span>
          </div>
        )}

        {/* Context + Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {row.contextLength && (
            <span>
              上下文{" "}
              {row.contextLength >= 1000
                ? `${Math.round(row.contextLength / 1000)}K`
                : `${row.contextLength}`}
            </span>
          )}
          <span>{row.companyCountry}</span>
        </div>

        {/* Features */}
        {row.features.length > 0 && (
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground mb-1.5">特性</p>
            <ul className="space-y-1">
              {row.features.slice(0, 4).map((f, i) => (
                <li
                  key={i}
                  className="text-xs text-muted-foreground flex items-center gap-1.5"
                >
                  <Check className="size-3 text-primary/60 shrink-0" />
                  {f}
                </li>
              ))}
              {row.features.length > 4 && (
                <li className="text-xs text-muted-foreground">
                  +{row.features.length - 4} 更多
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Description */}
        {row.planDescription && (
          <p className="text-xs text-muted-foreground italic">
            {row.planDescription}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
