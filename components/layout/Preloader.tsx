"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "@/components/shared/Logo";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Only show once per session to avoid blocking repeated navigation
    if (typeof window !== "undefined" && sessionStorage.getItem("b2h_preloader_seen")) {
      setVisible(false);
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setVisible(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("b2h_preloader_seen", "1");
      }
      setTimeout(onComplete, 300);
    }, 700);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] bg-[#E60000] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          >
            <Logo
              variant="lockup"
              tone="cream"
              width={200}
              priority
              className="w-40 md:w-52"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
