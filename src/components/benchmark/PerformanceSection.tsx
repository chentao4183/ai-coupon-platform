interface Performance {
  speed: {
    inputTokensPerSec: number;
    outputTokensPerSec: number;
  };
  concurrency: {
    maxConcurrentRequests: number;
    maxTokensPerMinute: number;
  };
}

interface PerformanceSectionProps {
  performance: Performance;
}

function formatTokenCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${n}`;
}

const CARDS = [
  {
    key: "inputTokensPerSec" as const,
    label: "输入速度",
    unit: "tokens/s",
    getValue: (p: Performance) => p.speed.inputTokensPerSec,
    raw: false as const,
  },
  {
    key: "outputTokensPerSec" as const,
    label: "输出速度",
    unit: "tokens/s",
    getValue: (p: Performance) => p.speed.outputTokensPerSec,
    raw: false as const,
  },
  {
    key: "maxConcurrentRequests" as const,
    label: "最大并发",
    unit: "请求",
    getValue: (p: Performance) => p.concurrency.maxConcurrentRequests,
    raw: false as const,
  },
  {
    key: "maxTokensPerMinute" as const,
    label: "每分钟 Token",
    unit: "",
    getValue: (p: Performance) => formatTokenCount(p.concurrency.maxTokensPerMinute),
    raw: true as const,
  },
];

export function PerformanceSection({ performance }: PerformanceSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">性能指标</h3>
      <div className="grid grid-cols-2 gap-3">
        {CARDS.map((card) => {
          const val = card.raw
            ? card.getValue(performance)
            : card.getValue(performance).toLocaleString();
          return (
            <div
              key={card.key}
              className="rounded-lg border bg-muted/30 p-3"
            >
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="text-lg font-semibold tabular-nums">
                {val}
                {card.unit && (
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    {card.unit}
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
