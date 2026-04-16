import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 模型对比 | AIdeals",
  description:
    "多维度对比不同 AI 大模型的参数、价格和能力，帮助你做出明智的选择。",
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
