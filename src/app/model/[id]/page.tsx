import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModelById, getCompanyById, getAllModels } from "@/lib/data";
import { ModelTabs } from "@/components/model/ModelTabs";
import { OfficialLinks } from "@/components/model/OfficialLinks";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  asRModel,
  formatContextLength,
  getStartingPrice,
  getMaxContext,
  getLatestVersions,
  getCompanyColor,
} from "@/lib/helpers";
import type { RModel } from "@/lib/helpers";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function findRelatedModels(model: RModel, count = 3): RModel[] {
  const company = getCompanyById(model.companyId);
  const country = company?.country;
  if (!country) return [];

  const allRaw = getAllModels();
  return allRaw
    .filter((m) => {
      if (m.id === model.id) return false;
      const c = getCompanyById(m.companyId);
      return c?.country === country;
    })
    .slice(0, count)
    .map((m) => asRModel(m));
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const raw = getModelById(id);
  if (!raw) return { title: "模型未找到" };
  const model = asRModel(raw);
  return {
    title: `${model.name} - AI模型比价`,
    description: model.description,
  };
}

export default async function ModelDetailPage({ params }: PageProps) {
  const { id } = await params;
  const raw = getModelById(id);
  if (!raw) notFound();

  const model = asRModel(raw);
  const company = getCompanyById(model.companyId);
  const colorClass = getCompanyColor(model.companyId);
  const price = getStartingPrice(model);
  const maxCtx = getMaxContext(model);
  const latestVersions = getLatestVersions(model);
  const latestVersionName =
    latestVersions.length > 0 ? latestVersions[0].name : model.versions[0]?.name || "-";
  const relatedModels = findRelatedModels(model);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          首页
        </Link>
        <span>/</span>
        {company && (
          <>
            <span>{company.name}</span>
            <span>/</span>
          </>
        )}
        <span className="text-foreground font-medium">{model.name}</span>
      </nav>

      {/* Model header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div className="flex items-start gap-4">
          {company?.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={48}
              height={48}
              className="size-12 shrink-0 rounded-full object-contain bg-muted/50"
            />
          ) : (
            <span
              className={`inline-flex size-12 shrink-0 items-center justify-center rounded-full ${colorClass} text-white text-lg font-bold`}
            >
              {company?.name.charAt(0) || "?"}
            </span>
          )}
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {model.name}
              </h1>
              {model.featured && (
                <Badge className="text-xs">推荐</Badge>
              )}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {company?.name || ""}
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Card size="sm">
          <CardContent>
            <p className="text-xs text-muted-foreground">上下文长度</p>
            <p className="text-lg font-semibold">
              {maxCtx > 0 ? formatContextLength(maxCtx) : "-"}
            </p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent>
            <p className="text-xs text-muted-foreground">最新版本</p>
            <p className="text-lg font-semibold">{latestVersionName}</p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent>
            <p className="text-xs text-muted-foreground">起步价格</p>
            <p
              className={`text-lg font-semibold ${
                price.isFree
                  ? "text-emerald-600 dark:text-emerald-400"
                  : ""
              }`}
            >
              {price.label}
            </p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent>
            <p className="text-xs text-muted-foreground">版本数量</p>
            <p className="text-lg font-semibold">{model.versions.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <ModelTabs model={model} />
      </div>

      {/* Official Links */}
      {model.links && <OfficialLinks links={model.links} />}

      {/* Related models */}
      {relatedModels.length > 0 && (
        <section className="border-t pt-8">
          <h2 className="text-lg font-semibold mb-4">
            同地区相关模型
            {company && (
              <span className="font-normal text-muted-foreground ml-2">
                ({company.country})
              </span>
            )}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedModels.map((rm) => {
              const rc = getCompanyById(rm.companyId);
              const rcColor = getCompanyColor(rm.companyId);
              const rp = getStartingPrice(rm);
              return (
                <Link key={rm.id} href={`/model/${rm.id}`}>
                  <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-center gap-2.5">
                        {rc?.logo ? (
                          <Image
                            src={rc.logo}
                            alt={rc.name}
                            width={32}
                            height={32}
                            className="size-8 shrink-0 rounded-full object-contain bg-muted/50"
                          />
                        ) : (
                          <span
                            className={`inline-block size-8 shrink-0 rounded-full ${rcColor} flex items-center justify-center text-white text-sm font-bold`}
                          >
                            {rc?.name.charAt(0) || "?"}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {rm.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {rc?.name || ""}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {rm.description}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span
                          className={`text-sm font-semibold ${
                            rp.isFree
                              ? "text-emerald-600 dark:text-emerald-400"
                              : ""
                          }`}
                        >
                          {rp.label}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
