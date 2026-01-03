"use client";

import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopbar from "@/components/layout/AdminTopbar";
import Protected from "@/components/layout/Protected";
import { AdminLayoutProvider, useAdminLayout } from "@/components/admin/AdminLayoutContext";
import clsx from "clsx";

function AdminLayoutInner({ children }) {
  const { collapsed } = useAdminLayout();

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />

      <div
        className={clsx(
          "flex flex-col transition-all duration-300",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        <AdminTopbar />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <Protected roles={["ADMIN", "STAFF"]}>
      <AdminLayoutProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </AdminLayoutProvider>
    </Protected>
  );
}
