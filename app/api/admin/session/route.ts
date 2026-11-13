import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import {
  getUserRole,
  verifyAdminSession,
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  clearFailedLoginAttempts,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_EXPIRY,
} from "@/lib/admin-auth";
import { hashIp } from "@/lib/enquiry";

function checkSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  if (!origin || !host) {
    // If no origin header (same-origin GET / non-CORS client), check referer
    const referer = req.headers.get("referer");
    if (!referer) return true; // Standard intra-app navigation
    try {
      const refHost = new URL(referer).host;
      return refHost === host;
    } catch {
      return false;
    }
  }

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // 1. Enforce same-origin check
  if (!checkSameOrigin(req)) {
    return NextResponse.json(
      { error: "Forbidden cross-origin request" },
      { status: 403 }
    );
  }

  const rawIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";
  const hashedIp = hashIp(rawIp);
  const ipRateLimitKey = `login_ip_${hashedIp}`;

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    let idToken = body.idToken;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const emailRateLimitKey = email ? `login_email_${email}` : null;

    // 2. Check rate limit for IP and email (5 failures per 15 minutes)
    const ipLimit = checkLoginRateLimit(ipRateLimitKey);
    if (ipLimit.isLocked) {
      return NextResponse.json(
        { error: "Too many failed login attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    if (emailRateLimitKey) {
      const emailLimit = checkLoginRateLimit(emailRateLimitKey);
      if (emailLimit.isLocked) {
        return NextResponse.json(
          { error: "Too many failed login attempts. Please try again in 15 minutes." },
          { status: 429 }
        );
      }
    }

    // 3. Fallback: server-side authentication if client SDK was blocked
    if (!idToken) {
      if (!email || !password) {
        recordFailedLoginAttempt(ipRateLimitKey);
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: "Authentication service unavailable" }, { status: 503 });
      }

      let authRes;
      try {
        authRes = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
              returnSecureToken: true,
            }),
          }
        );
      } catch {
        recordFailedLoginAttempt(ipRateLimitKey);
        if (emailRateLimitKey) recordFailedLoginAttempt(emailRateLimitKey);
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      const authData = await authRes.json().catch(() => ({}));
      if (!authRes.ok || !authData.idToken) {
        recordFailedLoginAttempt(ipRateLimitKey);
        if (emailRateLimitKey) recordFailedLoginAttempt(emailRateLimitKey);
        // Generic response: never reveal whether email exists
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      idToken = authData.idToken;
    }

    if (!idToken || typeof idToken !== "string") {
      recordFailedLoginAttempt(ipRateLimitKey);
      if (emailRateLimitKey) recordFailedLoginAttempt(emailRateLimitKey);
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // 4. Verify ID token and Allowlist on the server
    const auth = getAdminAuth();
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch {
      recordFailedLoginAttempt(ipRateLimitKey);
      if (emailRateLimitKey) recordFailedLoginAttempt(emailRateLimitKey);
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!decodedToken || !decodedToken.email) {
      recordFailedLoginAttempt(ipRateLimitKey);
      if (emailRateLimitKey) recordFailedLoginAttempt(emailRateLimitKey);
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const tokenEmail = decodedToken.email.toLowerCase().trim();
    const tokenEmailKey = `login_email_${tokenEmail}`;

    const role = getUserRole(tokenEmail);
    if (!role) {
      recordFailedLoginAttempt(ipRateLimitKey);
      recordFailedLoginAttempt(tokenEmailKey);
      // Generic error: never leak allowlist status
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // 5. Successful authentication -> clear rate-limiting counters
    clearFailedLoginAttempts(ipRateLimitKey);
    clearFailedLoginAttempts(tokenEmailKey);
    if (emailRateLimitKey) clearFailedLoginAttempts(emailRateLimitKey);

    // 6. Create session cookie with 5-day expiry
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_COOKIE_EXPIRY,
    });

    const isProd = process.env.NODE_ENV === "production";
    const res = NextResponse.json({
      ok: true,
      email: tokenEmail,
      role,
    });

    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      maxAge: 5 * 24 * 60 * 60, // 5 days in seconds
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (err: unknown) {
    recordFailedLoginAttempt(ipRateLimitKey);
    console.error("[Admin Session Auth Exception]:", (err as any)?.message || "Internal auth failure");
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    maxAge: 0,
    path: "/",
  });
  return res;
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const admin = await verifyAdminSession(sessionCookie);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      email: admin.email,
      role: admin.role,
    },
  });
}
