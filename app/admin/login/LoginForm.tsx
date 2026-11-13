"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getClientFirebaseAuth } from "@/lib/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      let idToken: string | null = null;

      // 1. Attempt Client Firebase Auth
      try {
        const auth = getClientFirebaseAuth();
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        idToken = await userCredential.user.getIdToken();
      } catch (clientErr: unknown) {
        // If client network is blocked by adblockers, Brave Shields, or CORS, fall back to direct session auth
        console.warn(
          "[Login Info] Client SDK blocked or offline, using server verification fallback:",
          clientErr
        );
      }

      // 2. Submit to session endpoint (either with idToken or direct credentials fallback)
      const payload = idToken
        ? { idToken }
        : { email: email.trim(), password };

      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Invalid email or password.");
      }

      // Successfully authenticated & session cookie set
      window.location.href = "/admin";
    } catch (err: unknown) {
      let msg = "Invalid email or password.";
      if (err instanceof Error) {
        if (err.message.includes("15 minutes") || err.message.includes("Too many")) {
          msg = err.message;
        } else if (err.message.includes("Invalid")) {
          msg = err.message;
        }
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-[#EFE4E4] rounded-3xl shadow-xl overflow-hidden">
        {/* Brand Header */}
        <div className="bg-[#E60000] p-8 text-center text-[#F7F1E8]">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Lock size={22} className="text-[#F7F1E8]" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight">built2host Admin</h1>
          <p className="font-mono text-xs opacity-85 mt-1 tracking-wider uppercase">
            Restricted Staff Portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-[#FAF0F0] border border-[#F8B4B4] rounded-xl text-xs font-mono text-[#C40000] flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-[#6E4242] uppercase tracking-wider mb-2 font-semibold">
              Authorised Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-[#A08585]" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@built2host.in"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF7F7] border border-[#E8DDDD] rounded-xl text-sm text-[#1A0505] placeholder:text-[#A08585] focus:outline-none focus:border-[#E60000] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#6E4242] uppercase tracking-wider mb-2 font-semibold">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-[#A08585]" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF7F7] border border-[#E8DDDD] rounded-xl text-sm text-[#1A0505] placeholder:text-[#A08585] focus:outline-none focus:border-[#E60000] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E60000] text-white py-3.5 px-6 rounded-xl font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#C40000] shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Admin"}</span>
            {!loading && <ArrowRight size={14} />}
          </button>

          <p className="font-mono text-[11px] text-center text-[#8C7575] leading-relaxed">
            Access strictly limited to authorised emails listed in system security policy.
          </p>
        </form>
      </div>
    </div>
  );
}
