"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  getCodingPlanProviders,
  getCodingPlanTags,
  sortCodingPlans,
  type CodingPlan,
  type CodingPlanSortOption,
} from "@/lib/coding-plans";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X } from "lucide-react";

const SORT_OPTIONS: { value: CodingPlanSortOption; label: string }[] = [
  { value: "recommended", label: "推荐" },
  { value: "price-asc", label: "价格 ↑" },
  { value: "price-desc", label: "价格 ↓" },
  { value: "value", label: "性价比" },
];

const TIER_OPTIONS = [
  { value: "all", label: "全部" },
  { value: "lite", label: "Lite" },
  { value: "pro", label: "Pro" },
  { value: "max", label: "Max" },
  { value: "ultra", label: "Ultra" },
];

interface CodingPlanFiltersProps {
  plans: CodingPlan[];
  onFilteredChange: (plans: CodingPlan[]) => void;
}

export function CodingPlanFilters({
  plans,
  onFilteredChange,
}: CodingPlanFiltersProps) {
  const providers = useMemo(() => getCodingPlanProviders(), []);
  const tags = useMemo(() => getCodingPlanTags(), []);

  const [search, setSearch] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedTag, setSelectedTag] = useState("全部");
  const [sortBy, setSortBy] = useState<CodingPlanSortOption>("recommended");
  const [showFilters, setShowFilters] = useState(false);

  // Apply all filters
  const filtered = useMemo(() => {
    let result = [...plans];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.providerName.toLowerCase().includes(q) ||
          p.models.some((m) => m.toLowerCase().includes(q)) ||
          p.supportedTools.some((t) => t.toLowerCase().includes(q)) ||
          p.bestFor.toLowerCase().includes(q)
      );
    }

    // Provider filter
    if (selectedProviders.length > 0) {
      result = result.filter((p) => selectedProviders.includes(p.providerId));
    }

    // Tier filter
    if (selectedTier !== "all") {
      result = result.filter((p) => p.tier === selectedTier);
    }

    // Tag filter
    if (selectedTag && selectedTag !== "全部") {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }

    // Sort
    result = sortCodingPlans(result, sortBy);

    return result;
  }, [plans, search, selectedProviders, selectedTier, selectedTag, sortBy]);

  useEffect(() => {
    onFilteredChange(filtered);
  }, [filtered, onFilteredChange]);

  const toggleProvider = useCallback((providerId: string) => {
    setSelectedProviders((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    );
  }, []);

  const clearAll = useCallback(() => {
    setSearch("");
    setSelectedProviders([]);
    setSelectedTier("all");
    setSelectedTag("全部");
    setSortBy("recommended");
  }, []);

  const hasActiveFilters =
    search ||
    selectedProviders.length > 0 ||
    selectedTier !== "all" ||
    selectedTag !== "全部" ||
    sortBy !== "recommended";

  return (
    <div className="space-y-4">
      {/* Search + Sort row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索套餐、模型、工具..."
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
        <div className="flex items-center gap-1 shrink-0">
          {SORT_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={sortBy === opt.value ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs px-2.5"
              onClick={() => setSortBy(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
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
        <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          {/* Tier filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              等级
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TIER_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  variant={selectedTier === opt.value ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs px-2.5"
                  onClick={() => setSelectedTier(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Provider filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              厂商
            </label>
            <div className="flex flex-wrap gap-1.5">
              {providers.map((p) => {
                const isActive = selectedProviders.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProvider(p.id)}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {p.name}
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
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer text-xs select-none"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Badge>
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
    </div>
  );
}
