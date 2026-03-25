# 项目修改日志

记录项目的每次优化、修复和改进。

---

## 2026-03-25

### 09:58 - 更新智谱AI优惠信息描述

**修改内容**：
- 将智谱AI平台的优惠信息从"下单立减5%金额"更新为"新用户首单95折"

**修改原因**：
- 根据智谱AI官方活动规则分析，原描述"下单立减5%金额"存在误导性
- 实际优惠仅限新用户首次订阅GLM Coding，非所有订单
- 新描述更准确，避免用户误解和投诉

**影响范围**：
- 后台管理系统：平台数据已更新
- 用户首页：ISR缓存（60秒）后显示新信息
- 数据库：Vercel KV中的平台记录已更新

**修改方式**：
- 通过Admin API直接更新数据库
- API调用：`PUT /api/admin/platforms`
- 修改字段：`discount: "新用户首单95折"`

**验证结果**：
- ✅ 后台管理显示正确
- ✅ 首页显示正确（缓存过期后）
- ✅ 数据库记录已更新

**相关链接**：
- 智谱AI官方活动规则：https://docs.bigmodel.cn/cn/coding-plan/credit-campaign-rules
- 分销链接：https://www.bigmodel.cn/glm-coding?ic=CWJW4TEIY7

---

## 2026-03-24

### 22:38 - 添加智谱AI平台

**修改内容**：
- 新增智谱AI平台到系统
- 优惠信息：下单立减5%金额（后来发现不准确）
- 分销链接：https://www.bigmodel.cn/glm-coding?ic=CWJW4TEIY7

**修改原因**：
- 用户提供了智谱AI的分销链接
- 扩展平台覆盖范围

### 22:38 - 修复平台Logo缺失问题

**修改内容**：
- 为所有6个平台创建SVG Logo文件
- 文件位置：`public/logos/*.svg`
- 包括：chatgpt.svg, claude.svg, wenxin.svg, gemini.svg, copilot.svg, zhipu.svg

**修改原因**：
- 部署后发现所有平台Logo返回404错误
- 影响用户体验和专业度

**影响范围**：
- 首页平台卡片正常显示Logo
- 后台管理页面正常显示Logo

### 21:23 - 更新README为产品导向

**修改内容**：
- 删除182行技术文档（项目结构、部署方式、使用指南）
- 添加62行产品导向内容
- 突出产品愿景、平台特色、所有AI平台优惠链接

**修改原因**：
- GitHub项目主要面向用户，而非开发者
- 需要展示产品价值，而非技术细节

**影响范围**：
- GitHub项目首页更友好
- 用户可以直接看到所有优惠链接

---

## 2026-03-24

### 20:29 - 项目初始化与部署

**修改内容**：
- 创建Next.js 14项目（App Router）
- 配置TypeScript、Tailwind CSS
- 集成Vercel KV数据库
- 实现首页（ISR缓存）
- 实现后台管理系统（登录、CRUD）
- 实现点击追踪API（带速率限制）
- 部署到Vercel：https://web-tau-tawny-98.vercel.app

**平台列表**：
1. ChatGPT - Plus会员8折
2. Claude - Pro会员免费试用
3. 文心一言 - 企业版7折
4. Gemini - Advanced版首月免费
5. GitHub Copilot - 个人版9折
6. 智谱AI - 下单立减5%金额（后更新）

**技术栈**：
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Vercel KV (Upstash Redis)
- JWT认证 (jose)

---

## 统计信息

- **总平台数**：6个
- **总修改次数**：5次
- **最后更新**：2026-03-25 09:58
- **项目状态**：✅ 运行正常

---

**注意**：本日志记录项目优化过程，不包括代码提交历史（Git）。
