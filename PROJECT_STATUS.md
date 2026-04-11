# AI模型比价 - 项目状态文档

> 最后更新: 2026-04-12
> 在线地址: https://www.aideals.me/
> 仓库: https://github.com/chentao4183/ai-coupon-platform
> 飞书产品档案: https://lcn8oxq8ntrf.feishu.cn/wiki/space/7626710692959112392

---

## 技术栈

- Next.js 16 (Turbopack) + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- 部署: Vercel (自动部署，push to master 即触发)
- 本地开发: WSL Ubuntu, 端口 3009, `npx next dev -p 3009`
- WSL 网络注意: 未启用 mirrored 模式，Windows 浏览器需用 WSL IP 访问（非 localhost）。启动服务时务必显示当前 WSL IP（`ip addr show eth0 | grep "inet "`），格式: `http://<WSL_IP>:3009`

## 数据概览

| 指标 | 数量 |
|------|------|
| 覆盖公司 | 10 |
| 模型系列 | 10 |
| 模型版本 | 32 |
| 订阅套餐 | 14 |
| API 定价 | 29 |
| 定价方案总计 | 43 |
| Benchmark 数据 | 32 版本全覆盖 |
| 性能数据 | 32 版本全覆盖 |
| Coding Plan 套餐 | 26 |
| Coding Plan 提供商 | 10 |

**已覆盖模型:** GLM、GPT、Claude、Gemini、通义千问、DeepSeek、Kimi、豆包、文心一言、MiniMax
**Coding Plan 提供商:** GLM(3档)、MiniMax(6档)、Kimi(2档)、火山引擎(2档)、阿里云百炼(2档)、腾讯云(2档)、百度千帆(2档)、ChatGPT(3档)、Claude(2档)、Cursor(1档)、Windsurf(1档)

## 页面状态

| 页面 | 路由 | 状态 | 说明 |
|------|------|------|------|
| 首页 | `/` | ✅ 可用 | 两大入口(编程套餐/API按量) + 快速总览(10厂商/10模型/14订阅/29API) + 精选模型卡片 |
| 编程套餐 | `/coding` | ✅ 可用 | 编程场景订阅对比卡片，筛选+排序 |
| API按量 | `/pricing` | ✅ 可用 | 29个API定价，表格+卡片双视图，搜索/排序/筛选，展开详情，价格双显(USD+原币种) |
| 龙虾套餐 | `/lobster` | ✅ 可用 | 8个高端订阅对比，价格档位筛选(20$/100$/200$/国产替代)，底部对比表 |
| 对比 | `/compare` | ✅ 可用 | 2-4模型横向对比，benchmark 进度条(MMLU/HumanEval/MT-Bench) |
| 推荐 | `/recommend` | ✅ 可用 | 分步问卷(场景/预算/偏好)，推荐理由，性价比评分 |
| 成本计算 | `/calculator` | ✅ 可用 | 缓存命中率滑块，省钱提示，订阅更划算提醒，CSS柱状图，43方案排序表 |
| 模型详情 | `/model/[id]` | ✅ 可用 | Tabs(概述/定价/技术参数)，benchmark进度条，性能指标2x2卡片 |

## 已完成阶段

### Phase 1-2: 基础搭建 (早期)
- [x] 项目初始化 (Next.js 16 + Tailwind 4 + shadcn)
- [x] 10家公司 + 32个版本模型数据
- [x] 43个定价方案 (14订阅 + 29API)
- [x] 10个品牌 favicon/logo
- [x] 基础5页面 (首页/详情/对比/推荐/计算器)
- [x] GitHub 自动部署到 Vercel

### Phase 3: API按量付费页 /pricing
- [x] 29个API定价完整展示 (含2个免费模型)
- [x] 表格视图: 8列 + 排序(输入价/输出价/缓存价/综合评分)
- [x] 卡片视图: 响应式网格，价格双显
- [x] 展开详情: 特性/说明/限制
- [x] 搜索 + 厂商筛选 + 仅免费过滤
- [x] 综合评分列 (MMLU benchmark)

