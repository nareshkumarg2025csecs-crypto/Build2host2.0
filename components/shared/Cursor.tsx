"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type CursorLabel = "" | "View" | "Enter" | "Drag";

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40 });
  const springY = useSpring(y, { stiffness: 500, damping: 40 });
  const [label, setLabel] = useState<CursorLabel>("");
  const [isVisible, setIsVisible] = useState(false);
  const [isCoarse, setIsCoarse] = useState(true); // default true = hidden on SSR

  useEffect(() => {
    setIsCoarse(window.matchMedia("(pointer: coarse)").matches);

    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsVisible(true);
    };

    const handleLabel = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest("[data-cursor]") as HTMLElement | null;
      setLabel((el?.dataset.cursor as CursorLabel) ?? "");
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", handleLabel);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleLabel);
    };
  }, [x, y]);

  if (isCoarse) return null;

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[300] pointer-events-none hidden md:flex items-center justify-center"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      aria-hidden="true"
    >
      <motion.div
        className="rounded-full border border-[#F7F1E8]/60 flex items-center justify-center"
        animate={{
          width: label ? 72 : 12,
          height: label ? 72 : 12,
          opacity: isVisible ? 1 : 0,
          backgroundColor: label ? "rgba(230,0,0,0.85)" : "transparent",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {label && (
          <span className="label-sm text-[#F7F1E8] text-[10px] whitespace-nowrap">
            {label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
