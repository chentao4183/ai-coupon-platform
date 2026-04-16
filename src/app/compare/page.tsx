"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getAllModels } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  X,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import {
  asRModel,
  formatContextLength,
  formatPrice,
  planTypeLabel,
  getMaxContext,
  getLatestVersions,
  getCompanyColor,
  getMinInputPrice,
  getMinOutputPrice,
} from "@/lib/helpers";
import type { RModel } from "@/lib/helpers";
import { BenchmarkBar } from "@/components/benchmark/BenchmarkBar";

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

const MAX_SLOTS = 4;
const allModels: RModel[] = getAllModels().map((m) => asRModel(m));

// Pre-fill with first two featured/popular models
const defaultIds = allModels
  .filter((m) => m.featured)
  .slice(0, 2)
  .map((m) => m.id);

/* ------------------------------------------------------------------ */
/* CompareRow helper                                                  */
/* ------------------------------------------------------------------ */

interface RowDef {
  label: string;
  /** Return a string or ReactNode for each model. index is the slot index */
  render: (models: RModel[], index: number) => React.ReactNode;
  /** If true, highlight the best numeric value per row */
  highlightBest?: boolean;
  /** Extract a numeric value for "best" comparison */
  numericValue?: (model: RModel) => number;
  /** Lower is better (default true) */
  lowerIsBetter?: boolean;
}

