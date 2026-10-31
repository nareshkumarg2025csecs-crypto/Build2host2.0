import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SITE } from "@/lib/site";

const enquirySchema = z.object({
  type: z.enum(["websites", "automation"]),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
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

// Simple in-memory rate limiting: max 4 requests per IP per minute
const ipHits = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxLimit = 4;

  const hits = ipHits.get(ip) || [];
  const validHits = hits.filter((time) => now - time < windowMs);

  if (validHits.length >= maxLimit) {
    return true; // Rate limited
  }

  validHits.push(now);
  ipHits.set(ip, validHits);
  return false;
}

function sanitize(text?: string): string {
  if (!text) return "";
  return text.replace(/[<>]/g, "").trim().slice(0, 2000);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown-ip";

    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly or contact us via WhatsApp." },
        { status: 429 }
      );
    }

    let rawBody;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const parseResult = enquirySchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const data = parseResult.data;

    // Time-trap spam protection: If submitted in less than 2.5 seconds, likely a bot
    const elapsedMs = Date.now() - data.submittedAt;
    if (elapsedMs < 2500) {
      return NextResponse.json(
        { error: "Submission too fast. Please take your time." },
        { status: 422 }
      );
    }

    const isWebsites = data.type === "websites";
    const divisionEmail = isWebsites
      ? SITE.websiteDivision.email
      : SITE.automationDivision.email;
    const commonEmail = SITE.commonEmail;

    const emailSubject = `[${data.type.toUpperCase()} ENQUIRY] from ${sanitize(data.name)}`;

    const textContent = [
      `New Lead Enquiry received on built2host.in:`,
      `-----------------------------------------`,
      `Division: ${data.type.toUpperCase()}`,
      `Name: ${sanitize(data.name)}`,
      `Phone: ${sanitize(data.phone)}`,
      data.email ? `Email: ${sanitize(data.email)}` : null,
      data.businessName ? `Business/Brand: ${sanitize(data.businessName)}` : null,
      data.agencyName ? `Agency Name: ${sanitize(data.agencyName)}` : null,
      data.city ? `City: ${sanitize(data.city)}` : null,
      data.package ? `Selected Package: ${sanitize(data.package)}` : null,
      data.services && data.services.length > 0
        ? `Selected Services: ${data.services.map(sanitize).join(", ")}`
        : null,
      data.addons && data.addons.length > 0
        ? `Selected Add-ons: ${data.addons.map(sanitize).join(", ")}`
        : null,
      data.enquiryVolume ? `Monthly Enquiries: ${sanitize(data.enquiryVolume)}` : null,
      data.timeline ? `Timeline: ${sanitize(data.timeline)}` : null,
      data.description ? `Project Scope: ${sanitize(data.description)}` : null,
      data.notes ? `Notes / Requirement: ${sanitize(data.notes)}` : null,
      `Consent Given: Yes`,
      `Received At: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join("\n");

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("[DEV ENQUIRY LOG - NO RESEND API KEY SET]");
      console.log("To:", divisionEmail);
      console.log("CC:", commonEmail);
      console.log("Subject:", emailSubject);
      console.log("Content:\n", textContent);
      return NextResponse.json({ ok: true, devMode: true });
    }

    // Call Resend API
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "built2host Enquiries <enquiries@built2host.in>",
        to: [divisionEmail],
        cc: [commonEmail],
        subject: emailSubject,
        text: textContent,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error("[Resend Error]:", errText);
      // Even if Resend fails in development, don't break user flow
      return NextResponse.json({ ok: true, emailNotice: "Queued" });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("[Enquiry Handler Exception]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
