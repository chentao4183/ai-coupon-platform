import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIdeals - AI 模型价格与能力全景对比",
  description:
    "一站式 AI 大模型定价对比平台，覆盖 Claude、GPT、Gemini、GLM、DeepSeek 等主流模型。编程套餐订阅与 API 按量付费双维度对比，帮助开发者和企业找到最优方案。",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AIdeals",
    url: "https://aideals.me",
    description:
      "一站式 AI 大模型定价对比平台，覆盖 Claude、GPT、Gemini、GLM、DeepSeek 等主流模型。编程套餐与 API 按量付费双维度对比。",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CNY",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "AI 编程套餐和 API 按量付费哪个更划算？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "如果你每天编程使用量较大（超过 50 次对话），编程套餐通常比 API 按量付费便宜 3-5 倍。轻度使用或间歇性调用则按量付费更灵活。",
        },
      },
      {
        "@type": "Question",
        name: "国产 AI 模型能否替代 GPT 和 Claude？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "在编程场景下，GLM、DeepSeek 等国产模型已接近 GPT-4 水平，且价格仅为 1/5 到 1/10。日常对话和中文场景下，国产模型表现甚至更优。复杂推理和英文长文场景下，GPT 和 Claude 仍有优势。",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