### Phase 4: 首页重构
- [x] 两大入口 CTA (编程套餐 Code2 / API按量 Zap)
- [x] 快速总览统计卡片 (实时计算)
- [x] 精选模型: 默认 featured + 查看全部

### Phase 5: 龙虾套餐页 /lobster
- [x] 8个付费订阅卡片 (ChatGPT Plus/Pro, Claude Pro/Max, GLM Coding Plan 3档, Kimi 尊享)
- [x] 筛选: 全部/20$档/100$档/200$档/国产替代
- [x] 价格双显 + 汇率换算 (7.2)
- [x] 底部对比表格

### Phase 6: Benchmark + 性能数据
- [x] models.json 32版本添加 benchmarks (MMLU/HumanEval/MATH/GSM8K/MT-Bench)
- [x] models.json 32版本添加 performance (速度/并发)
- [x] BenchmarkBar/BenchmarkSection/PerformanceSection 组件
- [x] 对比页集成 benchmark 进度条
- [x] 模型详情页「技术参数」tab
- [x] /pricing 表格综合评分列

### Phase 7: 推荐增强 + 成本计算器增强
- [x] 推荐页: 分步问卷(场景多选/预算/偏好)
- [x] 推荐结果: 推荐理由 + 性价比评分
- [x] 计算器: 快捷按钮(1M/10M/50M/100M)
- [x] 计算器: 缓存命中率滑块
- [x] 计算器: 省钱提示 + 订阅更划算提醒 + 免费方案汇总
- [x] 计算器: CSS 柱状图

### Phase 8: 暗色主题 + 动效 + 移动端
- [x] 主题切换: light/dark/system，localStorage 持久化
- [x] 主题切换按钮: 太阳/月亮/显示器图标
- [x] 卡片 hover 动效 (translateY + shadow)
- [x] 筛选按钮过渡效果
- [x] 导航 hover 下划线动画
- [x] 页面 fadeIn 加载动画
- [x] 数字递增动画 (animated-number 组件)
- [x] 移动端汉堡菜单 (Sheet)
- [x] 表格横向滚动
- [x] 响应式网格 (1/2/3列)

## 项目文件结构

```
src/
  app/
    page.tsx                # 首页 (两大入口+总览+精选)
    layout.tsx              # 全局布局 + ThemeProvider
    coding/page.tsx         # 编程套餐页
    pricing/page.tsx        # API按量付费页
    lobster/page.tsx        # 龙虾套餐页
    compare/page.tsx        # 模型对比页
    recommend/page.tsx      # 推荐页
    calculator/page.tsx     # 成本计算器
    model/[id]/page.tsx     # 模型详情页
  components/
    home/ModelCard.tsx      # 模型卡片
    home/ModelFilters.tsx   # 首页筛选器
    model/ModelTabs.tsx     # 详情页Tab
    model/VersionCard.tsx   # 版本卡片
    coding/CodingPlanFilters.tsx  # 编程套餐筛选
    pricing/ApiPricingTable.tsx   # API定价表格+卡片
    benchmark/
      BenchmarkBar.tsx      # 水平进度条
      BenchmarkSection.tsx  # 能力评测区
      PerformanceSection.tsx # 性能指标区
    theme-provider.tsx      # 主题 Provider
    theme-toggle.tsx        # 主题切换按钮
    animated-number.tsx     # 数字递增动画
    fade-in.tsx             # fadeIn 容器
    layout/Header.tsx       # 导航头 (含汉堡菜单+主题切换)
    layout/Footer.tsx       # 页脚
    ui/                     # shadcn组件
  data/
    models.json             # 核心数据 (公司+模型+版本+定价+benchmark+性能)
    coding-plans.json       # 编程套餐数据
  lib/
    data.ts                 # 数据读取工具
    helpers.ts              # 通用工具函数
    api-pricing.ts          # API定价数据处理
    coding-plans.ts         # 编程套餐数据处理
  types/
    model.ts                # 模型类型定义
    coding-plan.ts          # 编程套餐类型定义
public/
  logos/                    # 10个品牌图标 (.ico/.svg)
```

