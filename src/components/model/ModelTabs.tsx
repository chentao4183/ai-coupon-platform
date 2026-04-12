"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Cpu,
  FileText,
  MessageSquare,
  Code,
  Brain,
  Shield,
  Image,
  Search,
  Globe,
  Languages,
  BookOpen,
  Sparkles,
  Lock,
  Server,
} from "lucide-react";
import { VersionCard } from "@/components/model/VersionCard";
import { BenchmarkSection } from "@/components/benchmark/BenchmarkSection";
import { PerformanceSection } from "@/components/benchmark/PerformanceSection";
import type { RModel, RVersion } from "@/lib/helpers";
import {
  formatContextLength,
  getPlansForVersion,
  tierLabel,
  getLatestVersions,
} from "@/lib/helpers";

/* ------------------------------------------------------------------ */
/* Capability icon map                                                */
/* ------------------------------------------------------------------ */

const CAPABILITY_ICONS: Record<string, typeof Cpu> = {
  代码生成: Code,
  长文本理解: FileText,
  超长文本理解: FileText,
  中文对话: MessageSquare,
  中文理解: MessageSquare,
  多模态理解: Image,
  图片分析: Image,
  多语言: Globe,
  复杂推理: Brain,
  深度推理: Brain,
  文档分析: FileText,
  安全对话: Shield,
  数据提取: Search,
  结构化输出: Code,
  联网搜索: Search,
  视频分析: Image,
  视觉识别: Image,
  长文本处理: FileText,
  工具调用: Code,
  内容创作: Sparkles,
  知识问答: BookOpen,
  数学计算: Brain,
  多轮对话: MessageSquare,
  数据分析: Search,
  知识图谱: Brain,
  多模态处理: Image,
  企业搜索: Search,
  实时翻译: Languages,
};

function getCapabilityIcon(name: string) {
  return CAPABILITY_ICONS[name] || Sparkles;
}

/* ------------------------------------------------------------------ */
/* Tab 1: Overview                                                    */
/* ------------------------------------------------------------------ */

