# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

AI大模型价格与能力全景对比平台，覆盖10家主流提供商的32个模型版本和43个定价方案。
在线地址：https://www.aideals.me/

## 技术栈

- **框架**: Next.js 16.2 (App Router, Turbopack)
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4 + shadcn/ui 4
- **包管理**: npm
- **部署**: Vercel (push to master 自动触发)
- **Node**: v22+

## 常用命令

```bash
npm run dev          # 开发服务器 (Turbopack, localhost:3000)
npm run build        # 生产构建 — 修改完成后务必运行确认通过
npm run lint         # ESLint 检查
```

无测试框架，无测试文件。验证方式为 `npm run build`。

## 数据架构

项目是纯静态数据驱动，无数据库/API 后端。数据通过 JSON import 加载：

```
models.json → lib/data.ts (查询/排序/筛选) → 页面组件
coding-plans.json → lib/coding-plans.ts → coding 页面
```

### 双类型系统（重要）

models.json 的实际字段结构（运行时）与 `types/model.ts` 中的 TypeScript 接口**不一致**。为此存在两套类型：

- **`types/model.ts`** — TypeScript 编译期接口（`Model`, `ModelVersion`, `PricingPlan`），字段名如 `versionName`, `amount`, `isLatest`
- **`lib/helpers.ts` 中的 R 系列** — 运行时接口（`RModel`, `RVersion`, `RPlan`），字段名如 `name`, `price`, `latest`

`lib/data.ts` 通过 `as unknown as ModelData` 强制转换。**组件中应优先使用 `lib/helpers.ts` 的 R 系列类型和辅助函数**（`asRModel()`, `getStartingPrice()`, `getPlansForVersion()` 等），它们匹配 JSON 的真实结构。

### 数据约定

- 核心数据在 `src/data/models.json`，修改前务必理解其结构
- 编程套餐数据在 `src/data/coding-plans.json`
- 公司ID: zhipu | openai | anthropic | google | alibaba | deepseek | moonshot | bytedance | baidu | minimax
- planType 枚举: subscription | pay-per-use | enterprise | api
- 编程套餐数据必须以官网控制台实际页面为准，不能凭竞品推测
- 阿里云百炼实际只有 Pro ¥200/月一个套餐（截至 2026-04）

## 页面路由

| 路由 | 用途 |
|------|------|
| `/` | 首页 — 模型卡片列表 + 搜索筛选 |
| `/model/[id]` | 模型详情页 — 动态路由 |
| `/compare` | 对比页 — 横向参数对比 |
| `/recommend` | 推荐页 — 需求问卷式推荐 |
| `/calculator` | 成本计算器 |
| `/pricing` | API定价详情 |
| `/coding` | 编程套餐 |
| `/lobster` | 龙虾特惠 |

所有页面共享根布局（`app/layout.tsx`）中的 Header/Footer/ThemeProvider。部分页面有独立的子布局（`layout.tsx`）注入页面级 CSS 变量。

## 编码规范

- **注释**: 中文注释
- **组件命名**: PascalCase，文件命名: PascalCase 组件, kebab-case 工具文件
- **样式**: 优先 Tailwind CSS，使用 `cn()` 工具函数合并类名
- **UI组件**: 优先使用 shadcn/ui（`src/components/ui/`），不要自己造轮子
- **图片**: 使用 `next/image`，品牌图标在 `/public/logos/` 目录
- **类型**: 不要使用 `any`，必要时用 `unknown`

## 设计原则（Apple 设计语言）

- 只有一个强调色 `#0a84ff`，其余黑白灰。禁止引入其他彩色
- 去AI味：避免渐变色（纯色背景交替）、大圆角（药丸形仅限 CTA）、过度动效
- 毛玻璃导航：导航栏半透明 + backdrop-filter blur，去掉 border
- 无边框设计：卡片和容器靠背景色差和微阴影区分层级
- 字体：Inter（Google Fonts），禁止使用其他字体
- 高级克制：负字距贯穿所有尺寸，标题 line-height 1.07-1.14，正文 1.47

### CSS 工具类（globals.css 定义）

- `.heading-hero` — 56px/600/1.07/-0.015em
- `.heading-section` — 40px/600/1.10/-0.012em
- `.heading-card` — 28px/400/1.14/-0.01em
- `.label-text` — 12px/600/uppercase/0.06em
- `.caption-text` — 14px/400/1.29

### Tailwind 颜色工具类

- `bg-apple-accent` / `text-apple-accent` — #0a84ff
- `text-apple-link` — #0066cc(亮) / #2997ff(暗)
- `text-apple-text-secondary` — rgba 80%
- `text-apple-text-tertiary` — rgba 48%
- `bg-apple-surface` — 卡片背景 #fff(亮) / #1c1c1e(暗)
- `bg-apple-surface-elevated` — 悬浮卡片 #fff(亮) / #2c2c2e(暗)

### CSS 变量

- `--section-spacing: 100px` — 区块间距
- `--content-max-width: 980px` — 全局内容最大宽度（coding 页面除外）
- `--coding-max-width: 1280px` — coding 页面专用
- `--card-padding: 24px` — 卡片内边距

### Hero 区块统一模板（所有页面必须遵循）

```jsx
<section className="bg-[#000000]">
  <div className="mx-auto max-w-[980px] px-6 pb-20 pt-24 sm:pb-28 sm:pt-32 text-center">
    {/* Pill 标签（可选，带图标） */}
    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 mb-6">
      <Icon className="size-3" />
      <span>数据摘要文字</span>
    </div>
    {/* 标题 */}
    <h1 className="heading-hero text-white">页面标题</h1>
    {/* 副标题 */}
    <p className="mx-auto mt-5 max-w-xl text-[21px] font-normal leading-relaxed text-white/80">
      一句话描述
    </p>
    {/* 页面特有内容（CTA按钮/统计数字等）放在这里 */}
  </div>
</section>
```

关键规则：
- 背景统一 `bg-[#000000]`，不用 `bg-black` 或其他变体
- 内边距统一 `pb-20 pt-24 sm:pb-28 sm:pt-32`，不允许各页面自定高度
- Pill 标签用 `bg-white/10 text-white/80`，不用 `bg-apple-accent/10 text-apple-accent`
- 标题用 `heading-hero text-white`，不用 `heading-section`
- 副标题用 `text-[21px] text-white/80`，不用 `text-lg` 或 `text-apple-text-secondary`
- coding 页面 max-width 用 `var(--coding-max-width)`，其他页面用 980px

## 禁止事项

- 不要修改 `src/components/ui/` 下的 shadcn 基础组件（用 shadcn CLI 管理）
- 不要删除 `public/logos/` 下的品牌图标文件
- 不要随意修改 models.json 的数据结构（只改数据不改 schema）
- 不要安装未经确认的新 npm 依赖包
- 不要使用 css-in-js 或 styled-components
- 不要引入重量级动画库
