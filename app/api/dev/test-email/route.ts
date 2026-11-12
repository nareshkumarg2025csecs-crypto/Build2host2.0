import { NextRequest, NextResponse } from "next/server";
import { renderVisitorConfirmationEmail, renderTeamNotificationEmail } from "@/lib/email/templates";
import { EnquiryDoc } from "@/lib/types/enquiry";
import { getEmailTransporter, getMailFrom } from "@/lib/email/transport";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not Found", { status: 404 });
  }

  const division = req.nextUrl.searchParams.get("division") === "automation" ? "automation" : "websites";
  const type = req.nextUrl.searchParams.get("type") || "visitor"; // "visitor" | "team"
  const send = req.nextUrl.searchParams.get("send") === "true";

  const sampleDoc: EnquiryDoc = {
    ref: division === "websites" ? "B2H-W-261112-9F2A" : "B2H-A-261112-4C18",
    division,
    name: "John Doe",
    phone: "9840212345",
    email: "test@domain.com",
    businessName: division === "websites" ? "Acme Studio" : "",
    agencyName: division === "automation" ? "Apex Realty" : "",
    city: "Chennai",
    packageOrServices: division === "websites" ? ["Business (₹12,999)"] : ["Complete AI Lead Suite"],
    addOns: division === "websites" ? ["Blog & CMS", "SEO Setup"] : [],
    timeline: division === "websites" ? "2-3 weeks" : "",
    monthlyEnquiryVolume: division === "automation" ? "50–200 leads/mo" : "",
    message: "Test enquiry message for email preview verification.",
    consent: true,
    consentAt: new Date().toISOString(),
    privacyPolicyVersion: "2026-v1",
    status: "new",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    emailStatus: "pending",
    userAgent: "Mozilla/5.0 Test Browser",
    hashedIp: "test_ip_hash",
  };

  const rendered =
    type === "team"
      ? renderTeamNotificationEmail(sampleDoc)
      : renderVisitorConfirmationEmail(sampleDoc);

  if (send) {
    const transporter = getEmailTransporter();
    if (!transporter) {
      return NextResponse.json({
        error: "SMTP not configured. Set SMTP_USER and SMTP_APP_PASSWORD.",
      });
    }

    try {
      const from = getMailFrom();
      const target = req.nextUrl.searchParams.get("to") || sampleDoc.email;
      const res = await transporter.sendMail({
        from,
        to: target,
        subject: `[DEV TEST] ${rendered.subject}`,
        html: rendered.html,
        text: rendered.text,
      });
      return NextResponse.json({ ok: true, messageId: res.messageId, to: target });
    } catch (err: unknown) {
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  return new NextResponse(rendered.html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
