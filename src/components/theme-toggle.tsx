"use client";

import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, Monitor } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
  };

  const icon =
    theme === "light" ? (
      <Sun className="size-4" />
    ) : theme === "dark" ? (
      <Moon className="size-4" />
    ) : (
      <Monitor className="size-4" />
    );

  const label =
    theme === "light" ? "浅色模式" : theme === "dark" ? "深色模式" : "跟随系统";

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={cycleTheme}
        aria-label={label}
        className="relative inline-flex shrink-0 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground size-8 cursor-pointer"
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent>
        <p>{label} (点击切换)</p>
      </TooltipContent>
    </Tooltip>
  );
}
