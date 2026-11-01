"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { packages, addons } from "@/data/websites";
import { SITE, makeWhatsAppUrl } from "@/lib/site";
import { ArrowRight, Check, Send, AlertCircle, Phone, MessageSquare } from "lucide-react";

export function WebsiteEnquiryForm() {
  const searchParams = useSearchParams();
  const initialPackage = searchParams.get("package") || "business";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(initialPackage);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("2-3 weeks");
  const [description, setDescription] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submittedAt, setSubmittedAt] = useState(0);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setSubmittedAt(Date.now());
  }, []);

  const toggleAddon = (addonName: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonName) ? prev.filter((a) => a !== addonName) : [...prev, addonName]
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
      setErrorMsg("Please provide a valid 10-digit phone number");
      return;
    }
    if (!consent) {
      setErrorMsg("Please accept the terms and privacy consent to proceed");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "websites",
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          businessName: businessName.trim() || undefined,
          package: selectedPackage,
          addons: selectedAddons,
          timeline,
          description: description.trim() || undefined,
          honeypot,
          submittedAt,
          consent: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit enquiry");
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
    const pkgName = selectedPackage.toUpperCase();
    const addonList = selectedAddons.length > 0 ? selectedAddons.join(", ") : "None";
    return `Hi built2host! I just submitted an enquiry for a Website.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Business:* ${businessName || "N/A"}\n*Package:* ${pkgName}\n*Add-ons:* ${addonList}\n*Timeline:* ${timeline}\n*Notes:* ${description || "Discuss on chat"}\n\nLooking forward to hearing from your team!`;
  };

  const whatsappRedirectUrl = makeWhatsAppUrl(
    SITE.websiteDivision.whatsapp,
    buildWhatsAppMessage()
  );

  if (submitted) {
    return (
      <div className="border border-[#F7F1E8]/20 bg-[#C40000]/60 rounded-3xl p-8 md:p-14 text-center max-w-2xl mx-auto shadow-2xl backdrop-blur-sm">
        <div className="w-16 h-16 rounded-full bg-[#F7F1E8] text-[#E60000] flex items-center justify-center mx-auto mb-6">
          <Check size={32} />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-[#F7F1E8] mb-4">
          Enquiry Received
        </h2>
        <p className="font-sans text-sm text-[#F7F1E8]/85 mb-8 leading-relaxed">
          Thank you, <span className="font-bold text-[#F7F1E8]">{name}</span>. We review every brief
          thoroughly. To fast-track your quotation and discuss scope, jump straight into WhatsApp
          with our Website Division.
        </p>

        <div className="space-y-4">
          <a
            href={whatsappRedirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-3 bg-[#F7F1E8] text-[#E60000] py-4 px-8 rounded font-sans font-bold text-xs uppercase tracking-wider hover:bg-white shadow-xl transition-transform hover:scale-[1.02]"
          >
            <MessageSquare size={16} />
            <span>Continue on WhatsApp</span>
            <ArrowRight size={14} />
          </a>

          <p className="font-mono text-xs text-[#F7F1E8]/60">
            Order details, scope, and the 40/30/30 payment structure are discussed over WhatsApp.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-[#F7F1E8]/15 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-[#F7F1E8]/60 gap-4">
          <span>Website Division: {SITE.websiteDivision.phoneDisplay}</span>
          <a href={`tel:+${SITE.websiteDivision.whatsapp}`} className="underline hover:text-[#F7F1E8]">
            Click to Call on Mobile
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#F7F1E8]/20 bg-[#B50000]/40 rounded-3xl p-6 md:p-12 shadow-2xl backdrop-blur-sm">
      {/* Honeypot field (hidden) */}
      <input
        type="text"
        name="website_enquiry_trap"
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
            <label className="block label-sm text-[#F7F1E8]/80 mb-2">
              Your Name <span className="text-[#FBBABD]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              autoComplete="name"
              className="w-full bg-[#800000]/60 border border-[#F7F1E8]/20 rounded-xl px-4 py-3.5 text-base text-[#F7F1E8] placeholder:text-[#F7F1E8]/30 focus:outline-none focus:border-[#F7F1E8]"
            />
          </div>
          <div>
            <label className="block label-sm text-[#F7F1E8]/80 mb-2">
              WhatsApp / Phone Number <span className="text-[#FBBABD]">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 98402 12345"
              inputMode="tel"
              autoComplete="tel"
              className="w-full bg-[#800000]/60 border border-[#F7F1E8]/20 rounded-xl px-4 py-3.5 text-base text-[#F7F1E8] placeholder:text-[#F7F1E8]/30 focus:outline-none focus:border-[#F7F1E8]"
            />
          </div>
        </div>

        {/* Email & Business Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block label-sm text-[#F7F1E8]/80 mb-2">
              Email Address <span className="text-[#F7F1E8]/40">(Optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              inputMode="email"
              autoComplete="email"
              className="w-full bg-[#800000]/60 border border-[#F7F1E8]/20 rounded-xl px-4 py-3.5 text-base text-[#F7F1E8] placeholder:text-[#F7F1E8]/30 focus:outline-none focus:border-[#F7F1E8]"
            />
          </div>
          <div>
            <label className="block label-sm text-[#F7F1E8]/80 mb-2">
              Business or Brand Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Acme Studio"
              autoComplete="organization"
              className="w-full bg-[#800000]/60 border border-[#F7F1E8]/20 rounded-xl px-4 py-3.5 text-base text-[#F7F1E8] placeholder:text-[#F7F1E8]/30 focus:outline-none focus:border-[#F7F1E8]"
            />
          </div>
        </div>

        {/* Package Selection */}
        <div>
          <label className="block label-sm text-[#F7F1E8]/80 mb-3">
            Select Website Package
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: "starter", name: "Starter", price: "₹7,999" },
              { id: "business", name: "Business", price: "₹12,999" },
              { id: "premium", name: "Premium", price: "₹19,999" },
              { id: "not-sure", name: "Not Sure Yet", price: "Custom" },
            ].map((pkg) => (
              <button
                type="button"
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`min-h-[48px] p-4 rounded-xl border text-left transition-all ${
                  selectedPackage === pkg.id
                    ? "bg-[#F7F1E8] text-[#E60000] border-[#F7F1E8] font-bold"
                    : "bg-[#800000]/40 border-[#F7F1E8]/20 text-[#F7F1E8] hover:border-[#F7F1E8]/50"
                }`}
              >
                <p className="font-serif text-lg">{pkg.name}</p>
                <p className="font-mono text-xs opacity-80">{pkg.price}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Add-ons Multi-Select Chips */}
        <div>
          <label className="block label-sm text-[#F7F1E8]/80 mb-2">
            Optional Add-ons <span className="text-[#F7F1E8]/40">(Select any that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {addons.slice(0, 10).map((addon) => {
              const active = selectedAddons.includes(addon.name);
              return (
                <button
                  type="button"
                  key={addon.name}
                  onClick={() => toggleAddon(addon.name)}
                  className={`min-h-[44px] px-3.5 py-2.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-2 ${
                    active
                      ? "bg-[#F7F1E8] text-[#E60000] border-[#F7F1E8] font-bold"
                      : "bg-[#800000]/30 border-[#F7F1E8]/20 text-[#F7F1E8]/80 hover:border-[#F7F1E8]/40"
                  }`}
                >
                  <span>{addon.name}</span>
                  <span className="opacity-70">({addon.price})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <label className="block label-sm text-[#F7F1E8]/80 mb-2">Target Timeline</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            {["1-2 weeks (Express)", "2-3 weeks", "1 month", "Flexible"].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTimeline(t)}
                className={`min-h-[44px] p-3 rounded-lg border text-center transition-all ${
                  timeline === t
                    ? "bg-[#F7F1E8] text-[#E60000] border-[#F7F1E8] font-bold"
                    : "bg-[#800000]/30 border-[#F7F1E8]/20 text-[#F7F1E8]/80"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Project Description */}
        <div>
          <label className="block label-sm text-[#F7F1E8]/80 mb-2">
            Project Description &amp; Inspiration
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us what you want to achieve, any reference websites you like, or special features..."
            className="w-full bg-[#800000]/60 border border-[#F7F1E8]/20 rounded-xl px-4 py-3.5 text-base text-[#F7F1E8] placeholder:text-[#F7F1E8]/30 focus:outline-none focus:border-[#F7F1E8]"
          />
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="consent-check"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 rounded border-[#F7F1E8]/30 bg-[#800000] accent-[#F7F1E8] focus:ring-0 cursor-pointer"
          />
          <label htmlFor="consent-check" className="font-sans text-xs text-[#F7F1E8]/80 cursor-pointer leading-relaxed">
            I agree that built2host may contact me via WhatsApp or email regarding this enquiry. I
            understand that prices shown are starting prices and that full scope is approved prior
            to build. Read our{" "}
            <Link href="/privacy" className="underline hover:text-white min-h-[44px] inline-flex items-center" target="_blank">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="underline hover:text-white min-h-[44px] inline-flex items-center" target="_blank">
              Terms
            </Link>
            .
          </label>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3.5 bg-[#3B0000] border border-[#F83F41] rounded-lg text-xs font-mono text-[#F97B7E] flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] bg-[#F7F1E8] text-[#E60000] py-4 px-8 rounded font-sans font-bold text-xs uppercase tracking-wider hover:bg-white shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? "Transmitting brief..." : "Submit Project Enquiry"}
          </button>
          <p className="font-mono text-[11px] text-[#F7F1E8]/60 text-center mt-3">
            We reply on WhatsApp, usually within the working day.
          </p>
        </div>
      </div>
    </form>
  );
}

