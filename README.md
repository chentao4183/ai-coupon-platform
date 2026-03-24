# AI 大模型分销优惠平台

> 集成各类 AI 大模型优惠链接的一站式平台

---

## 项目简介

这是一个轻量级的 AI 大模型优惠信息聚合平台，帮助用户快速找到各大 AI 平台的优惠链接。

**核心功能**：
- 展示主流 AI 平台的优惠信息
- 追踪点击数据，分析用户偏好
- 简单的后台管理系统

**技术栈**：
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Vercel KV (数据存储)

---

## 环境要求

- Node.js 18.17 或更高版本
- npm 或 pnpm
- Vercel 账号（用于部署和 KV 数据库）

---

## 本地开发

### 1. 克隆项目

```bash
cd D:\ai-coupon-platform\development\web
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 到 `.env.local`：

```bash
copy .env.example .env.local
```

编辑 `.env.local`，填入实际值：

```env
# Vercel KV 配置（本地开发可先留空）
KV_REST_API_URL=your-kv-url
KV_REST_API_TOKEN=your-kv-token

# 管理员密码（至少 16 个字符）
ADMIN_PASSWORD=your-secure-password-here
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

---

## 部署到 Vercel

### 步骤 1：创建 Vercel 项目

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "Add New..." > "Project"
3. 导入你的 Git 仓库（或直接上传 `development/web` 目录）
4. Framework Preset 选择 "Next.js"

### 步骤 2：创建 Vercel KV 数据库

1. 在项目页面，进入 **Storage** 标签
2. 点击 **Create Database**
3. 选择 **KV**
4. 输入数据库名称（如 `ai-coupon-kv`）
5. 选择区域（建议选择离用户最近的区域）
6. 点击 **Create**

### 步骤 3：绑定 KV 到项目

1. 创建完成后，点击 **Connect to Project**
2. 选择你的项目
3. 确认连接

这会自动在项目中添加以下环境变量：
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_URL`（内部连接用）

### 步骤 4：配置管理员密码

1. 进入项目 **Settings** > **Environment Variables**
2. 添加新变量：
   - Name: `ADMIN_PASSWORD`
   - Value: 你的管理员密码（至少 16 个字符）
3. 选择应用到所有环境（Production, Preview, Development）

### 步骤 5：部署

1. 回到项目页面
2. 点击 **Deploy**
3. 等待构建完成
4. 访问分配的 URL（如 `https://ai-coupons.vercel.app`）

---

## 环境变量说明

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `KV_REST_API_URL` | Vercel KV REST API 地址 | 创建 KV 数据库后自动获取 |
| `KV_REST_API_TOKEN` | Vercel KV 访问令牌 | 创建 KV 数据库后自动获取 |
| `ADMIN_PASSWORD` | 管理员登录密码 | 自定义，至少 16 个字符 |

**安全建议**：
- `ADMIN_PASSWORD` 使用强密码，可运行 `openssl rand -base64 24` 生成
- 不要在代码中提交 `.env.local` 文件

---

## 项目结构

```
development/web/
├── app/
│   ├── page.tsx              # 首页 - 平台列表
│   ├── layout.tsx            # 全局布局
│   ├── admin/
│   │   ├── page.tsx          # 管理员登录页
│   │   └── dashboard/
│   │       └── page.tsx      # 管理后台
│   └── api/
│       ├── click/
│       │   └── route.ts      # 点击追踪 API
│       ├── admin/
│       │   └── login/
│       │       └── route.ts  # 登录 API
│       └── platforms/
│           └── route.ts      # 平台管理 API
├── lib/
│   ├── kv.ts                 # Vercel KV 工具函数
│   └── auth.ts               # 认证工具函数
├── types/
│   └── index.ts              # TypeScript 类型定义
├── public/
│   └── images/               # 平台 Logo 图片
├── .env.example              # 环境变量示例
├── package.json
├── tailwind.config.ts
└── next.config.mjs
```

---

## 使用指南

### 访问管理后台

1. 访问 `/admin`
2. 输入管理员密码
3. 登录后跳转到 `/admin/dashboard`

### 添加新平台

1. 在管理后台点击 "Add Platform"
2. 填写平台信息：
   - 名称 (name)
   - Logo URL (logoUrl)
   - 优惠文字 (discountText)
   - 分销链接 (affiliateUrl)
   - 描述 (description)
   - 是否激活 (isActive)
   - 排序顺序 (order)
3. 点击保存

### 查看统计数据

管理后台首页显示：
- 各平台点击次数
- 总点击量
- 最近活跃平台

---

## 常见问题

### Q: 本地开发时 KV 连接失败？

A: 确保 `.env.local` 中的 KV 环境变量正确。本地开发时，你也可以使用 Vercel CLI 连接远程 KV：

```bash
vercel env pull .env.local
```

### Q: 部署后访问报错？

A: 检查以下几点：
1. KV 数据库是否已创建并连接到项目
2. 环境变量是否正确配置
3. 查看 Vercel 部署日志获取详细错误信息

### Q: 如何重置管理员密码？

A: 在 Vercel 项目设置中更新 `ADMIN_PASSWORD` 环境变量，然后重新部署。

---

## 技术支持

- [Next.js 文档](https://nextjs.org/docs)
- [Vercel KV 文档](https://vercel.com/docs/storage/vercel-kv)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

---

**创建时间**：2026-03-24
**最后更新**：2026-03-24
