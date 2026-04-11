"use client";

import { useState, useMemo } from "react";
import { getAllModels, getCompanyById } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Calculator,
  Sparkles,
  Info,
} from "lucide-react";
import {
  asRModel,
  getCompanyColor,
  planTypeLabel,
} from "@/lib/helpers";
import type { RModel, RPlan } from "@/lib/helpers";

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

const USD_TO_CNY = 7.25; // approximate exchange rate

const allModels: RModel[] = getAllModels().map((m) => asRModel(m));

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface CostRow {
  model: RModel;
  plan: RPlan;
  /** cost converted to CNY for fair comparison */
  totalCNY: number;
  inputCostCNY: number;
  outputCostCNY: number;
  cacheSavingsCNY: number;
  originalCurrency: string;
  originalTotal: number;
  planType: string;
  isFree: boolean;
}

/* ------------------------------------------------------------------ */
/* Price normalization helpers                                        */
/* ------------------------------------------------------------------ */

/** Convert a price value to CNY for fair comparison */
function toCNY(value: number, currency: string): number {
  if (currency === "USD") return value * USD_TO_CNY;
  return value;
}

/** Get per-1M-token input price, handling 1K-unit pricing */
function getNormalizedInputPrice(plan: RPlan): number {
  const p = plan.pricing;
  let price = p.inputPrice ?? 0;
  if (p.unit === "1K tokens") price = price * 1000;
  return price;
}

/** Get per-1M-token output price, handling 1K-unit pricing */
function getNormalizedOutputPrice(plan: RPlan): number {
  const p = plan.pricing;
  let price = p.outputPrice ?? 0;
  if (p.unit === "1K tokens") price = price * 1000;
  return price;
}

/** Get per-1M-token cache-hit input price, handling 1K-unit pricing */
function getNormalizedCachePrice(plan: RPlan): number | null {
  const p = plan.pricing;
  if (p.cacheHitPrice === undefined) return null;
  let price = p.cacheHitPrice;
  // cache typically uses same unit as input
  if (p.unit === "1K tokens") price = price * 1000;
  return price;
}

/* ------------------------------------------------------------------ */
/* Core calculation                                                   */
/* ------------------------------------------------------------------ */

/**
 * For each model, pick the BEST plan given the usage profile.
 * - For API plans: calculate actual token-based cost
 * - For subscription plans: show fixed monthly cost as-is
 * - Return ALL options sorted by total cost (CNY)
 *
 * The key insight: for API plans, the input/output ratio matters because
 * different models have different input/output price ratios.
 */
function calculateAllCosts(
  inputTokens: number,
  outputTokens: number,
  cacheHitRate: number
): CostRow[] {
  const results: CostRow[] = [];

  for (const model of allModels) {
    for (const plan of model.pricingPlans) {
      const currency = plan.pricing.currency || "CNY";

      if (plan.planType === "subscription") {
        // Subscription: fixed monthly cost
        const monthlyPrice = plan.pricing.price ?? 0;
        const costCNY = toCNY(monthlyPrice, currency);
        results.push({
          model,
          plan,
          totalCNY: costCNY,
          inputCostCNY: costCNY,
          outputCostCNY: 0,
          cacheSavingsCNY: 0,
          originalCurrency: currency,
          originalTotal: monthlyPrice,
          planType: "subscription",
          isFree: monthlyPrice === 0,
        });
      } else if (plan.planType === "api") {
        // API: per-token cost
        const inputPerM = getNormalizedInputPrice(plan);
        const outputPerM = getNormalizedOutputPrice(plan);
        const cachePerM = getNormalizedCachePrice(plan);

        const inputMul = inputTokens / 1_000_000;
        const outputMul = outputTokens / 1_000_000;

        let inputCost = inputMul * inputPerM;
        let outputCost = outputMul * outputPerM;

        // Cache savings
        let cacheSavings = 0;
        if (cachePerM !== null && inputPerM > 0) {
          const savingPerM = inputPerM - cachePerM;
          cacheSavings = inputMul * cacheHitRate * savingPerM;
        }

        const total = Math.max(0, inputCost + outputCost - cacheSavings);
        const totalCNY = toCNY(total, currency);

        results.push({
          model,
          plan,
          totalCNY,
          inputCostCNY: toCNY(inputCost, currency),
          outputCostCNY: toCNY(outputCost, currency),
          cacheSavingsCNY: toCNY(cacheSavings, currency),
          originalCurrency: currency,
          originalTotal: total,
          planType: "api",
          isFree: total === 0 && (inputPerM === 0 || cachePerM === 0),
        });
      }
    }
  }

  // Sort by total CNY cost ascending
  results.sort((a, b) => a.totalCNY - b.totalCNY);
  return results;
}

