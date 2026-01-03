"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  Image as ImageIcon,
  Layers,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Logo from "@/components/public/Logo";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "STAFF"] },
  { href: "/admin/products", label: "Productos", icon: Package, roles: ["ADMIN", "STAFF"] },
  { href: "/admin/orders", label: "Órdenes", icon: ShoppingBag, roles: ["ADMIN", "STAFF"] },
  { href: "/admin/vendors", label: "Proveedores", icon: Truck, roles: ["ADMIN", "STAFF"] },
  { href: "/admin/categories", label: "Categorías", icon: Layers, roles: ["ADMIN", "STAFF"] },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon, roles: ["ADMIN", "STAFF"] },
  { href: "/admin/staff", label: "Staff", icon: Users, roles: ["ADMIN"] },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { collapsed, setCollapsed } = useAdminLayout();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen bg-[#002366] text-white border-r border-[#003380] transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* HEADER — Identidad + control collapse */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[#003380]">
        {!collapsed && (
          <Link href="/admin" className="text-lg font-semibold tracking-tight">
            <Logo className="h-16 text-white" />
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1.5 hover:bg-white/10 transition-colors duration-150"
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* NAVEGACIÓN — Funcional, sin decoración */}
      <nav className="mt-2 flex flex-col gap-1 px-2">
        {links
          .filter((link) => link.roles.includes(user?.role))
          .map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                title={collapsed ? label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
      </nav>

      {/* FOOTER — Contexto discreto */}
      {!collapsed && (
        <div className="absolute bottom-0 w-full px-4 py-4 border-t border-[#003380]">
          <p className="text-xs text-white/50">
            Panel administrativo
          </p>
          <p className="text-xs text-white/30 mt-1">
            v1.0
          </p>
        </div>
      )}
    </aside>
  );
}