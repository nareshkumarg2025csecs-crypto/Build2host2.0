import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import {
  getUserRole,
  verifyAdminSession,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_EXPIRY,
} from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    let idToken = body.idToken;

    // Server-side fallback authentication if client SDK was blocked by adblockers or network filters
    if (!idToken) {
      const email = typeof body.email === "string" ? body.email.trim() : "";
      const password = typeof body.password === "string" ? body.password : "";

      if (!email || !password) {
        return NextResponse.json({ error: "Missing login credentials" }, { status: 400 });
      }

      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: "Firebase API key missing" }, { status: 500 });
      }

      const authRes = await fetch(
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

      const authData = await authRes.json();
      if (!authRes.ok || !authData.idToken) {
        const errCode = authData.error?.message;
        if (
          errCode === "EMAIL_NOT_FOUND" ||
          errCode === "INVALID_PASSWORD" ||
          errCode === "INVALID_LOGIN_CREDENTIALS"
        ) {
          return NextResponse.json(
            { error: "Invalid email or password." },
            { status: 401 }
          );
        }
        return NextResponse.json(
          { error: errCode ? errCode.replace(/_/g, " ").toLowerCase() : "Authentication failed" },
          { status: 401 }
        );
      }

      idToken = authData.idToken;
    }

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const auth = getAdminAuth();
    const decodedToken = await auth.verifyIdToken(idToken);

    if (!decodedToken.email) {
      return NextResponse.json(
        { error: "Firebase account must have an associated email" },
        { status: 400 }
      );
    }

    const role = getUserRole(decodedToken.email);
    if (!role) {
      console.warn(
        `[Admin Session] Rejected login for ${decodedToken.email}: not in ADMIN_EMAILS allowlist`
      );
      return NextResponse.json(
        { error: "Access denied. Your email is not permitted to access this admin panel." },
        { status: 403 }
      );
    }

    // Create session cookie with 5-day expiry
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_COOKIE_EXPIRY,
    });

    const isProd = process.env.NODE_ENV === "production";
    const res = NextResponse.json({
      ok: true,
      email: decodedToken.email,
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
    console.error("[Admin Session Login Error]:", err);
    return NextResponse.json(
      { error: "Authentication failed. Please verify credentials." },
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
