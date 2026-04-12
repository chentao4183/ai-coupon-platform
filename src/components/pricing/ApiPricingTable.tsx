"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  formatApiPrice,
  formatUSDPrice,
  type ApiPricingRow,
} from "@/lib/api-pricing";
import { Info, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

const TIER_BADGES: Record<string, { label: string; className: string }> = {
  free: {
    label: "免费",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  "cost-effective": {
    label: "经济",
    className: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
  },
  standard: {
    label: "标准",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  flagship: {
    label: "旗舰",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
};

interface ApiPricingTableProps {
  rows: ApiPricingRow[];
}

export function ApiPricingTable({ rows }: ApiPricingTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/40">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
              模型
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
              厂商
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap">
              输入价
              <Tooltip>
                <TooltipTrigger>
                  <Info className="inline size-3 ml-0.5 text-muted-foreground/60" />
                </TooltipTrigger>
                <TooltipContent>每百万 Token 输入价格（统一换算 USD）</TooltipContent>
              </Tooltip>
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap">
              输出价
              <Tooltip>
                <TooltipTrigger>
                  <Info className="inline size-3 ml-0.5 text-muted-foreground/60" />
                </TooltipTrigger>
                <TooltipContent>每百万 Token 输出价格（统一换算 USD）</TooltipContent>
              </Tooltip>
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap">
              缓存价
            </th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground text-xs uppercase tracking-wide">
              等级
            </th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground text-xs uppercase tracking-wide">
              上下文
            </th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap">
              <Tooltip>
                <TooltipTrigger>
                  综合评分
                  <Info className="inline size-3 ml-0.5 text-muted-foreground/60" />
                </TooltipTrigger>
                <TooltipContent>MMLU 综合知识评测分数</TooltipContent>
              </Tooltip>
            </th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground text-xs uppercase tracking-wide w-8">
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.flatMap((row, idx) => {
            const isFree = row.inputPrice === 0 && row.outputPrice === 0;
            const isExpanded = expandedRow === row.id;
            const tierBadge = TIER_BADGES[row.versionTier ?? ""] ?? null;

            const mainRow = (
              <tr
                key={row.id}
                className={`border-b border-border/40 transition-colors hover:bg-muted/30 ${
                  isFree ? "bg-emerald-50/50 dark:bg-emerald-950/20" : ""
                } ${idx % 2 === 0 ? "bg-background" : "bg-muted/10"}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {row.popular && (
                      <Sparkles className="size-3 text-amber-500 shrink-0" />
                    )}
                    <div>
                      <div className="font-medium text-foreground whitespace-nowrap">
                        {row.planName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {row.modelNameEn}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={row.companyLogo}
                      alt={row.companyName}
                      width={20}
                      height={20}
                      className="size-5 rounded-full object-contain bg-muted/50 shrink-0"
                    />
                    <span className="text-muted-foreground whitespace-nowrap">
                      {row.companyName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="font-semibold text-foreground whitespace-nowrap">
                    {formatUSDPrice(row.inputPriceUSD)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatApiPrice(row.inputPrice, row.currency)}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="font-semibold text-foreground whitespace-nowrap">
                    {formatUSDPrice(row.outputPriceUSD)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatApiPrice(row.outputPrice, row.currency)}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  {row.cacheHitPrice != null ? (
                    <span className="text-sm text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {formatApiPrice(row.cacheHitPrice, row.currency)}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {tierBadge ? (
                    <span
                      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ${tierBadge.className}`}
                    >
                      {tierBadge.label}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-xs text-muted-foreground whitespace-nowrap">
                  {row.contextLength
                    ? row.contextLength >= 1000
                      ? `${Math.round(row.contextLength / 1000)}K`
                      : `${row.contextLength}`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  {row.mmluScore != null ? (
                    <span className="text-sm font-semibold tabular-nums">
                      {row.mmluScore}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {row.features.length > 0 && (
                    <button
                      onClick={() => toggleExpand(row.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </button>
                  )}
                </td>
              </tr>
            );

            if (!isExpanded) return [mainRow];

            return [
              mainRow,
              <tr key={`${row.id}-detail`} className="bg-muted/20">
                <td colSpan={9} className="px-6 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        特性
                      </h4>
                      <ul className="space-y-1">
                        {row.features.map((f, i) => (
                          <li
                            key={i}
                            className="text-sm text-foreground flex items-center gap-1.5"
                          >
                            <span className="size-1 rounded-full bg-primary/60 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      {row.planDescription && (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                            说明
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {row.planDescription}
                          </p>
                        </div>
                      )}
                      {row.restrictions.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                            限制
                          </h4>
                          <ul className="space-y-1">
                            {row.restrictions.map((r, i) => (
                              <li
                                key={i}
                                className="text-sm text-muted-foreground flex items-center gap-1.5"
                              >
                                <span className="size-1 rounded-full bg-amber-400/60 shrink-0" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>,
            ];
          })}
        </tbody>
      </table>
    </div>
  );
}
