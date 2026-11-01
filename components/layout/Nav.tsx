"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { SITE, makeWhatsAppUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";

const menuLinks = [
  { href: "/websites", label: "Websites" },
  { href: "/automation", label: "Automation" },
  { href: "/catalog", label: "Catalogue" },
  { href: "/about", label: "About" },
  { href: "/websites/enquiry", label: "Website Enquiry" },
  { href: "/automation/enquiry", label: "Book a Demo" },
];

export function Nav({ transparent = false }: { transparent?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const waUrl = makeWhatsAppUrl(
    SITE.websiteDivision.whatsapp,
    "Hi built2host! I'd like to learn more about your studio."
  );

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center px-6 md:px-12 h-16 border-b transition-colors",
          transparent
            ? "bg-[#E60000]/90 md:bg-transparent border-[#F7F1E8]/10 backdrop-blur-sm md:backdrop-blur-none"
            : "bg-[#E60000] border-[#F7F1E8]/15 shadow-sm"
        )}
      >
        {/* Brand Logo Mark (Left column) */}
        <div className="flex items-center justify-start">
          <Link
            href="/"
            className="flex items-center no-underline shrink-0"
            aria-label="built2host studio home"
          >
            <Logo
              variant="mark"
              tone="cream"
              height={44}
              priority
              className="h-8 md:h-10 w-auto"
            />
          </Link>
        </div>

        {/* Centered Division Switcher (Middle column) */}
        <div className="hidden md:flex items-center justify-center gap-6 font-mono text-xs uppercase tracking-widest text-[#F7F1E8]">
          <Link
            href="/websites"
            className="no-underline text-[#F7F1E8] hover:text-white transition-opacity hover:opacity-80"
          >
            Websites
          </Link>
          <span className="opacity-30 select-none">|</span>
          <Link
            href="/automation"
            className="no-underline text-[#F7F1E8] hover:text-white transition-opacity hover:opacity-80"
          >
            Automation
          </Link>
        </div>

        {/* Right actions: WhatsApp + Menu button (Right column) */}
        <div className="flex items-center justify-end gap-5">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#F7F1E8] no-underline border border-[#F7F1E8]/30 px-3.5 py-1.5 rounded hover:bg-[#F7F1E8] hover:text-[#E60000] transition-all"
            aria-label="Chat on WhatsApp"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => setMenuOpen(true)}
            className="flex items-center justify-center w-10 h-10 text-[#F7F1E8] hover:opacity-75 transition-opacity max-md:w-11 max-md:h-11"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Full-Screen Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-[#E60000] flex flex-col max-md:overflow-y-auto"
          >
            <div className="flex items-center justify-between px-6 md:px-12 h-16 border-b border-[#F7F1E8]/10 shrink-0">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                aria-label="built2host home"
              >
                <Logo
                  variant="lockup"
                  tone="cream"
                  width={150}
                  className="w-36 md:w-40"
                />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-10 h-10 text-[#F7F1E8] hover:opacity-75 transition-opacity max-md:w-11 max-md:h-11"
                aria-label="Close menu"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            {/* Mobile Switcher Banner inside menu */}
            <div className="md:hidden flex items-center justify-center gap-4 py-3 px-6 bg-[#C40000]/70 border-b border-[#F7F1E8]/10 font-mono text-xs uppercase tracking-widest text-[#F7F1E8] shrink-0">
              <Link
                href="/websites"
                onClick={() => setMenuOpen(false)}
                className="py-2 px-3 text-[#F7F1E8] hover:underline"
              >
                Websites
              </Link>
              <span className="opacity-40">|</span>
              <Link
                href="/automation"
                onClick={() => setMenuOpen(false)}
                className="py-2 px-3 text-[#F7F1E8] hover:underline"
              >
                Automation
              </Link>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 md:px-20 gap-3 md:gap-5">
              {menuLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.4,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block font-transcity text-[#F7F1E8] no-underline hover:opacity-75 transition-opacity uppercase"
                    style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", lineHeight: 1.05 }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="px-8 md:px-20 pb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-[#F7F1E8]/10 pt-6 gap-4 font-mono text-xs text-[#F7F1E8]/70">
              <p>Inquiries: {SITE.commonEmail}</p>
              <p>Websites: {SITE.websiteDivision.phoneDisplay} &middot; Automation: {SITE.automationDivision.phoneDisplay}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
