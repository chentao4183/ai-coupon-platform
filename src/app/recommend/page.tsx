"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getAllModels, getCompanyById } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  PenTool,
  BarChart3,
  MessageSquare,
  GraduationCap,
  User,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ExternalLink,
  Check,
  Trophy,
} from "lucide-react";
import {
  asRModel,
  getStartingPrice,
  getMaxContext,
  getCompanyColor,
  formatContextLength,
} from "@/lib/helpers";
import type { RModel } from "@/lib/helpers";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const allModels: RModel[] = getAllModels().map((m) => asRModel(m));

/* ------------------------------------------------------------------ */
/* Wizard option definitions                                           */
/* ------------------------------------------------------------------ */

interface WizardOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const scenarioOptions: WizardOption[] = [
  { id: "编程开发", label: "编程开发", icon: <Code className="size-5" /> },
  { id: "内容创作", label: "内容创作", icon: <PenTool className="size-5" /> },
  { id: "数据分析", label: "数据分析", icon: <BarChart3 className="size-5" /> },
  { id: "客服对话", label: "客服对话", icon: <MessageSquare className="size-5" /> },
  { id: "学术研究", label: "学术研究", icon: <GraduationCap className="size-5" /> },
  { id: "日常使用", label: "日常使用", icon: <User className="size-5" /> },
];

const budgetOptions: WizardOption[] = [
  { id: "free", label: "完全免费", icon: <Badge variant="secondary">0元</Badge> },
  { id: "low", label: "月预算100元以内", icon: <Badge variant="secondary">100元</Badge> },
  { id: "medium", label: "月预算100-500元", icon: <Badge variant="secondary">500元</Badge> },
  { id: "unlimited", label: "预算无上限", icon: <Badge variant="secondary">不限</Badge> },
];

const needOptions: WizardOption[] = [
  { id: "long-context", label: "超长上下文 (>128K)", icon: <span className="text-xs font-mono">&gt;128K</span> },
  { id: "multimodal", label: "多模态能力", icon: <span className="text-xs">[img]</span> },
  { id: "reasoning", label: "最强推理能力", icon: <span className="text-xs">[R]</span> },
  { id: "speed", label: "最快响应速度", icon: <span className="text-xs">[S]</span> },
  { id: "chinese", label: "中文优化", icon: <span className="text-xs">[CN]</span> },
  { id: "compliance", label: "数据安全合规", icon: <span className="text-xs">[S]</span> },
];

/* ------------------------------------------------------------------ */
/* Scenario-to-tags mapping for fuzzy matching                         */
/* ------------------------------------------------------------------ */

const scenarioToTags: Record<string, string[]> = {
  "编程开发": ["代码生成", "代码能力强", "编程开发"],
  "内容创作": ["内容创作", "多模态理解"],
  "数据分析": ["数据分析", "数据分析"],
  "客服对话": ["智能客服", "客服对话"],
  "学术研究": ["科研辅助", "学术研究", "文档处理", "科研分析"],
  "日常使用": ["中文对话", "日常使用"],
};

/* ------------------------------------------------------------------ */
/* Recommendation logic                                                */
/* ------------------------------------------------------------------ */

interface RecommendedModel {
  model: RModel;
  score: number;
  reasons: string[];
}

