"use client";

import { useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
