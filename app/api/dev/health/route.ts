import { NextRequest, NextResponse } from "next/server";
import { runAllHealthChecks } from "@/lib/health/checker";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const report = await runAllHealthChecks();

  return NextResponse.json(report, {
    status: report.ok ? 200 : 503,
  });
}
