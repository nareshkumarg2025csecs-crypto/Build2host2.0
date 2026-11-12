"use client";

import React from "react";
import Link from "next/link";
import { AdminRole } from "@/lib/admin-auth";
import { LogOut, Shield, User } from "lucide-react";

interface AdminHeaderProps {
  email: string;
  role: AdminRole;
}

export function AdminHeader({ email, role }: AdminHeaderProps) {
  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
    } catch {
      // Continue to redirect
    }
    window.location.href = "/admin/login";
  };

  const getRoleBadgeStyle = (r: AdminRole) => {
    switch (r) {
      case "owner":
        return "bg-[#F7F1E8] text-[#E60000] border-[#F7F1E8]";
      case "websites":
        return "bg-[#800000] text-[#F7F1E8] border-[#F7F1E8]/30";
      case "automation":
        return "bg-[#540000] text-[#F7F1E8] border-[#F7F1E8]/30";
    }
  };

  return (
    <header className="bg-[#E60000] text-[#F7F1E8] shadow-md border-b border-[#C40000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-serif text-lg font-bold border border-white/20">
            b2h
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-tight">built2host</span>
              <span className="text-[10px] font-mono tracking-widest uppercase bg-black/20 px-2 py-0.5 rounded text-white/90">
                Admin
              </span>
            </div>
            <p className="font-mono text-[10px] text-[#F7F1E8]/70 hidden sm:block">
              Enquiry &amp; Pipeline Management
            </p>
          </div>
        </div>

        {/* User Badges & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-black/15 px-3 py-1.5 rounded-xl border border-white/10">
            <User size={13} className="text-[#F7F1E8]/70" />
            <span className="font-mono text-xs text-[#F7F1E8]">{email}</span>
            <span
              className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getRoleBadgeStyle(
                role
              )}`}
            >
              {role}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 bg-[#FAF7F7] hover:bg-white text-[#E60000] px-3.5 py-1.5 rounded-lg font-sans font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
