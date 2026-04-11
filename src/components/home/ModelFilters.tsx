"use client";

import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Model = any;

export type SortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "context-length";

const FILTER_OPTIONS = ["全部", "国产", "国际", "免费", "付费"] as const;

const DOMESTIC_COMPANIES = [
  "zhipu",
  "alibaba",
  "deepseek",
  "moonshot",
  "bytedance",
  "baidu",
  "minimax",
];

const INTERNATIONAL_COMPANIES = ["openai", "anthropic", "google"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPlanFree(plan: any): boolean {
  const p = plan.pricing || {};
  if (p.price === 0) return true;
  if (p.inputPrice === 0 && p.outputPrice === 0) return true;
  return false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMinPrice(model: any): number {
  let min = Infinity;
  for (const plan of model.pricingPlans || []) {
    if (isPlanFree(plan)) continue;
    const p = plan.pricing || {};
    if (p.price > 0) min = Math.min(min, p.price);
    let ip = p.inputPrice || 0;
    if (p.unit === "1K tokens") ip = ip * 1000;
    if (ip > 0) min = Math.min(min, ip);
  }
  return min === Infinity ? -1 : min;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMaxContext(model: any): number {
  const versions = model.versions || [];
  if (versions.length === 0) return 0;
  return Math.max(...versions.map((v: any) => v.contextLength || 0));
}

function sortModels(models: Model[], sortBy: SortOption): Model[] {
  const sorted = [...models];
  switch (sortBy) {
    case "recommended":
      return sorted.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return (a.order ?? 999) - (b.order ?? 999);
      });
    case "price-asc":
      return sorted.sort((a, b) => getMinPrice(a) - getMinPrice(b));
    case "price-desc":
      return sorted.sort((a, b) => getMinPrice(b) - getMinPrice(a));
    case "context-length":
      return sorted.sort((a, b) => getMaxContext(b) - getMaxContext(a));
    default:
      return sorted;
  }
}

interface ModelFiltersProps {
  models: Model[];
  onFilteredChange: (models: Model[]) => void;
}

export function ModelFilters({ models, onFilteredChange }: ModelFiltersProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("全部");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  const applyFilters = useCallback(
    (q: string, filter: string, sort: SortOption) => {
      let result = [...models];

      // Text search
      if (q.trim()) {
        const lower = q.toLowerCase();
        result = result.filter(
          (m) =>
            m.name.toLowerCase().includes(lower) ||
            m.nameEn.toLowerCase().includes(lower) ||
            m.description.toLowerCase().includes(lower) ||
            m.capabilities.some((c: string) => c.toLowerCase().includes(lower))
        );
      }

      // Tag filter
      if (filter && filter !== "全部") {
        if (filter === "国产") {
          result = result.filter((m) =>
            DOMESTIC_COMPANIES.includes(m.companyId)
          );
        } else if (filter === "国际") {
          result = result.filter((m) =>
            INTERNATIONAL_COMPANIES.includes(m.companyId)
          );
        } else if (filter === "免费") {
          result = result.filter((m) =>
            (m.pricingPlans || []).some((plan: any) => isPlanFree(plan))
          );
        } else if (filter === "付费") {
          result = result.filter(
            (m) => !(m.pricingPlans || []).some((plan: any) => isPlanFree(plan))
          );
        }
      }

      // Sort
      result = sortModels(result, sort);

      onFilteredChange(result);
    },
    [models, onFilteredChange]
  );

  function handleQueryChange(value: string) {
    setQuery(value);
    applyFilters(value, activeFilter, sortBy);
  }

  function handleFilterChange(value: string) {
    setActiveFilter(value);
    applyFilters(query, value, sortBy);
  }

  function handleSortChange(value: string | null) {
    const s = (value || "recommended") as SortOption;
    setSortBy(s);
    applyFilters(query, activeFilter, s);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search + Sort row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="搜索模型名称、能力..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-44 h-10">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">推荐排序</SelectItem>
            <SelectItem value="price-asc">价格从低到高</SelectItem>
            <SelectItem value="price-desc">价格从高到低</SelectItem>
            <SelectItem value="context-length">上下文长度</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => handleFilterChange(option)}
            className={cn(
              "inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors border",
              activeFilter === option
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
