interface BenchmarkBarProps {
  label: string;
  value: number;
  max?: number;
  suffix?: string;
  color?: string;
}

export function BenchmarkBar({
  label,
  value,
  max = 100,
  suffix,
  color,
}: BenchmarkBarProps) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">
          {value}
          <span className="text-muted-foreground">/{max}</span>
          {suffix && (
            <span className="text-muted-foreground ml-0.5">{suffix}</span>
          )}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className={`h-2 rounded-full transition-all ${color ?? "bg-primary/70"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
