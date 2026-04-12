"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCompanyById } from "@/lib/data";

const COMPANY_COLORS: Record<string, string> = {
  zhipu: "bg-blue-500",
  openai: "bg-emerald-600",
  anthropic: "bg-orange-500",
  google: "bg-blue-600",
  alibaba: "bg-orange-600",
  deepseek: "bg-indigo-500",
  moonshot: "bg-purple-500",
  bytedance: "bg-sky-500",
  baidu: "bg-red-500",
  minimax: "bg-teal-500",
};

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
  const colorClass = COMPANY_COLORS[model.companyId] || "bg-gray-500";
  const price = getStartingPrice(model);
  const contextLen = getContextLength(model);

  return (
    <Card className="group relative transition-all duration-300 border-border/60 bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.04] h-full flex flex-col overflow-hidden card-hover">
      {/* Top accent line */}
      <div className={`absolute inset-x-0 top-0 h-0.5 ${colorClass} opacity-60 group-hover:opacity-100 transition-opacity`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {company?.logo ? (
              <Image
                src={company.logo}
                alt={company.name}
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-full object-contain bg-muted/50"
              />
            ) : (
              <span
                className={`inline-block size-8 shrink-0 rounded-full ${colorClass} flex items-center justify-center text-white text-sm font-bold`}
              >
                {company?.name.charAt(0) || "?"}
              </span>
            )}
            <div className="min-w-0">
              <CardTitle className="text-base truncate">
                {model.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {company?.name || ""}
              </p>
            </div>
          </div>
          {model.featured && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              推荐
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {model.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {(model.tags || []).slice(0, 4).map((tag: string) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs font-normal"
            >
              {tag}
            </Badge>
          ))}
          {contextLen > 0 && (
            <Badge variant="outline" className="text-xs font-normal">
              {formatContextLength(contextLen)}上下文
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          {price.isFree ? (
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              {price.label}
            </span>
          ) : (
            <span className="text-sm font-semibold text-foreground">
              起步 {price.label}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t-0 bg-transparent">
        <Link
          href={`/model/${model.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          查看详情
          <ArrowRight className="size-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
