import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminDb } from "@/lib/firebase/admin";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { EnquiryDoc, EnquiryStatus } from "@/lib/types/enquiry";
import { sanitize } from "@/lib/enquiry";

const updateSchema = z.object({
  status: z.enum(["new", "contacted", "won", "lost"]).optional(),
  notes: z.string().max(3000).optional(),
});

export async function GET(
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

    // Scoped division check
    if (admin.role !== "owner" && doc.division !== admin.role) {
      return NextResponse.json({ error: "Forbidden: out of division scope" }, { status: 403 });
    }

    return NextResponse.json({ enquiry: { ...doc, id: snap.id } });
  } catch (err: unknown) {
    console.error("[Get Enquiry Error]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    let rawBody;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const parseResult = updateSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.flatten() },
        { status: 422 }
      );
    }

    const { status, notes } = parseResult.data;

    const db = getAdminDb();
    const docRef = db.collection("enquiries").doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    const existing = snap.data() as EnquiryDoc;

    // Scoped division check
    if (admin.role !== "owner" && existing.division !== admin.role) {
      return NextResponse.json({ error: "Forbidden: out of division scope" }, { status: 403 });
    }

    const nowIso = new Date().toISOString();
    const updates: Partial<EnquiryDoc> & Record<string, unknown> = {
      updatedAt: nowIso,
    };

    if (notes !== undefined) {
      updates.notes = sanitize(notes, 3000);
    }

    if (status && status !== existing.status) {
      updates.status = status as EnquiryStatus;
      const history = existing.history || [];
      history.push({
        status: status as EnquiryStatus,
        changedBy: admin.email,
        changedAt: nowIso,
      });
      updates.history = history;
    }

    await docRef.update(updates);

    return NextResponse.json({
      ok: true,
      enquiry: {
        ...existing,
        ...updates,
      },
    });
  } catch (err: unknown) {
    console.error("[Update Enquiry Error]:", err);
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}