## 踩坑记录

1. `/app/api/` 路径被 Next.js 保留，API 页面必须用 `/pricing` 代替
2. `.ico` 文件不支持 `next/image`，必须用原生 `<img>` 标签
3. 品牌 logo 路径需与文件后缀一致（如 `zhipu.ico` 不能写成 `zhipu`）
4. 表格展开行用 `flatMap` 代替 `map`，避免 `<Fragment>` 在 `<tr>` 内的嵌套问题
5. TypeScript 严格模式下，JSON 数据访问需通过 `unknown` 中间类型转换

### Phase 9: Coding Plan 套餐数据扩充 (2026-04-12)
- [x] 新增 MiniMax Token Plan 6档 (¥29~¥399/月): Starter/Plus/Max + 极速版Plus/Max/Ultra
- [x] 新增 Kimi Code Plan 2档 (¥49~¥99/月): Andante/Moderato
- [x] 新增 火山引擎方舟 Coding Plan 2档 (¥40~¥200/月): Lite/Pro，6款模型最多
- [x] 新增 阿里云百炼 Coding Plan 2档 (¥40~¥200/月): Lite/Pro，千问+GLM+Kimi
- [x] 新增 腾讯云 Coding Plan 2档 (¥40~¥200/月): Lite/Pro，混元+第三方模型
- [x] 新增 百度千帆 Coding Plan 2档 (¥40~¥200/月): Lite/Pro
- [x] 下载腾讯云 logo (tencent.ico)
- [x] 修正所有新套餐 logo 路径匹配实际文件
- [x] 所有购买链接追踪码/referral 原样保留
- 数据来源: codingplan.org 横评网站 + 用户手动提供百度千帆信息
- DeepSeek 无 coding 订阅套餐(仅按量计费)；Gemini 无国内 coding plan；GPT/Claude 已有
- [x] 同步到网站: tier 类型新增 ultra，卡片样式+筛选器+hero badge 更新
- 改动文件: coding-plan.ts(类型) / CodingPlanCard.tsx(ultra紫色样式) / CodingPlanFilters.tsx(Ultra按钮) / coding/page.tsx(hero badge)
- [x] 重写 /coding 页面: 去掉搜索框/筛选器/排序，改为按厂商分组的表格布局
  - 厂商区块: Logo+名称+模型列表+上下文+工具数+购买按钮(相同信息拎出)
  - 表格列: 档位→配额→等效用量→亮点→价格(最右)，一行一个套餐纵向比较
  - 响应式: 等效用量(sm以下隐藏)/亮点(lg以下隐藏)
  - 亮点列智能展示: 优先discount标签 > 差异化modelsNote > mcpFeatures首项
  - 美元自动换算人民币显示

## 待优化

### P1 - 数据准确性
- [ ] 所有定价数据与官网二次核实
- [ ] Benchmark 数据与官方报告交叉验证
- [ ] 定价数据时效性标注 (最后更新时间)

### P2 - SEO + 国际化
- [ ] SEO 优化 (meta tags, structured data, sitemap)
- [ ] 国际化 (中英双语)
- [ ] Open Graph 图片

### P3 - 扩展功能
- [ ] 定价变动追踪/通知
- [ ] 用户收藏/对比历史
- [ ] API 文档直达链接
- [ ] 更多模型覆盖

## 已知问题

1. bytedance.ico 只有 826 bytes，可能质量不高
2. zhipu.ico 只有 1100 bytes，同上
3. README.md 还是 Next.js 默认模板，未更新
4. add_benchmarks.js 临时脚本可删除