function OverviewTab({ model }: { model: RModel }) {
  return (
    <div className="space-y-6">
      {/* Long description */}
      {model.longDescription && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {model.longDescription}
        </p>
      )}

      {/* Key capabilities grid */}
      <div>
        <h3 className="text-sm font-medium mb-3">核心能力</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {model.capabilities.map((cap) => {
            const Icon = getCapabilityIcon(cap);
            return (
              <div
                key={cap}
                className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5"
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm">{cap}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Applicable scenarios */}
      <div>
        <h3 className="text-sm font-medium mb-3">适用场景</h3>
        <div className="flex flex-wrap gap-2">
          {model.scenarios.map((s) => (
            <Badge key={s} variant="outline" className="text-sm font-normal">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-sm font-medium mb-3">标签</h3>
        <div className="flex flex-wrap gap-2">
          {model.tags.map((t) => (
            <Badge key={t} variant="secondary" className="font-normal">
              {t}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab 2: Versions & Pricing                                         */
/* ------------------------------------------------------------------ */

function VersionsTab({ model }: { model: RModel }) {
  const versions = model.versions;

  return (
    <div className="space-y-4">
      {versions.length === 0 ? (
        <p className="text-sm text-muted-foreground">暂无版本信息</p>
      ) : (
        versions.map((v) => {
          const plans = getPlansForVersion(model, v.id);
          return (
            <VersionCard
              key={v.id}
              version={v}
              plans={plans}
              model={model}
            />
          );
        })
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab 3: Technical Specs                                             */
/* ------------------------------------------------------------------ */

function LatestBenchmarksAndPerformance({ model }: { model: RModel }) {
  const latest = getLatestVersions(model)[0];
  if (!latest) return null;

  const raw = latest as unknown as Record<string, unknown>;
  const benchmarks = raw.benchmarks as Record<string, number> | undefined;
  const performance = raw.performance as Record<string, unknown> | undefined;

  if (!benchmarks && !performance) return null;

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {benchmarks && (
        <BenchmarkSection
          benchmarks={{
            mmlu: benchmarks.mmlu as number | undefined,
            humaneval: benchmarks.humaneval as number | undefined,
            math: benchmarks.math as number | undefined,
            gsm8k: benchmarks.gsm8k as number | undefined,
            mt_bench: benchmarks.mt_bench as number | undefined,
          }}
        />
      )}
      {performance && (
        <PerformanceSection
          performance={
            {
              speed: {
                inputTokensPerSec: (performance.speed as Record<string, number>)?.inputTokensPerSec ?? 0,
                outputTokensPerSec: (performance.speed as Record<string, number>)?.outputTokensPerSec ?? 0,
              },
              concurrency: {
                maxConcurrentRequests: (performance.concurrency as Record<string, number>)?.maxConcurrentRequests ?? 0,
                maxTokensPerMinute: (performance.concurrency as Record<string, number>)?.maxTokensPerMinute ?? 0,
              },
            } as Parameters<typeof PerformanceSection>[0]["performance"]
          }
        />
      )}
    </div>
  );
}

function SpecsTab({ model }: { model: RModel }) {
  const versions = model.versions;

  if (versions.length === 0) {
    return <p className="text-sm text-muted-foreground">暂无版本数据</p>;
  }

  // Find best values for highlighting
  const maxContext = Math.max(...versions.map((v) => v.contextLength));

  return (
    <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[120px]">属性</TableHead>
          {versions.map((v) => (
            <TableHead key={v.id} className="min-w-[160px] text-center">
              <div className="flex flex-col items-center gap-1">
                {v.name}
                {v.latest && (
                  <Badge className="text-xs">最新</Badge>
                )}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Tier */}
        <TableRow>
          <TableCell className="font-medium">级别</TableCell>
          {versions.map((v) => (
            <TableCell key={v.id} className="text-center">
              {tierLabel(v.tier)}
            </TableCell>
          ))}
        </TableRow>

        {/* Context Length */}
        <TableRow>
          <TableCell className="font-medium">上下文长度</TableCell>
          {versions.map((v) => {
            const isBest = v.contextLength === maxContext;
            return (
              <TableCell key={v.id} className="text-center">
                <span
                  className={
                    isBest
                      ? "font-semibold text-emerald-600 dark:text-emerald-400"
                      : ""
                  }
                >
                  {formatContextLength(v.contextLength)}
                  {isBest && (
                    <span className="ml-1 text-xs text-emerald-600 dark:text-emerald-400">
                      最优
                    </span>
                  )}
                </span>
              </TableCell>
            );
          })}
        </TableRow>

        {/* Description */}
        <TableRow>
          <TableCell className="font-medium">说明</TableCell>
          {versions.map((v) => (
            <TableCell key={v.id} className="text-center text-muted-foreground text-xs">
              {v.description || "-"}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>

    {/* Benchmarks & Performance for the latest version */}
    <LatestBenchmarksAndPerformance model={model} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Tab 4: Compliance & Deployment                                     */
/* ------------------------------------------------------------------ */

function ComplianceTab({ model }: { model: RModel }) {
  const hasCompliance = model.compliance && model.compliance.length > 0;
  const hasDeployment = !!model.privateDeployment;

  if (!hasCompliance && !hasDeployment) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">合规信息</CardTitle>
            <CardDescription>该模型暂无公开的合规与部署信息</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compliance certifications */}
      {hasCompliance && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="size-4" />
              合规认证
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {model.compliance!.map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm">
                  <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Private deployment */}
      {hasDeployment && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="size-4" />
              私有部署
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {model.privateDeployment}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Security notes (generic) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="size-4" />
            数据安全
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            请访问模型官网了解详细的数据安全与隐私保护政策。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ModelTabs (exported)                                               */
/* ------------------------------------------------------------------ */

export interface ModelTabsProps {
  model: RModel;
}

export function ModelTabs({ model }: ModelTabsProps) {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">概览</TabsTrigger>
        <TabsTrigger value="versions">版本与价格</TabsTrigger>
        <TabsTrigger value="specs">技术参数</TabsTrigger>
        <TabsTrigger value="compliance">合规与部署</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab model={model} />
      </TabsContent>

      <TabsContent value="versions">
        <VersionsTab model={model} />
      </TabsContent>

      <TabsContent value="specs">
        <SpecsTab model={model} />
      </TabsContent>

      <TabsContent value="compliance">
        <ComplianceTab model={model} />
      </TabsContent>
    </Tabs>
  );
}
