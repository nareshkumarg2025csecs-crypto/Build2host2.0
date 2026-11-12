import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | built2host",
  description: "built2host administrative console",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#1A0505]">
      {children}
    </div>
  );
}
