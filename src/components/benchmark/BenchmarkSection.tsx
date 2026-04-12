import { BenchmarkBar } from "./BenchmarkBar";

interface Benchmarks {
  mmlu?: number;
  humaneval?: number;
  math?: number;
  gsm8k?: number;
  mt_bench?: number;
}

interface BenchmarkSectionProps {
  benchmarks: Benchmarks;
}

const BENCHMARK_LABELS: { key: keyof Benchmarks; label: string; max: number }[] = [
  { key: "mmlu", label: "综合知识 (MMLU)", max: 100 },
  { key: "humaneval", label: "代码生成 (HumanEval)", max: 100 },
  { key: "math", label: "数学推理 (MATH)", max: 100 },
  { key: "gsm8k", label: "数学应用 (GSM8K)", max: 100 },
  { key: "mt_bench", label: "对话能力 (MT-Bench)", max: 10 },
];

export function BenchmarkSection({ benchmarks }: BenchmarkSectionProps) {
  const entries = BENCHMARK_LABELS.filter(
    (e) => benchmarks[e.key] != null
  );

  if (entries.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">能力评测</h3>
      <div className="space-y-3">
        {entries.map((e) => (
          <BenchmarkBar
            key={e.key}
            label={e.label}
            value={benchmarks[e.key]!}
            max={e.max}
          />
        ))}
      </div>
    </div>
  );
}
