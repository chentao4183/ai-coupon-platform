import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 模型平替方案 - 国产替代性价比对比",
  description:
    "预算有限？找到 GPT、Claude 等海外模型的国产平替方案。DeepSeek、GLM、通义千问等国产大模型能力接近，价格仅 1/5 到 1/10。",
};

export default function LobsterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
