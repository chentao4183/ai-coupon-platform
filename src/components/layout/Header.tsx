"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/coding", label: "编程套餐" },
  { href: "/pricing", label: "API 按量" },
  { href: "/lobster", label: "龙虾" },
  { href: "/compare", label: "对比" },
  { href: "/recommend", label: "推荐" },
  { href: "/calculator", label: "成本计算" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Layers className="size-5 text-primary" strokeWidth={2} />
          <span>AI模型比价</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-link rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === link.href
                  ? "text-foreground active"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: theme toggle + mobile menu */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon-sm" />}>
              <Menu className="size-5" />
              <span className="sr-only">菜单</span>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Layers className="size-5" />
                  AI模型比价
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 pt-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground min-h-[44px] flex items-center",
                      pathname === link.href
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
