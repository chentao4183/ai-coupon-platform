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
  title: "AI模型比价 - 一站式大模型套餐对比平台",
  description:
    "全面对比国内外主流AI大模型的定价方案，包括GPT、Claude、Gemini、GLM、通义千问等，帮助您找到最具性价比的AI模型方案。",
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
