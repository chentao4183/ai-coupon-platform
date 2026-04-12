# AI模型比价网站 · 重大重构方案

## 目标

将现有的"10款模型卡片列表"重构为 **分类对比平台**，以"更深、更全、更美、更活"四个差异化维度碾压竞品 codingplan.org。

## 核心架构变更

### 当前问题
- 首页是扁平的模型卡片列表，无分类
- 数据结构以"模型系列"为中心，Coding Plan 和 API 混在一起
- 竞品 codingplan.org 已在 Coding Plan 对比上做得很好，我们需要差异化

### 新架构：两大主分类 + 四大差异化

```
首页（新）
├── Hero: AI 大模型 全场景价格与能力对比平台
├── 两大入口卡片:
│   ├── 🖥️ Coding 订阅套餐 — 编程工具专属订阅对比
│   └── 🔌 API 按量付费 — 按Token计费的大模型对比
├── 快速总览表（Coding Plan）
├── 低价排行（API）
└── Footer
```

---

## 一、两大主分类

### 1. Coding 订阅套餐页 `/coding`

参照竞品但做得更深更全。

**总览表（快速对比）：**

| 平台 | 入门价 | 首月特惠 | 核心模型 | 用量/5h | 套餐档位 | 亮点 |
|------|--------|----------|----------|---------|----------|------|
| 智谱 GLM | ¥49/月 | — | GLM-5, 4.7, 4.5-Air | ~80 prompts | 3档 | MCP工具 |
| MiniMax | ¥29/月 | — | M2.7, M2.7-hs | 100 prompts | 6档 | 100+ TPS |
| Kimi | ¥49/月 | — | Kimi K2.5 | 300-1200次 | 2档 | 含会员权益 |
| 火山引擎 | ¥40/月 | ¥8.91 | 豆包·DeepSeek·Kimi·GLM | 数倍Claude Pro | 2档 | 模型最多 |
| 阿里云百炼 | ¥40/月 | ¥7.9 | 千问+GLM+Kimi | 1200次 | 2档 | 首月最低 |
| 腾讯云 | ¥40/月 | ¥7.9 | HY2.0·GLM-5·K2.5·M2.5 | 1200次 | 2档 | 腾讯自研 |
| **Claude Max** | **$100/月** | — | Claude 4 Sonnet/Opus | 5x Pro | 1档 | 国际首选 |
| **ChatGPT Plus/Pro** | **$20-$200/月** | — | GPT-4o/o3/o4-mini | Pro:无限 | 2档 | 行业标杆 |
| **Gemini Advanced** | **$19.99/月** | — | Gemini 2.5 Pro | — | 1档 | 1M上下文 |

> 竞品只做了国内，我们加入国际龙虾套餐 = 差异化"更全"

**各平台详情卡片：**
- 套餐档位（Lite/Pro/Max 等）及价格
- 支持模型列表
- 支持工具列表（Claude Code, Cursor, Cline 等）
- MCP 工具权益（视觉理解、联网搜索等）
- 用量限制（prompts/5h, /周, /月）
- 首月特惠 & 长期折扣（包季/包年）
- 限制说明 & 额度重置规则

### 2. API 按量付费页 `/api`

**总览表（按价格排序）：**

| 提供商 | 模型 | 输入价/1M | 输出价/1M | 缓存价 | 上下文 | 免费额度 |
|--------|------|-----------|-----------|--------|--------|----------|
| DeepSeek | V3 | ¥1 | ¥2 | ¥0.1 | 131K | 有 |
| 豆包 | Pro | ¥0.5 | ¥2 | — | 131K | 有 |
| GLM | 4.7-Flash | ¥0 | ¥0 | — | 200K | 永久免费 |
| ... | ... | ... | ... | ... | ... | ... |
| Claude | 4 Opus | $15 | $75 | — | 200K | 无 |
| GPT | o3 | $2 | $8 | — | 200K | 无 |

**各提供商详情：**
- 模型列表（按层级：旗舰/标准/经济/免费）
- 每个 token 定价（输入/输出/缓存）
- 上下文长度
- 适用范围和使用方式
- 免费额度说明

---

## 二、四大差异化

### 2. 更深 — 硬核数据

**Benchmark 跑分数据（Coding Plan 页）：**
- SWE-bench Verified（代码修复能力）
- HumanEval（代码生成）
- Aider Polyglot（多语言编程）
- LiveCodeBench（实时编程）

**速度与性能数据（API 页）：**
- 首Token延迟 (TTFT)
- 生成速度 (tokens/s)
- 最大并发 (TPS)
- 速率限制

**数据来源：**
- 官方公布数据
- Artificial Analysis (artificialanalysis.ai)
- Vellum AI Leaderboards

### 3. 更全 — 全场景覆盖

四个子分类的 Tab 切换：
1. **Coding 订阅** — 编程工具专属订阅（GLM Coding, MiniMax Token, Kimi Code 等）
2. **龙虾套餐** — 高端订阅（Claude Max $200, ChatGPT Pro $200, Gemini Ultra 等）
3. **按量付费** — API token 计费
4. **企业私有化** — 部署方案对比（后续扩展，先留入口）

### 4. 更美 — 设计碾压

**设计方向：**
- 高级克制，去除"AI味"
- 暗色主题为默认（开发者群体偏好）
- 数据密度高但不拥挤
- 表格设计参考 Linear/Notion 的精致感
- 移动端友好的横向滚动表格
- 微动效：排序动画、卡片hover、价格高亮

