import { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/site";
import { AlertTriangle } from "lucide-react";

/**
 * NOTICE: The following Privacy Policy is a draft operational document prepared
 * for built2host.in. It requires professional legal counsel review prior to full
 * production sign-off.
 *
 * Operational rules enforced:
 * - We do NOT guarantee all data stays in India (uses global cloud infrastructure).
 * - We do NOT promise specific fixed deletion schedules.
 * - Explicit opt-in rules for WhatsApp and conversational AI are defined.
 */

export const metadata: Metadata = {
  title: "Privacy Policy — built2host",
  description: "Privacy policy and conversational data handling terms for built2host.in.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#F9F9F9] text-[#1A0505] min-h-screen">
      <Nav />

      <div className="pt-36 pb-24 px-6 md:px-12 max-w-3xl mx-auto">
        {/* Legal Advisory Banner */}
        <div className="bg-[#FBBABD]/40 border border-[#E60000]/40 rounded-xl p-4 mb-8 flex items-start gap-3 text-xs font-mono text-[#6E0000]">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div>
            <strong>Legal Review Advisory:</strong> This draft privacy policy reflects our current
            operational protocols and data handling. It is subject to formal legal review before
            unconditional finalisation.
          </div>
        </div>

        <p className="label-sm text-[#1A0505]/50 mb-2 uppercase tracking-widest">
          Regulatory &amp; Data Ethics
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#1A0505] mb-4">
          Privacy Policy
        </h1>
        <p className="font-mono text-xs text-[#1A0505]/60 mb-10">
          Effective Date: Draft under legal review &middot; Domain: {SITE.domain}
        </p>

        <div className="prose prose-sm font-sans text-xs text-[#1A0505]/85 space-y-6 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-[#1A0505] mb-2">1. Introduction</h2>
            <p>
              built2host (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;studio&rdquo;) operates the
              domain <strong>{SITE.domain}</strong> and provides website design, development, and
              real-estate automation integration services. This document outlines how we collect,
              handle, and safeguard data submitted across our website and automated conversational
              endpoints.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A0505] mb-2">2. Information We Collect</h2>
            <p>We collect information voluntarily submitted by visitors and clients, including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Enquiry Information:</strong> Full name, WhatsApp phone number, email
                address, business or agency name, operating city, and project specifications.
              </li>
              <li>
                <strong>Conversational Lead Records:</strong> Property buyer criteria (budget,
                location preferences, BHK configurations, possession timelines) captured via
                opt-in WhatsApp chats, portal webhooks, or inbound phone calls.
              </li>
              <li>
                <strong>Technical Diagnostics:</strong> Minimal request timestamps, IP headers for
                rate limiting and anti-spam verification, and browser user-agent data.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A0505] mb-2">
              3. WhatsApp &amp; Conversational AI Rules
            </h2>
            <p>
              Our automation practice implements conversational assistants. In accordance with Meta
              platform policies and telecommunications standards:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Opt-In Requirement:</strong> We and our agency clients require verified
                opt-in consent prior to dispatching WhatsApp follow-ups. A missed call or portal visit
                does not automatically constitute blanket messaging permission.
              </li>
              <li>
                <strong>Assistant Identification:</strong> Automated bots explicitly identify
                themselves as automated assistants during the opening exchange.
              </li>
              <li>
                <strong>Immediate Opt-Out:</strong> Any prospect may opt out at any time by texting
                &ldquo;STOP&rdquo;, &ldquo;UNSUBSCRIBE&rdquo;, or requesting human agent escalation.
                The system halts automated sequences upon receipt.
              </li>
              <li>
                <strong>No Bulk Spam:</strong> We do not deploy unauthorized mass-broadcasting,
                unsolicited cold contact lists, or scraping mechanisms.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A0505] mb-2">4. Third-Party Infrastructure &amp; Data Storage</h2>
            <p>
              To deliver high-availability services, data is processed and stored through established
              enterprise cloud providers:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Enquiry Storage:</strong> Visitor enquiry details (name, phone number, email
                address, business or agency details, operating city, selected package/services, and project
                message) are stored in Google Firebase / Cloud Firestore and used exclusively to evaluate
                and respond to your enquiry.
              </li>
              <li>
                <strong>Email Transmissions:</strong> Visitor confirmation emails and internal team notifications
                are dispatched through Gmail SMTP infrastructure.
              </li>
              <li>
                <strong>Application Hosting:</strong> Application hosting and edge delivery are provided via
                Next.js on Vercel. We do not warrant that all network transit resides exclusively within India,
                as enterprise routing may utilize international edge nodes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A0505] mb-2">5. Data Retention &amp; Rights</h2>
            <p>
              Enquiry records stored in Firebase Firestore are retained for the operational duration necessary to
              evaluate scope, provide maintenance, and service client accounts. Exact retention schedule:
              {" "}<em>[RETENTION_PERIOD_PLACEHOLDER: To be defined by owner prior to final legal sign-off]</em>.
              Visitors and clients may request the inspection, correction, or permanent deletion of their
              stored contact and enquiry records at any time by emailing our central desk at{" "}
              <a href={`mailto:${SITE.commonEmail}`} className="underline text-[#E60000]">
                {SITE.commonEmail}
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1A0505] mb-2">6. Contact Information</h2>
            <p>
              For privacy inquiries, audit requests, or data deletion, contact us directly at:
            </p>
            <p className="font-mono text-xs">
              Central Email:{" "}
              <a href={`mailto:${SITE.commonEmail}`} className="underline text-[#E60000]">
                {SITE.commonEmail}
              </a>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
