"use client";

import React from "react";
import { EnquiryDoc, EnquiryStatus } from "@/lib/types/enquiry";
import { formatKolkataTime } from "@/lib/enquiry";
import { Inbox, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

interface EnquiriesTableProps {
  enquiries: EnquiryDoc[];
  loading: boolean;
  onSelect: (doc: EnquiryDoc) => void;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  total: number;
  pageSize: number;
}

export function EnquiriesTable({
  enquiries,
  loading,
  onSelect,
  page,
  setPage,
  totalPages,
  total,
  pageSize,
}: EnquiriesTableProps) {
  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case "new":
        return "bg-[#FFF0F0] text-[#E60000] border-[#F8B4B4]";
      case "contacted":
        return "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]";
      case "won":
        return "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]";
      case "lost":
        return "bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]";
    }
  };

  const getDivisionBadge = (division: string) => {
    return division === "websites"
      ? "bg-[#FFF0F0] text-[#E60000] border-[#F8B4B4]"
      : "bg-[#F3EBEB] text-[#540000] border-[#E0C8C8]";
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#E8DDDD] rounded-2xl p-8 shadow-xs">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="h-4 bg-[#EFE4E4] rounded w-28"></div>
              <div className="h-4 bg-[#EFE4E4] rounded w-36"></div>
              <div className="h-4 bg-[#EFE4E4] rounded w-20"></div>
              <div className="h-4 bg-[#EFE4E4] rounded flex-1"></div>
              <div className="h-4 bg-[#EFE4E4] rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <div className="bg-white border border-[#E8DDDD] rounded-2xl p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-full bg-[#FAF7F7] border border-[#E8DDDD] flex items-center justify-center mx-auto mb-4 text-[#A08585]">
          <Inbox size={26} />
        </div>
        <h3 className="font-serif text-lg font-bold text-[#1A0505] mb-1">
          No enquiries found
        </h3>
        <p className="font-mono text-xs text-[#6E4242] max-w-sm mx-auto">
          No records match your selected filters or search query. Adjust the filters above to see more results.
        </p>
      </div>
    );
  }

  const startCount = (page - 1) * pageSize + 1;
  const endCount = Math.min(page * pageSize, total);

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white border border-[#E8DDDD] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F7] border-b border-[#E8DDDD] font-mono text-[11px] uppercase tracking-wider text-[#6E4242]">
                <th className="py-3 px-4">Ref</th>
                <th className="py-3 px-4">Date &amp; Time (IST)</th>
                <th className="py-3 px-3">Division</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Package / Services</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE4E4] text-xs">
              {enquiries.map((enq) => {
                const pkgOrServices = enq.packageOrServices.join(", ") || "—";
                return (
                  <tr
                    key={enq.ref}
                    onClick={() => onSelect(enq)}
                    className="hover:bg-[#FFFDFD] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1A0505]">
                      {enq.ref}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#6E4242] whitespace-nowrap">
                      {formatKolkataTime(enq.createdAt)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getDivisionBadge(
                          enq.division
                        )}`}
                      >
                        {enq.division}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#1A0505]">
                      <div>{enq.name}</div>
                      {(enq.businessName || enq.agencyName) && (
                        <div className="text-[11px] text-[#8C7575] truncate max-w-[150px]">
                          {enq.businessName || enq.agencyName}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#4A3232]">
                      <div>{enq.phone}</div>
                      <div className="text-[11px] text-[#8C7575] truncate max-w-[170px]">
                        {enq.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#4A3232] max-w-[200px] truncate" title={pkgOrServices}>
                      {pkgOrServices}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getStatusBadge(
                          enq.status
                        )}`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center text-[#E60000] opacity-0 group-hover:opacity-100 font-sans font-bold text-[11px] transition-opacity">
                        View &rarr;
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View (<768px) */}
      <div className="block md:hidden space-y-3">
        {enquiries.map((enq) => (
          <div
            key={enq.ref}
            onClick={() => onSelect(enq)}
            className="bg-white border border-[#E8DDDD] rounded-2xl p-4 shadow-xs space-y-3 cursor-pointer hover:border-[#E60000]/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#1A0505]">{enq.ref}</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${getDivisionBadge(
                    enq.division
                  )}`}
                >
                  {enq.division}
                </span>
                <span
                  className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${getStatusBadge(
                    enq.status
                  )}`}
                >
                  {enq.status}
                </span>
              </div>
            </div>

            <div className="text-xs space-y-0.5">
              <p className="font-bold text-sm text-[#1A0505]">{enq.name}</p>
              {(enq.businessName || enq.agencyName) && (
                <p className="text-[11px] text-[#6E4242]">{enq.businessName || enq.agencyName}</p>
              )}
              <p className="font-mono text-[11px] text-[#4A3232]">
                {enq.phone} &middot; {enq.email}
              </p>
            </div>

            <div className="pt-2 border-t border-[#EFE4E4] flex items-center justify-between text-[11px] font-mono text-[#8C7575]">
              <span>{formatKolkataTime(enq.createdAt)}</span>
              <span className="text-[#E60000] font-bold flex items-center gap-0.5">
                Details <ArrowUpRight size={13} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Bar */}
      <div className="bg-white border border-[#E8DDDD] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <span className="text-[#6E4242]">
          Showing <strong>{startCount}</strong> to <strong>{endCount}</strong> of{" "}
          <strong>{total}</strong> enquiries
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E8DDDD] bg-[#FAF7F7] hover:bg-white disabled:opacity-40 transition-colors cursor-pointer font-bold"
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>

          <span className="px-2 text-[#1A0505] font-bold">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E8DDDD] bg-[#FAF7F7] hover:bg-white disabled:opacity-40 transition-colors cursor-pointer font-bold"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
