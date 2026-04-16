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
  TrendingUp,
  Star,
  Zap,
  Shield,
} from "lucide-react";
import {
  asRModel,
  getStartingPrice,
  getMaxContext,
  getCompanyColor,
  formatContextLength,
} from "@/lib/helpers";
import type { RModel, RVersion } from "@/lib/helpers";

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
  { id: "high", label: "月预算500元以上", icon: <Badge variant="secondary">500+</Badge> },
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
  "客服对话": ["智能客服", "客服对话", "企业客服"],
  "学术研究": ["科研辅助", "学术研究", "文档处理", "科研分析", "法律分析", "合同审查", "知识管理"],
  "日常使用": ["中文对话", "日常使用"],
};

/* ------------------------------------------------------------------ */
/* Benchmark / price helpers                                           */
/* ------------------------------------------------------------------ */

function getLatestVersion(model: RModel): RVersion | null {
  return model.versions.find((v) => v.latest) || model.versions[0] || null;
}

function getMMLU(model: RModel): number | null {
  const v = getLatestVersion(model);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bm = v?.benchmarks as any;
  return bm?.mmlu ?? null;
}

const USD_TO_CNY = 7.25;

function getLowestApiPriceCNY(model: RModel): number {
  let minCNY = Infinity;
  for (const plan of model.pricingPlans) {
    if (plan.planType !== "api") continue;
    const p = plan.pricing;
    const inputP = p.inputPrice ?? 0;
    const outputP = p.outputPrice ?? 0;
    if (inputP === 0 && outputP === 0) return 0; // free
    // Total per-1M cost
    let unit = 1;
    if (p.unit === "1K tokens") unit = 1000;
    const totalPerM = (inputP + outputP) * unit;
    const cny = p.currency === "USD" ? totalPerM * USD_TO_CNY : totalPerM;
    if (cny < minCNY) minCNY = cny;
  }
  return minCNY === Infinity ? -1 : minCNY;
}

function hasFreePlan(model: RModel): boolean {
  return model.pricingPlans.some(
    (p) =>
      (p.pricing.inputPrice === 0 && p.pricing.outputPrice === 0) ||
      p.pricing.price === 0
  );
}

/**
 * Cost-effectiveness score: MMLU / price (per 1M tokens total).
 * Free models get max score 100.
 */
function getCostEffectiveness(model: RModel): number {
  const mmlu = getMMLU(model);
  if (mmlu === null) return -1;

  if (hasFreePlan(model)) return 100;

  const price = getLowestApiPriceCNY(model);
  if (price <= 0) return 100;

  // Score = MMLU / (price / 10), capped at 100
  // This gives ~88/0.05 = 1760 -> capped. Let's use a softer formula.
  // score = mmlu * (10 / price), capped at 100
  const raw = mmlu * (10 / price);
  return Math.min(100, Math.round(raw * 10) / 10);
}

function getCostEffectivenessLabel(score: number): { label: string; color: string } {
  if (score < 0) return { label: "N/A", color: "text-apple-text-tertiary" };
  if (score >= 90) return { label: "极佳", color: "text-apple-accent" };
  if (score >= 70) return { label: "优秀", color: "text-apple-accent" };
  if (score >= 50) return { label: "良好", color: "text-apple-text-secondary" };
  if (score >= 30) return { label: "一般", color: "text-apple-text-secondary" };
  return { label: "较低", color: "text-apple-text-tertiary" };
}

/* ------------------------------------------------------------------ */
/* Recommendation logic                                                */
/* ------------------------------------------------------------------ */

interface RecommendedModel {
  model: RModel;
  score: number;
  reasons: string[];
  recommendationText: string;
}

