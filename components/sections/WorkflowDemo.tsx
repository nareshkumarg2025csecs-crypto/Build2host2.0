"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, MessageSquare, Table, Bell, RefreshCw, Send } from "lucide-react";

export function WorkflowDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="border border-[#F7F1E8]/20 bg-[#540000]/60 rounded-3xl p-6 md:p-10 relative overflow-hidden backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#F7F1E8]/15 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <p className="font-mono text-xs uppercase tracking-wider text-[#F7F1E8]/70">
            Interactive Workflow Architecture
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] px-3 py-1 bg-[#F7F1E8]/10 text-[#F7F1E8]/80 rounded border border-[#F7F1E8]/15">
            Sample data, not a client result.
          </span>
          <button
            onClick={() => setStep((prev) => (prev + 1) % 4)}
            className="flex items-center gap-1.5 font-mono text-xs text-[#F7F1E8]/60 hover:text-[#F7F1E8] transition-colors max-md:min-h-[44px] max-md:px-2"
            title="Next Step"
          >
            <RefreshCw size={12} />
            <span>Cycle Step</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Panel 1: WhatsApp Conversation */}
        <div className="lg:col-span-5 bg-[#3B0000] border border-[#F7F1E8]/15 rounded-2xl p-5 shadow-2xl flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F7F1E8]/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  WA
                </div>
                <div>
                  <p className="font-sans text-xs font-semibold text-[#F7F1E8]">
                    Property Lead Desk
                  </p>
                  <p className="font-mono text-[10px] text-emerald-400">Automated Assistant</p>
                </div>
              </div>
              <span className="font-mono text-[10px] text-[#F7F1E8]/40">Active</span>
            </div>

            <div className="space-y-3 font-sans text-xs">
              {/* Prospect message */}
              <div className="flex flex-col items-start">
                <div className="bg-[#4D0505] border border-[#F7F1E8]/10 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] text-[#F7F1E8]/90">
                  <p>Hi, looking for a 2 BHK in Velachery around 70 lakh.</p>
                  <span className="block text-[9px] font-mono text-[#F7F1E8]/40 text-right mt-1">
                    10:14 AM
                  </span>
                </div>
              </div>

              {/* Bot instant reply */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-end"
              >
                <div className="bg-[#E60000] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] text-[#F7F1E8] shadow-md">
                  <p>
                    Hello! We have multiple gated community units matching that range. Are you
                    looking to buy for immediate possession, or under-construction?
                  </p>
                  <span className="block text-[9px] font-mono text-[#F7F1E8]/70 text-right mt-1">
                    10:14 AM &middot; Delivered
                  </span>
                </div>
              </motion.div>

              {/* Prospect followup */}
              {step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-start"
                >
                  <div className="bg-[#4D0505] border border-[#F7F1E8]/10 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] text-[#F7F1E8]/90">
                    <p>Ready to move in within 2 months. Self-funding + loan pre-approved.</p>
                    <span className="block text-[9px] font-mono text-[#F7F1E8]/40 text-right mt-1">
                      10:15 AM
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Bot qualification summary */}
              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-end"
                >
                  <div className="bg-[#E60000] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] text-[#F7F1E8] shadow-md">
                    <p>
                      Got it! I&apos;ve logged your requirement. Our area advisor will share 2 verified
                      brochures shortly.
                    </p>
                    <span className="block text-[9px] font-mono text-[#F7F1E8]/70 text-right mt-1">
                      10:15 AM &middot; Qualified
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#F7F1E8]/10 flex items-center justify-between text-[#F7F1E8]/40 text-[11px] font-mono">
            <span>Conversational Intent Parsing</span>
            <Check size={14} className="text-emerald-400" />
          </div>
        </div>

        {/* Panel 2 & 3: Structured Lead Row & Agent Notification */}
        <div className="lg:col-span-7 space-y-6">
          {/* Structured Sheet Row */}
          <div className="bg-[#3B0000] border border-[#F7F1E8]/15 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Table size={16} className="text-[#F7F1E8]/60" />
                <h4 className="font-serif text-lg text-[#F7F1E8]">Normalized Lead Record</h4>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Google Sheets / CRM Sync
              </span>
            </div>

            <div className="overflow-x-auto w-full no-scrollbar">
              <table className="w-full min-w-[340px] text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#F7F1E8]/15 text-[#F7F1E8]/50 text-[10px] uppercase">
                    <th className="pb-2">Field</th>
                    <th className="pb-2">Extracted Value</th>
                    <th className="pb-2">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F7F1E8]/10">
                  <tr>
                    <td className="py-2 text-[#F7F1E8]/70">Micro-Market</td>
                    <td className="py-2 text-[#F7F1E8] font-bold">Velachery, Chennai</td>
                    <td className="py-2 text-emerald-400">99%</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-[#F7F1E8]/70">Configuration</td>
                    <td className="py-2 text-[#F7F1E8] font-bold">2 BHK</td>
                    <td className="py-2 text-emerald-400">100%</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-[#F7F1E8]/70">Target Budget</td>
                    <td className="py-2 text-[#F7F1E8] font-bold">₹70,00,000 (~70 Lakhs)</td>
                    <td className="py-2 text-emerald-400">98%</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-[#F7F1E8]/70">Possession</td>
                    <td className="py-2 text-[#F7F1E8]">
                      {step >= 1 ? "Ready to move (within 60 days)" : "Extracting..."}
                    </td>
                    <td className="py-2 text-emerald-400">{step >= 1 ? "95%" : "—"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-[#F7F1E8]/70">Financial Status</td>
                    <td className="py-2 text-[#F7F1E8]">
                      {step >= 1 ? "Self + Pre-approved loan" : "Pending reply"}
                    </td>
                    <td className="py-2 text-emerald-400">{step >= 1 ? "92%" : "—"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-time Agent Notification Alert */}
          <motion.div
            animate={{
              borderColor: step >= 2 ? "rgba(248, 63, 65, 0.8)" : "rgba(247, 241, 232, 0.15)",
              backgroundColor: step >= 2 ? "rgba(110, 0, 0, 0.8)" : "rgba(59, 0, 0, 0.6)",
            }}
            transition={{ duration: 0.5 }}
            className="border rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-[#F83F41]" />
                <h4 className="font-serif text-lg text-[#F7F1E8]">Agent Dispatch Alert</h4>
              </div>
              <span className="font-mono text-[10px] text-[#F97B7E] uppercase tracking-wider">
                Telegram / WhatsApp / SMS
              </span>
            </div>

            <div className="font-mono text-xs text-[#F7F1E8]/85 space-y-2 bg-[#2D0000] p-4 rounded-xl border border-[#F7F1E8]/10">
              <p className="text-[#F97B7E] font-bold">
                [HIGH PRIORITY LEAD HANDOFF] &mdash; 10:15 AM
              </p>
              <p>Buyer: +91 98402 XXXXX &middot; Velachery 2 BHK &middot; ₹70L</p>
              <p className="text-[#F7F1E8]/70">
                Timeline: 60 days &middot; Financing: Loan pre-approved
              </p>
              <div className="pt-2 border-t border-[#F7F1E8]/10 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400">Assigned: Ajay (Velachery Lead Desk)</span>
                <span className="underline cursor-pointer text-[#F7F1E8] hover:text-[#F83F41]">
                  Click to Call &rarr;
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

