import nodemailer, { Transporter } from "nodemailer";

let cachedTransporter: Transporter | null = null;

export function getMissingEmailEnv(): string[] {
  const missing: string[] = [];
  if (!process.env.SMTP_USER) missing.push("SMTP_USER");
  if (!process.env.SMTP_APP_PASSWORD) missing.push("SMTP_APP_PASSWORD");
  return missing;
}

/**
 * Creates or returns the email transport.
 * Configured for Gmail SMTP (smtp.gmail.com:465 SSL).
 * Can be swapped to Resend or another SMTP provider later by changing only this file.
 */
export function getEmailTransporter(): Transporter | null {
  const missing = getMissingEmailEnv();
  if (missing.length > 0) {
    console.warn(`[Email Transport] Missing SMTP environment variables: ${missing.join(", ")}`);
    return null;
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_APP_PASSWORD,
      },
    });
  }

  return cachedTransporter;
}

export function getMailFrom(): string {
  if (process.env.MAIL_FROM) {
    return process.env.MAIL_FROM;
  }
  const user = process.env.SMTP_USER || "build2host@gmail.com";
  return `built2host <${user}>`;
}
