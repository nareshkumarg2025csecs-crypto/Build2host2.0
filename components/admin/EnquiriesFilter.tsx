"use client";

import React from "react";
import { Search, Download, Filter, RefreshCw, X } from "lucide-react";
import { AdminRole } from "@/lib/admin-auth";

interface EnquiriesFilterProps {
  division: string;
  setDivision: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  search: string;
  setSearch: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  role: AdminRole;
  onRefresh: () => void;
  loading: boolean;
}

export function EnquiriesFilter({
  division,
  setDivision,
  status,
  setStatus,
  search,
  setSearch,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  role,
  onRefresh,
  loading,
}: EnquiriesFilterProps) {
  const isDivisionLocked = role !== "owner";

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (division !== "all") params.set("division", division);
    if (status !== "all") params.set("status", status);
    if (search) params.set("search", search);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    window.open(`/api/admin/export?${params.toString()}`, "_blank");
  };

  const handleClearFilters = () => {
    if (!isDivisionLocked) setDivision("all");
    setStatus("all");
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  const hasActiveFilters =
    (!isDivisionLocked && division !== "all") ||
    status !== "all" ||
    search !== "" ||
    startDate !== "" ||
    endDate !== "";

  return (
    <div className="bg-white border border-[#E8DDDD] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-3 text-[#A08585]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, email, or ref..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF7F7] border border-[#E8DDDD] rounded-xl text-xs text-[#1A0505] placeholder:text-[#A08585] focus:outline-none focus:border-[#E60000]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-2.5 text-[#A08585] hover:text-[#1A0505]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Buttons: Refresh & Export */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 text-xs font-mono text-[#6E4242] hover:text-[#E60000] flex items-center gap-1 cursor-pointer"
            >
              <X size={13} />
              <span>Clear</span>
            </button>
          )}

          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 bg-[#FAF7F7] hover:bg-[#EFE4E4] text-[#6E4242] rounded-xl border border-[#E8DDDD] transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 bg-[#FAF7F7] hover:bg-white text-[#1A0505] border border-[#D5C2C2] px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider shadow-xs transition-colors cursor-pointer"
          >
            <Download size={14} className="text-[#E60000]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Dropdowns & Date Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#E8DDDD]">
        {/* Division Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-[#6E4242] font-semibold mb-1">
            Division
          </label>
          <select
            disabled={isDivisionLocked}
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            className="w-full bg-[#FAF7F7] border border-[#E8DDDD] rounded-lg px-2.5 py-1.5 text-xs text-[#1A0505] font-mono focus:outline-none focus:border-[#E60000] disabled:opacity-60 cursor-pointer"
          >
            <option value="all">All Divisions</option>
            <option value="websites">Websites</option>
            <option value="automation">Automation</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-[#6E4242] font-semibold mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-[#FAF7F7] border border-[#E8DDDD] rounded-lg px-2.5 py-1.5 text-xs text-[#1A0505] font-mono focus:outline-none focus:border-[#E60000] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-[#6E4242] font-semibold mb-1">
            From Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-[#FAF7F7] border border-[#E8DDDD] rounded-lg px-2.5 py-1.5 text-xs text-[#1A0505] font-mono focus:outline-none focus:border-[#E60000] cursor-pointer"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-[#6E4242] font-semibold mb-1">
            To Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-[#FAF7F7] border border-[#E8DDDD] rounded-lg px-2.5 py-1.5 text-xs text-[#1A0505] font-mono focus:outline-none focus:border-[#E60000] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
