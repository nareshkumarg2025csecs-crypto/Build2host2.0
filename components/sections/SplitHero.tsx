"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export function SplitHero() {
  const [hovered, setHovered] = useState<"websites" | "automation" | null>(null);

  return (
    <section
      className="relative h-screen h-[100svh] min-h-screen w-full flex flex-col md:flex-row overflow-hidden select-none"
      aria-label="built2host — Websites and Automation"
    >
      {/* ── Left panel: Websites (Poster aesthetic) ── */}
      <motion.div
        className="relative flex-1 h-[50svh] md:h-full bg-[#E60000] flex flex-col justify-end p-6 md:p-12 lg:p-16 overflow-hidden cursor-pointer"
        animate={{
          flex: hovered === "websites" ? 1.4 : hovered === "automation" ? 0.7 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        onHoverStart={() => setHovered("websites")}
        onHoverEnd={() => setHovered(null)}
      >
        {/* Hover dim overlay */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          animate={{ opacity: hovered === "automation" ? 0.2 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        />

        {/* Clickable link */}
        <Link
          href="/websites"
          className="absolute inset-0 z-10"
          aria-label="Enter Websites Division"
          data-cursor="Enter"
        />

        <div className="relative z-20 pointer-events-none">
          <p className="font-mono text-xs text-[#F7F1E8]/60 uppercase tracking-widest mb-3 md:mb-4">
            Division 01
          </p>

          <h2
            className="font-transcity text-[#F7F1E8] leading-none mb-3 tracking-normal"
            style={{ fontSize: "clamp(3.5rem, 9vw, 9.5rem)" }}
          >
            Websites
          </h2>

          <p className="font-serif italic text-[#F7F1E8]/85 text-base md:text-xl max-w-sm mb-6 leading-snug">
            Fast, secure, search-ready websites at honest, fixed prices.
          </p>

          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#F7F1E8] uppercase tracking-wider border-b border-[#F7F1E8]/40 pb-1">
            <span>Enter Division</span>
            <ArrowRight size={13} aria-hidden="true" />
          </div>
        </div>
      </motion.div>

      {/* ── Center brand identity: logo + manifesto (positioned below nav) ── */}
      <div
        className="absolute top-20 md:top-[calc(4rem+1.5rem)] left-1/2 -translate-x-1/2 z-30 pointer-events-none w-[90%] sm:w-auto max-w-[340px]"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-3 text-center px-5 py-4 rounded-2xl bg-[#E60000]/85 border border-[#F7F1E8]/20 shadow-xl backdrop-blur-md">
          <Logo
            variant="lockup"
            tone="cream"
            width={140}
            priority
            className="w-32 md:w-36"
          />
          <p className="hidden md:block [@media(max-height:720px)]:hidden font-sans text-[11px] text-[#F7F1E8]/80 leading-relaxed">
            built2host is a small studio that builds fast, secure, search-ready websites and the automations that keep your enquiries from going cold.
          </p>
          <p className="font-serif italic text-[#F7F1E8] text-xs">
            &ldquo;You imagine it. We build it.&rdquo;
          </p>
        </div>
      </div>

      {/* ── Right panel: Automation (Systems aesthetic) ── */}
      <motion.div
        className="relative flex-1 h-[50svh] md:h-full bg-[#6E0000] flex flex-col justify-end p-6 md:p-12 lg:p-16 overflow-hidden cursor-pointer"
        animate={{
          flex: hovered === "automation" ? 1.4 : hovered === "websites" ? 0.7 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        onHoverStart={() => setHovered("automation")}
        onHoverEnd={() => setHovered(null)}
      >
        {/* Subtle 1px grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(247,241,232,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(247,241,232,0.15) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Hover dim overlay */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          animate={{ opacity: hovered === "websites" ? 0.2 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        />

        {/* Animated simulation pill loop */}
        <div
          className="absolute top-28 right-8 lg:right-12 hidden lg:flex flex-col gap-2 pointer-events-none z-10"
          aria-hidden="true"
        >
          <div className="bg-[#540000]/80 border border-[#F7F1E8]/15 rounded-lg px-3 py-1.5 max-w-[150px] shadow-lg">
            <p className="font-mono text-[#F7F1E8]/75 text-[9px]">
              2 BHK &middot; Velachery &middot; ₹70L
            </p>
          </div>
          <div className="bg-[#540000]/60 border border-[#F7F1E8]/10 rounded px-3 py-1 max-w-[150px] flex items-center justify-between">
            <span className="font-mono text-[#F7F1E8]/40 text-[8px]">01 Sheet sync</span>
            <Check size={12} className="text-emerald-400" />
          </div>
          <div className="bg-[#E60000]/40 border border-[#F83F41]/30 rounded px-3 py-1 max-w-[150px]">
            <p className="font-mono text-[#F97B7E] text-[8px]">Agent alert sent &rarr;</p>
          </div>
        </div>

        {/* Clickable link */}
        <Link
          href="/automation"
          className="absolute inset-0 z-10"
          aria-label="Enter Automation Division"
          data-cursor="Enter"
        />

        <div className="relative z-20 pointer-events-none">
          <p className="font-mono text-xs text-[#F7F1E8]/60 uppercase tracking-widest mb-3 md:mb-4">
            Division 02
          </p>

          <h2
            className="font-transcity text-[#F7F1E8] leading-none mb-3 tracking-normal"
            style={{ fontSize: "clamp(3.5rem, 9vw, 9.5rem)" }}
          >
            Automation
          </h2>

          <p className="font-mono text-[#F7F1E8]/85 text-xs md:text-sm max-w-sm mb-6 leading-relaxed">
            WhatsApp, missed-call, property-portal and AI voice automations for real-estate teams.
          </p>

          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#F7F1E8] uppercase tracking-wider border-b border-[#F7F1E8]/40 pb-1">
            <span>Enter Division</span>
            <ArrowRight size={13} aria-hidden="true" />
          </div>
        </div>
      </motion.div>

      {/* ── Scroll cue (desktop only) ── */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-1.5 pointer-events-none"
        aria-hidden="true"
      >
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#F7F1E8]/50">
          Scroll
        </span>
        <div className="w-px h-6 bg-[#F7F1E8]/40 animate-pulse" />
      </div>
    </section>
  );
}
