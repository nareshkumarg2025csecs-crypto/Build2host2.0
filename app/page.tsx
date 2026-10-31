"use client";

import { useState } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SplitHero } from "@/components/sections/SplitHero";
import { Marquee } from "@/components/shared/Marquee";
import { Preloader } from "@/components/layout/Preloader";

const marqueeItems = [
  "Websites",
  "Automation",
  "Fixed Prices",
  "WhatsApp",
  "Real Estate",
  "SEO",
  "GEO",
  "Secure",
  "Fast",
  "Responsive",
];

export default function HomePage() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  return (
    <main className="bg-[#E60000]">
      {!preloaderComplete && (
        <Preloader onComplete={() => setPreloaderComplete(true)} />
      )}
      <Nav transparent />
      <SplitHero />
      <div className="bg-[#E60000] text-[#F7F1E8]">
        <Marquee items={marqueeItems} />
      </div>
      <Footer />
    </main>
  );
}
