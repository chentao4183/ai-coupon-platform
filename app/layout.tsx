import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI 优惠平台 - 一站式 AI 大模型优惠链接',
  description: '发现最优质的 AI 大模型优惠信息，包括 ChatGPT、Claude、文心一言等热门 AI 产品的专属折扣和优惠链接',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
