"use client";

import React from "react";
import { Inbox, Clock, CheckCircle2, XCircle, Calendar, Layers } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    new: number;
    contacted: number;
    won: number;
    lost: number;
    thisMonth: number;
    total: number;
    websitesCount: number;
    automationCount: number;
  };
  role: string;
}

export function DashboardStats({ stats, role }: DashboardStatsProps) {
  const cards = [
    {
      label: "Total This Month",
      value: stats.thisMonth,
      icon: Calendar,
      color: "text-[#1A0505]",
      bg: "bg-white",
      border: "border-[#E8DDDD]",
      badge: `${stats.total} all-time`,
    },
    {
      label: "New Leads",
      value: stats.new,
      icon: Inbox,
      color: "text-[#E60000]",
      bg: "bg-[#FFF5F5]",
      border: "border-[#F8B4B4]",
      badge: "Action Required",
      badgeColor: "bg-[#E60000] text-white",
    },
    {
      label: "Contacted",
      value: stats.contacted,
      icon: Clock,
      color: "text-[#B45309]",
      bg: "bg-[#FFFBEB]",
      border: "border-[#FDE68A]",
      badge: "In Progress",
      badgeColor: "bg-[#FEF3C7] text-[#92400E]",
    },
    {
      label: "Won Deals",
      value: stats.won,
      icon: CheckCircle2,
      color: "text-[#15803D]",
      bg: "bg-[#F0FDF4]",
      border: "border-[#BBF7D0]",
      badge: "Converted",
      badgeColor: "bg-[#DCFCE7] text-[#166534]",
    },
    {
      label: "Lost / Closed",
      value: stats.lost,
      icon: XCircle,
      color: "text-[#6B7280]",
      bg: "bg-[#F9FAFB]",
      border: "border-[#E5E7EB]",
      badge: "Closed",
      badgeColor: "bg-[#F3F4F6] text-[#4B5563]",
    },
  ];

  return (
    <div className="space-y-3">
      {/* 5-Card Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className={`${c.bg} ${c.border} border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between ${
                i === 0 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-[#6E4242] uppercase tracking-wider font-semibold">
                  {c.label}
                </span>
                <Icon size={16} className={c.color} />
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className={`font-serif text-3xl font-bold ${c.color}`}>
                  {c.value}
                </span>
                {c.badge && (
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-md font-medium ${
                      c.badgeColor || "bg-[#EFE4E4] text-[#6E4242]"
                    }`}
                  >
                    {c.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Per Division Breakdown Pill for Owner */}
      {role === "owner" && (
        <div className="flex items-center gap-4 text-xs font-mono text-[#6E4242] bg-white border border-[#E8DDDD] rounded-xl px-4 py-2">
          <div className="flex items-center gap-1.5">
            <Layers size={13} className="text-[#E60000]" />
            <span className="font-bold">Division Breakdown:</span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              Websites: <strong className="text-[#1A0505]">{stats.websitesCount}</strong>
            </span>
            <span className="text-[#E8DDDD]">|</span>
            <span>
              Automation: <strong className="text-[#1A0505]">{stats.automationCount}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