function getRecommendations(
  scenarios: string[],
  budget: string,
  needs: string[]
): RecommendedModel[] {
  let candidates = [...allModels];

  // --- Scenario matching (required) ---
  const scenarioTags = scenarios.flatMap((s) => scenarioToTags[s] || [s]);
  const scored: RecommendedModel[] = candidates.map((model) => {
    let score = 0;
    const reasons: string[] = [];
    const allTags = [...model.tags, ...model.capabilities, ...model.scenarios];

    // Scenario score (most important)
    for (const st of scenarioTags) {
      if (allTags.some((t) => t.includes(st) || st.includes(t))) {
        score += 10;
      }
    }
    // Bonus for exact scenario match
    for (const s of scenarios) {
      if (model.scenarios.includes(s)) {
        score += 5;
      }
    }

    // --- Budget filtering/scoring ---
    if (budget === "free") {
      const hasFree = model.pricingPlans.some(
        (p) =>
          (p.pricing.inputPrice === 0 && p.pricing.outputPrice === 0) ||
          p.pricing.price === 0
      );
      if (!hasFree) {
        score -= 30; // Penalize non-free models for free budget
      } else {
        score += 15;
        if (!reasons.includes("完全免费")) reasons.push("完全免费");
      }
    } else if (budget === "low") {
      const hasFree = model.pricingPlans.some(
        (p) =>
          (p.pricing.inputPrice === 0 && p.pricing.outputPrice === 0) ||
          p.pricing.price === 0
      );
      if (hasFree) {
        score += 15;
        if (!reasons.includes("完全免费")) reasons.push("完全免费");
      } else {
        const sp = getStartingPrice(model);
        if (sp.isFree) {
          score += 10;
        } else {
          // Check if cheapest API plan is under 100 yuan/month equivalent
          const apiPlans = model.pricingPlans.filter((p) => p.planType === "api");
          for (const plan of apiPlans) {
            const inputCost = (plan.pricing.inputPrice || 0) * 10; // assume 10M tokens
            const outputCost = (plan.pricing.outputPrice || 0) * 5;
            if (inputCost + outputCost < 100) {
              score += 10;
              reasons.push("低价API");
              break;
            }
          }
        }
      }
    } else if (budget === "medium") {
      score += 5; // No penalty, most models fit
    }
    // unlimited: no budget constraint

    // --- Needs matching (optional bonus) ---
    if (needs.includes("long-context")) {
      const maxCtx = getMaxContext(model);
      if (maxCtx > 500_000) {
        score += 15;
        reasons.push(`${formatContextLength(maxCtx)}超长上下文`);
      } else if (maxCtx > 128_000) {
        score += 10;
        reasons.push(`${formatContextLength(maxCtx)}上下文`);
      } else if (maxCtx >= 128_000) {
        score += 5;
        reasons.push("128K上下文");
      }
    }

    if (needs.includes("multimodal")) {
      const isMultimodal =
        model.tags.some((t) => t.includes("多模态")) ||
        model.capabilities.some((c) => c.includes("多模态") || c.includes("视觉"));
      if (isMultimodal) {
        score += 10;
        reasons.push("多模态能力");
      }
    }

    if (needs.includes("reasoning")) {
      const isStrongReasoning =
        model.tags.some((t) => t.includes("推理")) ||
        model.capabilities.some((c) => c.includes("推理") || c.includes("数学"));
      if (isStrongReasoning) {
        score += 10;
        reasons.push("强推理能力");
      }
    }

    if (needs.includes("speed")) {
      const hasSpeed = model.capabilities.some(
        (c) => c.includes("极速") || c.includes("快速") || c.includes("低延迟")
      );
      if (hasSpeed) score += 8;
      // Also bonus for budget tier
      const hasBudgetTier = model.versions.some((v) => v.tier === "budget" || v.tier === "cost-effective");
      if (hasBudgetTier) {
        score += 5;
        reasons.push("极速响应");
      }
    }

    if (needs.includes("chinese")) {
      const isChinese = model.tags.includes("国产") || model.capabilities.some((c) => c.includes("中文"));
      if (isChinese) {
        score += 8;
        if (!reasons.includes("中文优化")) reasons.push("中文优化");
      }
    }

    if (needs.includes("compliance")) {
      const isCompliant =
        model.tags.includes("安全合规") ||
        model.tags.includes("国产") ||
        model.compliance?.length;
      if (isCompliant) {
        score += 8;
        reasons.push("数据安全合规");
      }
    }

    // Ensure at least 1 reason
    if (reasons.length === 0) {
      if (model.featured) reasons.push("行业标杆");
      else if (model.tags.includes("免费")) reasons.push("免费可用");
      else reasons.push("综合能力强");
    }

    return { model, score, reasons: reasons.slice(0, 3) };
  });

  // Sort by score descending, take top 3
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}

/* ------------------------------------------------------------------ */
/* Step indicator                                                      */
/* ------------------------------------------------------------------ */

