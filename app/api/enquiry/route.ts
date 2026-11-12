import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminDb, getMissingAdminEnv } from "@/lib/firebase/admin";
import {
  generateEnquiryRef,
  hashIp,
  checkRateLimit,
  sanitize,
} from "@/lib/enquiry";
import { EnquiryDoc, EnquiryEmailStatus } from "@/lib/types/enquiry";
import { sendEnquiryEmails, sendFallbackLeadEmail } from "@/lib/email/sender";

const enquirySchema = z.object({
  type: z.enum(["websites", "automation"]),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  email: z.string().email("Please provide a valid email address").max(120),
  businessName: z.string().max(120).optional().or(z.literal("")),
  agencyName: z.string().max(120).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  package: z.string().optional().or(z.literal("")),
  addons: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  enquiryVolume: z.string().optional().or(z.literal("")),
  timeline: z.string().optional().or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
  honeypot: z.string().max(0, "Bot detected"),
  submittedAt: z.number(),
  consent: z.literal(true, {
    message: "You must consent to be contacted",
  }),
});

export async function POST(req: NextRequest) {
  try {
    const rawIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const hashedIp = hashIp(rawIp);

    // Rate limit: 5 submissions per hour per hashed IP
    if (checkRateLimit(hashedIp, 5, 60 * 60 * 1000)) {
      console.warn(`[enquiry:rate-limit] Submission rejected: rate limit exceeded for hashed IP: ${hashedIp}`);
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly or contact us via WhatsApp." },
        { status: 429 }
      );
    }

    let rawBody;
    try {
      rawBody = await req.json();
    } catch (parseErr) {
      console.warn(`[enquiry:body] Failed to parse request JSON:`, parseErr);
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const parseResult = enquirySchema.safeParse(rawBody);
    if (!parseResult.success) {
      console.warn(`[enquiry:validation] Validation error:`, parseResult.error.flatten().fieldErrors);
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const data = parseResult.data;

    // Time-trap spam protection: minimum 2.5 seconds human deliberation
    const elapsedMs = Date.now() - data.submittedAt;
    if (elapsedMs < 2500) {
      console.warn(`[enquiry:time-trap] Submission too fast (${elapsedMs}ms < 2500ms) for IP ${hashedIp}`);
      return NextResponse.json(
        { error: "Submission too fast. Please take your time." },
        { status: 422 }
      );
    }

    // Build the enquiry document
    const ref = generateEnquiryRef(data.type);
    const nowIso = new Date().toISOString();
    const userAgent = (req.headers.get("user-agent") || "").slice(0, 200);

    const isWebsites = data.type === "websites";
    const packageOrServices = isWebsites
      ? data.package ? [sanitize(data.package, 100)] : []
      : (data.services || []).map((s) => sanitize(s, 100));
    const addOns = (data.addons || []).map((a) => sanitize(a, 100));

    const enquiryDoc: EnquiryDoc = {
      ref,
      division: data.type,
      name: sanitize(data.name, 100),
      phone: sanitize(data.phone, 30),
      email: sanitize(data.email, 120),
      businessName: sanitize(data.businessName || "", 120),
      agencyName: sanitize(data.agencyName || "", 120),
      city: sanitize(data.city || "", 100),
      packageOrServices,
      addOns,
      timeline: sanitize(data.timeline || "", 50),
      monthlyEnquiryVolume: sanitize(data.enquiryVolume || "", 50),
      message: sanitize(data.description || data.notes || "", 2000),
      consent: true,
      consentAt: nowIso,
      privacyPolicyVersion: "2026-v1",
      status: "new",
      notes: "",
      createdAt: nowIso,
      createdAtTimestamp: Date.now(),
      updatedAt: nowIso,
      emailStatus: "pending",
      userAgent,
      hashedIp,
      history: [
        {
          status: "new",
          changedBy: "system",
          changedAt: nowIso,
        },
      ],
    };

    // Check Firebase environment configuration
    const missingAdminEnv = getMissingAdminEnv();
    if (missingAdminEnv.length > 0) {
      console.error(
        `[enquiry:env] Missing required Firebase Admin environment variables: ${missingAdminEnv.join(", ")}`
      );

      // Lead protection: attempt to email team directly so lead is never lost
      await sendFallbackLeadEmail(
        enquiryDoc,
        `Missing Firebase Admin environment variables: ${missingAdminEnv.join(", ")}`
      );

      return NextResponse.json(
        { error: "Enquiry storage service is temporarily unavailable. Please reach us directly on WhatsApp." },
        { status: 503 }
      );
    }

    // Initialize Firebase Admin DB
    let db;
    try {
      db = getAdminDb();
    } catch (initErr: unknown) {
      console.error(`[enquiry:firebase-init] Failed to initialize Firebase Admin SDK:`, {
        code: (initErr as any)?.code || (initErr as any)?.name || "INIT_FAILED",
        message: initErr instanceof Error ? initErr.message : String(initErr),
        stack: initErr instanceof Error ? initErr.stack : undefined,
      });

      // Lead protection: send backup lead email to team
      await sendFallbackLeadEmail(
        enquiryDoc,
        `Firebase Admin SDK initialization failure: ${initErr instanceof Error ? initErr.message : String(initErr)}`
      );

      return NextResponse.json(
        { error: "Enquiry storage service is temporarily unavailable. Please reach us directly on WhatsApp." },
        { status: 503 }
      );
    }

    // Write to Firestore with Admin SDK
    try {
      await db.collection("enquiries").doc(ref).set(enquiryDoc);
    } catch (dbErr: unknown) {
      console.error(`[enquiry:firestore-write] Failed to write enquiry ${ref} to Firestore:`, {
        code: (dbErr as any)?.code || "FIRESTORE_WRITE_ERROR",
        message: dbErr instanceof Error ? dbErr.message : String(dbErr),
        stack: dbErr instanceof Error ? dbErr.stack : undefined,
      });

      // Lead protection: send backup lead email to team so lead is not lost
      await sendFallbackLeadEmail(
        enquiryDoc,
        `Firestore write failure: ${dbErr instanceof Error ? dbErr.message : String(dbErr)}`
      );

      return NextResponse.json(
        { error: "Enquiry storage service is temporarily unavailable. Please reach us directly on WhatsApp." },
        { status: 500 }
      );
    }

    // Independent email sending: enquiry is safely stored in Firestore
    let emailStatus: EnquiryEmailStatus = "sent";
    try {
      emailStatus = await sendEnquiryEmails(enquiryDoc);
    } catch (emailErr: unknown) {
      console.error(`[enquiry:email] Uncaught email dispatch error for ${ref}:`, {
        code: (emailErr as any)?.code,
        message: emailErr instanceof Error ? emailErr.message : String(emailErr),
        stack: emailErr instanceof Error ? emailErr.stack : undefined,
      });
      emailStatus = "failed";
    }

    return NextResponse.json({
      ok: true,
      ref,
      emailStatus,
    });
  } catch (err: unknown) {
    console.error("[enquiry:unhandled] Unexpected exception in enquiry route:", {
      code: (err as any)?.code,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return NextResponse.json(
      { error: "Enquiry storage service is temporarily unavailable. Please reach us directly on WhatsApp." },
      { status: 500 }
    );
  }
}
