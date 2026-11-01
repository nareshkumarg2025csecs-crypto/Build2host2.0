"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

interface OverlayCardProps {
  children: React.ReactNode;
  className?: string;
  index: number;
  total: number;
}

export function OverlayCard({ children, className, index, total }: OverlayCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1, 0.92 - (total - index - 1) * 0.02]
  );
  const opacity = useTransform(scrollYProgress, [0.7, 1], [1, 0.85]);

  return (
    <div
      ref={ref}
      className="max-md:relative md:sticky max-md:!top-0"
      style={{ top: `${index * 20}px` }}
    >
      <motion.div
        style={{ scale, opacity }}
        className={cn(
          "rounded-2xl overflow-hidden max-md:!transform-none max-md:!opacity-100",
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}
