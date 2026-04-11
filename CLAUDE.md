# AI模型比价平台 - 项目约定

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

## 项目结构

```
src/
  app/                    # 页面路由 (App Router)
    page.tsx              # 首页 - 模型卡片列表 + 搜索筛选
    model/[id]/page.tsx   # 模型详情页 - 动态路由
    compare/page.tsx      # 对比页 - 横向参数对比
    recommend/page.tsx    # 推荐页 - 需求问卷式推荐
    calculator/page.tsx   # 成本计算器
    pricing/page.tsx      # API定价详情
    coding/page.tsx       # 编程套餐
    layout.tsx            # 全局布局
  components/
    home/                 # 首页专用组件
      ModelCard.tsx       # 模型卡片 (含品牌logo)
      ModelFilters.tsx    # 筛选器
    model/                # 详情页组件
      ModelTabs.tsx       # Tab 切换
      VersionCard.tsx     # 版本卡片
    layout/               # 布局组件
      Header.tsx          # 导航栏
      Footer.tsx          # 页脚
    benchmark/            # 性能评测组件
    coding/               # 编程套餐组件
    pricing/              # 定价组件
    ui/                   # shadcn/ui 基础组件 (勿手动修改)
  data/
    models.json           # 核心数据 (公司+模型+版本+定价)
  lib/
    data.ts               # 数据读取函数
    helpers.ts            # 通用工具函数
    api-pricing.ts        # API定价工具
    coding-plans.ts       # 编程套餐数据
  types/
    model.ts              # TypeScript 类型定义
    coding-plan.ts        # 编程套餐类型
public/
  logos/                  # 品牌图标 (.ico/.svg)
```

## 编码规范

- **注释**: 中文注释
- **组件命名**: PascalCase (如 ModelCard)
- **文件命名**: PascalCase 组件, kebab-case 工具文件
- **样式**: 优先使用 Tailwind CSS，使用 cn() 工具函数合并类名
- **UI组件**: 优先使用 shadcn/ui (src/components/ui/)，不要自己造轮子
- **图片**: 使用 next/image 组件，品牌图标在 /logos/ 目录
- **类型**: 参考 src/types/model.ts，不要使用 any，必要时用 unknown

## 设计原则

- **去AI味**: 避免渐变色、大圆角、过度动效等"AI产品"视觉套路
- **高级克制**: 偏好低饱和度配色、精致排版、留白
- **信息密度**: 优先展示有用数据，不堆砌装饰元素
- **移动优先**: 响应式设计，确保移动端可用

## 数据约定

- 核心数据在 src/data/models.json，修改前务必理解其结构
- 类型定义在 src/types/model.ts
- 公司ID: zhipu | openai | anthropic | google | alibaba | deepseek | moonshot | bytedance | baidu | minimax
- planType 枚举: subscription | pay-per-use | enterprise | api

## 禁止事项

- 不要修改 src/components/ui/ 下的 shadcn 基础组件 (用 shadcn CLI 管理)
- 不要删除 public/logos/ 下的品牌图标文件
- 不要随意修改 models.json 的数据结构 (只改数据不改schema)
- 不要安装未经确认的新 npm 依赖包
- 不要使用 css-in-js 或 styled-components
- 不要引入重量级动画库

## 验证

修改完成后运行:
```bash
npx next build
```
确保构建通过再提交。
