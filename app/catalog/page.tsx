"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { packages, addons, maintenancePlans } from "@/data/websites";
import { automationServices } from "@/data/automation";
import { SITE, GATE_CATALOG_DOWNLOAD, makeWhatsAppUrl } from "@/lib/site";
import {
  Search,
  Filter,
  ArrowRight,
  Download,
  Check,
  X,
  MessageSquare,
  FileText,
} from "lucide-react";
import { SpotlightCard } from "@/components/shared/SpotlightCard";

type TabKey = "all" | "websites" | "addons" | "maintenance" | "automation";

interface CatalogItem {
  id: string;
  division: "Websites" | "Automation";
  category: "Package" | "Addon" | "Maintenance" | "Automation";
  title: string;
  price: string;
  summary: string;
  details: string[];
  scope?: string;
  enquiryHref: string;
}

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  // Unify items from data files
  const allItems: CatalogItem[] = useMemo(() => {
    const list: CatalogItem[] = [];

    // Website Packages
    packages.forEach((pkg) => {
      list.push({
        id: `pkg-${pkg.id}`,
        division: "Websites",
        category: "Package",
        title: `${pkg.name} Website Package`,
        price: `₹${pkg.priceDisplay}`,
        summary: pkg.bestFor,
        details: pkg.includes,
        scope: `${pkg.size} · ${pkg.seo} · 3 revisions`,
        enquiryHref: `/websites/enquiry?package=${pkg.id}`,
      });
    });

    // Addons
    addons.forEach((ad, i) => {
      list.push({
        id: `addon-${i}`,
        division: "Websites",
        category: "Addon",
        title: ad.name,
        price: ad.price,
        summary: `Modular add-on upgrade in category: ${ad.category}.`,
        details: [`Category: ${ad.category}`, "Integrated into active or custom build"],
        scope: "Add-on implementation scope",
        enquiryHref: `/websites/enquiry`,
      });
    });

    // Maintenance Plans
    maintenancePlans.forEach((plan) => {
      list.push({
        id: `maint-${plan.id}`,
        division: "Websites",
        category: "Maintenance",
        title: `${plan.name} Maintenance Plan`,
        price: plan.price,
        summary: plan.note || "Monthly post-launch stability, uptime and security checks.",
        details: plan.includes,
        scope: "Monthly recurring engagement (no unlimited feature additions)",
        enquiryHref: `/websites/enquiry`,
      });
    });

    // Automation Services
    automationServices.forEach((svc) => {
      list.push({
        id: `auto-${svc.id}`,
        division: "Automation",
        category: "Automation",
        title: `${svc.number} ${svc.name}`,
        price: `₹${svc.priceDisplay}`,
        summary: svc.outcome,
        details: svc.bullets,
        scope: svc.scope,
        enquiryHref: `/automation/enquiry?service=${svc.id}`,
      });
    });

    return list;
  }, []);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Tab filter
      if (activeTab === "websites" && item.category !== "Package") return false;
      if (activeTab === "addons" && item.category !== "Addon") return false;
      if (activeTab === "maintenance" && item.category !== "Maintenance") return false;
      if (activeTab === "automation" && item.category !== "Automation") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSummary = item.summary.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchTitle && !matchSummary && !matchCat) return false;
      }

      return true;
    });
  }, [allItems, activeTab, searchQuery]);

  return (
    <main className="bg-[#E60000] text-[#F7F1E8] min-h-screen">
      <Nav />

      <div className="pt-28 md:pt-36 pb-16 md:pb-24 px-5 sm:px-6 md:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <p className="label-sm text-[#F7F1E8]/70 mb-2 uppercase tracking-widest">
              Standardized Studio Catalogue
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl text-[#F7F1E8]">
              Browse All Offerings
            </h1>
            <p className="font-sans text-sm text-[#F7F1E8]/80 max-w-xl mt-3 leading-relaxed">
              Every website package, add-on feature, maintenance plan, and real-estate automation
              service with fixed starting prices and clear deliverables.
            </p>
          </div>

          <div>
            <Link
              href="/catalog/print"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 bg-[#F7F1E8] text-[#E60000] px-6 py-3.5 rounded font-sans font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-lg min-h-[44px] w-full sm:w-auto"
            >
              <Download size={14} />
              <span>Download catalogue (PDF)</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#B50000]/40 border border-[#F7F1E8]/20 rounded-2xl p-4 md:p-6 mb-10 md:mb-12 backdrop-blur-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F7F1E8]/40" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search packages, add-ons, CRM, voice agent..."
              className="w-full bg-[#800000]/60 border border-[#F7F1E8]/20 rounded-xl pl-12 pr-4 py-3.5 text-base text-[#F7F1E8] placeholder:text-[#F7F1E8]/40 focus:outline-none focus:border-[#F7F1E8]"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { key: "all", label: "All Items" },
              { key: "websites", label: "Website Packages" },
              { key: "addons", label: "Add-ons" },
              { key: "maintenance", label: "Maintenance" },
              { key: "automation", label: "Automation Services" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                  activeTab === tab.key
                    ? "bg-[#F7F1E8] text-[#E60000] font-bold shadow-md"
                    : "bg-[#800000]/40 text-[#F7F1E8]/80 hover:bg-[#800000]/80 border border-[#F7F1E8]/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <SpotlightCard
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="border border-[#F7F1E8]/20 bg-[#B50000]/30 rounded-2xl p-6 flex flex-col justify-between hover:border-[#F7F1E8]/50 transition-all cursor-pointer group"
              spotlightColor="rgba(247, 241, 232, 0.12)"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#F7F1E8]/50 mb-3 uppercase tracking-wider">
                  <span>{item.division}</span>
                  <span className="px-2 py-0.5 rounded bg-[#F7F1E8]/10 text-[#F7F1E8]/80">
                    {item.category}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-[#F7F1E8] mb-2 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="font-mono text-xl font-bold text-[#F7F1E8] mb-4">{item.price}</p>
                <p className="font-sans text-xs text-[#F7F1E8]/75 leading-relaxed line-clamp-3 mb-6">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F7F1E8]/15 flex items-center justify-between text-xs font-mono text-[#F7F1E8]/60 group-hover:text-[#F7F1E8]">
                <span>Click for full scope</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </SpotlightCard>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-24 text-sm font-mono text-[#F7F1E8]/60">
            No matching items found for &ldquo;{searchQuery}&rdquo;. Try another keyword.
          </div>
        )}
      </div>

      {/* Drawer / Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#6E0000] border border-[#F7F1E8]/30 rounded-3xl p-6 md:p-10 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 text-[#F7F1E8]/60 hover:text-white p-2"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <span className="font-mono text-xs text-[#F7F1E8]/50 uppercase tracking-widest block mb-2">
              {selectedItem.division} &middot; {selectedItem.category}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#F7F1E8] mb-2">
              {selectedItem.title}
            </h2>
            <p className="font-mono text-2xl font-bold text-[#F7F1E8] mb-6">
              {selectedItem.price}
            </p>

            <p className="font-sans text-sm text-[#F7F1E8]/90 leading-relaxed mb-6">
              {selectedItem.summary}
            </p>

            {selectedItem.scope && (
              <div className="p-4 bg-[#540000] border border-[#F7F1E8]/15 rounded-xl font-mono text-xs text-[#F7F1E8]/80 mb-6">
                <span className="font-bold text-[#F7F1E8]">Defined Scope:</span> {selectedItem.scope}
              </div>
            )}

            <div className="mb-8">
              <p className="font-mono text-xs text-[#F7F1E8]/50 uppercase tracking-wider mb-3">
                Included Deliverables:
              </p>
              <ul className="space-y-2">
                {selectedItem.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs font-sans text-[#F7F1E8]/90">
                    <Check size={14} className="text-[#F83F41] shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={makeWhatsAppUrl(
                  selectedItem.division === "Websites"
                    ? SITE.websiteDivision.whatsapp
                    : SITE.automationDivision.whatsapp,
                  `Hi built2host! I want to enquire about: ${selectedItem.title} (${selectedItem.price}).`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#F7F1E8] text-[#6E0000] py-3.5 px-6 rounded font-sans font-bold text-xs uppercase tracking-wider hover:bg-white shadow-lg"
              >
                <MessageSquare size={14} />
                <span>Enquire on WhatsApp</span>
              </a>
              <Link
                href={selectedItem.enquiryHref}
                className="inline-flex items-center justify-center border border-[#F7F1E8]/40 text-[#F7F1E8] py-3.5 px-6 rounded font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#F7F1E8]/10"
              >
                Direct Form
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
