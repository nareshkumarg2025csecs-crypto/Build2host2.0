import { Suspense } from "react";
import { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { WebsiteEnquiryForm } from "@/components/sections/WebsiteEnquiryForm";
import { SITE, makeWhatsAppUrl } from "@/lib/site";
import { MessageSquare, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Website Enquiry — built2host",
  description:
    "Select your website package, pick modular add-ons, and submit your brief for a direct quotation.",
};

export default function WebsiteEnquiryPage() {
  const directWa = makeWhatsAppUrl(
    SITE.websiteDivision.whatsapp,
    "Hi built2host! I'd like to ask a question before filling the website enquiry form."
  );

  return (
    <main className="bg-[#E60000] text-[#F7F1E8] min-h-screen">
      <Nav />

      <div className="pt-36 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="label-sm text-[#F7F1E8]/70 mb-2 uppercase tracking-widest">
            Division 01 &mdash; Websites
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-[#F7F1E8] mb-4">
            Start Your Website Build
          </h1>
          <p className="font-sans text-sm md:text-base text-[#F7F1E8]/85 leading-relaxed">
            Tell us about your project below. We review every enquiry and reply on WhatsApp,
            usually within the working day.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <a
              href={directWa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#F7F1E8]/80 hover:text-white border border-[#F7F1E8]/20 px-4 py-2 rounded-full"
            >
              <MessageSquare size={13} />
              <span>Direct WhatsApp: {SITE.websiteDivision.phoneDisplay}</span>
            </a>
          </div>
        </div>

        <Suspense fallback={<div className="text-center text-xs font-mono py-12">Loading form...</div>}>
          <WebsiteEnquiryForm />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}

