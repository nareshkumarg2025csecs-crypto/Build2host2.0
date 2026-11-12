import { getEmailTransporter, getMailFrom } from "./transport";
import { renderVisitorConfirmationEmail, renderTeamNotificationEmail } from "./templates";
import { EnquiryDoc, EnquiryEmailStatus } from "@/lib/types/enquiry";
import { getAdminDb } from "@/lib/firebase/admin";

export interface EmailDispatchReport {
  status: EnquiryEmailStatus;
  visitorMessageId?: string;
  teamMessageId?: string;
  visitorAccepted?: string[];
  teamAccepted?: string[];
  error?: string;
}

/**
 * Dispatches both visitor confirmation and team notification emails via Promise.allSettled.
 * Updates the Firestore document with the final emailStatus.
 */
export async function sendEnquiryEmails(doc: EnquiryDoc): Promise<EnquiryEmailStatus> {
  const transporter = getEmailTransporter();
  if (!transporter) {
    console.warn(`[enquiry:email] Skipped email sending for ${doc.ref}: SMTP transport not configured.`);
    return "failed";
  }

  const from = getMailFrom();
  const visitorData = renderVisitorConfirmationEmail(doc);
  const teamData = renderTeamNotificationEmail(doc);

  const visitorMailPromise = transporter.sendMail({
    from,
    to: doc.email,
    replyTo: visitorData.replyTo,
    subject: visitorData.subject,
    html: visitorData.html,
    text: visitorData.text,
  });

  const teamMailPromise = transporter.sendMail({
    from,
    to: teamData.to,
    cc: teamData.cc,
    replyTo: teamData.replyTo,
    subject: teamData.subject,
    html: teamData.html,
    text: teamData.text,
  });

  const [visitorRes, teamRes] = await Promise.allSettled([
    visitorMailPromise,
    teamMailPromise,
  ]);

  let status: EnquiryEmailStatus = "sent";

  if (visitorRes.status === "rejected") {
    const err = visitorRes.reason;
    console.error(`[enquiry:email] Visitor confirmation failed for ${doc.ref}:`, {
      code: (err as any)?.code,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    status = "failed";
  } else {
    console.log(`[enquiry:email] Visitor confirmation sent for ${doc.ref}:`, {
      to: doc.email,
      messageId: visitorRes.value?.messageId,
      accepted: visitorRes.value?.accepted,
      rejected: visitorRes.value?.rejected,
    });
  }

  if (teamRes.status === "rejected") {
    const err = teamRes.reason;
    console.error(`[enquiry:email] Team notification failed for ${doc.ref}:`, {
      code: (err as any)?.code,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  } else {
    console.log(`[enquiry:email] Team notification sent for ${doc.ref}:`, {
      to: teamData.to,
      cc: teamData.cc,
      messageId: teamRes.value?.messageId,
      accepted: teamRes.value?.accepted,
      rejected: teamRes.value?.rejected,
    });
  }

  // Record emailStatus in Firestore
  try {
    const db = getAdminDb();
    await db.collection("enquiries").doc(doc.ref).update({
      emailStatus: status,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error(`[enquiry:firestore-write] Could not update emailStatus for ${doc.ref}:`, {
      code: (err as any)?.code,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }

  return status;
}

/**
 * Fallback notification to the team when Firestore storage fails.
 * Ensures an incoming client lead is never lost even during database downtime.
 */
export async function sendFallbackLeadEmail(doc: EnquiryDoc, storageError: string): Promise<boolean> {
  const transporter = getEmailTransporter();
  if (!transporter) {
    console.warn(`[enquiry:email] Fallback lead email skipped for ${doc.ref}: SMTP not configured.`);
    return false;
  }

  const from = getMailFrom();
  const teamData = renderTeamNotificationEmail(doc);

  const fallbackSubject = `[URGENT LEAD - STORAGE FAILED] ${teamData.subject}`;
  const noticeHeader = `<div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 12px 16px; margin-bottom: 20px; font-family: monospace; font-size: 13px; color: #991b1b;">
    <strong>ATTENTION:</strong> Firestore storage failed for this enquiry (${storageError}). The lead details are preserved below for immediate manual follow-up.
  </div>`;

  try {
    const info = await transporter.sendMail({
      from,
      to: teamData.to,
      cc: teamData.cc,
      replyTo: teamData.replyTo,
      subject: fallbackSubject,
      html: noticeHeader + teamData.html,
      text: `ATTENTION: Firestore storage failed (${storageError}). Lead details:\n\n` + teamData.text,
    });

    console.log(`[enquiry:email] Fallback lead email dispatched for ${doc.ref}:`, {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });
    return true;
  } catch (err: unknown) {
    console.error(`[enquiry:email] Fallback lead email failed for ${doc.ref}:`, {
      code: (err as any)?.code,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return false;
  }
}

/**
 * Resends the visitor confirmation email from admin panel
 */
export async function resendVisitorConfirmationEmail(doc: EnquiryDoc): Promise<boolean> {
  const transporter = getEmailTransporter();
  if (!transporter) {
    console.warn("[enquiry:email] Resend confirmation skipped: SMTP transport not configured");
    return false;
  }

  const from = getMailFrom();
  const visitorData = renderVisitorConfirmationEmail(doc);

  try {
    const info = await transporter.sendMail({
      from,
      to: doc.email,
      replyTo: visitorData.replyTo,
      subject: visitorData.subject,
      html: visitorData.html,
      text: visitorData.text,
    });

    console.log(`[enquiry:email] Resend visitor confirmation sent for ${doc.ref}:`, {
      messageId: info.messageId,
      accepted: info.accepted,
    });

    const db = getAdminDb();
    await db.collection("enquiries").doc(doc.ref).update({
      emailStatus: "sent",
      updatedAt: new Date().toISOString(),
    });

    return true;
  } catch (err: unknown) {
    console.error(`[enquiry:email] Resend confirmation failed for ${doc.ref}:`, {
      code: (err as any)?.code,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return false;
  }
}
