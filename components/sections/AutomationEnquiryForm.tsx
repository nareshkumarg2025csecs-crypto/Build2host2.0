"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { automationServices } from "@/data/automation";
import { SITE, makeWhatsAppUrl } from "@/lib/site";
import { ArrowRight, Check, Send, AlertCircle, Phone, MessageSquare } from "lucide-react";

export function AutomationEnquiryForm() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "complete-suite";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [city, setCity] = useState("");
  const [enquiryVolume, setEnquiryVolume] = useState("50–200 leads/mo");
  const [selectedServices, setSelectedServices] = useState<string[]>([initialService]);
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submittedAt, setSubmittedAt] = useState(0);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setSubmittedAt(Date.now());
  }, []);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((s) => s !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (phone.trim().length < 10) {
      setErrorMsg("Please enter a valid 10-digit phone number");
      return;
    }
    if (!agencyName.trim()) {
      setErrorMsg("Please enter your real estate agency or company name");
      return;
    }
    if (selectedServices.length === 0) {
      setErrorMsg("Please select at least one automation service");
      return;
    }
    if (!consent) {
      setErrorMsg("Please confirm consent to proceed");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "automation",
          name: name.trim(),
          phone: phone.trim(),
          agencyName: agencyName.trim(),
          city: city.trim() || undefined,
          enquiryVolume,
          services: selectedServices,
          notes: notes.trim() || undefined,
          honeypot,
          submittedAt,
          consent: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit demo request");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const buildWhatsAppMessage = () => {
    const serviceList = selectedServices
      .map((id) => {
        const found = automationServices.find((s) => s.id === id);
        return found ? found.name : id;
      })
      .join(", ");

    return `Hi built2host! I just submitted an enquiry for Real Estate Automation.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Agency:* ${agencyName}\n*City:* ${city || "N/A"}\n*Monthly Enquiries:* ${enquiryVolume}\n*Selected Services:* ${serviceList}\n*Notes:* ${notes || "Discuss on chat"}\n\nCan we arrange a live demo?`;
  };

  const whatsappRedirectUrl = makeWhatsAppUrl(
    SITE.automationDivision.whatsapp,
    buildWhatsAppMessage()
  );

  if (submitted) {
    return (
      <div className="border border-[#F7F1E8]/20 bg-[#540000]/80 rounded-3xl p-8 md:p-14 text-center max-w-2xl mx-auto shadow-2xl backdrop-blur-sm">
        <div className="w-16 h-16 rounded-full bg-[#F7F1E8] text-[#6E0000] flex items-center justify-center mx-auto mb-6">
          <Check size={32} />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-[#F7F1E8] mb-4">
          Demo Request Registered
        </h2>
        <p className="font-sans text-sm text-[#F7F1E8]/85 mb-8 leading-relaxed">
          Thank you, <span className="font-bold text-[#F7F1E8]">{name}</span>. We prepare tailored
          walkthroughs based on your agency&apos;s lead channels. Connect directly on WhatsApp to
          confirm a 15-minute slot.
        </p>

        <div className="space-y-4">
          <a
            href={whatsappRedirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-3 bg-[#F7F1E8] text-[#6E0000] py-4 px-8 rounded font-sans font-bold text-xs uppercase tracking-wider hover:bg-white shadow-xl transition-transform hover:scale-[1.02]"
          >
            <MessageSquare size={16} />
            <span>Continue on WhatsApp</span>
            <ArrowRight size={14} />
          </a>

          <p className="font-mono text-xs text-[#F7F1E8]/60">
            System scope, prerequisites, and integration timelines are finalized on WhatsApp.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-[#F7F1E8]/15 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-[#F7F1E8]/60 gap-4">
          <span>Automation Division: {SITE.automationDivision.phoneDisplay}</span>
          <a href={`tel:+${SITE.automationDivision.whatsapp}`} className="underline hover:text-[#F7F1E8]">
            Click to Call on Mobile
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#F7F1E8]/20 bg-[#540000]/60 rounded-3xl p-6 md:p-12 shadow-2xl backdrop-blur-sm">
      <input
        type="text"
        name="automation_enquiry_trap"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="space-y-8">
        {/* Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-mono text-xs text-[#F7F1E8]/80 mb-2 uppercase tracking-wider">
              Your Name <span className="text-[#FBBABD]">*</span>
            </label>
            <input
              type="text"
              required
              autoComplete="name"
              autoCapitalize="words"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={(e) => {
                if (typeof window !== "undefined" && window.innerWidth < 768) {
                  e.target.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              placeholder="e.g. Ajay Surya"
              className="w-full bg-[#3B0000]/80 border border-[#F7F1E8]/20 rounded-xl px-4 py-3 text-sm text-[#F7F1E8] placeholder:text-[#F7F1E8]/30 focus:outline-none focus:border-[#F7F1E8]"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-[#F7F1E8]/80 mb-2 uppercase tracking-wider">
              WhatsApp / Mobile Number <span className="text-[#FBBABD]">*</span>
            </label>
            <input
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={(e) => {
                if (typeof window !== "undefined" && window.innerWidth < 768) {
                  e.target.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              placeholder="e.g. 72003 12345"
              className="w-full bg-[#3B0000]/80 border border-[#F7F1E8]/20 rounded-xl px-4 py-3 text-sm text-[#F7F1E8] placeholder:text-[#F7F1E8]/30 focus:outline-none focus:border-[#F7F1E8]"
            />
          </div>
        </div>

        {/* Agency Name & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-mono text-xs text-[#F7F1E8]/80 mb-2 uppercase tracking-wider">
              Real Estate Agency / Firm Name <span className="text-[#FBBABD]">*</span>
            </label>
            <input
              type="text"
              required
              autoComplete="organization"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              onFocus={(e) => {
                if (typeof window !== "undefined" && window.innerWidth < 768) {
                  e.target.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              placeholder="e.g. Apex Realty Partners"
              className="w-full bg-[#3B0000]/80 border border-[#F7F1E8]/20 rounded-xl px-4 py-3 text-sm text-[#F7F1E8] placeholder:text-[#F7F1E8]/30 focus:outline-none focus:border-[#F7F1E8]"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-[#F7F1E8]/80 mb-2 uppercase tracking-wider">
              Primary City / Region of Operation
            </label>
            <input
              type="text"
              autoComplete="address-level2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={(e) => {
                if (typeof window !== "undefined" && window.innerWidth < 768) {
                  e.target.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              placeholder="e.g. Chennai, Bangalore, Hyderabad"
              className="w-full bg-[#3B0000]/80 border border-[#F7F1E8]/20 rounded-xl px-4 py-3 text-sm text-[#F7F1E8] placeholder:text-[#F7F1E8]/30 focus:outline-none focus:border-[#F7F1E8]"
            />
          </div>
        </div>

        {/* Monthly Enquiry Volume */}
        <div>
          <label className="block font-mono text-xs text-[#F7F1E8]/80 mb-2 uppercase tracking-wider">
            Approximate Monthly Inbound Leads
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            {["Under 50", "50–200 leads/mo", "200–500 leads/mo", "500+ leads/mo"].map((vol) => (
              <button
                type="button"
                key={vol}
                onClick={() => setEnquiryVolume(vol)}
                className={`p-3 rounded-lg border text-center transition-all max-md:min-h-[44px] ${
                  enquiryVolume === vol
                    ? "bg-[#F7F1E8] text-[#6E0000] border-[#F7F1E8] font-bold"
                    : "bg-[#3B0000]/60 border-[#F7F1E8]/20 text-[#F7F1E8]/80"
                }`}
              >
                {vol}
              </button>
            ))}
          </div>
        </div>

        {/* Services Selection (Multi-select) */}
        <div>
          <label className="block font-mono text-xs text-[#F7F1E8]/80 mb-3 uppercase tracking-wider">
            Select Services of Interest <span className="text-[#FBBABD]">*</span>
          </label>
          <div className="space-y-3">
            {automationServices.map((service) => {
              const active = selectedServices.includes(service.id);
              return (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all max-md:min-h-[52px] ${
                    active
                      ? "bg-[#F7F1E8] text-[#6E0000] border-[#F7F1E8] shadow-md"
                      : "bg-[#3B0000]/50 border-[#F7F1E8]/20 text-[#F7F1E8] hover:border-[#F7F1E8]/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold opacity-60">
                      {service.number}
                    </span>
                    <div>
                      <p className="font-serif text-base font-medium">{service.name}</p>
                      <p className="font-mono text-[11px] opacity-75">{service.outcome}</p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold shrink-0 pl-4">
                    ₹{service.priceDisplay}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Operational Notes */}
        <div>
          <label className="block font-mono text-xs text-[#F7F1E8]/80 mb-2 uppercase tracking-wider">
            Current Setup / Notes
          </label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onFocus={(e) => {
              if (typeof window !== "undefined" && window.innerWidth < 768) {
                e.target.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
            placeholder="Tell us what property portals you currently use, whether you have a WhatsApp API number, or your biggest lead qualification bottleneck..."
            className="w-full bg-[#3B0000]/80 border border-[#F7F1E8]/20 rounded-xl px-4 py-3 text-sm text-[#F7F1E8] placeholder:text-[#F7F1E8]/30 focus:outline-none focus:border-[#F7F1E8]"
          />
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="automation-consent-check"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[#F7F1E8]/30 bg-[#3B0000] accent-[#F7F1E8] focus:ring-0 cursor-pointer"
          />
          <label htmlFor="automation-consent-check" className="font-sans text-xs text-[#F7F1E8]/80 cursor-pointer leading-relaxed">
            I consent to built2host contacting me regarding this automation inquiry. I understand
            that prices shown are one-time implementation fees for a defined starter scope, and that
            WhatsApp/telephony usage is billed by respective third-party providers. Read our{" "}
            <Link href="/privacy" className="underline hover:text-white" target="_blank">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="underline hover:text-white" target="_blank">
              Terms
            </Link>
            .
          </label>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 bg-[#2D0000] border border-[#F83F41] rounded-lg text-xs font-mono text-[#F97B7E] flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F7F1E8] text-[#6E0000] py-4 px-8 rounded font-sans font-bold text-xs uppercase tracking-wider hover:bg-white shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? "Registering request..." : "Book Live Demo Walkthrough"}
          </button>
          <p className="font-mono text-[11px] text-[#F7F1E8]/60 text-center mt-3">
            We reply on WhatsApp, usually within the working day.
          </p>
        </div>
      </div>
    </form>
  );
}

