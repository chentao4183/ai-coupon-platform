# ai-coupon-platform 项目笔记

## 飞书知识库（产品资料源）

- 空间链接：https://lcn8oxq8ntrf.feishu.cn/wiki/space/7626710692959112392
- space_id：`7626710692959112392`
- 项目所有产品资料都在此知识库中

### 浏览知识库所有节点

```bash
lark-cli wiki nodes list --params '{"space_id":"7626710692959112392"}' --page-all --format pretty
```

### 已知子文档

| 文档名 | node_token | obj_token | 读取命令 |
|--------|-----------|-----------|---------|
| 大模型提供商相关资料URL | KHwfwa5oSiHz3DkVfsJcugjQnjb | D9wXdETEMojpiTx6VHTcRtVnnSd | `lark-cli docs +fetch --doc "D9wXdETEMojpiTx6VHTcRtVnnSd" --format pretty` |

### 大模型提供商相关资料URL 内容摘要

包含各厂商的：官网、对话平台、API文档、按token计费定价、coding套餐购买链接、接入OpenClaw指南、接入Claude Code指南、订阅套餐等链接。

各厂商官网（来自飞书）：

| 厂商 | 官网 |
|------|------|
| 智谱 | https://www.bigmodel.cn/ |
| DeepSeek | https://www.deepseek.com/?via=invadeai |
| Kimi | https://www.moonshot.cn/ |
| MiniMax | https://www.minimaxi.com/ |
| 火山引擎(豆包) | https://www.volcengine.com/ |
| 阿里云(千问) | https://www.aliyun.com/product/qwen?utm_content=se_1023293835 |
| 百度(文心一言) | https://cloud.baidu.com/ |
| OpenAI | https://chatgpt.com/zh-Hans-CN/overview/ |
| Anthropic | https://www.anthropic.com/ |
| Google | 飞书未提供 |

## 界面优化任务（Apple 设计语言）

以苹果官网设计 DNA 为基底，强调色微调为 #0a84ff（偏靛蓝/青蓝 AI 科技感）。
字体用 Inter 替代 SF Pro（Web 加载友好）。布局适配数据密集的比价工具场景。

### 设计规范参考

色彩体系（CSS 变量）：
- 纯黑 #000000: Hero/暗色区块背景
- 浅灰 #f5f5f7: 信息区块背景（亮色模式主背景，不是纯白）
- 近黑 #1d1d1f: 亮色区块主文字
- 强调蓝 #0a84ff: 唯一强调色，仅用于交互元素（按钮、链接、标签、focus ring）
- 链接蓝 #0066cc: 亮色背景上的内联链接
- 亮蓝 #2997ff: 暗色背景上的链接
- 白 #ffffff: 暗色背景上的文字
- 黑80% rgba(0,0,0,0.8): 次要文字
- 黑48% rgba(0,0,0,0.48): 三级文字、表头
- 暗面 #1c1c1e: 暗色卡片背景
- 暗面2 #2c2c2e: 悬浮暗色卡片

字体：Inter（Google Fonts 可变字重）
- Hero 标题: 56px, weight 600, line-height 1.07, letter-spacing -0.28px
- 区块标题: 40px, weight 600, line-height 1.10
- 卡片标题: 28px, weight 400, line-height 1.14
- 正文: 17px, weight 400, line-height 1.47, letter-spacing -0.374px
- 标签/表头: 12px, weight 600, 全大写 + letter-spacing
- 微标注: 14px, weight 400, line-height 1.29

苹果设计 DNA 要点：
1. 色彩纪律：只有一个强调色，其余黑白灰
2. 黑白交替区块节奏（纯黑 ↔ 浅灰）
3. 标题极度紧凑 + 正文宽松，负字距贯穿所有尺寸
4. 大量留白，区块间距 80-120px
5. 毛玻璃导航栏（半透明 + backdrop-filter blur(20px)）
6. 几乎不用边框，靠背景色差区分层级
7. 药丸形 CTA（980px 圆角）
8. 阴影极简：一种柔和阴影或不用

### 任务清单

#### P0 - 全局基础层（所有页面受益）

- [x] **T1 色彩系统重建** ✓
  - globals.css 定义 --apple-* 原始色变量（亮/暗双模式）
  - shadcn 语义变量全部映射到 Apple 色值
  - @theme inline 新增 --color-apple-accent/link/text-secondary/text-tertiary/surface/surface-elevated/divider
  - 亮色 bg #f5f5f7，暗色 bg #000000，accent #0a84ff

- [x] **T2 字体系统升级** ✓
  - 6 级排版变量（hero/section/card/body/label/caption）
  - 全局 body 17px weight 400 line-height 1.47 tracking -0.022em
  - 工具类：.heading-hero, .heading-section, .heading-card, .label-text, .caption-text

- [x] **T3 毛玻璃导航栏** ✓
  - .nav-frosted 类：saturate(180%) blur(20px)
  - 亮色 rgba(255,255,255,0.72)，暗色 rgba(0,0,0,0.72)
  - 导航链接 text-xs font-normal（12px weight 400），去 border-b

- [x] **T4 间距与留白规范** ✓
  - --section-spacing: 100px, --content-max-width: 980px, --card-padding: 24px

#### P1 - 核心页面

