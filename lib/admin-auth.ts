import { getAdminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

export type AdminRole = "owner" | "websites" | "automation";

export const SESSION_COOKIE_NAME = "b2h_admin_session";
export const SESSION_COOKIE_EXPIRY = 5 * 24 * 60 * 60 * 1000; // 5 days in ms

// Rate limiting for admin login: 5 failed attempts per 15 minutes per key
const loginFailedAttempts = new Map<string, number[]>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkLoginRateLimit(key: string): { isLocked: boolean; remainingMs?: number } {
  const now = Date.now();
  const history = (loginFailedAttempts.get(key) || []).filter((ts) => now - ts < LOCKOUT_WINDOW_MS);
  loginFailedAttempts.set(key, history);

  if (history.length >= MAX_FAILED_ATTEMPTS) {
    const oldest = history[0];
    const remainingMs = Math.max(0, LOCKOUT_WINDOW_MS - (now - oldest));
    return { isLocked: true, remainingMs };
  }

  return { isLocked: false };
}

export function recordFailedLoginAttempt(key: string): void {
  const now = Date.now();
  const history = (loginFailedAttempts.get(key) || []).filter((ts) => now - ts < LOCKOUT_WINDOW_MS);
  history.push(now);
  loginFailedAttempts.set(key, history);
}

export function clearFailedLoginAttempts(key: string): void {
  loginFailedAttempts.delete(key);
}

export function getAllowlistedEmails(): string[] {
  const envVal = process.env.ADMIN_EMAILS || "";
  return envVal
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function getAdminRolesMap(): Map<string, AdminRole> {
  const map = new Map<string, AdminRole>();
  const envVal = process.env.ADMIN_ROLES || "";
  // format: email:owner,email:websites,email:automation
  const entries = envVal.split(",").map((s) => s.trim()).filter(Boolean);

  for (const entry of entries) {
    const [rawEmail, rawRole] = entry.split(":");
    if (rawEmail && rawRole) {
      const email = rawEmail.trim().toLowerCase();
      const role = rawRole.trim().toLowerCase();
      if (role === "owner" || role === "websites" || role === "automation") {
        map.set(email, role as AdminRole);
      }
    }
  }

  return map;
}

export function getUserRole(email?: string | null): AdminRole | null {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  const allowlist = getAllowlistedEmails();

  // Allowlist MUST come ONLY from env variables. An empty allowlist rejects everyone.
  if (allowlist.length === 0 || !allowlist.includes(normalized)) {
    return null;
  }

  const rolesMap = getAdminRolesMap();
  const mappedRole = rolesMap.get(normalized);
  return mappedRole || "owner";
}

export interface AuthenticatedAdminUser {
  uid: string;
  email: string;
  role: AdminRole;
}

/**
 * Verifies the admin session cookie server-side via Firebase Admin SDK.
 * Validates the email against the allowlist on EVERY single request.
 * Returns the authenticated user or null.
 */
export async function verifyAdminSession(sessionCookie?: string | null): Promise<AuthenticatedAdminUser | null> {
  if (!sessionCookie) return null;

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    if (!decoded || !decoded.email) {
      return null;
    }

    const role = getUserRole(decoded.email);
    if (!role) {
      console.warn(`[Admin Auth] Access denied for ${decoded.email}: revoked or not in allowlist.`);
      return null;
    }

    return {
      uid: decoded.uid,
      email: decoded.email,
      role,
    };
  } catch {
    // Session cookie revoked, expired, or invalid
    return null;
  }
}

/**
 * Helper to get currently authenticated admin user from Next.js request cookies
 */
export async function getCurrentAdmin(): Promise<AuthenticatedAdminUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifyAdminSession(sessionCookie);
}
