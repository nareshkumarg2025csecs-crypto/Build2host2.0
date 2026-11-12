import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F1E8] flex items-center justify-center p-8">
          <div className="font-mono text-xs text-[#6E4242] animate-pulse">
            Loading Admin Workspace...
          </div>
        </div>
      }
    >
      <AdminDashboard email={admin.email} role={admin.role} />
    </Suspense>
  );
}
