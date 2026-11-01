import { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { packages, addons, maintenancePlans } from "@/data/websites";
import { projects } from "@/data/projects";
import { SITE, makeWhatsAppUrl } from "@/lib/site";
import { SpotlightCard } from "@/components/shared/SpotlightCard";
import { TiltCard } from "@/components/shared/TiltCard";
import { Proof } from "@/components/shared/Proof";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Zap,
  Globe2,
  Code2,
  Layers,
  Sparkles,
  Smartphone,
  Search,
  Lock,
  Headphones,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Websites — Fast, Secure, Search-Ready",
  description:
    "Boutique websites for portfolios, small businesses, and growing brands. Honest fixed prices from ₹7,999 with 3 revision rounds.",
};

const serviceTiles = [
  {
    icon: Code2,
    title: "Custom Development",
    desc: "Clean, performant TypeScript and React architectures built for speed and zero bloat.",
  },
  {
    icon: Smartphone,
    title: "Responsive UI / UX",
    desc: "Meticulously crafted interfaces that feel native and fluid on mobile, tablet, and desktop.",
  },
  {
    icon: Search,
    title: "On-Page & Technical SEO",
    desc: "Semantic HTML, meta tags, schema markup, and sitemaps designed for search indexing from day one.",
  },
  {
    icon: Globe2,
    title: "GEO-Optimized Architecture",
    desc: "Structured content and local search grounding configured for regional and local market presence.",
  },
  {
    icon: Lock,
    title: "Security by Default",
    desc: "Strict CSP headers, TLS enforcement, sanitized inputs, and minimal attack surface out of the box.",
  },
  {
    icon: Zap,
    title: "Instant Speed",
    desc: "Optimized fonts, responsive images, and minimal client payloads targeting 90+ Lighthouse metrics.",
  },
];

const faqItems = [
  {
    q: "Who owns the domain and hosting?",
    a: "You do. Domain registration and hosting are charged separately and registered directly in your name so you always retain full ownership and control of your web assets.",
  },
  {
    q: "How do revisions work?",
    a: "Every package includes 3 structured revision rounds within the agreed scope. Design is presented and approved before code implementation begins, preventing scope confusion.",
  },
  {
    q: "What is your delivery timeline?",
    a: "Starter packages typically launch within 7–10 business days. Business packages take 2–3 weeks, and Premium builds take 3–4 weeks depending on prompt asset handover and review.",
  },
  {
    q: "How are payments structured?",
    a: "We work on a transparent milestone structure: 40% upfront deposit to commence, 30% after design sign-off, and the final 30% before deployment and DNS handover.",
  },
  {
    q: "Do you offer post-launch maintenance?",
    a: "Yes. We offer optional monthly maintenance plans starting from ₹399/month covering uptime, SSL checks, dependencies, and minor updates within a defined scope.",
  },
];

