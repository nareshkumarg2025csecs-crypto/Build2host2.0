import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Logo } from "@/components/shared/Logo";

export const metadata: Metadata = {
  title: "Type Specimen & Glyph Coverage — built2host",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TypeSpecimenPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return (
    <main className="bg-[#E60000] text-[#F7F1E8] min-h-screen p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-16">
        <div>
          <Link href="/" className="font-mono text-xs opacity-70 hover:opacity-100 uppercase">
            &larr; Return to Studio Homepage
          </Link>
          <h1 className="font-serif text-3xl md:text-5xl mt-4">Typography Specimen Review</h1>
          <p className="font-mono text-xs opacity-80 mt-2">
            Evaluating Transcity OTF display font, Instrument Serif editorial fallback, Inter Tight,
            and Geist Mono against the cream script logo.
          </p>
        </div>

        {/* 1. Logo vs Transcity Comparison */}
        <section className="border border-[#F7F1E8]/20 bg-[#C40000]/60 p-8 rounded-2xl space-y-6">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60">
            01 &middot; Script Wordmark vs Display Heading
          </p>

          <div>
            <p className="font-mono text-xs opacity-50 mb-2">Original Script Wordmark (PNG):</p>
            <Logo
              variant="lockup"
              tone="cream"
              width={240}
              className="w-56"
            />
          </div>

          <div>
            <p className="font-mono text-xs opacity-50 mb-2">Transcity Display (letters only):</p>
            <div className="space-y-2">
              <h2
                className="font-transcity text-[#F7F1E8] leading-none"
                style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
              >
                Websites
              </h2>
              <h2
                className="font-transcity text-[#F7F1E8] leading-none"
                style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
              >
                Automation
              </h2>
            </div>
          </div>
        </section>

        {/* 2. Glyph Coverage Verification */}
        <section className="border border-[#F7F1E8]/20 bg-[#B50000]/40 p-8 rounded-2xl space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60">
            02 &middot; Glyph Coverage Check (Letters Only vs Punctuation/Digits)
          </p>
          <p className="font-sans text-xs opacity-80">
            Transcity contains only A–Z and a–z. Notice how the CSS font fallback seamlessly passes
            numbers, punctuation, and currency symbols (₹, 7,999, &amp;, %) to Instrument Serif
            without blank box glyph render failures:
          </p>

          <div className="p-6 bg-[#800000] rounded-xl space-y-4">
            <div>
              <span className="font-mono text-[10px] opacity-50 block">PURE LETTERS IN TRANSCITY:</span>
              <p className="font-transcity text-4xl text-[#F7F1E8]">Selected Work</p>
            </div>
            <div>
              <span className="font-mono text-[10px] opacity-50 block">FALLBACK SERIF WITH NUMERALS:</span>
              <p className="font-serif text-3xl text-[#F7F1E8]">Package 01 — ₹7,999 &middot; 40/30/30</p>
            </div>
          </div>
        </section>

        {/* 3. Instrument Serif Display Evaluation */}
        <section className="border border-[#F7F1E8]/20 bg-[#6E0000]/50 p-8 rounded-2xl space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60">
            03 &middot; Instrument Serif Editorial Variant
          </p>
          <p className="font-serif italic text-4xl text-[#F7F1E8]">
            &ldquo;You imagine it. We build it.&rdquo;
          </p>
          <p className="font-serif text-3xl text-[#F7F1E8]/90">
            Respond to every property enquiry before it goes cold.
          </p>
        </section>

        {/* 4. UI Body & Mono Evaluation */}
        <section className="border border-[#F7F1E8]/20 bg-[#540000]/50 p-8 rounded-2xl space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60">
            04 &middot; Inter Tight (UI Body) &amp; Geist Mono (Technical Data)
          </p>
          <p className="font-sans text-sm text-[#F7F1E8]/80 leading-relaxed max-w-xl">
            Inter Tight renders with clean proportions at 14px and 12px, while Geist Mono anchors
            all pricing figures, timeline steps, and schema attributes with engineering precision.
          </p>
          <div className="flex gap-4 font-mono text-xs text-[#F7F1E8]/70">
            <span>₹1,299 WA AI</span>
            <span>&middot;</span>
            <span>₹2,499 Missed Call</span>
            <span>&middot;</span>
            <span>₹15,000 Suite</span>
          </div>
        </section>

        <div className="pt-6 border-t border-[#F7F1E8]/20 text-xs font-mono opacity-60">
          Evaluation Conclusion: Transcity works very nicely for ultra-large pure-letter headings
          (&ldquo;Websites&rdquo;, &ldquo;Automation&rdquo;), giving an editorial poster presence.
          For mixed headings containing punctuation, numbers, or prices, Instrument Serif acts as
          the primary display serif.
        </div>
      </div>
    </main>
  );
}

