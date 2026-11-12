import nodemailer from "nodemailer";
import { renderVisitorConfirmationEmail, renderTeamNotificationEmail } from "../lib/email/templates";
import { EnquiryDoc } from "../lib/types/enquiry";
import { SITE } from "../lib/site";

async function main() {
  console.log("=== Built2host Email Template Test Runner ===\n");

  const sampleWebsiteDoc: EnquiryDoc = {
    ref: "B2H-W-261112-9F2A",
    division: "websites",
    name: "Naresh Kumar",
    phone: "9840264843",
    email: "naresh.kumar.g.2112@gmail.com",
    businessName: "Acme Designs Pvt Ltd",
    agencyName: "",
    city: "Chennai",
    packageOrServices: ["Premium Package (₹19,999)"],
    addOns: ["Domain & DNS Setup", "Multi-lingual Support"],
    timeline: "2-3 weeks",
    monthlyEnquiryVolume: "",
    message: "We need a clean, high-converting portfolio website for our architectural studio.",
    consent: true,
    consentAt: new Date().toISOString(),
    privacyPolicyVersion: "2026-v1",
    status: "new",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    emailStatus: "pending",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    hashedIp: "test-hashed-ip",
  };

  const sampleAutomationDoc: EnquiryDoc = {
    ref: "B2H-A-261112-4C18",
    division: "automation",
    name: "Ajay Surya",
    phone: "7200346975",
    email: "ajaysuryawork@gmail.com",
    businessName: "",
    agencyName: "Apex Realty Partners",
    city: "Bangalore",
    packageOrServices: ["AI WhatsApp Sales Assistant", "Meta Leads Webhook Instant Sync"],
    addOns: [],
    timeline: "",
    monthlyEnquiryVolume: "200–500 leads/mo",
    message: "Looking for an automated WhatsApp assistant to qualify buyer leads from 99acres and housing.com.",
    consent: true,
    consentAt: new Date().toISOString(),
    privacyPolicyVersion: "2026-v1",
    status: "new",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    emailStatus: "pending",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    hashedIp: "test-hashed-ip",
  };

  // Render Website Emails
  console.log("1. Rendering Website Visitor Confirmation Email...");
  const webVisitor = renderVisitorConfirmationEmail(sampleWebsiteDoc);
  console.log("  Subject:", webVisitor.subject);
  console.log("  ReplyTo:", webVisitor.replyTo);
  console.log("  HTML Size:", webVisitor.html.length, "bytes");

  console.log("\n2. Rendering Website Team Notification Email...");
  const webTeam = renderTeamNotificationEmail(sampleWebsiteDoc);
  console.log("  To:", webTeam.to);
  console.log("  CC:", webTeam.cc);
  console.log("  Subject:", webTeam.subject);
  console.log("  ReplyTo:", webTeam.replyTo);

  // Render Automation Emails
  console.log("\n3. Rendering Automation Visitor Confirmation Email...");
  const autoVisitor = renderVisitorConfirmationEmail(sampleAutomationDoc);
  console.log("  Subject:", autoVisitor.subject);
  console.log("  ReplyTo:", autoVisitor.replyTo);

  console.log("\n4. Rendering Automation Team Notification Email...");
  const autoTeam = renderTeamNotificationEmail(sampleAutomationDoc);
  console.log("  To:", autoTeam.to);
  console.log("  CC:", autoTeam.cc);
  console.log("  Subject:", autoTeam.subject);

  // If SMTP environment variables are present, attempt actual send
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_APP_PASSWORD;

  if (smtpUser && smtpPass) {
    console.log(`\nAttempting test send using ${smtpUser} via smtp.gmail.com:465...`);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const mailFrom = process.env.MAIL_FROM || `built2host <${smtpUser}>`;

    const info = await transporter.sendMail({
      from: mailFrom,
      to: sampleWebsiteDoc.email,
      replyTo: webVisitor.replyTo,
      subject: `[TEST] ${webVisitor.subject}`,
      html: webVisitor.html,
      text: webVisitor.text,
    });
    console.log("Test email sent successfully! MessageId:", info.messageId);
  } else {
    console.log("\n[INFO] SMTP_USER or SMTP_APP_PASSWORD not set in environment.");
    console.log("HTML rendering tests passed completely. To send live test emails, set SMTP_USER and SMTP_APP_PASSWORD in .env.local.");
  }
}

main().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
