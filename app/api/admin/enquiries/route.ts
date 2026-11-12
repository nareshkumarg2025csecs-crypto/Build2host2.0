import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { getCurrentAdmin, AdminRole } from "@/lib/admin-auth";
import { EnquiryDoc, EnquiryStatus } from "@/lib/types/enquiry";

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
    const startDate = searchParams.get("startDate"); // YYYY-MM-DD
    const endDate = searchParams.get("endDate"); // YYYY-MM-DD
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "25", 10)));

    // Role-based scoping
    if (admin.role === "websites") {
      division = "websites";
    } else if (admin.role === "automation") {
      division = "automation";
    }

    const db = getAdminDb();
    let queryRef: FirebaseFirestore.Query = db.collection("enquiries");

    // Apply division filter if scoped or chosen
    if (division !== "all") {
      queryRef = queryRef.where("division", "==", division);
    }

    const snapshot = await queryRef.orderBy("createdAt", "desc").get();

    const allDocs: EnquiryDoc[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as EnquiryDoc;
      allDocs.push({
        ...data,
        id: doc.id,
      });
    });

    // Compute month start for "total this month"
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const monthStartIso = new Date(currentYear, currentMonth, 1).toISOString();

    // Calculate Dashboard Stats across user's scoped view
    const stats = {
      new: 0,
      contacted: 0,
      won: 0,
      lost: 0,
      thisMonth: 0,
      total: allDocs.length,
      websitesCount: 0,
      automationCount: 0,
    };

    for (const item of allDocs) {
      if (item.status === "new") stats.new++;
      else if (item.status === "contacted") stats.contacted++;
      else if (item.status === "won") stats.won++;
      else if (item.status === "lost") stats.lost++;

      if (item.createdAt >= monthStartIso) {
        stats.thisMonth++;
      }

      if (item.division === "websites") stats.websitesCount++;
      else if (item.division === "automation") stats.automationCount++;
    }

    // Apply in-memory filters for status, date range, search
    let filtered = allDocs;

    if (status !== "all") {
      filtered = filtered.filter((d) => d.status === status);
    }

    if (startDate) {
      const startIso = new Date(`${startDate}T00:00:00.000Z`).toISOString();
      filtered = filtered.filter((d) => d.createdAt >= startIso);
    }

    if (endDate) {
      const endIso = new Date(`${endDate}T23:59:59.999Z`).toISOString();
      filtered = filtered.filter((d) => d.createdAt <= endIso);
    }

    if (search) {
      filtered = filtered.filter((d) => {
        const refMatch = d.ref.toLowerCase().includes(search);
        const nameMatch = d.name.toLowerCase().includes(search);
        const phoneMatch = d.phone.toLowerCase().includes(search);
        const emailMatch = d.email.toLowerCase().includes(search);
        const businessMatch = (d.businessName || d.agencyName || "").toLowerCase().includes(search);
        return refMatch || nameMatch || phoneMatch || emailMatch || businessMatch;
      });
    }

    const totalFiltered = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedDocs = filtered.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      enquiries: paginatedDocs,
      stats,
      total: totalFiltered,
      page,
      pageSize,
      totalPages: Math.ceil(totalFiltered / pageSize) || 1,
      admin: {
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err: unknown) {
    console.error("[Admin Enquiries List Error]:", err);
    return NextResponse.json({ error: "Failed to load enquiries" }, { status: 500 });
  }
}
