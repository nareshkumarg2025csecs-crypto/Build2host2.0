import { Suspense } from "react";
import { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AutomationEnquiryForm } from "@/components/sections/AutomationEnquiryForm";
import { SITE, makeWhatsAppUrl } from "@/lib/site";
import { MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Automation Demo Enquiry — built2host",
  description:
    "Schedule a live interactive walkthrough of our WhatsApp AI lead qualification and property portal pipelines.",
};

export default function AutomationEnquiryPage() {
  const directWa = makeWhatsAppUrl(
    SITE.automationDivision.whatsapp,
    "Hi built2host! I have a question about the real estate automation demo."
  );

  return (
    <main className="bg-[#6E0000] text-[#F7F1E8] min-h-screen">
      <Nav />

      <div className="pt-36 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="font-mono text-xs text-[#F7F1E8]/60 mb-2 uppercase tracking-widest">
            Division 02 &mdash; Automation
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-[#F7F1E8] mb-4">
            Book an Automation Demo
          </h1>
          <p className="font-mono text-xs md:text-sm text-[#F7F1E8]/80 leading-relaxed">
            Tell us about your property enquiry flow. We will set up a simulation matching your
            active channels.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <a
              href={directWa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#F7F1E8]/80 hover:text-white border border-[#F7F1E8]/20 px-4 py-2 rounded-full"
            >
              <MessageSquare size={13} />
              <span>Direct WhatsApp: {SITE.automationDivision.phoneDisplay}</span>
            </a>
          </div>
        </div>

        <Suspense fallback={<div className="text-center text-xs font-mono py-12">Loading form...</div>}>
          <AutomationEnquiryForm />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}

