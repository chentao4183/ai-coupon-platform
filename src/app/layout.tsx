import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AIdeals - AI 模型价格与能力全景对比",
    template: "%s | AIdeals",
  },
  description:
    "一站式 AI 大模型定价对比平台，覆盖 Claude、GPT、Gemini、GLM、DeepSeek 等主流模型。编程套餐订阅与 API 按量付费双维度对比，帮助开发者和企业找到最优方案。",
  keywords: [
    "AI模型比价",
    "Claude价格",
    "GPT价格",
    "Gemini价格",
    "AI编程套餐",
    "API定价对比",
    "大模型成本",
    "DeepSeek",
    "GLM",
  ],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "AIdeals",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'?'dark':t==='light'?'light':(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.classList.add(d)}catch(e){}})();`}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <TooltipProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
