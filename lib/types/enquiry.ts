export type EnquiryDivision = "websites" | "automation";
export type EnquiryStatus = "new" | "contacted" | "won" | "lost";
export type EnquiryEmailStatus = "sent" | "failed" | "pending";

export interface StatusHistoryEntry {
  status: EnquiryStatus;
  changedBy: string;
  changedAt: string;
}

export interface EnquiryDoc {
  id?: string;
  ref: string;
  division: EnquiryDivision;
  name: string;
  phone: string;
  email: string;
  businessName: string;
  agencyName: string;
  city: string;
  packageOrServices: string[];
  addOns: string[];
  timeline: string;
  monthlyEnquiryVolume: string;
  message: string;
  consent: boolean;
  consentAt: string;
  privacyPolicyVersion: string;
  status: EnquiryStatus;
  notes: string;
  createdAt: string; // ISO string for simple queries & client rendering
  createdAtTimestamp?: number; // epoch ms
  updatedAt: string;
  emailStatus: EnquiryEmailStatus;
  userAgent: string;
  hashedIp: string;
  history?: StatusHistoryEntry[];
}
