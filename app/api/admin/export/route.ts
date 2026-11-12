import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { EnquiryDoc } from "@/lib/types/enquiry";
import { formatKolkataTime } from "@/lib/enquiry";

function escapeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return '""';
  let str = String(val).replace(/\r\n|\r|\n/g, " ").trim();
  // Formula-injection protection: prefix cells starting with =, +, -, @ with a single quote
  if (/^[=+\-@]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    let division = searchParams.get("division") || "all";
    const status = searchParams.get("status") || "all";
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Scoped division enforcement
    if (admin.role === "websites") {
      division = "websites";
    } else if (admin.role === "automation") {
      division = "automation";
    }

    const db = getAdminDb();
    let queryRef: FirebaseFirestore.Query = db.collection("enquiries");

    if (division !== "all") {
      queryRef = queryRef.where("division", "==", division);
    }

    const snapshot = await queryRef.orderBy("createdAt", "desc").get();
    let docs: EnquiryDoc[] = [];
    snapshot.forEach((snap) => {
      docs.push(snap.data() as EnquiryDoc);
    });

    if (status !== "all") {
      docs = docs.filter((d) => d.status === status);
    }

    if (startDate) {
      const startIso = new Date(`${startDate}T00:00:00.000Z`).toISOString();
      docs = docs.filter((d) => d.createdAt >= startIso);
    }

    if (endDate) {
      const endIso = new Date(`${endDate}T23:59:59.999Z`).toISOString();
      docs = docs.filter((d) => d.createdAt <= endIso);
    }

    if (search) {
      docs = docs.filter((d) => {
        const refMatch = d.ref.toLowerCase().includes(search);
        const nameMatch = d.name.toLowerCase().includes(search);
        const phoneMatch = d.phone.toLowerCase().includes(search);
        const emailMatch = d.email.toLowerCase().includes(search);
        const businessMatch = (d.businessName || d.agencyName || "").toLowerCase().includes(search);
        return refMatch || nameMatch || phoneMatch || emailMatch || businessMatch;
      });
    }

    const headers = [
      "Reference",
      "Division",
      "Date & Time (IST)",
      "Name",
      "Phone",
      "Email",
      "Business / Agency",
      "City",
      "Package / Services",
      "Add-ons",
      "Timeline / Volume",
      "Message / Scope",
      "Status",
      "Email Status",
      "Internal Notes",
      "Consent Timestamp",
    ];

    const rows = docs.map((d) => {
      const dateStr = formatKolkataTime(d.createdAt);
      const pkgOrServices = d.packageOrServices.join("; ");
      const addOns = d.addOns.join("; ");
      const businessOrAgency = d.businessName || d.agencyName || "";
      const timelineOrVol = d.timeline || d.monthlyEnquiryVolume || "";

      return [
        escapeCsvCell(d.ref),
        escapeCsvCell(d.division),
        escapeCsvCell(dateStr),
        escapeCsvCell(d.name),
        escapeCsvCell(d.phone),
        escapeCsvCell(d.email),
        escapeCsvCell(businessOrAgency),
        escapeCsvCell(d.city),
        escapeCsvCell(pkgOrServices),
        escapeCsvCell(addOns),
        escapeCsvCell(timelineOrVol),
        escapeCsvCell(d.message),
        escapeCsvCell(d.status),
        escapeCsvCell(d.emailStatus),
        escapeCsvCell(d.notes),
        escapeCsvCell(d.consentAt),
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.map(escapeCsvCell).join(","), ...rows].join("\r\n");
    const filename = `built2host-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (err: unknown) {
    console.error("[CSV Export Error]:", err);
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 });
  }
}
