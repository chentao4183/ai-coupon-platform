import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm font-semibold text-foreground">AI模型比价</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              精确到每百万 Token 的 AI 大模型定价对比平台，帮助开发者和企业找到最优方案。
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">功能</p>
            <ul className="space-y-1.5">
              {[
                { label: "模型对比", href: "/compare" },
                { label: "智能推荐", href: "/recommend" },
                { label: "成本计算", href: "/calculator" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coverage */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">覆盖模型</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>GPT / Claude / Gemini</li>
              <li>GLM / 通义千问 / DeepSeek</li>
              <li>Kimi / 豆包 / 文心一言</li>
              <li>MiniMax</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">说明</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>定价数据来源于官方公开页面</li>
              <li>仅供参考，以官网实时数据为准</li>
              <li>内容持续更新中</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
          &copy; 2025 AI模型比价. 保留所有权利.
        </div>
      </div>
    </footer>
  );
}
