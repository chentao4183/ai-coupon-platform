import { ExternalLink, MessageSquare, FileText, BookOpen, Code2, Shield, Zap, CreditCard, Globe } from "lucide-react";
import type { RModelLinks } from "@/lib/helpers";

/* ------------------------------------------------------------------ */
/* Link config                                                         */
/* ------------------------------------------------------------------ */

interface LinkItem {
  key: keyof RModelLinks;
  label: string;
  icon: typeof ExternalLink;
}

const LINK_ITEMS: LinkItem[] = [
  { key: "website", label: "官网", icon: Globe },
  { key: "chatPlatform", label: "在线对话", icon: MessageSquare },
  { key: "codingPlan", label: "编程套餐", icon: Code2 },
  { key: "apiPricing", label: "API 定价", icon: FileText },
  { key: "apiDocs", label: "开发者文档", icon: BookOpen },
  { key: "openclawGuide", label: "接入 OpenClaw", icon: Shield },
  { key: "claudeCodeGuide", label: "接入 Claude Code", icon: Zap },
  { key: "subscription", label: "订阅套餐", icon: CreditCard },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export interface OfficialLinksProps {
  links: RModelLinks;
}

export function OfficialLinks({ links }: OfficialLinksProps) {
  const available = LINK_ITEMS.filter(
    (item) => links[item.key] && typeof links[item.key] === "string"
  );

  if (available.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-border/50 bg-muted/20">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ExternalLink className="size-3.5 text-muted-foreground" />
            官方资源
          </h3>
        </div>

        {/* Links */}
        <div className="divide-y divide-border/30">
          {available.map((item) => {
            const Icon = item.icon;
            const url = links[item.key]!;
            return (
              <a
                key={item.key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/30 group"
              >
                <Icon className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors underline decoration-primary/40 underline-offset-4 group-hover:decoration-primary">
                  {item.label}
                </span>
                <span className="flex-1" />
                <ExternalLink className="size-3 shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
