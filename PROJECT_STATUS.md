# aideals.me 产品改进计划

## 当前进度（2025-04-15）

### Hero 区域视觉统一 ✅ 已完成（2025-04-15）
- 统一4个页面（首页/coding/pricing/lobster）Hero 为纯黑 #000000 背景
- 统一 heading-hero 白色标题 + pill 标签 bg-white/10 样式
- 统一副标题 21px text-white/80
- 统一内边距 min-h-[420px] sm:min-h-[480px] + flex 垂直居中
- 删除首页统计数字栏，4页面高度一致
- CLAUDE.md Hero 模板已同步更新

### 阿里云百炼套餐数据 ✅ 已验证（2025-04-15）
- 用 browser_navigate 确认 coding-plan 页面无需登录即可浏览
- 套餐信息：Pro ¥200/月 90,000次，支持千问/GLM/Kimi/MiniMax
- coding-plans.json 数据与官网一致

### 历史任务（2025-04-14）

| # | 任务 | 状态 | 说明 |
|---|------|------|------|
| 1 | /coding 快速对比表 + 首月特惠高亮 | ✅ 已完成 | |
| 2 | /coding FAQ 模块 | ✅ 已完成 | 6条FAQ，原生details实现，双列布局 |
| 3 | 首页改成决策入口（场景选择器替代模型展览馆） | 🔄 进行中 | Linear风格重新设计 |
| 4 | 导航精简（7→4个：首页/Coding套餐/API按量/龙虾） | ⬜ 待开始 | |
| 5 | /lobster 按价格区间重组+同类对比引导 | ⬜ 待开始 | |
| 6 | SEO优化（页面标题/Schema.org/更新时间标注） | ⬜ 待开始 | |

## 设计风格参考

采用 **Linear** 设计系统（来源: https://getdesign.md/linear.app/design-md）

### 核心特征
- 暗色模式优先，极简精准，紫色品牌色点缀
- Inter Variable 字体，签名权重 510
- 半透明白色边框系统 rgba(255,255,255,0.05~0.08)
- 品牌色 #5e6ad2 (背景) / #7170ff (交互) / #828fff (悬停)

### 注意
- 用户不喜欢"AI味"设计，偏好高级克制视觉风格
- 用户审美要求高，不要花哨渐变和过度的阴影

## 项目结构

```
src/
├── app/
│   ├── page.tsx          # 首页（待重做）
│   ├── layout.tsx        # 根布局
│   ├── globals.css       # 全局样式 + Tailwind 主题
│   ├── coding/page.tsx   # 编程套餐（已完成优化）
│   ├── pricing/page.tsx  # API按量付费
│   ├── lobster/page.tsx  # 龙虾页面（待优化）
│   ├── compare/page.tsx  # 模型对比
│   ├── recommend/page.tsx# 智能推荐
│   ├── calculator/page.tsx# 成本计算
│   └── model/[id]/page.tsx # 模型详情
├── components/
│   ├── layout/Header.tsx  # 导航栏（待精简）
│   ├── layout/Footer.tsx  # 页脚
│   ├── home/ModelCard.tsx # 模型卡片
│   ├── home/ModelFilters.tsx # 模型筛选
│   ├── animated-number.tsx  # 数字动画
│   └── ui/               # shadcn 组件
├── lib/data.ts           # 数据访问层
├── data/models.json      # 模型数据
└── data/coding-plans.json # 编程套餐数据
```

## 关键约定
- Tailwind CSS v4 + shadcn/ui（oklch 色彩系统）
- Next.js 16（注意 breaking changes）
- 数据层：models.json + coding-plans.json
- 龙虾页面卡片"立即订阅"链接用 getBuyUrlByCompanyId 从 coding-plans.json 匹配
- 无 coding 套餐的厂商 fallback 到内部 /model/ 页面
- IntersectionObserver 需加 fallback setTimeout（500ms）