- [x] **T5 首页 Hero 重做** ✓
  - 纯黑 #000 背景 + 白色文字（亮暗模式均黑）
  - .heading-hero 标题，21px 副标题 text-white/80
  - 药丸 CTA：bg-apple-accent rounded-full + 透明白边框 pill
  - 大号统计数字 40-48px + 分隔线，标签 text-white/60
  - 场景卡片：无边框 bg-apple-surface-elevated，统一 accent 色

- [x] **T6 首页模型卡片重设计** ✓
  - 去掉彩色顶部条和边框，bg-apple-surface-elevated
  - 公司名 .label-text，模型名 .heading-card
  - 推荐 #0a84ff 药丸，查看详情 text-apple-link + ChevronRight
  - 去掉 CardFooter border-t，标签用 bg-apple-surface

- [x] **T7 编程套餐页表格样式** ✓
  - 去纵边框和表头底线，.label-text 表头
  - 行分割 border-apple-divider，hover:bg-apple-surface-elevated
  - 价格列 text-apple-accent font-semibold
  - 热门标签 bg-apple-accent/10 text-apple-accent rounded-full
  - Tier 标签统一为 accent 色（移除多色 TIER_CLASS）

- [x] **T8 编程套餐厂商分组标题** ✓
  - 厂商名 .heading-card font-semibold（28px 600）
  - 信息行 .caption-text text-apple-text-tertiary
  - 前往购买 bg-apple-accent rounded-full 药丸按钮
  - 容器 bg-apple-surface 无边框

- [x] **T9 龙虾页卡片重构** ✓
  - 价格 40px font-semibold 居顶部视觉中心
  - 厂商名+套餐名副标题，功能/限制精简至 3-5 项
  - 立即订阅 rounded-full bg-apple-accent 药丸固定底部
  - 推荐卡片 border-l-2 border-apple-accent 左竖条
  - 去掉 shadcn Card/Badge/Button，用纯 HTML + Tailwind

- [x] **T10 龙虾页筛选栏重设计** ✓
  - 筛选按钮 rounded-[11px]
  - 选中 text-apple-accent bg-apple-accent/10
  - 未选 text-apple-text-secondary bg-apple-surface-elevated

#### P2 - 收尾

- [x] **T11 页脚重设计** ✓
  - bg-apple-bg，链接 text-apple-link hover 加下划线
  - 版权 text-apple-text-tertiary，去重 border

- [x] **T12 其他页面统一** ✓
  - pricing/compare/recommend/calculator/model/[id] 全部统一
  - 清零所有旧颜色（emerald/amber/violet/rose/orange 残留 = 0）
  - 表格、卡片、按钮、标签全部使用 Apple 设计系统

### 实施记录

- 执行方式：Hermes 编排 Claude Code (print mode -p)，分 5 批执行
- 改动规模：17 文件，+1287/-840 行
- T11-T12 因页面多拆为 3 轮（40 turns + 20 turns + 手动 patch）
- 全站旧颜色扫描确认 0 残留

### 执行顺序

T1 → T2 → T3 → T4（基础层一次做完）→ T5 + T6（首页）→ T7 + T8（coding页）→ T9 + T10（lobster页）→ T11 + T12（收尾）

### 验证

每完成一组任务后运行 `npx next build` 确保构建通过。全部完成后在浏览器验证各页面视觉效果。

## Coding 套餐页面布局优化（2026-04-15）

### 改动内容

1. **页面宽度从 980px 扩大到 1280px**
   - 通过顶层 div 注入 CSS 变量 `--coding-max-width: 1280px`
   - 所有子组件（Hero/首月特惠/快速对比/提供商详情/FAQ）统一使用
   - 不影响其他页面的全局 `--content-max-width: 980px`

- 首月特惠卡片 grid 改为一行 6 个
   - `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`（当前仅4个有首月特惠）

3. **快速对比表去掉横向滚动条**
   - 移除 `overflow-x-auto` 容器
   - 移除"等效用量"和"上下文"列的响应式隐藏（`hidden md:table-cell` / `hidden lg:table-cell`）

4. **提供商套餐表格**
   - 移除 `overflow-x-auto` 容器
   - 移除"等效用量"和"亮点"列的响应式隐藏
   - 配额/等效用量/亮点列加 `whitespace-nowrap`

### 涉及文件
- `src/app/coding/page.tsx`（布局改动）

## 阿里云百炼 Coding 套餐数据修正（2026-04-15）

### 问题
数据中存在虚构的 `aliyun-lite` 套餐（¥40/月，首月¥7.9），以及 `aliyun-pro` 的错误首月折扣信息。这些数据是根据竞品推测的，未经官网核实。

### 实际情况（浏览器访问控制台确认，2026-04-15 复验）
- 只有 1 个套餐：Pro ¥200/月
- 无 Lite 档位
- 无首月折扣活动
- 当前暂时售罄
- 配额：90,000次请求/月（仅月度总量，无5h/周细分）
- 支持工具：Claude Code、Qwen Code、Qoder、Cline、OpenClaw
- 模型：千问、GLM、Kimi、MiniMax
- 每个百炼账号同时只能订阅一个 Coding Plan
- 购买后不支持退订与退款
- 页面无需登录即可浏览（browser_navigate 直接可访问），curl 会返回登录拦截页

### 修正内容
- 删除 `aliyun-lite` 整条记录
- 更新 `aliyun-pro`：去首月折扣、修正模型/工具/配额、cons 加"当前暂时售罄"
- 总套餐数从 26 降到 25，首月特惠从 6 个降到 4 个