/* ------------------------------------------------------------------ */
/* Page component                                                     */
/* ------------------------------------------------------------------ */

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultIds);

  // Resolved models
  const models = useMemo(
    () =>
      selectedIds
        .map((id) => allModels.find((m) => m.id === id))
        .filter(Boolean) as RModel[],
    [selectedIds]
  );

  // Available models not yet selected
  const availableModels = useMemo(
    () => allModels.filter((m) => !selectedIds.includes(m.id)),
    [selectedIds]
  );

  // Add a model
  const handleAdd = () => {
    if (selectedIds.length >= MAX_SLOTS || availableModels.length === 0) return;
    setSelectedIds((prev) => [...prev, availableModels[0].id]);
  };

  // Change a model in a slot
  const handleChange = (slotIndex: number, newId: string) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[slotIndex] = newId;
      return next;
    });
  };

  // Remove a slot
  const handleRemove = (slotIndex: number) => {
    setSelectedIds((prev) => prev.filter((_, i) => i !== slotIndex));
  };

  // Reset
  const handleReset = () => {
    setSelectedIds(defaultIds);
  };

  /* ---- Row definitions ---- */
  const rows: RowDef[] = useMemo(() => {
    if (models.length === 0) return [];

    // Find global min input price across all models for highlighting
    const allApiPlans = models.flatMap((m) =>
      m.pricingPlans.filter((p) => p.pricing.inputPrice !== undefined)
    );

    const minInput =
      allApiPlans.length > 0
        ? Math.min(
            ...allApiPlans
              .map((p) => p.pricing.inputPrice!)
              .filter((v) => v > 0)
          )
        : null;

    const minOutput =
      allApiPlans.length > 0
        ? Math.min(
            ...allApiPlans
              .map((p) => p.pricing.outputPrice!)
              .filter((v) => v > 0)
          )
        : null;

    return [
      {
        label: "公司名称",
        render: (ms, idx) => {
          const c = require("@/lib/data").getCompanyById(ms[idx].companyId);
          return (
            <div className="flex items-center gap-2">
              <span
                className={`inline-block size-6 shrink-0 rounded-full ${getCompanyColor(ms[idx].companyId)} flex items-center justify-center text-white text-xs font-bold`}
              >
                {c?.name?.charAt(0) || "?"}
              </span>
              {c?.name || "-"}
            </div>
          );
        },
      },
      {
        label: "模型名称",
        render: (ms, idx) => (
          <Link
            href={`/model/${ms[idx].id}`}
            className="font-medium hover:underline"
          >
            {ms[idx].name}
          </Link>
        ),
      },
      {
        label: "上下文长度",
        render: (ms, idx) => formatContextLength(getMaxContext(ms[idx])),
        highlightBest: true,
        numericValue: (m) => getMaxContext(m),
        lowerIsBetter: false,
      },
      {
        label: "最新版本",
        render: (ms, idx) => {
          const latest = getLatestVersions(ms[idx]);
          return latest.length > 0 ? latest[0].name : "-";
        },
      },
      {
        label: "输入价格 (per 1M tokens)",
        render: (ms, idx) => {
          const result = getMinInputPrice(ms[idx].pricingPlans);
          if (!result) return "-";
          const isBest = minInput !== null && result.price === minInput;
          return (
            <span className="flex items-center gap-1.5">
              <span
                className={
                  isBest
                    ? "font-semibold text-apple-accent"
                    : ""
                }
              >
                {formatPrice(result.price, result.currency)}
              </span>
              {isBest && (
                <Badge
                  variant="outline"
                  className="text-xs text-apple-accent border-apple-accent/30"
                >
                  最优
                </Badge>
              )}
            </span>
          );
        },
      },
      {
        label: "输出价格 (per 1M tokens)",
        render: (ms, idx) => {
          const result = getMinOutputPrice(ms[idx].pricingPlans);
          if (!result) return "-";
          const isBest = minOutput !== null && result.price === minOutput;
          return (
            <span className="flex items-center gap-1.5">
              <span
                className={
                  isBest
                    ? "font-semibold text-apple-accent"
                    : ""
                }
              >
                {formatPrice(result.price, result.currency)}
              </span>
              {isBest && (
                <Badge
                  variant="outline"
                  className="text-xs text-apple-accent border-apple-accent/30"
                >
                  最优
                </Badge>
              )}
            </span>
          );
        },
      },
      {
        label: "缓存价格 (if available)",
        render: (ms, idx) => {
          const plans = ms[idx].pricingPlans.filter(
            (p) =>
              p.pricing.cacheHitPrice !== undefined &&
              p.pricing.cacheHitPrice > 0
          );
          if (plans.length === 0) return "-";
          const cheapest = plans.reduce(
            (min, p) =>
              (p.pricing.cacheHitPrice ?? Infinity) < min
                ? p.pricing.cacheHitPrice!
                : min,
            Infinity
          );
          return (
            <span className="text-apple-accent text-sm">
              {formatPrice(cheapest, plans[0].pricing.currency)}/1M
            </span>
          );
        },
      },
      {
        label: "多模态支持",
        render: (ms, idx) => {
          const hasMultimodal = ms[idx].capabilities.some(
            (c) =>
              c.includes("多模态") ||
              c.includes("图片") ||
              c.includes("视觉") ||
              c.includes("视频")
          );
          return hasMultimodal ? (
            <Badge variant="default" className="text-xs">
              支持
            </Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
      },
      {
        label: "核心能力",
        render: (ms, idx) => (
          <div className="flex flex-wrap gap-1 justify-center">
            {ms[idx].capabilities.slice(0, 4).map((c) => (
              <Badge key={c} variant="outline" className="text-xs font-normal">
                {c}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        label: "适用场景",
        render: (ms, idx) => (
          <div className="flex flex-wrap gap-1 justify-center">
            {ms[idx].scenarios.slice(0, 3).map((s) => (
              <Badge key={s} variant="secondary" className="text-xs font-normal">
                {s}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        label: "定价方式",
        render: (ms, idx) => {
          const types = [...new Set(ms[idx].pricingPlans.map((p) => p.planType))];
          return (
            <div className="flex flex-wrap gap-1 justify-center">
              {types.map((t) => (
                <Badge key={t} variant="outline" className="text-xs">
                  {planTypeLabel(t)}
                </Badge>
              ))}
            </div>
          );
        },
      },
      // Benchmark rows
      {
        label: "综合知识 (MMLU)",
        render: (ms, idx) => {
          const v = getLatestVersions(ms[idx])[0];
          if (!v) return "-";
          const bm = (v as unknown as Record<string, unknown>).benchmarks as Record<string, number> | undefined;
          if (!bm?.mmlu) return "-";
          return (
            <div className="w-28">
              <BenchmarkBar label="" value={bm.mmlu} max={100} />
            </div>
          );
        },
      },
      {
        label: "代码生成 (HumanEval)",
        render: (ms, idx) => {
          const v = getLatestVersions(ms[idx])[0];
          if (!v) return "-";
          const bm = (v as unknown as Record<string, unknown>).benchmarks as Record<string, number> | undefined;
          if (!bm?.humaneval) return "-";
          return (
            <div className="w-28">
              <BenchmarkBar label="" value={bm.humaneval} max={100} />
            </div>
          );
        },
      },
      {
        label: "对话能力 (MT-Bench)",
        render: (ms, idx) => {
          const v = getLatestVersions(ms[idx])[0];
          if (!v) return "-";
          const bm = (v as unknown as Record<string, unknown>).benchmarks as Record<string, number> | undefined;
          if (!bm?.mt_bench) return "-";
          return (
            <div className="w-28">
              <BenchmarkBar label="" value={bm.mt_bench} max={10} />
            </div>
          );
        },
      },
    ];
  }, [models]);

  /* ---- Compute best values for highlight rows ---- */
  const bestValues = useMemo(() => {
    const map = new Map<string, { value: number; lowerIsBetter: boolean }>();
    for (const row of rows) {
      if (row.highlightBest && row.numericValue) {
        const values = models.map((m) => row.numericValue!(m));
        const lb = row.lowerIsBetter !== false;
        const best = lb ? Math.min(...values) : Math.max(...values);
        map.set(row.label, { value: best, lowerIsBetter: lb });
      }
    }
    return map;
  }, [rows, models]);

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-6 py-8 sm:px-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            返回首页
          </Link>
        </div>
        <h1 className="heading-section">
          模型对比
        </h1>
        <p className="mt-1 text-muted-foreground">
          选择 2-4 个模型进行横向对比，快速找到最适合的方案
        </p>
      </div>

      {/* Model selector */}
      <div className="flex flex-wrap items-end gap-3 mb-8">
        {selectedIds.map((id, idx) => {
          const model = allModels.find((m) => m.id === id);
          return (
            <div key={idx} className="flex items-end gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  模型 {idx + 1}
                </label>
                <Select
                  value={id}
                  onValueChange={(val) => { if (val) handleChange(idx, val); }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="选择模型">
                      {model?.name || "选择模型"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {/* Show current selection first */}
                    {model && (
                      <SelectItem value={model.id}>
                        {model.name}
                      </SelectItem>
                    )}
                    {allModels
                      .filter((m) => m.id !== id && !selectedIds.includes(m.id))
                      .map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedIds.length > 2 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(idx)}
                  className="mb-0.5 text-muted-foreground hover:text-destructive"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          );
        })}

        {selectedIds.length < MAX_SLOTS && availableModels.length > 0 && (
          <Button
            variant="outline"
            onClick={handleAdd}
            className="inline-flex items-center gap-1"
          >
            <Plus className="size-3.5" />
            添加模型
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-muted-foreground"
        >
          <RotateCcw className="size-3.5" />
          重置对比
        </Button>
      </div>

      {/* Comparison table */}
      {models.length < 2 ? (
        <div className="py-20 text-center text-muted-foreground">
          请至少选择 2 个模型进行对比
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[160px]">对比项</TableHead>
              {models.map((m) => {
                const company = require("@/lib/data").getCompanyById(m.companyId);
                return (
                  <TableHead key={m.id} className="min-w-[180px] text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-block size-5 rounded-full ${getCompanyColor(m.companyId)} flex items-center justify-center text-white text-[10px] font-bold`}
                        >
                          {company?.name?.charAt(0) || "?"}
                        </span>
                        <span className="font-medium">{m.name}</span>
                      </div>
                      <span className="text-xs font-normal text-muted-foreground">
                        {company?.name || ""}
                      </span>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const best = bestValues.get(row.label);
              return (
                <TableRow key={row.label}>
                  <TableCell className="font-medium text-muted-foreground whitespace-nowrap">
                    {row.label}
                  </TableCell>
                  {models.map((m, idx) => {
                    // Check if this cell should be highlighted
                    let isBestCell = false;
                    if (
                      best &&
                      row.numericValue
                    ) {
                      const val = row.numericValue(m);
                      isBestCell = val === best.value;
                    }

                    return (
                      <TableCell
                        key={`${m.id}-${row.label}`}
                        className={`text-center ${
                          isBestCell
                            ? "bg-apple-accent/[0.05]"
                            : ""
                        }`}
                      >
                        <div className="flex justify-center">
                          {row.render(models, idx)}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </div>
      )}
    </div>
  );
}
