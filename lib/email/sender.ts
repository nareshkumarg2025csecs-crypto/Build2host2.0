import { getEmailTransporter, getMailFrom } from "./transport";
import { renderVisitorConfirmationEmail, renderTeamNotificationEmail } from "./templates";
import { EnquiryDoc, EnquiryEmailStatus } from "@/lib/types/enquiry";
import { getAdminDb } from "@/lib/firebase/admin";

/**
 * Dispatches both visitor confirmation and team notification emails via Promise.allSettled.
 * Updates the Firestore document with the final emailStatus.
 */
export async function sendEnquiryEmails(doc: EnquiryDoc): Promise<EnquiryEmailStatus> {
  const transporter = getEmailTransporter();
  if (!transporter) {
    console.warn(`[Email Dispatch] Skipped email sending for ${doc.ref}: SMTP transport not configured.`);
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
    console.error(`[Email Error] Visitor confirmation failed for ${doc.ref}:`, visitorRes.reason);
    status = "failed";
  } else {
    console.log(`[Email Success] Visitor confirmation sent for ${doc.ref} to ${doc.email}`);
  }

  if (teamRes.status === "rejected") {
    console.error(`[Email Error] Team notification failed for ${doc.ref}:`, teamRes.reason);
  } else {
    console.log(`[Email Success] Team notification sent for ${doc.ref} to ${teamData.to}`);
  }

  // Record emailStatus in Firestore
  try {
    const db = getAdminDb();
    await db.collection("enquiries").doc(doc.ref).update({
      emailStatus: status,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(`[Firestore Update Error] Could not update emailStatus for ${doc.ref}:`, err);
  }

  return status;
}

/**
 * Resends the visitor confirmation email from admin panel
 */
export async function resendVisitorConfirmationEmail(doc: EnquiryDoc): Promise<boolean> {
  const transporter = getEmailTransporter();
  if (!transporter) {
    console.warn("[Resend Confirmation] SMTP transport not configured");
    return false;
  }

  const from = getMailFrom();
  const visitorData = renderVisitorConfirmationEmail(doc);

  try {
    await transporter.sendMail({
      from,
      to: doc.email,
      replyTo: visitorData.replyTo,
      subject: visitorData.subject,
      html: visitorData.html,
      text: visitorData.text,
    });

    const db = getAdminDb();
    await db.collection("enquiries").doc(doc.ref).update({
      emailStatus: "sent",
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error(`[Resend Error] Could not resend confirmation for ${doc.ref}:`, err);
    return false;
  }
}