export default function WebsitesPage() {
  const websiteWa = makeWhatsAppUrl(
    SITE.websiteDivision.whatsapp,
    "Hi built2host! I'd like to discuss a website project."
  );

  return (
    <main className="bg-[#E60000] text-[#F7F1E8] min-h-screen selection:bg-[#F7F1E8] selection:text-[#E60000]">
      <Nav />

      {/* ── 1. Hero ── */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 px-5 sm:px-6 md:px-12 max-w-7xl mx-auto flex flex-col justify-end min-h-[70svh] md:min-h-[85vh]">
        <div className="max-w-4xl">
          <p className="label-sm text-[#F7F1E8]/70 mb-3 md:mb-4 tracking-widest uppercase">
            Division 01 &mdash; Websites
          </p>
          <h1
            className="font-transcity text-[#F7F1E8] leading-[0.9] md:leading-[0.85] tracking-tight uppercase mb-5 md:mb-6"
            style={{ fontSize: "clamp(2.75rem, 11vw, 15rem)" }}
          >
            Websites
          </h1>
          <p className="font-serif italic text-xl sm:text-2xl md:text-4xl text-[#F7F1E8]/90 max-w-2xl font-light mb-8 md:mb-10 leading-tight">
            Fast, secure, search-ready websites at honest, fixed prices.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <a
              href="#packages"
              className="bg-[#F7F1E8] text-[#E60000] px-7 py-3.5 md:px-8 md:py-4 font-sans font-semibold text-xs md:text-sm uppercase tracking-wider text-center min-h-[48px] flex items-center justify-center hover:bg-[#F9F9F9] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Choose a package
            </a>
            <a
              href={websiteWa}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#F7F1E8]/40 hover:border-[#F7F1E8] text-[#F7F1E8] px-7 py-3.5 md:px-8 md:py-4 font-sans font-semibold text-xs md:text-sm uppercase tracking-wider text-center min-h-[48px] flex items-center justify-center transition-all hover:bg-[#F7F1E8]/10"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. Selected Work (Stacked Cards) ── */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#F7F1E8]/15">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <p className="label-sm text-[#F7F1E8]/60 mb-2">Portfolio</p>
            <h2 className="font-serif text-4xl md:text-6xl text-[#F7F1E8]">Selected Work</h2>
          </div>
          <p className="font-sans text-sm text-[#F7F1E8]/70 max-w-xs">
            A small selection of bespoke websites built with precision, speed, and clean typography.
          </p>
        </div>

        <div className="space-y-12">
          {projects.map((project, idx) => (
            <TiltCard key={project.slug} className="w-full">
              <SpotlightCard
                className="bg-[#C40000]/60 border border-[#F7F1E8]/20 rounded-2xl p-8 md:p-14 relative backdrop-blur-sm overflow-hidden"
                spotlightColor="rgba(247, 241, 232, 0.12)"
              >
                {/* Diagonal lines background pattern */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, #F7F1E8 0, #F7F1E8 1px, transparent 0, transparent 24px)",
                  }}
                  aria-hidden="true"
                />

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-3">
                    <span className="font-mono text-6xl md:text-8xl font-bold text-[#F7F1E8]/30">
                      0{idx + 1}
                    </span>
                    <p className="label-sm text-[#F7F1E8]/60 mt-2">{project.year}</p>
                  </div>

                  <div className="md:col-span-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono uppercase px-2.5 py-1 bg-[#F7F1E8]/10 rounded border border-[#F7F1E8]/15 text-[#F7F1E8]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-serif text-3xl md:text-4xl text-[#F7F1E8] mb-3">
                      {project.title}
                    </h3>
                    <p className="font-sans text-sm text-[#F7F1E8]/80 leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  <div className="md:col-span-3 flex md:justify-end">
                    {project.href ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 label-sm text-[#F7F1E8] border border-[#F7F1E8]/40 px-5 py-3 rounded hover:bg-[#F7F1E8] hover:text-[#E60000] transition-colors"
                      >
                        <span>View project</span>
                        <ArrowRight size={14} />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 label-sm text-[#F7F1E8]/50 border border-[#F7F1E8]/20 px-4 py-2.5 rounded cursor-default">
                        <span>Case study soon</span>
                      </span>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ── 3. Packages & Pricing ── */}
      <section id="packages" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#F7F1E8]/15">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="label-sm text-[#F7F1E8]/60 mb-2 uppercase tracking-widest">
            Transparent Pricing
          </p>
          <h2 className="font-serif text-4xl md:text-6xl text-[#F7F1E8] mb-4">
            Website Packages
          </h2>
          <p className="font-sans text-base text-[#F7F1E8]/80">
            Every package includes 3 structured revision rounds, modern responsive engineering,
            and honest on-page SEO foundations. No surprise charges.
          </p>
        </div>

        {/* 3 Package Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 mb-16">
          {packages.map((pkg) => {
            const isPopular = pkg.id === "business";
            return (
              <SpotlightCard
                key={pkg.id}
                id={`package-${pkg.id}`}
                overflowHidden={false}
                className={`relative rounded-2xl p-8 md:p-10 flex flex-col justify-between transition-all duration-300 border ${
                  isPopular
                    ? "z-10 bg-[#C40000] border-[#F7F1E8] shadow-2xl scale-[1.02]"
                    : "z-0 bg-[#B50000]/50 border-[#F7F1E8]/20 hover:border-[#F7F1E8]/50"
                }`}
                spotlightColor="rgba(247, 241, 232, 0.18)"
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 bg-[#F7F1E8] text-[#E60000] border border-[#E60000]/20 px-3.5 py-0.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider shadow-sm whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <h3 className="font-serif text-3xl text-[#F7F1E8]">{pkg.name}</h3>
                    <span className="font-mono text-3xl font-bold text-[#F7F1E8]">
                      ₹{pkg.priceDisplay}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-[#F7F1E8]/70 mb-6 min-h-[36px]">
                    {pkg.bestFor}
                  </p>

                  <div className="border-t border-[#F7F1E8]/15 pt-6 pb-6 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#F7F1E8]/70">Scope</span>
                      <span className="font-medium text-[#F7F1E8]">{pkg.size}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#F7F1E8]/70">SEO</span>
                      <span className="font-medium text-[#F7F1E8]">{pkg.seo}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#F7F1E8]/70">GEO Structure</span>
                      <span className="font-medium text-[#F7F1E8]">
                        {pkg.geo ? "Included" : "Not included"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#F7F1E8]/70">Custom Logo</span>
                      <span className="font-medium text-[#F7F1E8]">{pkg.logo}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#F7F1E8]/70">Admin Dashboard</span>
                      <span className="font-medium text-[#F7F1E8]">{pkg.adminDashboard}</span>
                    </div>
                  </div>

                  <div className="border-t border-[#F7F1E8]/15 pt-6 mb-8">
                    <p className="label-sm text-[#F7F1E8]/50 mb-3 text-[10px]">What is included</p>
                    <ul className="space-y-2.5">
                      {pkg.includes.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-[#F7F1E8]/90">
                          <Check size={14} className="text-[#F7F1E8] shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href={`/websites/enquiry?package=${pkg.id}`}
                  className={`w-full text-center py-4 rounded font-sans font-semibold text-xs uppercase tracking-wider transition-all ${
                    isPopular
                      ? "bg-[#F7F1E8] text-[#E60000] hover:bg-white shadow-lg"
                      : "border border-[#F7F1E8]/50 text-[#F7F1E8] hover:bg-[#F7F1E8] hover:text-[#E60000]"
                  }`}
                >
                  Select this package
                </Link>
              </SpotlightCard>
            );
          })}
        </div>

        {/* Honest Note banner */}
        <div className="bg-[#6E0000]/60 border border-[#F7F1E8]/20 rounded-xl p-6 text-center max-w-3xl mx-auto mb-16">
          <p className="font-mono text-xs text-[#F7F1E8]/80 leading-relaxed">
            <span className="font-bold text-[#F7F1E8]">Honest Note:</span> Prices are starting
            prices; final cost depends on scope. We never promise guaranteed rankings, unlimited
            traffic, or complete security.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="border border-[#F7F1E8]/20 rounded-2xl overflow-hidden bg-[#B50000]/30 backdrop-blur-sm">
          <div className="p-5 md:p-8 border-b border-[#F7F1E8]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-serif text-2xl text-[#F7F1E8]">Package Comparison</h3>
            <span className="font-mono text-[11px] text-[#F7F1E8]/60 md:hidden flex items-center gap-1">
              Scroll horizontally &rarr;
            </span>
          </div>
          <div className="overflow-x-auto w-full no-scrollbar">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#F7F1E8]/15 text-[#F7F1E8]/60 font-mono text-xs uppercase">
                  <th className="py-4 px-6 font-normal">Feature</th>
                  <th className="py-4 px-6 font-normal">Starter (₹7,999)</th>
                  <th className="py-4 px-6 font-normal text-[#F7F1E8] font-bold">Business (₹12,999)</th>
                  <th className="py-4 px-6 font-normal">Premium (₹19,999)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F1E8]/10 text-xs">
                <tr>
                  <td className="py-4 px-6 font-medium text-[#F7F1E8]">Number of pages</td>
                  <td className="py-4 px-6 text-[#F7F1E8]/80">1–5 sections (Single page)</td>
                  <td className="py-4 px-6 text-[#F7F1E8]/80">5–8 custom pages</td>
                  <td className="py-4 px-6 text-[#F7F1E8]/80">8–12 custom pages</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#F7F1E8]">SEO Depth</td>
                  <td className="py-4 px-6 text-[#F7F1E8]/80">Basic on-page</td>
                  <td className="py-4 px-6 text-[#F7F1E8]/80">On-page + Technical foundations</td>
                  <td className="py-4 px-6 text-[#F7F1E8]/80">Advanced SEO & Schema</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#F7F1E8]">GEO Content Structure</td>
                  <td className="py-4 px-6 text-[#F7F1E8]/50">—</td>
                  <td className="py-4 px-6 text-[#F7F1E8]">Included</td>
                  <td className="py-4 px-6 text-[#F7F1E8]">Included</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#F7F1E8]">Custom Logo</td>
                  <td className="py-4 px-6 text-[#F7F1E8]/80">Extra, from ₹1,500</td>
                  <td className="py-4 px-6 text-[#F7F1E8]/80">Extra, from ₹1,500</td>
                  <td className="py-4 px-6 text-[#F7F1E8] font-medium">Free custom logo</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#F7F1E8]">Admin Dashboard</td>
                  <td className="py-4 px-6 text-[#F7F1E8]/50">None</td>
                  <td className="py-4 px-6 text-[#F7F1E8]/80">Optional upgrade (₹4,999+)</td>
                  <td className="py-4 px-6 text-[#F7F1E8]">Basic included</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#F7F1E8]">Revision Rounds</td>
                  <td className="py-4 px-6 text-[#F7F1E8]">3 rounds</td>
                  <td className="py-4 px-6 text-[#F7F1E8]">3 rounds</td>
                  <td className="py-4 px-6 text-[#F7F1E8]">3 rounds + Priority review</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#F7F1E8]">Analytics & Search Console</td>
                  <td className="py-4 px-6 text-[#F7F1E8]/50">—</td>
                  <td className="py-4 px-6 text-[#F7F1E8]">Included</td>
                  <td className="py-4 px-6 text-[#F7F1E8]">Included + Event tracking</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 4. Services Grid ── */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#F7F1E8]/15">
        <div className="max-w-2xl mb-16">
          <p className="label-sm text-[#F7F1E8]/60 mb-2">Capabilities</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F7F1E8] mb-4">
            How we engineer web experiences
          </h2>
          <p className="font-sans text-sm text-[#F7F1E8]/80">
            Every studio site is bespoke, fast-loading, mobile-optimized, and built to the highest
            architectural standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceTiles.map((tile, i) => {
            const Icon = tile.icon;
            return (
              <SpotlightCard
                key={i}
                className="bg-[#C40000]/40 border border-[#F7F1E8]/15 rounded-xl p-8 hover:border-[#F7F1E8]/40 transition-colors"
                spotlightColor="rgba(247, 241, 232, 0.1)"
              >
                <div className="w-12 h-12 rounded-lg bg-[#F7F1E8]/10 border border-[#F7F1E8]/15 flex items-center justify-center mb-6 text-[#F7F1E8]">
                  <Icon size={22} />
                </div>
                <h3 className="font-serif text-2xl text-[#F7F1E8] mb-2">{tile.title}</h3>
                <p className="font-sans text-xs text-[#F7F1E8]/75 leading-relaxed">{tile.desc}</p>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      {/* ── 5. Add-ons Menu ── */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#F7F1E8]/15">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <p className="label-sm text-[#F7F1E8]/60 mb-2">Modular Upgrades</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#F7F1E8]">Add-ons Menu</h2>
          </div>
          <p className="font-sans text-xs text-[#F7F1E8]/70 max-w-xs">
            A la carte features to tailor your website to your precise operational needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addons.map((addon, i) => (
            <div
              key={i}
              className="border border-[#F7F1E8]/15 bg-[#B50000]/30 rounded-xl p-5 flex items-center justify-between hover:border-[#F7F1E8]/35 transition-colors"
            >
              <div>
                <p className="font-sans text-sm font-medium text-[#F7F1E8]">{addon.name}</p>
                <span className="font-mono text-[10px] text-[#F7F1E8]/50 uppercase tracking-wider">
                  {addon.category}
                </span>
              </div>
              <span className="font-mono text-sm font-bold text-[#F7F1E8] shrink-0 pl-4">
                {addon.price}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Monthly Maintenance ── */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#F7F1E8]/15">
        <div className="max-w-2xl mb-16">
          <p className="label-sm text-[#F7F1E8]/60 mb-2">Post-Launch Care</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F7F1E8] mb-4">
            Monthly Maintenance
          </h2>
          <p className="font-sans text-sm text-[#F7F1E8]/80">
            Keep your website updated, secure, and monitored without hiring a full-time webmaster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {maintenancePlans.map((plan) => (
            <div
              key={plan.id}
              className="border border-[#F7F1E8]/20 bg-[#B50000]/40 rounded-2xl p-8 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-serif text-2xl text-[#F7F1E8] mb-2">{plan.name}</h3>
                <p className="font-mono text-2xl font-bold text-[#F7F1E8] mb-6">{plan.price}</p>
                <ul className="space-y-3 mb-6">
                  {plan.includes.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#F7F1E8]/85">
                      <Check size={14} className="text-[#F7F1E8] shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {plan.note && (
                <p className="font-mono text-[11px] text-[#F7F1E8]/60 border-t border-[#F7F1E8]/15 pt-4">
                  {plan.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. How We Work (Timeline & Terms) ── */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#F7F1E8]/15">
        <div className="max-w-2xl mb-16">
          <p className="label-sm text-[#F7F1E8]/60 mb-2">Our Workflow</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F7F1E8] mb-4">
            How a project runs
          </h2>
          <p className="font-sans text-sm text-[#F7F1E8]/80">
            A linear, stress-free engagement with milestones designed for alignment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {[
            {
              step: "01",
              title: "Brief & Discovery",
              desc: "We confirm your goals, branding assets, content outline, and technical scope.",
            },
            {
              step: "02",
              title: "Design Approval",
              desc: "Interactive visual layouts presented for feedback. 3 revision rounds before code starts.",
            },
            {
              step: "03",
              title: "Engineering & SEO",
              desc: "Building the custom Next.js frontend, responsive styling, and technical SEO structure.",
            },
            {
              step: "04",
              title: "Handover & Go Live",
              desc: "Final testing on staging, DNS configuration, search console linking, and launch.",
            },
          ].map((item, idx) => (
            <div key={idx} className="border-l border-[#F7F1E8]/25 pl-6 py-2">
              <span className="font-mono text-xs text-[#F7F1E8]/60 tracking-wider">
                Step {item.step}
              </span>
              <h3 className="font-serif text-2xl text-[#F7F1E8] mt-2 mb-2">{item.title}</h3>
              <p className="font-sans text-xs text-[#F7F1E8]/75 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Payment Structure */}
        <div className="bg-[#B50000]/40 border border-[#F7F1E8]/20 rounded-2xl p-8 mb-12">
          <h3 className="font-serif text-2xl text-[#F7F1E8] mb-4">
            Transparent Payment Structure: 40 / 30 / 30
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#F7F1E8]/15 rounded-xl p-5 bg-[#C40000]/40">
              <span className="font-mono text-3xl font-bold text-[#F7F1E8]">40%</span>
              <p className="font-serif text-lg text-[#F7F1E8] mt-1">Upfront Deposit</p>
              <p className="font-sans text-xs text-[#F7F1E8]/70 mt-1">
                To reserve studio time and begin wireframing & initial discovery.
              </p>
            </div>
            <div className="border border-[#F7F1E8]/15 rounded-xl p-5 bg-[#C40000]/40">
              <span className="font-mono text-3xl font-bold text-[#F7F1E8]">30%</span>
              <p className="font-serif text-lg text-[#F7F1E8] mt-1">Design Sign-off</p>
              <p className="font-sans text-xs text-[#F7F1E8]/70 mt-1">
                Triggered once design layouts are approved before build begins.
              </p>
            </div>
            <div className="border border-[#F7F1E8]/15 rounded-xl p-5 bg-[#C40000]/40">
              <span className="font-mono text-3xl font-bold text-[#F7F1E8]">30%</span>
              <p className="font-serif text-lg text-[#F7F1E8] mt-1">Pre-Deployment</p>
              <p className="font-sans text-xs text-[#F7F1E8]/70 mt-1">
                Paid after QA sign-off, immediately prior to DNS switch and handover.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Strip */}
        <div className="p-6 border border-[#F7F1E8]/20 rounded-xl bg-[#6E0000]/40 text-xs font-mono text-[#F7F1E8]/80 leading-relaxed">
          <span className="font-bold text-[#F7F1E8] uppercase tracking-wider block mb-1">
            Terms of engagement:
          </span>
          Domain and hosting are charged separately and the domain is registered in the
          client&apos;s name · Design is approved before the full build · New features or major
          changes cost extra · Advanced security, compliance and penetration testing need a separate
          agreement · Payment 40% upfront, 30% after design approval, 30% before deployment and
          handover.
        </div>
      </section>

      {/* ── 8. FAQ ── */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto border-t border-[#F7F1E8]/15">
        <div className="text-center mb-16">
          <p className="label-sm text-[#F7F1E8]/60 mb-2">Clarity & Details</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F7F1E8]">Frequently Asked Questions</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-[#F7F1E8]/20 bg-[#B50000]/30 rounded-xl px-6 data-[state=open]:border-[#F7F1E8]/40"
            >
              <AccordionTrigger className="font-serif text-xl text-[#F7F1E8] hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-sans text-xs text-[#F7F1E8]/80 leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── Optional Proof (hidden unless SHOW_PROOF is true) ── */}
      <Proof />

      {/* ── 10. CTA Band ── */}
      <section className="py-24 px-6 md:px-12 bg-[#C40000] border-t border-[#F7F1E8]/20 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="label-sm text-[#F7F1E8]/60 mb-4">Start your build</p>
          <h2 className="font-serif text-4xl md:text-7xl text-[#F7F1E8] mb-6">
            Ready to build a website that performs?
          </h2>
          <p className="font-sans text-sm md:text-base text-[#F7F1E8]/85 max-w-xl mx-auto mb-10 leading-relaxed">
            Get in touch directly with our Website Division. We respond on WhatsApp, usually within
            the working day.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a
              href={websiteWa}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F7F1E8] text-[#E60000] px-8 py-4 font-sans font-semibold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-xl hover:scale-105"
            >
              WhatsApp: {SITE.websiteDivision.phoneDisplay}
            </a>
            <Link
              href="/websites/enquiry"
              className="border border-[#F7F1E8]/50 text-[#F7F1E8] px-8 py-4 font-sans font-semibold text-xs uppercase tracking-wider hover:bg-[#F7F1E8]/10 transition-colors"
            >
              Submit an enquiry
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-[#F7F1E8]/60">
            <span>Direct: {SITE.websiteDivision.email}</span>
            <span>Studio: {SITE.commonEmail}</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
