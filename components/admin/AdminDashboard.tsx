"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { AdminRole } from "@/lib/admin-auth";
import { EnquiryDoc } from "@/lib/types/enquiry";
import { AdminHeader } from "./AdminHeader";
import { DashboardStats } from "./DashboardStats";
import { EnquiriesFilter } from "./EnquiriesFilter";
import { EnquiriesTable } from "./EnquiriesTable";
import { EnquiryDetailDrawer } from "./EnquiryDetailDrawer";
import { AlertCircle } from "lucide-react";

interface AdminDashboardProps {
  email: string;
  role: AdminRole;
}

export function AdminDashboard({ email, role }: AdminDashboardProps) {
  const searchParams = useSearchParams();
  const urlRef = searchParams.get("ref");

  const [division, setDivision] = useState<string>(
    role === "websites" ? "websites" : role === "automation" ? "automation" : "all"
  );
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const [enquiries, setEnquiries] = useState<EnquiryDoc[]>([]);
  const [stats, setStats] = useState({
    new: 0,
    contacted: 0,
    won: 0,
    lost: 0,
    thisMonth: 0,
    total: 0,
    websitesCount: 0,
    automationCount: 0,
  });
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryDoc | null>(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const params = new URLSearchParams();
      if (division !== "all") params.set("division", division);
      if (status !== "all") params.set("status", status);
      if (search) params.set("search", search);
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      params.set("page", page.toString());
      params.set("pageSize", "25");

      const res = await fetch(`/api/admin/enquiries?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch enquiries");
      }

      setEnquiries(data.enquiries || []);
      if (data.stats) setStats(data.stats);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);

      // If URL has ?ref=..., open that enquiry directly
      if (urlRef) {
        const found = (data.enquiries as EnquiryDoc[]).find((e) => e.ref === urlRef);
        if (found) {
          setSelectedEnquiry(found);
        } else {
          // Attempt single fetch
          try {
            const singleRes = await fetch(`/api/admin/enquiries/${urlRef}`);
            const singleData = await singleRes.json();
            if (singleRes.ok && singleData.enquiry) {
              setSelectedEnquiry(singleData.enquiry);
            }
          } catch {
            // Ignore if not found
          }
        }
      }
    } catch (err: unknown) {
      console.error("[Dashboard Fetch Error]:", err);
      setErrorMsg(err instanceof Error ? err.message : "Error loading enquiries");
    } finally {
      setLoading(false);
    }
  }, [division, status, search, startDate, endDate, page, urlRef]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // When updating an enquiry in drawer, update state locally
  const handleEnquiryUpdate = (updated: EnquiryDoc) => {
    setSelectedEnquiry(updated);
    setEnquiries((prev) =>
      prev.map((e) => (e.ref === updated.ref ? { ...e, ...updated } : e))
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F1E8] flex flex-col font-sans">
      <AdminHeader email={email} role={role} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-[#FFF0F0] border border-[#F8B4B4] rounded-2xl p-4 flex items-center gap-3 text-xs font-mono text-[#C40000]">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dashboard Strip */}
        <DashboardStats stats={stats} role={role} />

        {/* Filters Toolbar */}
        <EnquiriesFilter
          division={division}
          setDivision={(d) => {
            setDivision(d);
            setPage(1);
          }}
          status={status}
          setStatus={(s) => {
            setStatus(s);
            setPage(1);
          }}
          search={search}
          setSearch={(s) => {
            setSearch(s);
            setPage(1);
          }}
          startDate={startDate}
          setStartDate={(d) => {
            setStartDate(d);
            setPage(1);
          }}
          endDate={endDate}
          setEndDate={(d) => {
            setEndDate(d);
            setPage(1);
          }}
          role={role}
          onRefresh={fetchEnquiries}
          loading={loading}
        />

        {/* Enquiries List & Pagination */}
        <EnquiriesTable
          enquiries={enquiries}
          loading={loading}
          onSelect={(enq) => setSelectedEnquiry(enq)}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          total={total}
          pageSize={25}
        />
      </main>

      {/* Detail Drawer */}
      {selectedEnquiry && (
        <EnquiryDetailDrawer
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onUpdate={handleEnquiryUpdate}
        />
      )}
    </div>
  );
}
