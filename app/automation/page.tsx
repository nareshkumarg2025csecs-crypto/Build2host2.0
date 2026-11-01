import { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { automationServices, pipelineSteps } from "@/data/automation";
import { SITE, makeWhatsAppUrl } from "@/lib/site";
import { SpotlightCard } from "@/components/shared/SpotlightCard";
import { WorkflowDemo } from "@/components/sections/WorkflowDemo";
import {
  ArrowRight,
  Check,
  AlertTriangle,
  Layers,
  PhoneCall,
  MessageSquare,
  Globe,
  Bot,
  Sparkles,
  ClipboardCheck,
  Shield,
  Clock,
  UserCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Automation — Real Estate Lead Capture & Qualification",
  description:
    "WhatsApp AI qualification, missed-call recovery, and portal integrations for real estate teams. Respond before leads go cold.",
};

const leadFieldsData = [
  {
    category: "Lead Identity",
    fields: "Prospect Name, WhatsApp/Phone Number, Timestamp, Inbound Channel Source",
    purpose: "Establishes unique contact key and channel attribution",
  },
  {
    category: "Requirement Scope",
    fields: "Micro-Market / Location, Configuration (BHK), Property Type (Villa/Apt/Plot), Buy or Rent",
    purpose: "Filters immediate inventory match criteria",
  },
  {
    category: "Commercial Fit",
    fields: "Target Budget Range, Funding Mode (Self / Pre-approved Loan), Purchase Timeline (e.g. 60 days)",
    purpose: "Prioritizes high-intent buyers for senior advisors",
  },
  {
    category: "Pipeline & Routing",
    fields: "Assigned Property Agent, Lead Status (New, Qualified, Contacted), Escalation Flags",
    purpose: "Eliminates duplicate outreach and tracks team response times",
  },
  {
    category: "Consent & Audit",
    fields: "Opt-In Proof Timestamp, Full Transcript Log, Human Handover Confirmation",
    purpose: "Maintains regulatory compliance and conversation history",
  },
];

const checklistItems = [
  "Verified business name, trading entity & company profile",
  "Dedicated WhatsApp Business phone number & Meta Business Manager access",
  "Approved sales scripts, qualifying rules & standard FAQs",
  "Agreed service areas, micro-markets & project portfolio scope",
  "Target lead capture fields & data schema preferences",
  "Designated agent notification destinations (WhatsApp, Telegram, or email)",
  "Google Sheet owner account with edit permissions",
  "Property portal credentials or authorized email parser forwarding rules",
  "Telephony provider / virtual number account (for missed-call & voice flows)",
  "Designated internal escalation manager & operational point of contact",
];

export default function AutomationPage() {
  const automationWa = makeWhatsAppUrl(
    SITE.automationDivision.whatsapp,
    "Hi built2host! I'd like to book a demo of your real estate automation system."
  );

  return (
    <main className="bg-[#6E0000] text-[#F7F1E8] min-h-screen selection:bg-[#F7F1E8] selection:text-[#6E0000]">
      <Nav />

      {/* Grid overlay for technical system look */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(247,241,232,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(247,241,232,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      {/* ── 1. Hero ── */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 px-5 sm:px-6 md:px-12 max-w-7xl mx-auto flex flex-col justify-end min-h-[70svh] md:min-h-[85vh]">
        <div className="max-w-4xl relative z-10">
          <p className="font-mono text-xs text-[#F7F1E8]/60 mb-3 md:mb-4 tracking-widest uppercase">
            Division 02 &mdash; Systems &amp; Automation
          </p>
          <h1
            className="font-serif text-[#F7F1E8] leading-[1.0] md:leading-[0.95] tracking-tight mb-6 md:mb-8"
            style={{ fontSize: "clamp(2.2rem, 6.5vw, 7.5rem)" }}
          >
            Respond to every property enquiry before it goes cold.
          </h1>
          <p className="font-mono text-sm md:text-base text-[#F7F1E8]/80 max-w-2xl font-light mb-8 md:mb-10 leading-relaxed">
            WhatsApp, missed-call, property-portal and AI voice automations that capture buyer
            requirements, organise leads and alert your real-estate team, so your agents can focus
            on conversations that matter.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link
              href="/automation/enquiry"
              className="bg-[#F7F1E8] text-[#6E0000] px-7 py-3.5 md:px-8 md:py-4 font-sans font-semibold text-xs md:text-sm uppercase tracking-wider text-center min-h-[48px] flex items-center justify-center hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Book a Demo
            </Link>
            <a
              href="#services"
              className="border border-[#F7F1E8]/30 hover:border-[#F7F1E8] text-[#F7F1E8] px-7 py-3.5 md:px-8 md:py-4 font-sans font-semibold text-xs md:text-sm uppercase tracking-wider text-center min-h-[48px] flex items-center justify-center transition-all hover:bg-[#F7F1E8]/10"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. Problem & Solution ── */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#F7F1E8]/15 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-mono text-xs text-[#F83F41] uppercase tracking-wider mb-2">
              The Reality of Real Estate Lead Decay
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-[#F7F1E8] mb-6">
              Enquiries don&apos;t wait for office hours.
            </h2>
            <div className="space-y-4 font-sans text-sm text-[#F7F1E8]/80 leading-relaxed">
              <p>
                Property enquiries routinely arrive outside working hours or while agents are on
                calls and site visits. A delay of 30 minutes in acknowledging a buyer can mean a lost
                opportunity as they move on to the next listing.
              </p>
              <p>
                Manual follow-ups lead to unlogged contacts, disjointed WhatsApp chats on personal
                phones, and zero pipeline visibility for agency founders.
              </p>
            </div>
          </div>

          <div className="border border-[#F7F1E8]/20 bg-[#540000]/60 rounded-2xl p-8 backdrop-blur-sm">
            <p className="font-mono text-xs text-emerald-400 uppercase tracking-wider mb-2">
              The Connected Response Solution
            </p>
            <h3 className="font-serif text-2xl text-[#F7F1E8] mb-4">
              Instant engagement, zero missed details.
            </h3>
            <p className="font-sans text-sm text-[#F7F1E8]/80 leading-relaxed mb-6">
              Our automated pipelines acknowledge incoming enquiries in seconds, guide prospects
              conversationally to extract location, BHK, budget, and possession timeline, and log
              a clean summary to your Google Sheet or CRM before alerting the right agent.
            </p>
            <div className="border-t border-[#F7F1E8]/15 pt-4 flex items-center justify-between text-xs font-mono text-[#F7F1E8]/60">
              <span>Avg acknowledgment: &lt; 15 seconds</span>
              <span className="text-emerald-400">Structured Data Handoff &check;</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Live Interactive Workflow Demo ── */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#F7F1E8]/15 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="font-mono text-xs text-[#F7F1E8]/60 mb-2 uppercase tracking-widest">
            Architecture in Action
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F7F1E8] mb-4">
            Live Workflow Simulation
          </h2>
          <p className="font-sans text-sm text-[#F7F1E8]/80">
            See how an unstructured buyer text is automatically transformed into a normalized record
            and team dispatch alert.
          </p>
        </div>

        <WorkflowDemo />
      </section>

      {/* ── 4. Five Services ── */}
      <section id="services" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#F7F1E8]/15 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <p className="font-mono text-xs text-[#F7F1E8]/60 mb-2 uppercase tracking-widest">
              Standardized Modular Implementations
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#F7F1E8]">
              Automation Services
            </h2>
          </div>
          <p className="font-mono text-xs text-[#F7F1E8]/70 max-w-xs">
            Fixed one-time implementation pricing for defined starter scopes.
          </p>
        </div>

        <div className="space-y-8">
          {automationServices.map((service) => {
            const isSuite = service.id === "complete-suite";
            return (
              <SpotlightCard
                key={service.id}
                className={`border rounded-2xl p-8 md:p-12 transition-all ${
                  isSuite
                    ? "bg-[#800000]/70 border-[#F7F1E8] shadow-2xl"
                    : "bg-[#540000]/50 border-[#F7F1E8]/20 hover:border-[#F7F1E8]/40"
                }`}
                spotlightColor="rgba(247, 241, 232, 0.12)"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left: Identifier & Price */}
                  <div className="lg:col-span-3">
                    <span className="font-mono text-4xl md:text-5xl font-bold text-[#F7F1E8]/30">
                      {service.number}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-[#F7F1E8] mt-2 mb-2">
                      {service.name}
                    </h3>
                    <div className="mt-4">
                      <span className="font-mono text-3xl font-bold text-[#F7F1E8]">
                        ₹{service.priceDisplay}
                      </span>
                      {isSuite && (
                        <span className="block font-mono text-[11px] text-[#F97B7E] mt-1">
                          Bundle saving of ₹1,796
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle: Description & Bullets */}
                  <div className="lg:col-span-6 space-y-4">
                    <p className="font-sans text-sm text-[#F7F1E8]/90 font-medium">
                      {service.outcome}
                    </p>
                    <p className="font-sans text-xs text-[#F7F1E8]/75 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="pt-2">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[#F7F1E8]/50 mb-2">
                        Deliverables:
                      </p>
                      <ul className="space-y-2">
                        {service.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-[#F7F1E8]/85 font-sans">
                            <Check size={14} className="text-[#F83F41] shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-[#F7F1E8]/10 text-xs font-mono text-[#F7F1E8]/70">
                      <span className="text-[#F7F1E8] font-bold">Scope:</span> {service.scope}
                    </div>

                    {service.consentNote && (
                      <div className="p-3 bg-[#3B0000] border border-[#F83F41]/30 rounded-lg text-[11px] font-mono text-[#F97B7E] flex items-start gap-2">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                        <span>{service.consentNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: CTA Button */}
                  <div className="lg:col-span-3 flex lg:justify-end">
                    <Link
                      href={`/automation/enquiry?service=${service.id}`}
                      className="w-full lg:w-auto text-center border border-[#F7F1E8]/40 hover:border-[#F7F1E8] bg-[#F7F1E8] text-[#6E0000] hover:bg-white px-6 py-3.5 rounded font-sans font-semibold text-xs uppercase tracking-wider transition-all"
                    >
                      Enquire for this service
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      {/* ── 5. How It Works: The 6-Step Pipeline ── */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#F7F1E8]/15 relative z-10">
        <div className="max-w-2xl mb-16">
          <p className="font-mono text-xs text-[#F7F1E8]/60 mb-2 uppercase tracking-widest">
            Pipeline Architecture
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F7F1E8] mb-4">
            How the six-step pipeline works
          </h2>
          <p className="font-sans text-sm text-[#F7F1E8]/80 leading-relaxed">
            The agent contacts the prospect, updates status and owns the sale; automation supports
            the team, it does not close the deal.
          </p>
        </div>

        {/* Mobile vertical timeline & desktop grid */}
        <div className="relative">
          {/* Vertical line indicator on mobile */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[#F83F41]/30 md:hidden" aria-hidden="true" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {pipelineSteps.map((step) => (
              <div
                key={step.number}
                className="border border-[#F7F1E8]/15 bg-[#540000]/40 rounded-2xl p-6 relative overflow-hidden pl-12 md:pl-6"
              >
                {/* Mobile timeline marker */}
                <div className="absolute left-4 top-7 w-4 h-4 rounded-full bg-[#E60000] border-2 border-[#F7F1E8] md:hidden" aria-hidden="true" />

                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-bold text-[#F83F41]">
                    {step.number}
                  </span>
                  <span className="font-mono text-[10px] text-[#F7F1E8]/40 uppercase tracking-widest">
                    Phase
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-[#F7F1E8] mb-2">{step.label}</h3>
                <p className="font-sans text-xs text-[#F7F1E8]/75 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Lead Fields Table ── */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#F7F1E8]/15 relative z-10">
        <div className="max-w-2xl mb-16">
          <p className="font-mono text-xs text-[#F7F1E8]/60 mb-2 uppercase tracking-widest">
            Data Schema
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F7F1E8] mb-4">
            Normalized Lead Fields
          </h2>
          <p className="font-sans text-sm text-[#F7F1E8]/80">
            Standard properties captured and structured across all conversational touchpoints.
          </p>
        </div>

        <div className="border border-[#F7F1E8]/20 rounded-2xl overflow-hidden bg-[#540000]/30 backdrop-blur-sm">
          <div className="p-4 border-b border-[#F7F1E8]/10 md:hidden flex items-center justify-between">
            <span className="font-mono text-[11px] text-[#F7F1E8]/60">Lead Schema Details</span>
            <span className="font-mono text-[11px] text-[#F7F1E8]/60 flex items-center gap-1">
              Scroll horizontally &rarr;
            </span>
          </div>
          <div className="overflow-x-auto w-full no-scrollbar">
            <table className="w-full min-w-[540px] text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#F7F1E8]/15 text-[#F7F1E8]/50 uppercase tracking-wider">
                  <th className="py-4 px-6 font-medium">Category</th>
                  <th className="py-4 px-6 font-medium">Extracted Data Fields</th>
                  <th className="py-4 px-6 font-medium">Operational Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F1E8]/10 text-xs">
                {leadFieldsData.map((row, i) => (
                  <tr key={i} className="hover:bg-[#F7F1E8]/5 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#F7F1E8]">{row.category}</td>
                    <td className="py-4 px-6 text-[#F7F1E8]/85 font-sans">{row.fields}</td>
                    <td className="py-4 px-6 text-[#F7F1E8]/70 font-sans">{row.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 7. Operational Boundaries (Honest Panel) ── */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#F7F1E8]/15 relative z-10">
        <div className="border border-[#F83F41]/30 bg-[#3B0000]/80 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-[#F83F41]" size={24} />
            <h3 className="font-serif text-2xl md:text-3xl text-[#F7F1E8]">
              Operational Boundaries &amp; Integrity Policy
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans text-xs text-[#F7F1E8]/80 leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong className="text-[#F7F1E8] font-mono uppercase block mb-1">
                  1. The Human Owns the Sale:
                </strong>
                The agent must respond swiftly after an alert is delivered. Automation qualifies
                and structures intent; it does not replace the relationship-building and closing
                expertise of your agents.
              </p>
              <p>
                <strong className="text-[#F7F1E8] font-mono uppercase block mb-1">
                  2. AI Fallback Guarantee:
                </strong>
                Our AI assistants are explicitly instructed never to hallucinate inventory, pricing,
                legal title status, or availability. Unknown queries trigger an automated handover
                to the human agent.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                <strong className="text-[#F7F1E8] font-mono uppercase block mb-1">
                  3. Authorized Integrations Only:
                </strong>
                Property portal integrations utilize official APIs, webhooks, or authorized email
                notifications. We never deploy illegal scrapers or bypass third-party access controls.
              </p>
              <p>
                <strong className="text-[#F7F1E8] font-mono uppercase block mb-1">
                  4. Third-Party Network Dependencies:
                </strong>
                Performance and uptime are subject to vendor network stability (Meta WhatsApp API,
                telephony carriers, Google Cloud). We build retry queues to protect data integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Before We Build Checklist ── */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#F7F1E8]/15 relative z-10">
        <div className="max-w-2xl mb-16">
          <p className="font-mono text-xs text-[#F7F1E8]/60 mb-2 uppercase tracking-widest">
            Prerequisites
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F7F1E8] mb-4">
            Before we build (Checklist)
          </h2>
          <p className="font-sans text-sm text-[#F7F1E8]/80">
            We work on a least-privilege access model. Credentials and permissions are utilized
            solely during configuration and removed after setup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklistItems.map((item, i) => (
            <div
              key={i}
              className="border border-[#F7F1E8]/15 bg-[#540000]/40 rounded-xl p-4 flex items-start gap-3 text-xs font-mono text-[#F7F1E8]/85"
            >
              <span className="font-bold text-[#F83F41] shrink-0">{i + 1 < 10 ? `0${i + 1}` : i + 1}.</span>
              <span className="font-sans leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9. Pricing Basis Banner ── */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="bg-[#3B0000] border border-[#F7F1E8]/20 rounded-xl p-6 text-center max-w-4xl mx-auto font-mono text-xs text-[#F7F1E8]/80 leading-relaxed">
          <span className="font-bold text-[#F7F1E8] uppercase tracking-wider block mb-1">
            Implementation Pricing Basis:
          </span>
          Prices are one-time implementation fees for a defined starter scope. WhatsApp/Meta, AI
          model, telephony, hosting, Google and other third-party usage charges are not included.
          GST, where applicable, is additional.
        </div>
      </section>

      {/* ── 10. CTA Band ── */}
      <section className="py-24 px-6 md:px-12 bg-[#540000] border-t border-[#F7F1E8]/20 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-xs text-[#F7F1E8]/60 mb-4 uppercase tracking-widest">
            Get Started
          </p>
          <h2 className="font-serif text-4xl md:text-7xl text-[#F7F1E8] mb-6">
            Stop losing qualified property leads.
          </h2>
          <p className="font-sans text-sm md:text-base text-[#F7F1E8]/85 max-w-xl mx-auto mb-10 leading-relaxed">
            Schedule a 15-minute live walkthrough on your actual WhatsApp flow.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a
              href={automationWa}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F7F1E8] text-[#6E0000] px-8 py-4 font-sans font-semibold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-xl hover:scale-105"
            >
              Book a Demo: {SITE.automationDivision.phoneDisplay}
            </a>
            <Link
              href="/automation/enquiry"
              className="border border-[#F7F1E8]/50 text-[#F7F1E8] px-8 py-4 font-sans font-semibold text-xs uppercase tracking-wider hover:bg-[#F7F1E8]/10 transition-colors"
            >
              Service Enquiry Form
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-[#F7F1E8]/60">
            <span>Direct: {SITE.automationDivision.email}</span>
            <span>Studio: {SITE.commonEmail}</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
