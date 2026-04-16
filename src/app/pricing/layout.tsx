import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API 按量付费对比 - 大模型 Token 定价排行榜",
  description:
    "精确到每百万 Token 的 AI 大模型 API 定价对比，覆盖 OpenAI、Anthropic、Google、智谱、DeepSeek 等主流服务商的输入/输出价格。",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
