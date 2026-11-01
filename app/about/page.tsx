import { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SITE, makeWhatsAppUrl } from "@/lib/site";
import { Logo } from "@/components/shared/Logo";
import {
  ShieldAlert,
  CheckCircle2,
  Lock,
  Search,
  Sparkles,
  ArrowRight,
  Phone,
  MessageSquare,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About built2host — Honest Freelance Studio",
  description:
    "We build fast, secure, search-ready websites and real estate automations. Clear scope, fixed pricing, and no false promises.",
};

const projectSteps = [
  { num: "01", title: "Briefing", desc: "Clarify core targets, branding assets, and technical boundary." },
  { num: "02", title: "Quotation", desc: "Fixed cost agreed in writing. 40% upfront deposit to begin." },
  { num: "03", title: "Design", desc: "Interactive layouts created. 3 structured revision rounds." },
  { num: "04", title: "Approval", desc: "Design sign-off before code build starts. 30% milestone paid." },
  { num: "05", title: "Engineering", desc: "Clean TypeScript build, responsive checks, and SEO setup." },
  { num: "06", title: "Handover", desc: "Final QA, DNS launch, and documentation. Final 30% balance." },
];

export default function AboutPage() {
  const websiteWa = makeWhatsAppUrl(
    SITE.websiteDivision.whatsapp,
    "Hi built2host! I'd like to talk about a website."
  );
  const automationWa = makeWhatsAppUrl(
    SITE.automationDivision.whatsapp,
    "Hi built2host! I'd like to discuss an automation project."
  );

  return (
    <main className="bg-[#E60000] text-[#F7F1E8] min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-16 md:pb-20 px-5 sm:px-6 md:px-12 max-w-5xl mx-auto">
        <Logo
          variant="lockup"
          tone="cream"
          width={180}
          priority
          className="w-36 md:w-48 mb-6 md:mb-8"
        />
        <p className="label-sm text-[#F7F1E8]/70 mb-3 tracking-widest uppercase">
          Studio Philosophy &amp; Practice
        </p>
        <h1
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[#F7F1E8] leading-tight mb-6 md:mb-8"
        >
          You imagine it. We build it.
        </h1>
        <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#F7F1E8]/90 font-light max-w-3xl leading-relaxed">
          built2host is a boutique freelance studio building fast, secure, search-ready websites and
          the real estate automations that prevent enquiries from slipping away.
        </p>
      </section>

      {/* Two Divisions Architecture */}
      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#F7F1E8]/15">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-[#C40000]/60 border border-[#F7F1E8]/20 rounded-2xl p-8 backdrop-blur-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-[#F7F1E8]/50 block mb-2">
              Division 01
            </span>
            <h2 className="font-serif text-3xl text-[#F7F1E8] mb-4">Websites Practice</h2>
            <p className="font-sans text-sm text-[#F7F1E8]/80 leading-relaxed mb-6">
              We design and engineer bespoke web presences for freelancers, personal brands, small
              businesses, and commercial operations. Every site is built on modern Next.js
              architecture with responsive layouts, fast load speeds, and semantic search
              foundations.
            </p>
            <Link
              href="/websites"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#F7F1E8] hover:underline"
            >
              <span>Explore Website Packages</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="bg-[#6E0000]/60 border border-[#F7F1E8]/20 rounded-2xl p-8 backdrop-blur-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-[#F7F1E8]/50 block mb-2">
              Division 02
            </span>
            <h2 className="font-serif text-3xl text-[#F7F1E8] mb-4">Automation Practice</h2>
            <p className="font-sans text-sm text-[#F7F1E8]/80 leading-relaxed mb-6">
              We engineer conversational capture and routing engines for real estate teams. From
              instant WhatsApp qualification to missed-call recovery and property portal lead
              normalisation, our systems capture key buyer criteria and dispatch alerts directly to
              sales agents.
            </p>
            <Link
              href="/automation"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#F7F1E8] hover:underline"
            >
              <span>Explore Automation Systems</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#F7F1E8]/15">
        <div className="max-w-2xl mb-12">
          <p className="label-sm text-[#F7F1E8]/60 mb-2">Partnerships</p>
          <h2 className="font-serif text-4xl text-[#F7F1E8] mb-4">Who we work with</h2>
          <p className="font-sans text-sm text-[#F7F1E8]/80 leading-relaxed">
            We intentionally focus on client segments where clean digital engineering produces
            immediate, measurable clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {[
            {
              title: "Individuals & Freelancers",
              desc: "Showcase portfolio work, writing, and services with a tailored presence that reflects authentic craft.",
            },
            {
              title: "Small Businesses & Local Brands",
              desc: "Replace clunky templates with fast, search-ready websites that establish immediate local trust.",
            },
            {
              title: "Real Estate Agencies & Developers",
              desc: "Eliminate lead decay with automated WhatsApp, telephony, and portal qualification workflows.",
            },
            {
              title: "Independent Brokers & Sales Teams",
              desc: "Empower agents with structured buyer briefs so they only spend time on qualified conversations.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="border border-[#F7F1E8]/15 bg-[#B50000]/30 rounded-xl p-6"
            >
              <h3 className="font-serif text-2xl text-[#F7F1E8] mb-2">{item.title}</h3>
              <p className="font-sans text-xs text-[#F7F1E8]/75 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#F7F1E8]/15">
        <div className="max-w-2xl mb-12">
          <p className="label-sm text-[#F7F1E8]/60 mb-2">Principles</p>
          <h2 className="font-serif text-4xl text-[#F7F1E8] mb-4">What makes us different</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-[#F7F1E8]/15 bg-[#B50000]/40 rounded-xl p-6">
            <span className="font-mono text-xs text-[#F7F1E8]/60 uppercase tracking-widest block mb-2">
              01 &middot; Pricing
            </span>
            <h3 className="font-serif text-2xl text-[#F7F1E8] mb-2">Affordable Fixed Pricing</h3>
            <p className="font-sans text-xs text-[#F7F1E8]/80 leading-relaxed">
              We publish our packages and add-ons publicly. No inflated corporate quotes or hidden
              fees. Scope is defined upfront.
            </p>
          </div>

          <div className="border border-[#F7F1E8]/15 bg-[#B50000]/40 rounded-xl p-6">
            <span className="font-mono text-xs text-[#F7F1E8]/60 uppercase tracking-widest block mb-2">
              02 &middot; Engineering
            </span>
            <h3 className="font-serif text-2xl text-[#F7F1E8] mb-2">Secure &amp; Fast by Default</h3>
            <p className="font-sans text-xs text-[#F7F1E8]/80 leading-relaxed">
              Zero heavy website builders. We engineer in Next.js, enforcing TLS encryption, Content
              Security Policies, and minimal client JavaScript.
            </p>
          </div>

          <div className="border border-[#F7F1E8]/15 bg-[#B50000]/40 rounded-xl p-6">
            <span className="font-mono text-xs text-[#F7F1E8]/60 uppercase tracking-widest block mb-2">
              03 &middot; Discoverability
            </span>
            <h3 className="font-serif text-2xl text-[#F7F1E8] mb-2">Search-Ready From Day One</h3>
            <p className="font-sans text-xs text-[#F7F1E8]/80 leading-relaxed">
              Structured metadata, canonical URLs, and schema markup are built right into the code
              rather than patched on as afterthoughts.
            </p>
          </div>
        </div>
      </section>

      {/* How a Project Runs (6-Step Strip) */}
      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#F7F1E8]/15">
        <div className="max-w-2xl mb-12">
          <p className="label-sm text-[#F7F1E8]/60 mb-2">Operational Method</p>
          <h2 className="font-serif text-4xl text-[#F7F1E8] mb-4">How a project runs</h2>
          <p className="font-sans text-sm text-[#F7F1E8]/80">
            A milestone-based engagement ensuring total mutual clarity before delivery.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {projectSteps.map((step) => (
            <div
              key={step.num}
              className="border border-[#F7F1E8]/15 bg-[#800000]/40 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-bold text-[#F83F41]">{step.num}</span>
                <h3 className="font-serif text-lg text-[#F7F1E8] mt-1 mb-2">{step.title}</h3>
              </div>
              <p className="font-sans text-[11px] text-[#F7F1E8]/70 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What We Will Not Promise (Honest Boundaries) */}
      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#F7F1E8]/15">
        <div className="border border-[#F83F41]/30 bg-[#540000]/70 rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert size={24} className="text-[#F83F41]" />
            <h2 className="font-serif text-3xl text-[#F7F1E8]">What we will not promise</h2>
          </div>

          <div className="space-y-4 font-sans text-xs text-[#F7F1E8]/80 leading-relaxed max-w-3xl">
            <p>
              We believe in honest craft over agency marketing rhetoric. We will never promise:
            </p>
            <ul className="space-y-2.5 pl-2">
              <li className="flex items-start gap-2">
                <span className="text-[#F83F41] font-bold">&times;</span>
                <span>
                  <strong>Guaranteed #1 Google Rankings:</strong> Search algorithm behavior is
                  proprietary and dynamic. We promise proper semantic structure and best practices;
                  we cannot guarantee rankings.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F83F41] font-bold">&times;</span>
                <span>
                  <strong>Unlimited Changes or Revisions:</strong> Every package includes 3
                  structured revision rounds within the agreed scope. Out-of-scope additions are
                  quoted transparently.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F83F41] font-bold">&times;</span>
                <span>
                  <strong>Guaranteed Sales or Conversion Rates:</strong> Our automation captures,
                  qualifies, and organizes leads instantly; your sales team still owns closing the
                  transaction.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F83F41] font-bold">&times;</span>
                <span>
                  <strong>Complete Immunity from Third-Party Downtime:</strong> Cloud hosts, Meta
                  WhatsApp APIs, and telephony vendors occasionally experience outages outside our
                  control.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Both Division Contact Blocks */}
      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#F7F1E8]/15">
        <h2 className="font-serif text-3xl text-[#F7F1E8] mb-8 text-center">Get in Touch</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Website Contact */}
          <div className="border border-[#F7F1E8]/20 bg-[#C40000]/60 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <p className="label-sm text-[#F7F1E8]/60 mb-2">Websites Division</p>
              <p className="font-serif text-2xl text-[#F7F1E8] mb-4">Naresh Kumar</p>
              <div className="space-y-2 text-xs font-mono text-[#F7F1E8]/80 mb-6">
                <p>Phone: +91 {SITE.websiteDivision.phoneDisplay}</p>
                <p>Email: {SITE.websiteDivision.email}</p>
                <p className="text-[11px] opacity-60">Enquiries: {SITE.commonEmail}</p>
              </div>
            </div>

            <a
              href={websiteWa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#F7F1E8] text-[#E60000] py-3 px-6 rounded font-sans font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
            >
              <MessageSquare size={14} />
              <span>WhatsApp Websites Desk</span>
            </a>
          </div>

          {/* Automation Contact */}
          <div className="border border-[#F7F1E8]/20 bg-[#6E0000]/60 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs text-[#F7F1E8]/60 mb-2 uppercase tracking-wider">
                Automation Division
              </p>
              <p className="font-serif text-2xl text-[#F7F1E8] mb-4">Ajay Surya</p>
              <div className="space-y-2 text-xs font-mono text-[#F7F1E8]/80 mb-6">
                <p>Phone: +91 {SITE.automationDivision.phoneDisplay}</p>
                <p>Email: {SITE.automationDivision.email}</p>
                <p className="text-[11px] opacity-60">Enquiries: {SITE.commonEmail}</p>
              </div>
            </div>

            <a
              href={automationWa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#F7F1E8] text-[#6E0000] py-3 px-6 rounded font-sans font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
            >
              <MessageSquare size={14} />
              <span>WhatsApp Automation Desk</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
