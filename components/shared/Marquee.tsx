"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  reverse?: boolean;
  speed?: number;
}

export function Marquee({ items, className = "", reverse = false, speed = 45 }: MarqueeProps) {
  const doubled = [...items, ...items, ...items];

  return (
    <div
      className={cn(
        "overflow-hidden py-5 border-y border-[#F7F1E8]/15 bg-[#E60000] text-[#F7F1E8] select-none",
        className
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "flex items-center gap-8 w-max",
          reverse
            ? "animate-[marquee-reverse_45s_linear_infinite]"
            : "animate-[marquee_45s_linear_infinite]"
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-8 shrink-0">
            <span className="font-transcity text-2xl md:text-3xl tracking-normal whitespace-nowrap leading-none uppercase">
              {item}
            </span>
            <span className="text-[#F7F1E8]/40 text-lg font-serif italic select-none">/</span>
          </div>
        ))}
      </div>
    </div>
  );
}
