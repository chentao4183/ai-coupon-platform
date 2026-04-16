import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 模型成本计算器 | AIdeals",
  description:
    "输入你的使用量，精确预估 AI 模型的月度 API 成本，支持多模型对比计算。",
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