function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center size-8 rounded-full text-sm font-medium transition-colors ${
              step < currentStep
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                : step === currentStep
                  ? "bg-emerald-600 text-white"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {step < currentStep ? <Check className="size-4" /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-12 h-0.5 ${
                step < currentStep
                  ? "bg-emerald-300 dark:bg-emerald-700"
                  : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Selectable card component                                           */
/* ------------------------------------------------------------------ */

function SelectableCard({
  option,
  selected,
  onClick,
  large,
}: {
  option: WizardOption;
  selected: boolean;
  onClick: () => void;
  large?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
        large ? "p-4" : ""
      } ${
        selected
          ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 dark:bg-emerald-950/30"
          : "border-border hover:border-emerald-300 dark:hover:border-emerald-700"
      }`}
    >
      <div
        className={`flex items-center justify-center size-10 rounded-lg shrink-0 ${
          selected
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {option.icon}
      </div>
      <span
        className={`font-medium ${
          selected ? "text-emerald-700 dark:text-emerald-300" : ""
        }`}
      >
        {option.label}
      </span>
      {selected && (
        <Check className="size-4 text-emerald-600 ml-auto shrink-0" />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Result card component                                               */
/* ------------------------------------------------------------------ */

function ResultCard({
  rec,
  rank,
}: {
  rec: RecommendedModel;
  rank: number;
}) {
  const { model, score, reasons } = rec;
  const company = getCompanyById(model.companyId);
  const maxScore = Math.max(80, score);
  const matchPercent = Math.min(99, Math.round((score / maxScore) * 100));
  const startPrice = getStartingPrice(model);
  const maxCtx = getMaxContext(model);

  const rankColors: Record<number, string> = {
    1: "bg-amber-500",
    2: "bg-gray-400",
    3: "bg-amber-700",
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-start gap-4 p-5">
          {/* Rank badge */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div
              className={`flex items-center justify-center size-10 rounded-full text-white font-bold text-sm ${
                rankColors[rank] || "bg-gray-400"
              }`}
            >
              #{rank}
            </div>
            <div className="flex items-center justify-center size-10 rounded-full bg-muted">
              {rank === 1 ? (
                <Trophy className="size-5 text-amber-500" />
              ) : (
                <span className="text-xs font-bold text-muted-foreground">
                  {matchPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Model info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center justify-center size-7 rounded-full text-white text-xs font-bold shrink-0 ${getCompanyColor(model.companyId)}`}
              >
                {company?.name?.charAt(0) || "?"}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-base truncate">{model.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {company?.name || ""}
                </p>
              </div>
            </div>

            {/* Match score bar */}
            <div className="mt-2 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">匹配度</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {matchPercent}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${matchPercent}%` }}
                />
              </div>
            </div>

            {/* Reasons */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {reasons.map((r) => (
                <Badge key={r} variant="secondary" className="text-xs">
                  {r}
                </Badge>
              ))}
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span>上下文: {formatContextLength(maxCtx)}</span>
              <span>
                起步价:{" "}
                <span
                  className={
                    startPrice.isFree
                      ? "text-emerald-600 dark:text-emerald-400 font-medium"
                      : "font-medium"
                  }
                >
                  {startPrice.label}
                </span>
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href={`/model/${model.id}`}>
                <Button variant="outline" size="sm">
                  查看详情
                </Button>
              </Link>
              <a
                href={model.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="default" size="sm">
                  开始使用
                  <ExternalLink className="size-3 ml-1" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Page component                                                      */
/* ------------------------------------------------------------------ */

export default function RecommendPage() {
  const [step, setStep] = useState(1);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [results, setResults] = useState<RecommendedModel[] | null>(null);

  const toggleScenario = (id: string) => {
    setSelectedScenarios((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleNeed = (id: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      // Calculate results
      const recs = getRecommendations(selectedScenarios, selectedBudget, selectedNeeds);
      setResults(recs);
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedScenarios([]);
    setSelectedBudget("");
    setSelectedNeeds([]);
    setResults(null);
  };

  const stepTitles = ["使用场景", "预算范围", "核心需求"];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
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
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          智能推荐
        </h1>
        <p className="mt-1 text-muted-foreground">
          回答几个问题，找到最适合你的AI模型
        </p>
      </div>

      {/* Results view */}
      {step === 4 && results ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">为你推荐的模型</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="inline-flex items-center gap-1"
            >
              <RotateCcw className="size-3.5" />
              重新选择
            </Button>
          </div>
          <div className="space-y-4">
            {results.map((rec, idx) => (
              <ResultCard key={rec.model.id} rec={rec} rank={idx + 1} />
            ))}
          </div>
          {results.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              未找到匹配的模型，请尝试调整筛选条件
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Step indicator */}
          <StepIndicator currentStep={step} totalSteps={3} />

          {/* Step card */}
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center size-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold dark:bg-emerald-950 dark:text-emerald-400">
                    {step}
                  </span>
                  <h2 className="text-lg font-semibold">{stepTitles[step - 1]}</h2>
                  {step === 3 && (
                    <Badge variant="outline" className="text-xs">
                      可选
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  {step === 1 && "选择你的主要使用场景（可多选）"}
                  {step === 2 && "选择你的月度预算范围"}
                  {step === 3 && "选择你关心的核心需求（可多选）"}
                </p>
              </div>

              {/* Step 1: Scenarios */}
              {step === 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {scenarioOptions.map((opt) => (
                    <SelectableCard
                      key={opt.id}
                      option={opt}
                      selected={selectedScenarios.includes(opt.id)}
                      onClick={() => toggleScenario(opt.id)}
                    />
                  ))}
                </div>
              )}

              {/* Step 2: Budget */}
              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {budgetOptions.map((opt) => (
                    <SelectableCard
                      key={opt.id}
                      option={opt}
                      selected={selectedBudget === opt.id}
                      onClick={() => setSelectedBudget(opt.id)}
                      large
                    />
                  ))}
                </div>
              )}

              {/* Step 3: Needs */}
              {step === 3 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {needOptions.map((opt) => (
                    <SelectableCard
                      key={opt.id}
                      option={opt}
                      selected={selectedNeeds.includes(opt.id)}
                      onClick={() => toggleNeed(opt.id)}
                    />
                  ))}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                {step > 1 ? (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="size-3.5" />
                    上一步
                  </Button>
                ) : (
                  <div />
                )}
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && selectedScenarios.length === 0) ||
                    (step === 2 && selectedBudget === "")
                  }
                  className="inline-flex items-center gap-1"
                >
                  {step === 3 ? "获取推荐" : "下一步"}
                  {step < 3 && <ArrowRight className="size-3.5" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
