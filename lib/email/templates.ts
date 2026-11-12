import { SITE, makeWhatsAppUrl } from "@/lib/site";
import { EnquiryDoc } from "@/lib/types/enquiry";
import { escapeHtml, normalizeWhatsAppNumber } from "@/lib/enquiry";

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || SITE.url;
}

/**
 * Builds the Visitor Confirmation Email (HTML + Plain text)
 */
export function renderVisitorConfirmationEmail(doc: EnquiryDoc): {
  subject: string;
  html: string;
  text: string;
  replyTo: string;
} {
  const isWebsites = doc.division === "websites";
  const divisionTitle = isWebsites ? "Websites" : "Automation";
  const divisionContact = isWebsites ? SITE.websiteDivision : SITE.automationDivision;
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const logoUrl = `${siteUrl}/brand/logo-mark.png`;

  const firstName = doc.name.trim().split(/\s+/)[0] || doc.name;
  const safeFirstName = escapeHtml(firstName);
  const safeName = escapeHtml(doc.name);
  const safeRef = escapeHtml(doc.ref);
  const safePhone = escapeHtml(doc.phone);
  const safeBusiness = escapeHtml(doc.businessName || doc.agencyName || "N/A");
  const pkgOrServicesList = doc.packageOrServices.length > 0 ? doc.packageOrServices.join(", ") : "N/A";
  const safePackageOrServices = escapeHtml(pkgOrServicesList);
  const timelineOrVolume = isWebsites ? doc.timeline || "N/A" : doc.monthlyEnquiryVolume || "N/A";
  const safeTimelineOrVolume = escapeHtml(timelineOrVolume);

  const waPrefill = `Hi built2host! I submitted enquiry ${doc.ref} for ${divisionTitle} and would like to continue our discussion.`;
  const whatsappUrl = makeWhatsAppUrl(divisionContact.whatsapp, waPrefill);

  const subject = "We've received your enquiry | built2host";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0; padding:0; background-color:#FAF4F4; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1A0505;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAF4F4; padding:32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background-color:#FFFFFF; border-radius:16px; overflow:hidden; border:1px solid #F0E2E2; box-shadow:0 4px 20px rgba(0,0,0,0.04);">
          <!-- Brand Header Band -->
          <tr>
            <td style="background-color:#E60000; padding:28px 24px; text-align:center;">
              <img src="${logoUrl}" alt="built2host logo" width="64" height="64" style="display:block; margin:0 auto 12px auto; width:64px; height:auto; border:0;" />
              <div style="font-family:'Courier New', Courier, monospace; font-size:12px; letter-spacing:3px; color:#F7F1E8; text-transform:uppercase; font-weight:700;">
                ENQUIRY RECEIVED
              </div>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding:32px 28px 24px 28px;">
              <h1 style="margin:0 0 16px 0; font-size:24px; line-height:32px; color:#1A0505; font-weight:700;">
                Thanks for reaching out, ${safeFirstName}
              </h1>
              <p style="margin:0 0 24px 0; font-size:14px; line-height:22px; color:#4A3232;">
                Your enquiry for <strong>${divisionTitle}</strong> has been received. We will review it and contact you on WhatsApp shortly.
              </p>

              <!-- Summary Table -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAF7F7; border:1px solid #EFE4E4; border-radius:10px; margin-bottom:28px;">
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #EFE4E4; font-size:12px; font-weight:600; color:#6E4242; width:38%;">Reference</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #EFE4E4; font-size:13px; font-weight:700; font-family:monospace; color:#E60000;">${safeRef}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #EFE4E4; font-size:12px; font-weight:600; color:#6E4242;">Division</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #EFE4E4; font-size:13px; color:#1A0505;">${divisionTitle}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #EFE4E4; font-size:12px; font-weight:600; color:#6E4242;">Package / Services</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #EFE4E4; font-size:13px; color:#1A0505;">${safePackageOrServices}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #EFE4E4; font-size:12px; font-weight:600; color:#6E4242;">Business Name</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #EFE4E4; font-size:13px; color:#1A0505;">${safeBusiness}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #EFE4E4; font-size:12px; font-weight:600; color:#6E4242;">WhatsApp / Phone</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #EFE4E4; font-size:13px; color:#1A0505;">${safePhone}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; font-size:12px; font-weight:600; color:#6E4242;">${isWebsites ? "Timeline" : "Monthly Volume"}</td>
                  <td style="padding:12px 16px; font-size:13px; color:#1A0505;">${safeTimelineOrVolume}</td>
                </tr>
              </table>

              <!-- WhatsApp Action Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5FAF6; border:1px solid #D5EBD9; border-radius:10px; margin-bottom:28px; text-align:center;">
                <tr>
                  <td style="padding:20px 16px;">
                    <p style="margin:0 0 12px 0; font-size:13px; line-height:20px; color:#235730; font-weight:600;">
                      Need to add details or discuss scope directly?
                    </p>
                    <a href="${whatsappUrl}" target="_blank" style="display:inline-block; background-color:#25D366; color:#FFFFFF; text-decoration:none; padding:12px 24px; border-radius:6px; font-size:13px; font-weight:700; letter-spacing:0.5px;">
                      Chat with us on WhatsApp &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Support Note -->
              <p style="margin:0; font-size:12px; line-height:18px; color:#785A5A;">
                For any questions, contact us at <a href="mailto:${divisionContact.email}" style="color:#E60000; text-decoration:underline;">${divisionContact.email}</a> or phone <a href="tel:+${divisionContact.whatsapp}" style="color:#E60000; text-decoration:underline;">${divisionContact.phoneDisplay}</a>. You can also reach our central desk at <a href="mailto:${SITE.commonEmail}" style="color:#E60000; text-decoration:underline;">${SITE.commonEmail}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#F7F1E8; padding:20px 28px; border-top:1px solid #EDE2D2; text-align:center;">
              <p style="margin:0 0 6px 0; font-size:12px; font-weight:700; color:#1A0505;">
                built2host &middot; You imagine it. We build it.
              </p>
              <p style="margin:0; font-size:11px; line-height:16px; color:#7A6B62;">
                You're receiving this because you submitted an enquiry on our website (<a href="${siteUrl}" style="color:#7A6B62; text-decoration:underline;">${SITE.domain}</a>).
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
WE'VE RECEIVED YOUR ENQUIRY | built2host
----------------------------------------

Thanks for reaching out, ${firstName}.

Your enquiry for ${divisionTitle} has been received. We will review it and contact you on WhatsApp shortly.

SUMMARY:
- Reference: ${doc.ref}
- Division: ${divisionTitle}
- Package / Services: ${pkgOrServicesList}
- Business Name: ${doc.businessName || doc.agencyName || "N/A"}
- Phone: ${doc.phone}
- ${isWebsites ? "Timeline" : "Monthly Volume"}: ${timelineOrVolume}

Chat with us on WhatsApp:
${whatsappUrl}

For any questions, contact us at ${divisionContact.email} or call ${divisionContact.phoneDisplay}.
Central Desk: ${SITE.commonEmail}

built2host · You imagine it. We build it.
You're receiving this because you submitted an enquiry on ${SITE.domain}.
  `.trim();

  return {
    subject,
    html,
    text,
    replyTo: divisionContact.email,
  };
}

/**
 * Builds the Team Notification Email (HTML + Plain text)
 */
export function renderTeamNotificationEmail(doc: EnquiryDoc): {
  to: string;
  cc: string;
  subject: string;
  html: string;
  text: string;
  replyTo: string;
} {
  const isWebsites = doc.division === "websites";
  const divisionTitle = isWebsites ? "Websites" : "Automation";
  const divisionEmail = isWebsites ? SITE.websiteDivision.email : SITE.automationDivision.email;
  const commonEmail = SITE.commonEmail;
  const siteUrl = getSiteUrl().replace(/\/$/, "");

  const safeName = escapeHtml(doc.name);
  const safeRef = escapeHtml(doc.ref);
  const safePhone = escapeHtml(doc.phone);
  const safeEmail = escapeHtml(doc.email);
  const safeBusiness = escapeHtml(doc.businessName || doc.agencyName || "N/A");
  const safeCity = escapeHtml(doc.city || "N/A");
  const safePackageOrServices = escapeHtml(doc.packageOrServices.join(", ") || "N/A");
  const safeAddOns = escapeHtml(doc.addOns.join(", ") || "None");
  const safeTimeline = escapeHtml(doc.timeline || "N/A");
  const safeVolume = escapeHtml(doc.monthlyEnquiryVolume || "N/A");
  const safeMessage = escapeHtml(doc.message || "None");

  const normalizedPhone = normalizeWhatsAppNumber(doc.phone);
  const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(`Hi ${doc.name}, reaching out from built2host regarding your enquiry (${doc.ref}).`)}`;
  const adminUrl = `${siteUrl}/admin?ref=${encodeURIComponent(doc.ref)}`;

  const subject = `[New enquiry] ${divisionTitle} | ${doc.name} | ${doc.ref}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0; padding:24px; background-color:#F5F5F5; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#111111;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px; margin:0 auto; background:#FFFFFF; border:1px solid #E0E0E0; border-radius:12px; overflow:hidden;">
    <tr>
      <td style="background-color:#E60000; padding:18px 24px; color:#FFFFFF;">
        <span style="font-family:monospace; font-size:11px; letter-spacing:1px; text-transform:uppercase; opacity:0.9;">NEW INBOUND LEAD</span>
        <h2 style="margin:6px 0 0 0; font-size:20px; font-weight:700;">${divisionTitle} Enquiry &mdash; ${safeName}</h2>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px; border-collapse:collapse;">
          <tr style="border-bottom:1px solid #EEEEEE;">
            <td style="padding:8px 0; font-weight:600; width:35%; color:#666666; font-size:13px;">Reference</td>
            <td style="padding:8px 0; font-weight:700; font-family:monospace; color:#E60000; font-size:13px;">${safeRef}</td>
          </tr>
          <tr style="border-bottom:1px solid #EEEEEE;">
            <td style="padding:8px 0; font-weight:600; color:#666666; font-size:13px;">Name</td>
            <td style="padding:8px 0; font-weight:600; font-size:13px;">${safeName}</td>
          </tr>
          <tr style="border-bottom:1px solid #EEEEEE;">
            <td style="padding:8px 0; font-weight:600; color:#666666; font-size:13px;">Phone</td>
            <td style="padding:8px 0; font-size:13px;"><a href="tel:${safePhone}" style="color:#0066CC;">${safePhone}</a></td>
          </tr>
          <tr style="border-bottom:1px solid #EEEEEE;">
            <td style="padding:8px 0; font-weight:600; color:#666666; font-size:13px;">Email</td>
            <td style="padding:8px 0; font-size:13px;"><a href="mailto:${safeEmail}" style="color:#0066CC;">${safeEmail}</a></td>
          </tr>
          <tr style="border-bottom:1px solid #EEEEEE;">
            <td style="padding:8px 0; font-weight:600; color:#666666; font-size:13px;">Business / Agency</td>
            <td style="padding:8px 0; font-size:13px;">${safeBusiness}</td>
          </tr>
          <tr style="border-bottom:1px solid #EEEEEE;">
            <td style="padding:8px 0; font-weight:600; color:#666666; font-size:13px;">City</td>
            <td style="padding:8px 0; font-size:13px;">${safeCity}</td>
          </tr>
          <tr style="border-bottom:1px solid #EEEEEE;">
            <td style="padding:8px 0; font-weight:600; color:#666666; font-size:13px;">Package / Services</td>
            <td style="padding:8px 0; font-size:13px;">${safePackageOrServices}</td>
          </tr>
          ${doc.addOns.length > 0 ? `
          <tr style="border-bottom:1px solid #EEEEEE;">
            <td style="padding:8px 0; font-weight:600; color:#666666; font-size:13px;">Add-ons</td>
            <td style="padding:8px 0; font-size:13px;">${safeAddOns}</td>
          </tr>` : ""}
          <tr style="border-bottom:1px solid #EEEEEE;">
            <td style="padding:8px 0; font-weight:600; color:#666666; font-size:13px;">${isWebsites ? "Timeline" : "Monthly Volume"}</td>
            <td style="padding:8px 0; font-size:13px;">${isWebsites ? safeTimeline : safeVolume}</td>
          </tr>
          <tr style="border-bottom:1px solid #EEEEEE;">
            <td style="padding:8px 0; font-weight:600; color:#666666; font-size:13px;">Message / Notes</td>
            <td style="padding:8px 0; font-size:13px; white-space:pre-wrap;">${safeMessage}</td>
          </tr>
          <tr style="border-bottom:1px solid #EEEEEE;">
            <td style="padding:8px 0; font-weight:600; color:#666666; font-size:13px;">Consent Given</td>
            <td style="padding:8px 0; font-size:13px; color:#15803D; font-weight:600;">Yes (${escapeHtml(doc.consentAt)})</td>
          </tr>
        </table>

        <!-- Actions -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
          <tr>
            <td style="padding-right:10px;" width="50%">
              <a href="${whatsappUrl}" target="_blank" style="display:block; text-align:center; background-color:#25D366; color:#FFFFFF; text-decoration:none; padding:12px; border-radius:6px; font-size:13px; font-weight:700;">
                Reply on WhatsApp &rarr;
              </a>
            </td>
            <td style="padding-left:10px;" width="50%">
              <a href="${adminUrl}" target="_blank" style="display:block; text-align:center; background-color:#111111; color:#FFFFFF; text-decoration:none; padding:12px; border-radius:6px; font-size:13px; font-weight:700;">
                Open in Admin &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
[NEW ENQUIRY] ${divisionTitle} | ${doc.name} | ${doc.ref}
------------------------------------------------------
Reference: ${doc.ref}
Division: ${divisionTitle}
Name: ${doc.name}
Phone: ${doc.phone}
Email: ${doc.email}
Business/Agency: ${doc.businessName || doc.agencyName || "N/A"}
City: ${doc.city || "N/A"}
Package/Services: ${doc.packageOrServices.join(", ")}
Add-ons: ${doc.addOns.join(", ") || "None"}
${isWebsites ? `Timeline: ${doc.timeline}` : `Monthly Volume: ${doc.monthlyEnquiryVolume}`}
Message / Notes: ${doc.message || "None"}
Consent: Yes (${doc.consentAt})

Reply on WhatsApp:
${whatsappUrl}

Open in Admin:
${adminUrl}
  `.trim();

  return {
    to: divisionEmail,
    cc: commonEmail,
    subject,
    html,
    text,
    replyTo: doc.email,
  };
}
