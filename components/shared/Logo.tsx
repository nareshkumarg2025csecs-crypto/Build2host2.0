import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LogoProps {
  variant?: "mark" | "lockup";
  tone?: "cream" | "ink";
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function Logo({
  variant = "lockup",
  tone = "cream",
  className = "",
  width,
  height,
  priority = false,
}: LogoProps) {
  const isMark = variant === "mark";
  const isCream = tone === "cream";

  const src = isMark
    ? isCream
      ? "/brand/logo-mark.png"
      : "/brand/logo-mark-ink.png"
    : isCream
    ? "/brand/logo-lockup.png"
    : "/brand/logo-lockup-ink.png";

  const alt = isMark ? "built2host mark" : "built2host";

  // Natural aspect ratios:
  // mark: 799 x 328 (~2.436 : 1)
  // lockup: 1200 x 738 (~1.626 : 1)
  const defaultWidth = isMark ? (height ? Math.round(height * 2.436) : 107) : 160;
  const defaultHeight = isMark ? (height || 44) : Math.round(160 / 1.626);

  const finalWidth = width || defaultWidth;
  const finalHeight = height || defaultHeight;

  return (
    <Image
      src={src}
      alt={alt}
      width={finalWidth}
      height={finalHeight}
      priority={priority}
      className={cn("h-auto w-auto object-contain select-none", className)}
    />
  );
}

