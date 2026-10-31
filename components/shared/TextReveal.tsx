"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export function TextReveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "h2",
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const lines = children.split("\n");

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} aria-label={children}>
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={isInView ? { y: "0%" } : { y: "100%" }}
            transition={{
              duration: 0.7,
              delay: delay + i * 0.08,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <Tag className={className}>{line}</Tag>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