/* ------------------------------------------------------------------ */
/* Formatting                                                         */
/* ------------------------------------------------------------------ */

function formatCNY(value: number): string {
  if (value === 0) return "免费";
  if (value < 0.01) return "≈¥0";
  return `¥${value.toFixed(2)}`;
}

function formatOriginal(value: number, currency: string): string {
  if (value === 0) return "免费";
  const sym = currency === "USD" ? "$" : "¥";
  if (value < 0.01) return `≈${sym}0`;
  return `${sym}${value.toFixed(2)}`;
}

function getBarColor(
  totalCost: number,
  minCost: number,
  maxCost: number
): string {
  if (maxCost === minCost) return "bg-emerald-500";
  const ratio = (totalCost - minCost) / (maxCost - minCost);
  if (ratio < 0.25) return "bg-emerald-500";
  if (ratio < 0.5) return "bg-lime-500";
  if (ratio < 0.75) return "bg-amber-500";
  return "bg-red-500";
}

/* ------------------------------------------------------------------ */
/* Plan type badge color                                              */
/* ------------------------------------------------------------------ */

function planBadgeClass(planType: string): string {
  switch (planType) {
    case "api":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "subscription":
      return "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    default:
      return "";
  }
}

/* ------------------------------------------------------------------ */
/* Page component                                                     */
/* ------------------------------------------------------------------ */

