import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 编程套餐对比 - Claude/GPT/GLM 订阅价格一览",
  description:
    "全面对比 Claude Code、ChatGPT Plus、Gemini Pro、GLM 编程套餐的订阅价格、配额限制和首月特惠，找到最适合开发者的编程 AI 套餐。",
};

export default function CodingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
