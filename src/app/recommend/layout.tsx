import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 模型智能推荐 - 找到最适合你的大模型",
  description:
    "不确定该选哪个 AI 模型？回答 3 个问题，根据你的使用场景、预算和需求，智能推荐最适合的大模型和计费方案。",
};

export default function RecommendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
