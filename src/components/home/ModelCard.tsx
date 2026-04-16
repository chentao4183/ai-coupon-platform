"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { getCompanyById } from "@/lib/data";

function formatContextLength(tokens: number): string {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(0)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
  return `${tokens}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPlanFree(plan: any): boolean {
  const p = plan.pricing || {};
  if (p.price === 0) return true;
  if (p.inputPrice === 0 && p.outputPrice === 0) return true;
  return false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getStartingPrice(model: any): { isFree: boolean; label: string } {
  const hasFree = (model.pricingPlans || []).some((plan: any) => isPlanFree(plan));
  if (hasFree) {
    return { isFree: true, label: "免费" };
  }

  let minPrice: number | null = null;
  let currency = "CNY";
  let suffix = "";

  for (const plan of model.pricingPlans || []) {
    if (isPlanFree(plan)) continue;
    const p = plan.pricing || {};

    // Subscription price
    if (p.price > 0) {
      if (minPrice === null || p.price < minPrice) {
        minPrice = p.price;
        currency = p.currency || "CNY";
        const periodMap: Record<string, string> = { month: "月", year: "年" };
        suffix = `/${periodMap[p.period] || p.period || "月"}`;
      }
    }

    // API input price - normalize to per-1M tokens
    let inputPerM = p.inputPrice || 0;
    if (p.unit === "1K tokens") {
      inputPerM = inputPerM * 1000;
    }
    if (inputPerM > 0) {
      if (minPrice === null || inputPerM < minPrice) {
        minPrice = inputPerM;
        currency = p.currency || "CNY";
        suffix = "/1M tokens";
      }
    }
  }

  if (minPrice !== null) {
    const symbol = currency === "CNY" ? "¥" : "$";
    return { isFree: false, label: `${symbol}${minPrice}${suffix}` };
  }

  return { isFree: false, label: "暂无定价" };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getContextLength(model: any): number {
  const versions = model.versions || [];
  if (versions.length === 0) return 0;
  return Math.max(...versions.map((v: any) => v.contextLength || 0));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ModelCardProps {
  model: any;
}

export function ModelCard({ model }: ModelCardProps) {
  const company = getCompanyById(model.companyId);
  const price = getStartingPrice(model);
  const contextLen = getContextLength(model);

  return (
    <Card className="group h-full flex flex-col overflow-hidden border-0 bg-apple-surface-elevated transition-colors duration-200 hover:bg-apple-surface-elevated/80">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {company?.logo ? (
              <Image
                src={company.logo}
                alt={company.name}
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-full object-contain bg-apple-surface"
              />
            ) : (
              <span className="inline-block size-8 shrink-0 rounded-full bg-apple-accent/10 flex items-center justify-center text-apple-accent text-sm font-bold">
                {company?.name.charAt(0) || "?"}
              </span>
            )}
            <div className="min-w-0">
              <p className="label-text text-apple-text-tertiary">
                {company?.name || ""}
              </p>
              <h3 className="heading-card truncate mt-0.5">
                {model.name}
              </h3>
            </div>
          </div>
          {model.featured && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-apple-accent px-2.5 py-0.5 text-[11px] font-medium text-white">
              推荐
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        <p className="text-[15px] text-apple-text-secondary line-clamp-2 leading-relaxed">
          {model.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {(model.tags || []).slice(0, 4).map((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-apple-surface px-2.5 py-0.5 text-xs font-normal text-apple-text-tertiary"
            >
              {tag}
            </span>
          ))}
          {contextLen > 0 && (
            <span className="inline-flex items-center rounded-full bg-apple-surface px-2.5 py-0.5 text-xs font-normal text-apple-text-tertiary">
              {formatContextLength(contextLen)}上下文
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          {price.isFree ? (
            <span className="inline-flex items-center rounded-full bg-apple-accent/10 px-2.5 py-0.5 text-sm font-medium text-apple-accent">
              {price.label}
            </span>
          ) : (
            <span className="text-sm font-semibold text-foreground">
              起步 {price.label}
            </span>
          )}
        </div>

        {/* Pill link */}
        <Link
          href={`/model/${model.id}`}
          className="inline-flex items-center gap-0.5 text-[15px] font-medium text-apple-link transition-colors hover:text-apple-link/70 mt-auto pt-2"
        >
          查看详情
          <ChevronRight className="size-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
