import { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/site";
import { AlertTriangle } from "lucide-react";

/**
 * NOTICE: The following Terms of Service document is a draft operational contract
 * for built2host.in. It requires formal legal counsel review prior to full commercial
 * implementation.
 */

export const metadata: Metadata = {
  title: "Terms of Service — built2host",
  description: "Terms and conditions of engagement for built2host website and automation services.",
};

export default function TermsPage() {
  return (
    <main className="bg-[#F9F9F9] text-[#1A0505] min-h-screen">
      <Nav />

      <div className="pt-28 md:pt-36 pb-16 md:pb-24 px-5 sm:px-6 md:px-12 max-w-3xl mx-auto">
        <div className="bg-[#FBBABD]/40 border border-[#E60000]/40 rounded-xl p-4 mb-8 flex items-start gap-3 text-xs font-mono text-[#6E0000]">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div>
            <strong>Legal Review Advisory:</strong> These terms represent the studio&apos;s standard
            commercial terms. They require formal review by legal counsel.
          </div>
        </div>

        <p className="label-sm text-[#1A0505]/50 mb-2 uppercase tracking-widest">
          Contractual Foundations
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1A0505] mb-4">
          Terms of Service
        </h1>
        <p className="font-mono text-xs text-[#1A0505]/60 mb-10">
          Effective Date: Draft under legal review &middot; Domain: {SITE.domain}
        </p>

        <div className="prose prose-sm font-sans text-xs text-[#1A0505]/85 space-y-6 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-[#1A0505] mb-2">1. Scope of Engagement</h2>
            <p>
              built2host (&ldquo;Studio&rdquo;) delivers custom website engineering and real-estate
              automation systems. All package fees and add-on rates published on {SITE.domain} are
              starting prices for a clearly defined initial scope. The final commercial quote is
              approved in writing prior to commencing work.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A0505] mb-2">
              2. Milestone Payment Structure: 40 / 30 / 30
            </h2>
            <p>All bespoke projects follow an immutable three-part milestone payment schedule:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>40% Upfront Deposit:</strong> Due upon contract execution to reserve studio
                calendar time and initiate discovery and wireframing.
              </li>
              <li>
                <strong>30% Design Approval Milestone:</strong> Due upon written approval of the
                interactive visual layouts and prior to frontend code development.
              </li>
              <li>
                <strong>30% Final Pre-Deployment Balance:</strong> Due upon completion of staging QA
                and immediately preceding live DNS deployment and administrative handover.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A0505] mb-2">
              3. Domains, Hosting &amp; Ownership
            </h2>
            <p>
              Domain registration and web hosting services are charged separately and registered
              directly in the client&apos;s name. Upon receipt of full and final payment, the client
              owns the bespoke codebase deliverables. The Studio retains the right to display the
              completed work in its digital portfolio and marketing materials.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A0505] mb-2">
              4. Revisions &amp; Scope Expansion
            </h2>
            <p>
              Each engagement includes exactly three (3) structured revision rounds within the
              agreed scope. Design layouts are finalized before full development starts. Feature
              requests, structural redesigns, or third-party additions outside the original scope
              are quoted separately as modular add-ons.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A0505] mb-2">
              5. Operational Boundaries &amp; Warranties
            </h2>
            <p>The Studio operates with technical transparency and explicitly disclaims:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                No guarantee of specific Google or search engine numerical rankings or organic
                visitor volumes.
              </li>
              <li>No guarantee of sales conversions, real estate closings, or buyer deal velocity.</li>
              <li>
                No liability for outages caused by third-party infrastructure (Meta WhatsApp API,
                telephony providers, property portals, or cloud hosting nodes).
              </li>
              <li>
                Penetration testing, formal SOC2 compliance audits, or specialized legal data
                residency agreements require a separate negotiated contract.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A0505] mb-2">
              6. Client Conduct in Automations
            </h2>
            <p>
              Clients utilizing automated messaging systems agree to comply with all applicable
              anti-spam legislation and Meta WhatsApp policies. The client must maintain verified
              opt-in records, provide immediate opt-out keywords, and assume responsibility for the
              commercial accuracy of property facts shared with prospects.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A0505] mb-2">7. Contact &amp; Governance</h2>
            <p>
              Questions regarding these terms may be directed to{" "}
              <a href={`mailto:${SITE.commonEmail}`} className="underline text-[#E60000]">
                {SITE.commonEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
