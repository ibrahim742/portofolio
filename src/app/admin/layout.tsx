import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import { requireAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await requireAdminSession())) {
    redirect("/admin/login");
  }

  return (
    <div className="admin-shell min-h-screen bg-[#f4f6f9] text-[#212529]">
      <AdminAuthGuard />
      {children}
    </div>
  );
}
