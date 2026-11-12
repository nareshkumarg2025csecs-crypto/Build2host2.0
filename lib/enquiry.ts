import crypto from "crypto";
import { EnquiryDivision } from "./types/enquiry";

/**
 * Generates human-readable reference IDs:
 * Websites: B2H-W-YYMMDD-XXXX
 * Automation: B2H-A-YYMMDD-XXXX
 */
export function generateEnquiryRef(division: EnquiryDivision): string {
  const code = division === "websites" ? "W" : "A";
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const randomHex = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `B2H-${code}-${yy}${mm}${dd}-${randomHex}`;
}

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || "b2h_fallback_salt_2026";
  return crypto.createHash("sha256").update(`${ip}::${salt}`).digest("hex");
}

// In-memory rate limiting: max 5 requests per hour per hashed IP
const rateLimitCache = new Map<string, number[]>();

export function checkRateLimit(hashedIp: string, maxHits = 5, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const history = rateLimitCache.get(hashedIp) || [];
  const valid = history.filter((time) => now - time < windowMs);

  if (valid.length >= maxHits) {
    return true; // Rate limited
  }

  valid.push(now);
  rateLimitCache.set(hashedIp, valid);
  return false;
}

export function sanitize(text?: string | null, maxLen = 2000): string {
  if (!text) return "";
  return text
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLen);
}

export function escapeHtml(str?: string | null): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function normalizeWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return `91${digits.slice(1)}`;
  }
  return digits;
}

/**
 * Formats ISO date into Asia/Kolkata date and time
 */
export function formatKolkataTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return isoString;
  }
}
