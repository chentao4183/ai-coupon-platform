"use client";

import { useState, useCallback, useMemo } from "react";
import {
  getAllApiPricing,
  sortApiPricing,
  getApiPricingCompanies,
  getApiPricingTags,
  formatApiPrice,
  formatUSDPrice,
  type ApiPricingRow,
  type ApiPricingSortOption,
} from "@/lib/api-pricing";
import { ApiPricingTable } from "@/components/pricing/ApiPricingTable";
import { ApiPricingCard } from "@/components/pricing/ApiPricingCard";
import {
  Search,
  SlidersHorizontal,
  Table2,
  LayoutGrid,
  X,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const allRows = getAllApiPricing();

const SORT_OPTIONS: { value: ApiPricingSortOption; label: string }[] = [
  { value: "recommended", label: "推荐" },
  { value: "input-asc", label: "输入价 ↑" },
  { value: "input-desc", label: "输入价 ↓" },
  { value: "output-asc", label: "输出价 ↑" },
  { value: "output-desc", label: "输出价 ↓" },
  { value: "value", label: "综合性价比" },
];

type ViewMode = "table" | "card";

export default function PricingPage() {
  const companies = useMemo(() => getApiPricingCompanies(), []);
  const tags = useMemo(() => getApiPricingTags(), []);

  const [search, setSearch] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedTag, setSelectedTag] = useState("全部");
  const [sortBy, setSortBy] = useState<ApiPricingSortOption>("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [freeOnly, setFreeOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = [...allRows];

    // Free only
    if (freeOnly) {
      result = result.filter((r) => r.inputPrice === 0 && r.outputPrice === 0);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.planName.toLowerCase().includes(q) ||
          r.modelName.toLowerCase().includes(q) ||
          r.modelNameEn.toLowerCase().includes(q) ||
          r.companyName.toLowerCase().includes(q)
      );
    }

    // Company filter
    if (selectedCompanies.length > 0) {
      result = result.filter((r) =>
        selectedCompanies.includes(r.companyId)
      );
    }

    // Country filter
    if (selectedCountry !== "all") {
      result = result.filter((r) => r.companyCountry === selectedCountry);
    }

    // Tag filter
    if (selectedTag && selectedTag !== "全部") {
      result = result.filter((r) => r.modelTags.includes(selectedTag));
    }

    // Sort
    result = sortApiPricing(result, sortBy);

    return result;
  }, [search, selectedCompanies, selectedCountry, selectedTag, sortBy, freeOnly]);

  const toggleCompany = useCallback((companyId: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  }, []);

  const clearAll = useCallback(() => {
    setSearch("");
    setSelectedCompanies([]);
    setSelectedCountry("all");
    setSelectedTag("全部");
    setSortBy("recommended");
    setFreeOnly(false);
  }, []);

  const hasActiveFilters =
    search ||
    selectedCompanies.length > 0 ||
    selectedCountry !== "all" ||
    selectedTag !== "全部" ||
    sortBy !== "recommended" ||
    freeOnly;

  // Stats
  const stats = useMemo(() => {
    const freeCount = allRows.filter(
      (r) => r.inputPrice === 0 && r.outputPrice === 0
    ).length;
    const minInput = Math.min(
      ...allRows.filter((r) => r.inputPrice > 0).map((r) => r.inputPriceUSD)
    );
    const minOutput = Math.min(
      ...allRows.filter((r) => r.outputPrice > 0).map((r) => r.outputPriceUSD)
    );
    return { total: allRows.length, freeCount, minInput, minOutput };
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/[0.04] via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,var(--color-primary)/0.08,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
            <DollarSign className="size-3" />
            <span>{stats.total} 个 API 定价，{stats.freeCount} 个免费</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            API 按量付费
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"> 精确对比 </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            精确到每百万 Token 的 API 定价。覆盖国内外主流大模型，
            统一换算为美元便于跨国对比。
          </p>

          {/* Quick stats */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {stats.freeCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {stats.freeCount} 个模型完全免费
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              最低输入 {formatUSDPrice(stats.minInput)}/1M tokens
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
              最低输出 {formatUSDPrice(stats.minOutput)}/1M tokens
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Search + Controls row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索模型、厂商..."
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none ring-ring/10 transition-shadow focus:ring-2"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Sort buttons */}
          <div className="flex items-center gap-1 shrink-0 overflow-x-auto">
            {SORT_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={sortBy === opt.value ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs px-2.5 whitespace-nowrap filter-btn min-h-[36px]"
                onClick={() => setSortBy(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>

          {/* Free toggle */}
          <Button
            variant={freeOnly ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs shrink-0"
            onClick={() => setFreeOnly(!freeOnly)}
          >
            仅免费
          </Button>

          {/* View toggle */}
          <div className="flex items-center border border-border rounded-md overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 transition-colors ${
                viewMode === "table"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              <Table2 className="size-3.5" />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-1.5 transition-colors ${
                viewMode === "card"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-3.5" />
            </button>
          </div>

          {/* Filter toggle */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs shrink-0"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="size-3.5 mr-1" />
            筛选
            {hasActiveFilters && (
              <span className="ml-1 inline-flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                !
              </span>
            )}
          </Button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-4 rounded-lg border border-border bg-muted/20 p-4 space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
            {/* Country filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                地区
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { value: "all", label: "全部" },
                  { value: "中国", label: "国产" },
                  { value: "美国", label: "国际" },
                ].map((opt) => (
                  <Button
                    key={opt.value}
                    variant={selectedCountry === opt.value ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs px-2.5"
                    onClick={() => setSelectedCountry(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Company filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                厂商
              </label>
              <div className="flex flex-wrap gap-1.5">
                {companies.map((c) => {
                  const isActive = selectedCompanies.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleCompany(c.id)}
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors ${
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tag filter */}
            {tags.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  标签
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["全部", ...tags].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`inline-flex items-center rounded-md border px-2 py-1 text-xs transition-colors ${
                        selectedTag === tag
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear */}
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                清除所有筛选
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="mt-6 mb-4 text-sm text-muted-foreground">
          共 {filtered.length} 个 API 定价
          {freeOnly && " (仅免费)"}
        </div>

        {/* Content */}
        {filtered.length > 0 ? (
          viewMode === "table" ? (
            <ApiPricingTable rows={filtered} />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((row) => (
                <ApiPricingCard key={row.id} row={row} />
              ))}
            </div>
          )
        ) : (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">未找到匹配的 API 定价</p>
          </div>
        )}
      </section>
    </div>
  );
}
