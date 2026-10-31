import React from "react";
import Link from "next/link";
import { SITE, makeWhatsAppUrl } from "@/lib/site";
import { Phone, Mail, MessageSquare } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export function Footer() {
  const websiteWa = makeWhatsAppUrl(
    SITE.websiteDivision.whatsapp,
    "Hi built2host! I'd like to enquire about a website."
  );
  const automationWa = makeWhatsAppUrl(
    SITE.automationDivision.whatsapp,
    "Hi built2host! I'd like to enquire about automation."
  );

  return (
    <footer className="bg-[#1A0505] text-[#F7F1E8] border-t border-[#F7F1E8]/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Studio Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block" aria-label="built2host home">
              <Logo variant="lockup" tone="cream" width={160} className="w-36 md:w-40" />
            </Link>
            <p className="font-serif italic text-sm text-[#F7F1E8]/75">
              &ldquo;You imagine it. We build it.&rdquo;
            </p>
            <div className="pt-2">
              <span className="font-mono text-[11px] text-[#F7F1E8]/40 block mb-1">
                Central Inquiries:
              </span>
              <a
                href={`mailto:${SITE.commonEmail}`}
                className="font-mono text-xs text-[#F7F1E8] hover:text-[#F83F41] transition-colors underline"
              >
                {SITE.commonEmail}
              </a>
            </div>
          </div>

          {/* Websites Division Contact */}
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-[#F7F1E8]/50">
              Division 01 &middot; Websites
            </p>
            <p className="font-serif text-xl text-[#F7F1E8]">Websites &amp; Branding</p>
            <ul className="space-y-2.5 text-xs font-mono text-[#F7F1E8]/80">
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-[#F83F41] shrink-0" />
                <a
                  href={`tel:+${SITE.websiteDivision.whatsapp}`}
                  className="hover:text-white transition-colors"
                >
                  {SITE.websiteDivision.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare size={13} className="text-[#F83F41] shrink-0" />
                <a
                  href={websiteWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors underline"
                >
                  WhatsApp Website Desk
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="text-[#F83F41] shrink-0" />
                <a
                  href={`mailto:${SITE.websiteDivision.email}`}
                  className="hover:text-white transition-colors"
                >
                  {SITE.websiteDivision.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Automation Division Contact */}
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-[#F7F1E8]/50">
              Division 02 &middot; Automation
            </p>
            <p className="font-serif text-xl text-[#F7F1E8]">Real Estate Automation</p>
            <ul className="space-y-2.5 text-xs font-mono text-[#F7F1E8]/80">
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-[#F83F41] shrink-0" />
                <a
                  href={`tel:+${SITE.automationDivision.whatsapp}`}
                  className="hover:text-white transition-colors"
                >
                  {SITE.automationDivision.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare size={13} className="text-[#F83F41] shrink-0" />
                <a
                  href={automationWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors underline"
                >
                  WhatsApp Automation Desk
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="text-[#F83F41] shrink-0" />
                <a
                  href={`mailto:${SITE.automationDivision.email}`}
                  className="hover:text-white transition-colors"
                >
                  {SITE.automationDivision.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#F7F1E8]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <nav className="flex flex-wrap gap-6 font-mono text-xs uppercase tracking-wider text-[#F7F1E8]/60">
            <Link href="/websites" className="hover:text-[#F7F1E8] transition-colors">
              Websites
            </Link>
            <Link href="/automation" className="hover:text-[#F7F1E8] transition-colors">
              Automation
            </Link>
            <Link href="/catalog" className="hover:text-[#F7F1E8] transition-colors">
              Catalogue
            </Link>
            <Link href="/about" className="hover:text-[#F7F1E8] transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-[#F7F1E8] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#F7F1E8] transition-colors">
              Terms
            </Link>
          </nav>

          <p className="font-mono text-xs text-[#F7F1E8]/40">
            &copy; {new Date().getFullYear()} {SITE.domain}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
