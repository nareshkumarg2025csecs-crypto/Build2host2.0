import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { EnquiryDoc } from "@/lib/types/enquiry";
import { resendVisitorConfirmationEmail } from "@/lib/email/sender";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const db = getAdminDb();
    const docRef = db.collection("enquiries").doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    const doc = snap.data() as EnquiryDoc;

    if (admin.role !== "owner" && doc.division !== admin.role) {
      return NextResponse.json({ error: "Forbidden: out of division scope" }, { status: 403 });
    }

    const success = await resendVisitorConfirmationEmail(doc);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to send confirmation email. Check SMTP settings." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, emailStatus: "sent" });
  } catch (err: unknown) {
    console.error("[Resend Confirmation Error]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
