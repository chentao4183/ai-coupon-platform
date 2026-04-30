"use client";

import { useMemo } from "react";
import { getAllCodingPlans } from "@/lib/coding-plans";
import { Code2, ExternalLink, Zap, TrendingDown, ChevronRight } from "lucide-react";

const allPlans = getAllCodingPlans();

/** 首月特惠套餐 — discount 包含"首月"关键词 */
const firstMonthPlans = allPlans.filter(
  (p) => p.pricing.discount && p.pricing.discount.includes("首月")
);

function normalizeToCNY(plan: (typeof allPlans)[number]): number {
  const monthly =
    plan.pricing.period === "year"
      ? plan.pricing.price / 12
      : plan.pricing.price;
  return plan.pricing.currency === "USD" ? monthly * 7.25 : monthly;
}

/** 各厂商 Pro 档位 — 用于快速对比表（取每个 providerId 的 pro tier，优先 popular） */
function getProPlansForComparison() {
  const map = new Map<string, (typeof allPlans)[number]>();
  for (const p of allPlans) {
    if (p.tier === "pro") {
      const existing = map.get(p.providerId);
      if (!existing || (p.popular && !existing.popular)) {
        map.set(p.providerId, p);
      }
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => normalizeToCNY(a) - normalizeToCNY(b)
  );
}

interface ProviderGroup {
  providerId: string;
  providerName: string;
  providerLogo: string;
  website: string;
  buyUrl: string;
  plans: (typeof allPlans)[number][];
  // Fields that are the same across all plans in this provider
  models: string[];
  modelsNote: string;
  supportedTools: string[];
  toolCount: string;
  contextLength: string;
}

function groupByProvider(plans: (typeof allPlans)[number][]): ProviderGroup[] {
  const map = new Map<string, ProviderGroup>();

  for (const p of plans) {
    if (!map.has(p.providerId)) {
      map.set(p.providerId, {
        providerId: p.providerId,
        providerName: p.providerName,
        providerLogo: p.providerLogo,
        website: p.website,
        buyUrl: p.buyUrl,
        plans: [],
        models: p.models,
        modelsNote: p.modelsNote || "",
        supportedTools: p.supportedTools,
        toolCount: p.toolCount,
        contextLength: p.contextLength,
      });
    }
    map.get(p.providerId)!.plans.push(p);
  }

  return Array.from(map.values());
}

const TIER_LABELS: Record<string, string> = {
  lite: "Lite",
  pro: "Pro",
  max: "Max",
  ultra: "Ultra",
};

function formatPrice(plan: (typeof allPlans)[number]): string {
  if (plan.pricing.currency === "USD") {
    const cny = Math.round(plan.pricing.price * 7.25);
    return `$${plan.pricing.price}/月 (≈¥${cny})`;
  }
  return `¥${plan.pricing.price}/月`;
}

export default function CodingPlansPage() {
  const providers = useMemo(() => groupByProvider(allPlans), []);
  const proPlans = useMemo(() => getProPlansForComparison(), []);

  // coding 页面使用更宽的布局
  return (
    <div className="flex flex-col" style={{ "--coding-max-width": "1280px" } as React.CSSProperties}>
      {/* Hero */}
      <section className="bg-[#000000]">
        <div className="mx-auto flex min-h-[420px] max-w-[var(--coding-max-width)] flex-col items-center justify-center px-6 py-20 text-center sm:min-h-[480px] sm:py-28">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 mb-6">
            <Code2 className="size-3" />
            <span>{allPlans.length} 个套餐 · {providers.length} 家厂商</span>
          </div>
          <h1 className="heading-hero text-white">
            AI 编程套餐
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[21px] font-normal leading-relaxed text-white/80">
            按厂商分类，一行一个套餐，配额与价格一目了然
          </p>
        </div>
      </section>

      {/* 首月特惠 */}
      {firstMonthPlans.length > 0 && <FirstMonthDeals plans={firstMonthPlans} />}

      {/* 快速对比表 */}
      <QuickComparisonTable plans={proPlans} />

      {/* Provider Sections */}
      <section className="mx-auto w-full px-4 py-8 sm:px-6 sm:py-10" style={{ maxWidth: "var(--coding-max-width)" }}>
        <div className="space-y-10">
          {providers.map((group) => (
            <ProviderSection key={group.providerId} group={group} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />
    </div>
  );
}

function ProviderSection({ group }: { group: ProviderGroup }) {
  return (
    <div className="rounded-2xl bg-apple-surface overflow-hidden">
      {/* Provider Header — T8: 28px name, caption meta, pill buy button */}
      <div className="px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: logo + name + meta */}
          <div className="flex items-center gap-4 min-w-0">
            <img
              src={group.providerLogo}
              alt={group.providerName}
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-full object-contain bg-apple-surface-elevated"
            />
            <div className="min-w-0">
              <h2 className="heading-card font-semibold text-foreground">
                {group.providerName}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 caption-text text-apple-text-tertiary">
                <span>
                  {group.models.slice(0, 4).join("、")}
                  {group.models.length > 4 && ` +${group.models.length - 4}`}
                </span>
                <span>·</span>
                <span>{group.contextLength} 上下文</span>
                <span>·</span>
                <span>{group.toolCount} 工具</span>
              </div>
            </div>
          </div>

          {/* Right: tools + buy link */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden lg:flex flex-wrap gap-1.5 max-w-[300px]">
              {group.supportedTools.slice(0, 6).map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center rounded-full bg-apple-surface-elevated px-2 py-0.5 text-[11px] text-apple-text-tertiary"
                >
                  {tool}
                </span>
              ))}
              {group.supportedTools.length > 6 && (
                <span className="text-[11px] text-apple-text-tertiary">
                  +{group.supportedTools.length - 6}
                </span>
              )}
            </div>
            <a
              href={group.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-apple-accent px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-85"
            >
              前往购买
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Plans Table — T7: clean Apple table */}
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[120px]" />
            <col className="w-[220px]" />
            <col className="w-[180px]" />
            <col />
            <col className="w-[180px]" />
          </colgroup>
        <thead>
          <tr className="label-text text-apple-text-tertiary">
            <th className="px-6 py-3 text-left sm:px-8">档位</th>
            <th className="px-6 py-3 text-left sm:px-8 whitespace-nowrap">配额</th>
            <th className="px-6 py-3 text-left sm:px-8 whitespace-nowrap">等效用量</th>
            <th className="px-6 py-3 text-left sm:px-8">亮点</th>
            <th className="px-6 py-3 text-right sm:px-8">价格</th>
            </tr>
          </thead>
          <tbody>
            {group.plans.map((plan, idx) => (
              <PlanRow
                key={plan.id}
                plan={plan}
                isLast={idx === group.plans.length - 1}
                defaultModelsNote={group.modelsNote}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlanRow({
  plan,
  isLast,
  defaultModelsNote,
}: {
  plan: (typeof allPlans)[number];
  isLast: boolean;
  defaultModelsNote: string;
}) {
  const tierLabel = TIER_LABELS[plan.tier] || plan.tier;

  return (
    <tr
      className={`border-b border-apple-divider transition-colors hover:bg-apple-surface-elevated ${
        isLast ? "border-b-0" : ""
      }`}
    >
      {/* Tier */}
      <td className="px-6 py-3.5 sm:px-8">
        <div className="flex flex-nowrap items-center gap-1.5 whitespace-nowrap">
          <span className="inline-flex items-center rounded-full bg-apple-accent/10 px-2 py-0.5 text-xs font-semibold text-apple-accent">
            {tierLabel}
          </span>
          {plan.popular && (
            <span className="inline-flex items-center rounded-full bg-apple-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-apple-accent">
              热门
            </span>
          )}
        </div>
      </td>

      {/* Quota */}
      <td className="px-6 py-3.5 sm:px-8">
        <span className="block whitespace-normal break-words font-medium text-foreground">
          {plan.quota.promptsPer5h
            ? `${plan.quota.promptsPer5h.toLocaleString()} 次/5h`
            : plan.quota.description.split("，")[0]}
        </span>
        {plan.quota.promptsPerWeek && (
          <span className="caption-text mt-0.5 block text-apple-text-tertiary">
            {plan.quota.promptsPerWeek.toLocaleString()} 次/周
          </span>
        )}
      </td>

      {/* Claude Equivalent */}
      <td className="px-6 py-3.5 caption-text whitespace-normal break-words text-apple-text-tertiary sm:px-8">
        {plan.claudeProEquivalent}
      </td>

      {/* Highlights */}
      <td className="px-6 py-3.5 sm:px-8">
        {plan.pricing.discount ? (
          <span className="inline-flex max-w-full items-center whitespace-normal break-words rounded-full bg-apple-accent/10 px-2 py-0.5 text-xs font-medium leading-relaxed text-apple-accent">
            {plan.pricing.discount}
          </span>
        ) : plan.modelsNote && plan.modelsNote !== defaultModelsNote ? (
          <span className="caption-text block max-w-full whitespace-normal break-words text-apple-text-tertiary">
            {plan.modelsNote}
          </span>
        ) : (
          <span className="caption-text block max-w-full whitespace-normal break-words text-apple-text-tertiary">
            {plan.mcpFeatures[0]}
          </span>
        )}
      </td>

      {/* Price */}
      <td className="px-6 py-3.5 text-right whitespace-nowrap sm:px-8">
        <span className="text-base font-semibold text-apple-accent">
          {formatPrice(plan)}
        </span>
      </td>
    </tr>
  );
}

/* ============================================================
   首月特惠区域
   ============================================================ */
function FirstMonthDeals({ plans }: { plans: (typeof allPlans)[number][] }) {
  return (
    <section className="mx-auto w-full px-4 pt-8 sm:px-6 sm:pt-10" style={{ maxWidth: "var(--coding-max-width)" }}>
      <div className="flex items-center gap-2 mb-5">
        <div className="flex items-center gap-1.5 rounded-full bg-apple-accent/10 px-3 py-1 text-xs font-medium text-apple-accent">
          <TrendingDown className="size-3" />
          <span>首月特惠</span>
        </div>
        <span className="caption-text text-apple-text-tertiary">
          {plans.length} 个套餐限时低价体验
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {plans.map((plan) => (
          <a
            key={plan.id}
            href={plan.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-xl bg-apple-surface p-4 transition-colors hover:bg-apple-surface-elevated"
          >
            {/* Discount badge */}
            <div className="absolute -top-2.5 right-3">
              <span className="inline-flex items-center rounded-full bg-apple-accent px-2 py-0.5 text-[10px] font-semibold text-white">
                {plan.pricing.discount?.match(/([\d.]+折)/)?.[0] || (plan.pricing.discount?.includes("半价") ? "半价" : "特惠")}
              </span>
            </div>

            {/* Provider + name */}
            <div className="flex items-center gap-2 mb-2.5">
              <img
                src={plan.providerLogo}
                alt={plan.providerName}
                width={24}
                height={24}
                className="size-6 shrink-0 rounded-full object-contain bg-apple-surface-elevated"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {plan.providerName}
                </p>
                <p className="caption-text text-apple-text-tertiary">
                  {plan.models[0]}
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-semibold text-foreground">
                {(() => {
                  const m = plan.pricing.discount?.match(/首月[仅]?[¥$]?([\d.]+)/);
                  return m ? `¥${m[1]}` : formatPrice(plan);
                })()}
              </span>
              {(() => {
                const disc = plan.pricing.discount?.match(/([\d.]+折)/);
                return disc ? (
                  <span className="text-[10px] font-medium text-apple-accent ml-1">
                    {disc[1]}
                  </span>
                ) : null;
              })()}
            </div>
            <p className="caption-text text-apple-text-tertiary mt-0.5">
              原价 {plan.pricing.currency === "CNY" ? "¥" : "$"}{plan.pricing.price}/月
            </p>

            {/* Quota hint */}
            <p className="caption-text text-apple-text-tertiary mt-2 truncate">
              {plan.quota.promptsPer5h
                ? `${plan.quota.promptsPer5h} 次/5h`
                : plan.quota.description.split("，")[0]}
            </p>

            {/* Arrow */}
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-apple-accent opacity-0 group-hover:opacity-100 transition-opacity">
              立即体验
              <ChevronRight className="size-3" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   FAQ 模块
   ============================================================ */
const FAQ_ITEMS = [
  {
    q: "AI 编程套餐和普通 API 按量计费有什么区别？",
    a: "编程套餐是月付订阅制，提供固定配额（如每 5 小时 N 次调用），适合日常编码使用，成本可预测。API 按量计费按实际 token 用量扣费，适合流量不固定或需要灵活扩缩的场景。如果你每天都在用 Claude Code、Cursor 等工具编程，套餐通常比按量便宜 3-5 倍。",
  },
  {
    q: "\"等效用量\"是怎么算的？",
    a: "以 Claude Pro（$20/月）为基准 1x，根据各套餐的实际配额换算。例如某套餐每 5 小时 400 次，约为 Claude Pro 的 5 倍，即 5x。这个数字仅供参考，实际体验还受模型质量、响应速度、上下文长度等因素影响。",
  },
  {
    q: "支持哪些编程工具？",
    a: "不同厂商支持的工具范围差异很大。国内厂商（如智谱、MiniMax）通常通过 OpenAI 兼容 API 接入，支持 Claude Code、Cursor、Windsurf、Cline、Aider 等主流工具。海外厂商（如 Anthropic、OpenAI）只支持自家工具。具体支持列表见各厂商详情。",
  },
  {
    q: "国产模型的编程能力够用吗？",
    a: "2025-2026 年国产模型进步很快。GLM-5、DeepSeek、Qwen 等在代码补全和简单重构上已经接近 GPT-4o 水平。但在复杂架构设计、多文件重构、长上下文推理等场景下，Claude 和 GPT 仍有优势。建议先用便宜的 Lite 档位试一试，再决定是否升级。",
  },
  {
    q: "首月特惠靠谱吗？有什么坑？",
    a: "火山引擎、阿里云、腾讯云等厂商的\"首月特惠\"是官方活动，可以放心购买。需要注意：1) 特惠价格仅限首月，次月恢复原价；2) 部分活动要求绑定手机号/实名认证；3) 取消订阅通常随时可以，不会自动续费扣款。建议先薅首月羊毛体验，满意再续。",
  },
  {
    q: "如何选择适合自己的套餐？",
    a: "三个维度：预算、使用强度、工具偏好。轻度使用（每天几小时）→ Lite 档 ¥29-49/月；日常开发（全职编程）→ Pro 档 ¥99-200/月；重度使用（多项目并行）→ Max 档 ¥119-725/月。如果不确定，先选最便宜的试一周。",
  },
];

function FAQSection() {
  return (
    <section className="mx-auto w-full px-4 py-8 sm:px-6 sm:py-10 border-t border-apple-divider" style={{ maxWidth: "var(--coding-max-width)" }}>
      <h2 className="heading-card font-semibold text-foreground mb-6">
        常见问题
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
        {FAQ_ITEMS.map((item, i) => (
          <details
            key={i}
            className="group py-3 border-b border-apple-divider last:border-b-0"
          >
            <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-foreground hover:text-apple-accent transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
              <span>{item.q}</span>
              <ChevronRight className="size-4 shrink-0 text-apple-text-tertiary transition-transform group-open:rotate-90 ml-3" />
            </summary>
            <p className="mt-2 caption-text text-apple-text-secondary" style={{ lineHeight: "1.6" }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   快速对比表 — 各厂商 Pro 档位一览
   ============================================================ */
function QuickComparisonTable({ plans }: { plans: (typeof allPlans)[number][] }) {
  return (
    <section className="mx-auto w-full px-4 py-8 sm:px-6 sm:py-10" style={{ maxWidth: "var(--coding-max-width)" }}>
      <div className="flex items-center gap-2 mb-5">
        <div className="flex items-center gap-1.5 rounded-full bg-apple-accent/10 px-3 py-1 text-xs font-medium text-apple-accent">
          <Zap className="size-3" />
          <span>快速对比</span>
        </div>
        <span className="caption-text text-apple-text-tertiary">
          各厂商 Pro 档位核心参数一览
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl bg-apple-surface">
        <table className="min-w-[980px] w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[180px]" />
            <col className="w-[240px]" />
            <col className="w-[220px]" />
            <col className="w-[170px]" />
            <col className="w-[100px]" />
            <col className="w-[170px]" />
          </colgroup>
          <thead>
            <tr className="label-text text-apple-text-tertiary">
              <th className="px-5 py-3 text-left">厂商</th>
              <th className="px-5 py-3 text-left">模型</th>
              <th className="px-5 py-3 text-left">配额</th>
              <th className="px-5 py-3 text-left">等效用量</th>
              <th className="px-5 py-3 text-left">上下文</th>
              <th className="px-5 py-3 text-right">价格</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr
                key={plan.id}
                className="border-b border-apple-divider last:border-b-0 transition-colors hover:bg-apple-surface-elevated"
              >
                {/* Provider */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={plan.providerLogo}
                      alt={plan.providerName}
                      width={20}
                      height={20}
                      className="size-5 shrink-0 rounded-full object-contain bg-apple-surface-elevated"
                    />
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">
                      {plan.providerName}
                    </span>
                    {plan.popular && (
                      <span className="inline-flex items-center rounded-full bg-apple-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-apple-accent">热门</span>
                    )}
                  </div>
                </td>

                {/* Models */}
                <td className="px-5 py-3 caption-text whitespace-normal break-words text-apple-text-tertiary">
                  {plan.models.slice(0, 2).join("、")}
                  {plan.models.length > 2 && ` +${plan.models.length - 2}`}
                </td>

                {/* Quota */}
                <td className="px-5 py-3 caption-text whitespace-normal break-words text-apple-text-tertiary">
                  {plan.quota.promptsPer5h
                    ? `${plan.quota.promptsPer5h.toLocaleString()} 次/5h`
                    : plan.quota.description.split("，")[0]}
                </td>

                {/* Equivalent */}
                <td className="px-5 py-3 caption-text whitespace-normal break-words text-apple-text-tertiary">
                  {plan.claudeProEquivalent}
                </td>

                {/* Context */}
                <td className="px-5 py-3 caption-text text-apple-text-tertiary">
                  {plan.contextLength}
                </td>

                {/* Price */}
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <span className="text-sm font-semibold text-apple-accent">
                    {formatPrice(plan)}
                  </span>
                  {plan.pricing.discount && (
                    <p className="mt-0.5 whitespace-normal break-words text-[10px] leading-snug text-apple-accent/70">{plan.pricing.discount}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
