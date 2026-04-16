"use client";

import { getAllModels } from "@/lib/data";
import { getAllCodingPlans } from "@/lib/coding-plans";
import { AnimatedNumber } from "@/components/animated-number";
import {
  Code2,
  Zap,
  HelpCircle,
  ArrowRight,
  Building2,
  Layers,
  TrendingDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { asRModel } from "@/lib/helpers";

// ─── Data ───────────────────────────────────────────────────────────

const allModels = getAllModels();
const rModels = allModels.map((m) => asRModel(m));

const stats = (() => {
  const companyIds = new Set(allModels.map((m) => m.companyId));
  // Find cheapest coding plan from dedicated coding-plans data
  const codingPlans = getAllCodingPlans();
  let cheapestMonthly = Infinity;
  for (const plan of codingPlans) {
    const price = plan.pricing.price;
    if (price > 0 && price < cheapestMonthly) {
      cheapestMonthly = price;
    }
  }
  return {
    companies: companyIds.size,
    modelSeries: allModels.length,
    cheapestMonthly: cheapestMonthly === Infinity ? 0 : Math.round(cheapestMonthly),
  };
})();

// ─── Scene Cards ────────────────────────────────────────────────────

const SCENES = [
  {
    icon: Code2,
    title: "编程开发",
    desc: "按月订阅编程套餐，无限调用主流代码模型，性价比远超按量付费",
    href: "/coding",
    tag: "最热门",
  },
  {
    icon: Zap,
    title: "API 按量付费",
    desc: "精确到每百万 Token 的价格对比，覆盖国内外主流 API 服务商",
    href: "/pricing",
    tag: "按需付费",
  },
  {
    icon: TrendingDown,
    title: "平替方案",
    desc: "预算有限？找到国产高性价比替代方案，能力接近价格更低",
    href: "/lobster",
    tag: "省钱之选",
  },
  {
    icon: HelpCircle,
    title: "不知道选哪个",
    desc: "回答几个问题，智能推荐最适合你的模型和计费方案",
    href: "/recommend",
    tag: "智能推荐",
  },
];

// ─── Page ───────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero (always dark) ─────────────────────────────────── */}
      <section className="bg-[#000000]">
        <div className="mx-auto flex min-h-[420px] max-w-[980px] flex-col items-center justify-center px-6 py-20 sm:min-h-[480px] sm:py-28">
          {/* Tag line */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 mb-6">
            <span>覆盖 {stats.companies} 家厂商 · {stats.modelSeries} 个模型系列</span>
          </div>

          {/* Title */}
          <h1 className="heading-hero text-white">
            选对 AI 模型，<br className="sm:hidden" />
            不花冤枉钱
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-xl text-[21px] font-normal leading-relaxed text-white/80">
            编程套餐订阅与 API 按量付费，双维度对比主流大模型定价，帮你找到最优解。
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/compare"
              className="inline-flex items-center justify-center rounded-full bg-apple-accent px-7 py-3 text-[17px] font-medium text-white transition-opacity hover:opacity-85"
            >
              对比所有模型
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3 text-[17px] font-medium text-white transition-opacity hover:bg-white/10"
            >
              API 定价详情
            </Link>
          </div>
        </div>
      </section>

      {/* ── Scene Selector ────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[980px] px-6 py-20 sm:py-24">
        <h2 className="label-text text-apple-text-tertiary mb-10">
          你想做什么
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {SCENES.map((scene) => (
            <Link
              key={scene.href}
              href={scene.href}
              className="group flex items-start gap-4 rounded-2xl bg-apple-surface-elevated p-5 transition-colors duration-200 hover:bg-apple-surface-elevated/80 sm:p-6 sm:gap-5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-apple-accent/10 sm:size-11">
                <scene.icon className="size-5 text-apple-accent sm:size-[22px]" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-[17px] font-medium text-foreground">
                    {scene.title}
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-apple-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-apple-accent">
                    {scene.tag}
                  </span>
                </div>
                <p className="mt-1.5 text-[15px] leading-relaxed text-apple-text-secondary">
                  {scene.desc}
                </p>
              </div>
              <ArrowRight className="mt-2 size-4 shrink-0 text-apple-text-tertiary transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────── */}
      <section className="border-t border-apple-divider">
        <div className="mx-auto max-w-[980px] px-6 py-20 sm:py-24 text-center">
          <h2 className="heading-section text-foreground">
            找到适合你的方案
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[17px] leading-relaxed text-apple-text-secondary">
            还在纠结？回答几个问题，获取个性化推荐。
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/recommend"
              className="inline-flex items-center justify-center rounded-full bg-apple-accent px-7 py-3 text-[17px] font-medium text-white transition-opacity hover:opacity-85"
            >
              智能推荐
              <ChevronRight className="ml-1 size-4" />
            </Link>
            <Link
              href="/calculator"
              className="inline-flex items-center justify-center rounded-full border border-apple-divider px-7 py-3 text-[17px] font-medium text-foreground transition-colors hover:bg-apple-surface-elevated"
            >
              成本计算器
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
