import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-apple-bg">
      <div className="mx-auto max-w-[var(--content-max-width)] px-6 py-12 sm:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm font-semibold text-foreground">AIdeals</p>
            <p className="mt-1 caption-text text-apple-text-secondary">
              精确到每百万 Token 的 AI 大模型定价对比平台，帮助开发者和企业找到最优方案。
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="label-text text-apple-text-tertiary mb-3">功能</p>
            <ul className="space-y-2">
              {[
                { label: "模型对比", href: "/compare" },
                { label: "智能推荐", href: "/recommend" },
                { label: "成本计算", href: "/calculator" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-apple-link hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coverage */}
          <div>
            <p className="label-text text-apple-text-tertiary mb-3">覆盖模型</p>
            <ul className="space-y-2 text-sm text-apple-text-secondary">
              <li>GPT / Claude / Gemini</li>
              <li>GLM / 通义千问 / DeepSeek</li>
              <li>Kimi / 豆包 / 文心一言</li>
              <li>MiniMax</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <p className="label-text text-apple-text-tertiary mb-3">说明</p>
            <ul className="space-y-2 text-sm text-apple-text-secondary">
              <li>定价数据来源于官方公开页面</li>
              <li>仅供参考，以官网实时数据为准</li>
              <li>内容持续更新中</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-apple-divider pt-4 text-center text-xs text-apple-text-tertiary">
          &copy; 2025 AIdeals. 保留所有权利.
        </div>
      </div>
    </footer>
  );
}