export default function CalculatorPage() {
  const [inputTokens, setInputTokens] = useState<string>("");
  const [outputTokens, setOutputTokens] = useState<string>("");
  const [cacheHitRate, setCacheHitRate] = useState(50);
  const [calculated, setCalculated] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const inputNum = parseFloat(inputTokens) || 0;
  const outputNum = parseFloat(outputTokens) || 0;

  const allResults = useMemo<CostRow[]>(() => {
    if (!calculated) return [];
    return calculateAllCosts(inputNum, outputNum, cacheHitRate / 100);
  }, [calculated, inputNum, outputNum, cacheHitRate]);

  // Show top 15 by default, expandable
  const results = showAll ? allResults : allResults.slice(0, 15);

  const handleCalculate = () => {
    if (inputNum > 0 || outputNum > 0) {
      setCalculated(true);
      setShowAll(false);
    }
  };

  const handleReset = () => {
    setInputTokens("");
    setOutputTokens("");
    setCacheHitRate(50);
    setCalculated(false);
    setShowAll(false);
  };

  // Insights
  const cheapest = allResults.length > 0 ? allResults[0] : null;
  const mostExpensive =
    allResults.length > 0 ? allResults[allResults.length - 1] : null;
  const freeResults = allResults.filter((r) => r.isFree);
  const apiResults = allResults.filter((r) => r.planType === "api");
  const subResults = allResults.filter((r) => r.planType === "subscription");
  const cheapestApi = apiResults.length > 0 ? apiResults[0] : null;

  const savingsPercent =
    cheapest &&
    mostExpensive &&
    mostExpensive.totalCNY > 0 &&
    cheapest.totalCNY !== mostExpensive.totalCNY
      ? Math.round(
          ((mostExpensive.totalCNY - cheapest.totalCNY) /
            mostExpensive.totalCNY) *
            100
        )
      : null;

  // Find subscription plans that are cheaper than API for this usage
  const subBetterThanApi = subResults.filter((sub) => {
    const cheapestModelApi = apiResults
      .filter((r) => r.model.id === sub.model.id)
      .sort((a, b) => a.totalCNY - b.totalCNY)[0];
    return (
      cheapestModelApi && sub.totalCNY < cheapestModelApi.totalCNY
    );
  });

  const presetTokens = [1000000, 10000000, 50000000, 100000000];
  const presetLabels = ["1M", "10M", "50M", "100M"];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            返回首页
          </a>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          成本计算器
        </h1>
        <p className="mt-1 text-muted-foreground">
          输入你的预估用量，精确计算各模型月度成本（已统一换算为人民币）
        </p>
      </div>

      {/* Input section */}
      <Card className="mb-8">
        <CardContent className="p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Input tokens */}
            <div className="space-y-2">
              <label className="text-sm font-medium">每月输入 Tokens</label>
              <Input
                type="number"
                placeholder="例如: 10000000"
                value={inputTokens}
                onChange={(e) => setInputTokens(e.target.value)}
                min={0}
              />
              <div className="flex gap-2">
                {presetTokens.map((val, i) => (
                  <Button
                    key={`in-${val}`}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setInputTokens(String(val))}
                  >
                    {presetLabels[i]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Output tokens */}
            <div className="space-y-2">
              <label className="text-sm font-medium">每月输出 Tokens</label>
              <Input
                type="number"
                placeholder="例如: 5000000"
                value={outputTokens}
                onChange={(e) => setOutputTokens(e.target.value)}
                min={0}
              />
              <div className="flex gap-2">
                {presetTokens.map((val, i) => (
                  <Button
                    key={`out-${val}`}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setOutputTokens(String(val))}
                  >
                    {presetLabels[i]}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Cache hit rate slider */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">缓存命中率</label>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {cacheHitRate}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              step={5}
              value={cacheHitRate}
              onChange={(e) => setCacheHitRate(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-emerald-600"
            />
            <p className="text-xs text-muted-foreground">
              开启缓存后，重复的输入内容可享受更低价格。仅部分模型支持缓存折扣（如 Claude、Gemini、GLM）
            </p>
          </div>

          {/* Exchange rate note */}
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2">
            <Info className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              所有费用统一按 1 USD ≈ {USD_TO_CNY} CNY 换算为人民币进行排序对比。表格中同时显示原始币种价格。
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t">
            <Button
              onClick={handleCalculate}
              disabled={inputNum === 0 && outputNum === 0}
              className="inline-flex items-center gap-1"
            >
              <Calculator className="size-4" />
              计算成本
            </Button>
            {calculated && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="inline-flex items-center gap-1"
              >
                重置
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {calculated && allResults.length > 0 && (
        <>
          {/* Insights */}
          <div className="grid gap-4 sm:grid-cols-2 mb-8">
            {/* Best value */}
            <Card className="border-emerald-200 dark:border-emerald-900">
              <CardContent className="p-5">
                <div className="flex items-start gap-2">
                  <Sparkles className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    {cheapest && (
                      <p className="text-sm">
                        最省钱方案：
                        <span className="font-semibold">{cheapest.model.name}</span>
                        {" "}
                        <Badge variant="secondary" className={`text-xs ml-1 ${planBadgeClass(cheapest.planType)}`}>
                          {planTypeLabel(cheapest.planType)}
                        </Badge>
                        {" — "}
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCNY(cheapest.totalCNY)}/月
                        </span>
                      </p>
                    )}
                    {savingsPercent !== null && savingsPercent > 0 && mostExpensive && (
                      <p className="text-xs text-muted-foreground">
                        比最贵的 {mostExpensive.model.name}（{formatCNY(mostExpensive.totalCNY)}）节省 {savingsPercent}%
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription tips */}
            {subBetterThanApi.length > 0 && (
              <Card className="border-purple-200 dark:border-purple-900">
                <CardContent className="p-5">
                  <div className="flex items-start gap-2">
                    <Info className="size-4 text-purple-600 mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">订阅更划算</p>
                      <p className="text-xs text-muted-foreground">
                        以你当前的用量，以下模型的订阅方案比按量付费更省钱：
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {subBetterThanApi.map((s) => (
                          <Badge key={s.plan.id} variant="outline" className="text-xs">
                            {s.model.name} {formatCNY(s.totalCNY)}/月
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Free tier note */}
            {freeResults.length > 0 && (
              <Card className="border-amber-200 dark:border-amber-900">
                <CardContent className="p-5">
                  <div className="flex items-start gap-2">
                    <Sparkles className="size-4 text-amber-600 mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">免费方案</p>
                      <p className="text-xs text-muted-foreground">
                        以下方案成本为 0，适合低用量或测试场景：
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {freeResults.slice(0, 6).map((f) => (
                          <Badge key={f.plan.id} variant="outline" className="text-xs">
                            {f.model.name} {f.plan.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cheapest API insight */}
            {cheapestApi && (
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start gap-2">
                    <Calculator className="size-4 text-blue-600 mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">最省 API 调用</p>
                      <p className="text-xs text-muted-foreground">
                        按量付费模式下，<span className="font-semibold">{cheapestApi.model.name}</span>
                        （{cheapestApi.plan.name}）最便宜，约 {formatCNY(cheapestApi.totalCNY)}/月
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Cost table */}
          <Card className="mb-8 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[60px]">排名</TableHead>
                      <TableHead className="min-w-[140px]">模型 / 方案</TableHead>
                      <TableHead className="min-w-[60px]">类型</TableHead>
                      <TableHead className="text-right min-w-[100px]">输入成本</TableHead>
                      <TableHead className="text-right min-w-[100px]">输出成本</TableHead>
                      <TableHead className="text-right min-w-[100px]">缓存节省</TableHead>
                      <TableHead className="text-right min-w-[120px]">月总成本</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((r, idx) => {
                      const isCheapest = idx === 0 && allResults.length > 1;
                      const company = getCompanyById(r.model.companyId);

                      return (
                        <TableRow
                          key={r.plan.id}
                          className={
                            isCheapest
                              ? "bg-emerald-50/50 dark:bg-emerald-950/20"
                              : ""
                          }
                        >
                          <TableCell className="text-sm text-muted-foreground">
                            {idx + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center justify-center size-5 rounded-full text-white text-[10px] font-bold shrink-0 ${getCompanyColor(r.model.companyId)}`}
                              >
                                {company?.name?.charAt(0) || "?"}
                              </span>
                              <div className="min-w-0">
                                <span className="font-medium text-sm">
                                  {r.model.name}
                                </span>
                                <span className="text-xs text-muted-foreground ml-1">
                                  {r.plan.name}
                                </span>
                                {isCheapest && (
                                  <Badge className="ml-1 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 shrink-0">
                                    最省钱
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={`text-xs ${planBadgeClass(r.planType)}`}>
                              {planTypeLabel(r.planType)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {r.planType === "subscription" ? "-" : formatCNY(r.inputCostCNY)}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {r.planType === "subscription" ? "-" : formatCNY(r.outputCostCNY)}
                          </TableCell>
                          <TableCell className="text-right text-sm text-emerald-600 dark:text-emerald-400">
                            {r.cacheSavingsCNY > 0 ? `-${formatCNY(r.cacheSavingsCNY)}` : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`font-semibold text-sm ${r.isFree ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                              {formatCNY(r.totalCNY)}
                            </span>
                            {r.originalCurrency !== "CNY" && r.planType === "api" && (
                              <span className="block text-xs text-muted-foreground">
                                ({formatOriginal(r.originalTotal, r.originalCurrency)})
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Show more / less */}
          {allResults.length > 15 && (
            <div className="text-center mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll
                  ? `收起（显示前15个）`
                  : `查看全部 ${allResults.length} 个方案`}
              </Button>
            </div>
          )}

          {/* Bar chart */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold mb-1">月度成本对比</h3>
              <p className="text-xs text-muted-foreground mb-6">
                按人民币（CNY）排序 · 绿色最便宜，红色最贵
              </p>
              <div className="space-y-2.5">
                {results.slice(0, 20).map((r) => {
                  const maxCost = results.length > 0 ? results[Math.min(results.length - 1, 19)].totalCNY : 1;
                  const barWidth = maxCost > 0 ? (r.totalCNY / maxCost) * 100 : 0;
                  const company = getCompanyById(r.model.companyId);

                  return (
                    <div key={r.plan.id} className="flex items-center gap-3">
                      <div className="w-[140px] sm:w-[180px] shrink-0 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span
                            className={`inline-flex items-center justify-center size-4 rounded-full text-white text-[8px] font-bold shrink-0 ${getCompanyColor(r.model.companyId)}`}
                          >
                            {company?.name?.charAt(0) || "?"}
                          </span>
                          <span className="text-xs font-medium truncate">
                            {r.model.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground block text-right">
                          {r.plan.name}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="w-full h-5 bg-muted rounded-md overflow-hidden">
                          <div
                            className={`h-full rounded-md flex items-center px-2 transition-all ${getBarColor(r.totalCNY, results[0]?.totalCNY ?? 0, maxCost)} ${barWidth < 12 ? "justify-start" : "justify-end"}`}
                            style={{ width: `${Math.max(barWidth, 1.5)}%` }}
                          >
                            {barWidth >= 12 && (
                              <span className="text-[10px] text-white font-medium whitespace-nowrap">
                                {formatCNY(r.totalCNY)}
                              </span>
                            )}
                          </div>
                          {barWidth < 12 && (
                            <span className="text-[10px] text-muted-foreground ml-1.5 self-center">
                              {formatCNY(r.totalCNY)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center">
            以上费用基于官方API/订阅定价估算，已按 1 USD ≈ {USD_TO_CNY} CNY 统一换算。实际费用可能因套餐、用量档位和汇率波动而不同。
          </p>
        </>
      )}

      {/* Empty state */}
      {calculated && allResults.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          没有找到可计算的模型定价信息
        </div>
      )}
    </div>
  );
}