function buildRecommendationText(
  model: RModel,
  scenarios: string[],
  budget: string,
  needs: string[]
): string {
  const parts: string[] = [];
  const mmlu = getMMLU(model);
  const isFree = hasFreePlan(model);
  const company = getCompanyById(model.companyId);

  // Scenario-based reason
  if (scenarios.length > 0) {
    const matched = scenarios.filter((s) =>
      model.scenarios.includes(s) ||
      [...model.tags, ...model.capabilities].some((t) => t.includes(s) || s.includes(t))
    );
    if (matched.length > 0) {
      parts.push(`${model.name}在「${matched[0]}」场景表现突出`);
    }
  }

  // Performance reason
  if (mmlu !== null && mmlu >= 85) {
    parts.push(`MMLU基准分数达${mmlu}分，综合能力强劲`);
  }

  // Budget reason
  if (budget === "free" && isFree) {
    parts.push("提供完全免费的API方案，零成本即可使用");
  } else if (budget === "low" && isFree) {
    parts.push("拥有免费方案，100元预算内绰绰有余");
  } else if (budget === "low") {
    const price = getLowestApiPriceCNY(model);
    if (price > 0 && price < 10) {
      parts.push(`API价格仅¥${price.toFixed(1)}/百万tokens，低成本使用`);
    }
  }

  // Need-based reasons
  if (needs.includes("long-context")) {
    const ctx = getMaxContext(model);
    if (ctx >= 1_000_000) {
      parts.push(`支持${formatContextLength(ctx)}超长上下文，适合处理大型文档`);
    }
  }
  if (needs.includes("multimodal")) {
    if (model.capabilities.some((c) => c.includes("多模态") || c.includes("视觉"))) {
      parts.push("支持多模态理解，可处理图片和文本混合输入");
    }
  }
  if (needs.includes("reasoning")) {
    if (model.tags.some((t) => t.includes("推理")) || model.capabilities.some((c) => c.includes("推理"))) {
      parts.push("具备出色的逻辑推理和数学能力");
    }
  }

  // Fallback
  if (parts.length === 0) {
    if (model.featured) parts.push("行业标杆模型，综合能力均衡");
    else if (isFree) parts.push("免费可用，适合入门和日常使用");
    else parts.push("综合能力出色，适合多种场景");
  }

  return parts.slice(0, 2).join("；") + "。";
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
      const hasFree = hasFreePlan(model);
      if (!hasFree) {
        score -= 30;
      } else {
        score += 15;
        if (!reasons.includes("完全免费")) reasons.push("完全免费");
      }
    } else if (budget === "low") {
      const hasFree = hasFreePlan(model);
      if (hasFree) {
        score += 15;
        if (!reasons.includes("完全免费")) reasons.push("完全免费");
      } else {
        const sp = getStartingPrice(model);
        if (sp.isFree) {
          score += 10;
        } else {
          const apiPlans = model.pricingPlans.filter((p) => p.planType === "api");
          for (const plan of apiPlans) {
            const inputCost = (plan.pricing.inputPrice || 0) * 10;
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
      score += 5;
    } else if (budget === "high") {
      // Prefer flagship/premium models
      const hasFlagship = model.versions.some((v) => v.tier === "flagship");
      if (hasFlagship) score += 8;
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

    // Benchmark bonus
    const mmlu = getMMLU(model);
    if (mmlu !== null) {
      score += Math.round(mmlu / 10); // up to ~9 points for benchmark
    }

    // Cost-effectiveness bonus
    const costEff = getCostEffectiveness(model);
    if (costEff >= 80) {
      score += 5;
      if (!reasons.includes("性价比极高")) reasons.push("性价比极高");
    } else if (costEff >= 50) {
      score += 3;
    }

    // Ensure at least 1 reason
    if (reasons.length === 0) {
      if (model.featured) reasons.push("行业标杆");
      else if (model.tags.includes("免费")) reasons.push("免费可用");
      else reasons.push("综合能力强");
    }

    const recommendationText = buildRecommendationText(model, scenarios, budget, needs);

    return { model, score, reasons: reasons.slice(0, 4), recommendationText };
  });

  // Sort by score descending, take top 5
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5);
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
                ? "bg-apple-accent/10 text-apple-accent dark:bg-apple-accent/10 dark:text-apple-accent"
                : step === currentStep
                  ? "bg-apple-accent text-white"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {step < currentStep ? <Check className="size-4" /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-12 h-0.5 ${
                step < currentStep
                  ? "bg-apple-accent/30 dark:bg-apple-accent/30"
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
          ? "border-apple-accent bg-apple-accent/5 ring-1 ring-apple-accent dark:bg-apple-accent/10"
          : "border-border hover:border-apple-accent/40"
      }`}
    >
      <div
        className={`flex items-center justify-center size-10 rounded-lg shrink-0 ${
          selected
            ? "bg-apple-accent/10 text-apple-accent dark:bg-apple-accent/10 dark:text-apple-accent"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {option.icon}
      </div>
      <span
        className={`font-medium ${
          selected ? "text-apple-accent" : ""
        }`}
      >
        {option.label}
      </span>
      {selected && (
        <Check className="size-4 text-apple-accent ml-auto shrink-0" />
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
  const { model, score, reasons, recommendationText } = rec;
  const company = getCompanyById(model.companyId);
  const maxScore = Math.max(80, score);
  const matchPercent = Math.min(99, Math.round((score / maxScore) * 100));
  const startPrice = getStartingPrice(model);
  const maxCtx = getMaxContext(model);
  const mmlu = getMMLU(model);
  const costEff = getCostEffectiveness(model);
  const costEffLabel = getCostEffectivenessLabel(costEff);

  const rankColors: Record<number, string> = {
    1: "bg-apple-accent",
    2: "bg-apple-text-tertiary",
    3: "bg-apple-text-tertiary",
  };

  return (
    <Card className={`overflow-hidden ${rank === 1 ? "ring-1 ring-apple-accent/40" : ""}`}>
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
                <Trophy className="size-5 text-apple-accent" />
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
                <span className="text-xs font-semibold text-apple-accent">
                  {matchPercent}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-apple-accent rounded-full transition-all"
                  style={{ width: `${matchPercent}%` }}
                />
              </div>
            </div>

            {/* Benchmark MMLU + Cost Effectiveness */}
            <div className="flex items-center gap-4 mb-3">
              {mmlu !== null && (
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 text-blue-500" />
                  <span className="text-xs text-muted-foreground">MMLU</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{mmlu}</span>
                </div>
              )}
              {costEff >= 0 && (
                <div className="flex items-center gap-1.5">
                  <Zap className="size-3.5 text-apple-accent" />
                  <span className="text-xs text-muted-foreground">性价比</span>
                  <span className={`text-xs font-bold ${costEffLabel.color}`}>
                    {costEffLabel.label}
                  </span>
                  <span className="text-xs text-muted-foreground">({costEff.toFixed(0)})</span>
                </div>
              )}
            </div>

            {/* Recommendation reason text */}
            <div className="rounded-md bg-muted/50 px-3 py-2 mb-3">
              <div className="flex items-start gap-1.5">
                <Star className="size-3.5 text-apple-accent mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {recommendationText}
                </p>
              </div>
            </div>

            {/* Reasons tags */}
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
                      ? "text-apple-accent font-medium"
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
            <div>
              <h2 className="text-lg font-semibold">为你推荐的模型</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                基于你选择的场景「{selectedScenarios.join("、")}」和预算偏好智能匹配
              </p>
            </div>
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

          {/* Summary badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="text-xs">
              {selectedScenarios.length}个场景
            </Badge>
            <Badge variant="outline" className="text-xs">
              {budgetOptions.find((b) => b.id === selectedBudget)?.label}
            </Badge>
            {selectedNeeds.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {selectedNeeds.length}个需求
              </Badge>
            )}
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

          {/* Tip at bottom */}
          <div className="mt-6 rounded-lg bg-muted/50 px-4 py-3">
            <div className="flex items-start gap-2">
              <Shield className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                推荐结果综合考虑了场景匹配度、基准测试分数（MMLU）、价格性价比和你的预算偏好。
                性价比评分 = MMLU分数 / API价格系数，免费模型获得最高评分。
                实际体验可能因使用方式不同而有所差异，建议先试用免费方案。
              </p>
            </div>
          </div>
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
                  <span className="inline-flex items-center justify-center size-6 rounded-full bg-apple-accent/10 text-apple-accent text-xs font-bold">
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
