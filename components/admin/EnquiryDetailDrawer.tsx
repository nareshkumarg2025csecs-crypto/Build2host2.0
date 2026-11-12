"use client";

import React, { useState } from "react";
import { EnquiryDoc, EnquiryStatus } from "@/lib/types/enquiry";
import { formatKolkataTime, normalizeWhatsAppNumber } from "@/lib/enquiry";
import {
  X,
  MessageSquare,
  Phone,
  Mail,
  Send,
  Save,
  Clock,
  CheckCircle,
  AlertTriangle,
  History,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  Layers,
  FileText,
} from "lucide-react";

interface EnquiryDetailDrawerProps {
  enquiry: EnquiryDoc | null;
  onClose: () => void;
  onUpdate: (updated: EnquiryDoc) => void;
}

export function EnquiryDetailDrawer({
  enquiry,
  onClose,
  onUpdate,
}: EnquiryDetailDrawerProps) {
  if (!enquiry) return null;

  const [notes, setNotes] = useState(enquiry.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);

  const normalizedPhone = normalizeWhatsAppNumber(enquiry.phone);
  const isWebsites = enquiry.division === "websites";
  const divisionTitle = isWebsites ? "Websites" : "Automation";

  const whatsappMessage = `Hi ${enquiry.name}, reaching out from built2host regarding your enquiry (${enquiry.ref}).`;
  const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleStatusChange = async (newStatus: EnquiryStatus) => {
    if (newStatus === enquiry.status) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry.ref}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      onUpdate(data.enquiry);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    setNotesSaved(false);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry.ref}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save notes");
      onUpdate(data.enquiry);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleResendConfirmation = async () => {
    setResendingEmail(true);
    setEmailNotice(null);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry.ref}/resend`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend confirmation email");
      onUpdate({ ...enquiry, emailStatus: "sent" });
      setEmailNotice("Confirmation email sent successfully!");
      setTimeout(() => setEmailNotice(null), 4000);
    } catch (err) {
      setEmailNotice(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      {/* Drawer Container */}
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="bg-[#FAF7F7] border-b border-[#E8DDDD] p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md uppercase border ${
                isWebsites
                  ? "bg-[#FFF0F0] text-[#E60000] border-[#F8B4B4]"
                  : "bg-[#F3EBEB] text-[#540000] border-[#E0C8C8]"
              }`}
            >
              {divisionTitle}
            </span>
            <div>
              <h2 className="font-mono text-base font-bold text-[#1A0505] tracking-tight">
                {enquiry.ref}
              </h2>
              <p className="font-mono text-xs text-[#6E4242]">
                Received {formatKolkataTime(enquiry.createdAt)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#6E4242] hover:text-[#1A0505] hover:bg-[#EFE4E4] rounded-lg transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Quick Action Bar */}
          <div className="bg-[#FAF7F7] border border-[#E8DDDD] rounded-2xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#6E4242] uppercase font-semibold">
                  Status:
                </span>
                <select
                  disabled={updatingStatus}
                  value={enquiry.status}
                  onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
                  className="bg-white border border-[#D5C2C2] text-[#1A0505] rounded-lg px-3 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-[#E60000] cursor-pointer"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BE5B] text-white px-3 py-1.5 rounded-lg text-xs font-bold font-sans tracking-wide shadow-xs"
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${enquiry.phone}`}
                  className="flex items-center gap-1.5 bg-[#1A0505] hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold font-sans tracking-wide shadow-xs"
                >
                  <Phone size={14} />
                  <span>Call</span>
                </a>
                <a
                  href={`mailto:${enquiry.email}`}
                  className="flex items-center gap-1.5 bg-white hover:bg-[#FAF7F7] text-[#1A0505] border border-[#D5C2C2] px-3 py-1.5 rounded-lg text-xs font-bold font-sans tracking-wide shadow-xs"
                >
                  <Mail size={14} />
                  <span>Email</span>
                </a>
              </div>
            </div>

            {/* Email Dispatch Status & Resend */}
            <div className="pt-3 border-t border-[#E8DDDD] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[#6E4242]">Confirmation Email:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    enquiry.emailStatus === "sent"
                      ? "bg-[#DCFCE7] text-[#166534]"
                      : "bg-[#FEE2E2] text-[#991B1B]"
                  }`}
                >
                  {enquiry.emailStatus === "sent" ? "Sent" : "Failed / Pending"}
                </span>
              </div>
              <button
                onClick={handleResendConfirmation}
                disabled={resendingEmail}
                className="text-[#E60000] hover:underline flex items-center gap-1 disabled:opacity-50 font-bold cursor-pointer"
              >
                <Send size={12} />
                <span>{resendingEmail ? "Sending..." : "Resend confirmation"}</span>
              </button>
            </div>
            {emailNotice && (
              <p className="text-xs font-mono text-[#E60000] bg-white p-2 rounded border border-[#E8DDDD]">
                {emailNotice}
              </p>
            )}
          </div>

          {/* Contact & Business Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div className="bg-[#FAF7F7] border border-[#E8DDDD] rounded-xl p-3.5 space-y-1">
              <span className="font-mono text-[11px] text-[#6E4242] uppercase font-semibold">
                Contact Person
              </span>
              <p className="text-sm font-bold text-[#1A0505]">{enquiry.name}</p>
              <p className="text-xs font-mono text-[#4A3232]">{enquiry.phone}</p>
              <p className="text-xs text-[#4A3232]">{enquiry.email}</p>
            </div>

            <div className="bg-[#FAF7F7] border border-[#E8DDDD] rounded-xl p-3.5 space-y-1">
              <span className="font-mono text-[11px] text-[#6E4242] uppercase font-semibold">
                Business &amp; Location
              </span>
              <p className="text-sm font-bold text-[#1A0505]">
                {enquiry.businessName || enquiry.agencyName || "N/A"}
              </p>
              <p className="text-xs text-[#4A3232] flex items-center gap-1">
                <MapPin size={12} className="text-[#A08585]" />
                <span>{enquiry.city || "Not specified"}</span>
              </p>
            </div>
          </div>

          {/* Scope & Selected Services */}
          <div className="bg-[#FAF7F7] border border-[#E8DDDD] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs text-[#6E4242] uppercase font-semibold">
              <Layers size={14} className="text-[#E60000]" />
              <span>Project Requirements</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#6E4242] block text-[11px] font-mono">
                  {isWebsites ? "Website Package" : "Selected Services"}
                </span>
                <p className="font-bold text-[#1A0505] mt-0.5">
                  {enquiry.packageOrServices.length > 0
                    ? enquiry.packageOrServices.join(", ")
                    : "None selected"}
                </p>
              </div>

              <div>
                <span className="text-[#6E4242] block text-[11px] font-mono">
                  {isWebsites ? "Add-ons" : "Monthly Leads Volume"}
                </span>
                <p className="font-bold text-[#1A0505] mt-0.5">
                  {isWebsites
                    ? enquiry.addOns.length > 0
                      ? enquiry.addOns.join(", ")
                      : "None"
                    : enquiry.monthlyEnquiryVolume || "N/A"}
                </p>
              </div>

              {isWebsites && enquiry.timeline && (
                <div>
                  <span className="text-[#6E4242] block text-[11px] font-mono">
                    Target Timeline
                  </span>
                  <p className="font-bold text-[#1A0505] mt-0.5">{enquiry.timeline}</p>
                </div>
              )}
            </div>

            {enquiry.message && (
              <div className="pt-3 border-t border-[#E8DDDD]">
                <span className="text-[#6E4242] block text-[11px] font-mono mb-1">
                  Visitor Notes / Scope Description
                </span>
                <p className="text-xs text-[#1A0505] bg-white p-3 rounded-lg border border-[#E8DDDD] leading-relaxed whitespace-pre-wrap">
                  {enquiry.message}
                </p>
              </div>
            )}
          </div>

          {/* Internal Notes Section */}
          <div className="bg-[#FAF7F7] border border-[#E8DDDD] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-xs text-[#6E4242] uppercase font-semibold">
                <FileText size={14} className="text-[#E60000]" />
                <span>Internal Staff Notes</span>
              </div>
              {notesSaved && (
                <span className="font-mono text-xs text-[#15803D] flex items-center gap-1">
                  <CheckCircle size={13} />
                  <span>Saved</span>
                </span>
              )}
            </div>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes on client budget, quote status, or WhatsApp discussion..."
              className="w-full bg-white border border-[#D5C2C2] rounded-lg p-3 text-xs text-[#1A0505] focus:outline-none focus:border-[#E60000]"
            />

            <button
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="flex items-center gap-1.5 bg-[#E60000] hover:bg-[#C40000] text-white px-4 py-2 rounded-lg text-xs font-bold font-sans uppercase tracking-wider shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Save size={13} />
              <span>{savingNotes ? "Saving..." : "Save Notes"}</span>
            </button>
          </div>

          {/* Consent & Audit Trail */}
          <div className="bg-white border border-[#E8DDDD] rounded-xl p-4 space-y-3 text-xs font-mono text-[#6E4242]">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#15803D]" />
              <span>
                Consent given at: <strong>{formatKolkataTime(enquiry.consentAt)}</strong> (Policy {enquiry.privacyPolicyVersion})
              </span>
            </div>

            {enquiry.history && enquiry.history.length > 0 && (
              <div className="pt-3 border-t border-[#E8DDDD] space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1A0505] uppercase">
                  <History size={13} />
                  <span>Status Change Audit</span>
                </div>
                <ul className="space-y-1 text-[11px]">
                  {enquiry.history.map((h, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span>
                        Status &rarr; <strong className="uppercase">{h.status}</strong> by {h.changedBy}
                      </span>
                      <span className="opacity-75">{formatKolkataTime(h.changedAt)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