**关键设计元素：**
- 价格用大字号 + 色彩编码（最低价绿色高亮）
- "最推荐"标签设计
- 首月特惠用醒目 badge
- 模型能力雷达图（可选）

### 5. 更活 — 交互体验

**多维筛选排序（Coding Plan 页）：**
- 按价格排序（入门价/最高档）
- 按用量排序（prompts/5h）
- 按模型数量筛选
- 按支持工具筛选（Claude Code? Cursor?）
- 按首月特惠筛选

**多维筛选排序（API 页）：**
- 按输入/输出价格排序
- 按上下文长度筛选
- 按免费/付费筛选
- 按提供商筛选
- 按模型层级筛选（旗舰/标准/经济/免费）

**个性化推荐：**
- "我是个人开发者" / "我是小团队" / "我是企业"
- 预算范围选择
- 主要用途选择（编程/写作/客服/数据分析）
- 推荐最优组合

**成本计算器（保留现有）：**
- 预估月度 API 成本
- Coding Plan vs API 成本对比

---

## 三、数据结构变更

### 新增：Coding Plan 数据文件 `src/data/coding-plans.json`

```json
{
  "platforms": [
    {
      "id": "zhipu-glm",
      "name": "智谱 GLM Coding Plan",
      "company": "智谱AI",
      "logo": "/logos/zhipu.svg",
      "country": "cn",
      "website": "https://www.bigmodel.cn/glm-coding",
      "description": "GLM-5 位列 SWE-bench 第一梯队",
      "tiers": [
        {
          "id": "lite",
          "name": "Lite",
          "price": 49,
          "currency": "CNY",
          "period": "month",
          "firstMonthPrice": null,
          "quarterlyPrice": 44,
          "yearlyPrice": null,
          "quota5h": "~80 prompts",
          "quotaWeekly": "~400",
          "quotaMonthly": "~1600",
          "models": ["GLM-5.1", "GLM-5-Turbo", "GLM-4.7", "GLM-4.5-Air"],
          "tools": ["Claude Code", "OpenClaw", "Cline", "Cursor", "等20+"],
          "mcp": { "vision": true, "search": 100, "webRead": 100, "repo": 100 },
          "highEndMultiplier": 3,
          "highEndModels": ["GLM-5.1", "GLM-5-Turbo"],
          "features": ["MCP试用额度", "5h+周双重限额"],
          "restrictions": ["高峰期3倍抵扣", "仅供编程工具"]
        },
        ...
      ],
      "benchmarks": {
        "sweBenchVerified": "第一梯队",
        "source": "官方公布"
      },
      "resetRules": {
        "short": "5小时动态刷新",
        "medium": "每7天重置",
        "long": "月度订阅日重置"
      }
    },
    ...
  ]
}
```

### 现有 `models.json` 调整
- 保留 API 按量付费数据
- Coding Plan 相关数据迁移到 `coding-plans.json`
- 各模型的 pricingPlans 只保留 `planType: "api"` 的

---

## 四、路由变更

```
/                   → 新首页（两大入口 + 快速总览）
/coding             → Coding 订阅对比（总览表 + 详情）
/api                → API 按量付费对比（总览表 + 详情）
/lobster            → 龙虾套餐（高端订阅对比）
/calculator         → 成本计算器（保留，增强）
/recommend          → 智能推荐（保留，增强）
```

### 废弃路由
- `/compare` → 合并到 `/coding` 和 `/api`
- `/model/[id]` → 不再以模型为中心，改为以提供商为中心

---

## 五、实施步骤（分阶段）

### Phase 1: 数据层
1. 创建 `src/data/coding-plans.json`，录入7个国内平台数据
2. 整理 models.json，分离 API 数据
3. 创建 TypeScript 类型定义

### Phase 2: Coding Plan 页面
4. 创建 `/coding` 页面 — 总览对比表
5. 各平台详情展开卡片
6. 筛选排序功能

### Phase 3: API 按量付费页面
7. 创建 `/api` 页面 — 价格排序总览表
8. 各提供商模型详情
9. 筛选排序功能

### Phase 4: 首页重构
10. 新首页设计 — 两大入口 + 快速总览

### Phase 5: 龙虾套餐页
11. 创建 `/lobster` 页面 — 国际高端订阅对比

### Phase 6: 更深（硬核数据）
12. Benchmark 数据展示
13. 速度/并发数据

### Phase 7: 更活（交互增强）
14. 智能推荐增强
15. 成本计算器增强（Coding vs API 对比）

### Phase 8: 更美（设计打磨）
16. 暗色主题
17. 动效和微交互
18. 移动端适配

---

## 六、风险与权衡

1. **数据维护成本高** — 7+个平台的套餐频繁变动，需设计易于更新的数据结构
2. **竞品已有先发优势** — codingplan.org SEO 和内容已成熟，我们需要在"更全"（国际套餐）和"更深"（Benchmark）上形成差异化
3. **设计工作量大** — "更美"需要更多设计迭代，建议先功能后打磨
4. **龙虾套餐数据** — Claude Max/ChatGPT Pro 等官方信息较少，需要手动整理

## 七、建议优先级

先做 Phase 1-4（数据 + Coding Plan + API + 首页），让网站核心功能可用。
Phase 5-8 逐步迭代。
