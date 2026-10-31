"use client";

import React from "react";
import { packages, addons, maintenancePlans } from "@/data/websites";
import { automationServices, pipelineSteps } from "@/data/automation";
import { SITE } from "@/lib/site";
import { Printer } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export default function CatalogPrintPage() {
  return (
    <div className="bg-[#E60000] text-[#F7F1E8] min-h-screen p-8 md:p-14 print:p-0 print:bg-white print:text-black">
      {/* Top action bar (hidden on print) */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between print:hidden">
        <p className="font-mono text-xs opacity-70">
          Print preview &mdash; Use browser print to save as A4 PDF
        </p>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-[#F7F1E8] text-[#E60000] px-5 py-2.5 rounded font-sans font-bold text-xs uppercase tracking-wider hover:bg-white shadow"
        >
          <Printer size={14} />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-16 print:space-y-0">
        {/* ── Page 1: Cover ── */}
        <div className="min-h-[90vh] flex flex-col justify-between p-12 border border-[#F7F1E8]/20 rounded-3xl bg-[#C40000] print:border-none print:rounded-none print:min-h-screen print:page-break-after-always">
          <div>
            <Logo
              variant="lockup"
              tone="cream"
              width={220}
              priority
              className="w-48 mb-8"
            />
            <p className="font-mono text-xs uppercase tracking-widest text-[#F7F1E8]/60 mb-2">
              Studio Catalogue &middot; 2025 Edition
            </p>
            <h1 className="font-serif text-5xl md:text-7xl text-[#F7F1E8] max-w-xl leading-tight">
              You imagine it. We build it.
            </h1>
          </div>

          <div className="space-y-6 border-t border-[#F7F1E8]/20 pt-8 font-mono text-xs text-[#F7F1E8]/80">
            <p className="font-sans text-sm text-[#F7F1E8]/90 max-w-lg">
              built2host is a boutique freelance studio operating two specialized practices:
              editorial, search-ready Websites and high-velocity Real Estate Automation.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold text-[#F7F1E8]">Websites Division</p>
                <p>Tel: +91 {SITE.websiteDivision.phoneDisplay}</p>
                <p>Email: {SITE.websiteDivision.email}</p>
              </div>
              <div>
                <p className="font-bold text-[#F7F1E8]">Automation Division</p>
                <p>Tel: +91 {SITE.automationDivision.phoneDisplay}</p>
                <p>Email: {SITE.automationDivision.email}</p>
              </div>
            </div>
            <p className="text-[11px] opacity-60">General Enquiries: {SITE.commonEmail} &middot; {SITE.domain}</p>
          </div>
        </div>

        {/* ── Page 2: Websites Division ── */}
        <div className="p-12 border border-[#F7F1E8]/20 rounded-3xl bg-[#B50000]/60 print:border-none print:rounded-none print:min-h-screen print:page-break-after-always">
          <p className="font-mono text-xs uppercase tracking-widest text-[#F7F1E8]/60 mb-2">
            Practice 01
          </p>
          <h2 className="font-serif text-4xl text-[#F7F1E8] mb-6">Website Engineering Packages</h2>

          <div className="space-y-6 mb-8">
            {packages.map((pkg) => (
              <div key={pkg.id} className="border border-[#F7F1E8]/20 p-5 rounded-xl bg-[#800000]/40">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-serif text-2xl text-[#F7F1E8]">{pkg.name}</h3>
                  <span className="font-mono text-xl font-bold">₹{pkg.priceDisplay}</span>
                </div>
                <p className="font-sans text-xs text-[#F7F1E8]/80 mb-3">{pkg.bestFor}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#F7F1E8]/70">
                  <p>Scope: {pkg.size}</p>
                  <p>SEO: {pkg.seo}</p>
                  <p>GEO: {pkg.geo ? "Included" : "None"}</p>
                  <p>Revisions: 3 rounds</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#F7F1E8]/20 pt-6">
            <h4 className="font-serif text-xl mb-3">Modular Add-ons Sample</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#F7F1E8]/80">
              {addons.slice(0, 8).map((a, i) => (
                <div key={i} className="flex justify-between border-b border-[#F7F1E8]/10 py-1">
                  <span>{a.name}</span>
                  <span className="font-bold">{a.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Page 3: Automation Division ── */}
        <div className="p-12 border border-[#F7F1E8]/20 rounded-3xl bg-[#6E0000] print:border-none print:rounded-none print:min-h-screen print:page-break-after-always">
          <p className="font-mono text-xs uppercase tracking-widest text-[#F7F1E8]/60 mb-2">
            Practice 02
          </p>
          <h2 className="font-serif text-4xl text-[#F7F1E8] mb-6">Real Estate Automation</h2>

          <div className="space-y-4 mb-8">
            {automationServices.map((svc) => (
              <div key={svc.id} className="border border-[#F7F1E8]/20 p-4 rounded-xl bg-[#540000]/50">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-serif text-lg text-[#F7F1E8]">
                    {svc.number} {svc.name}
                  </h3>
                  <span className="font-mono text-base font-bold">₹{svc.priceDisplay}</span>
                </div>
                <p className="font-sans text-xs text-[#F7F1E8]/80 mt-1">{svc.outcome}</p>
                <p className="font-mono text-[11px] text-[#F7F1E8]/60 mt-1">Scope: {svc.scope}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-[#F7F1E8]/20 pt-6 font-mono text-xs text-[#F7F1E8]/80">
            <p className="font-bold text-[#F7F1E8] uppercase tracking-wider mb-2">
              The 6-Step Automated Pipeline:
            </p>
            <p className="text-[11px] leading-relaxed">
              01 Receive &rarr; 02 Respond &rarr; 03 Qualify &rarr; 04 Structure &rarr; 05 Hand off
              &rarr; 06 Follow through.
            </p>
            <p className="mt-4 text-[11px] text-[#F97B7E]">
              Operational Notice: The agent owns the relationship; automation captures and
              qualifies intent. No AI hallucination of inventory or pricing.
            </p>
          </div>
        </div>

        {/* ── Page 4: Terms & Integrity ── */}
        <div className="p-12 border border-[#F7F1E8]/20 rounded-3xl bg-[#540000] print:border-none print:rounded-none print:min-h-screen">
          <h2 className="font-serif text-3xl text-[#F7F1E8] mb-6">Terms &amp; Operational Policy</h2>

          <div className="space-y-4 font-sans text-xs text-[#F7F1E8]/80 leading-relaxed">
            <p>
              <strong>Payment Schedule:</strong> 40% upfront deposit to initiate discovery, 30%
              upon visual design approval, and 30% before final production DNS deployment.
            </p>
            <p>
              <strong>Domain &amp; Infrastructure:</strong> Domain and third-party hosting are
              held directly in the client&apos;s name. WhatsApp/Meta API charges, telephony charges,
              and AI token costs are billed by respective vendors.
            </p>
            <p>
              <strong>What We Never Promise:</strong> We never promise guaranteed Google search
              rankings, unlimited web traffic, or complete immunity from security vulnerabilities.
              We build using current industry best practices.
            </p>
            <p>
              <strong>Consent &amp; Privacy:</strong> Automated messaging systems require verified
              client opt-in consent and respect immediate opt-out keywords (e.g. STOP).
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-[#F7F1E8]/20 flex justify-between font-mono text-xs text-[#F7F1E8]/60">
            <span>built2host.in</span>
            <span>build2host@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}

