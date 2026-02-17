"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Receipt,
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
  { href: "/admin/carts", label: "Carritos", icon: ShoppingCart, roles: ["ADMIN", "STAFF"] },
  { href: "/admin/orders", label: "Órdenes", icon: Receipt, roles: ["ADMIN", "STAFF"] },
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
      className={`
        fixed left-0 top-0 z-40 h-screen
        bg-gradient-to-b from-[#002366] to-[#001A4D]
        text-white
        border-r border-white/10
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      {/* HEADER */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
        <div
          className={`transition-all duration-300 ${
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          }`}
        >
          <Link href="/admin" className="flex items-center gap-2">
            <Logo className="h-10 text-white" />
          </Link>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-2 hover:bg-white/10 transition-all duration-200"
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* NAV */}
      <nav className="mt-4 flex flex-col gap-1 px-2">
        {links
          .filter((link) => link.roles.includes(user?.role))
          .map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`
                  relative group flex items-center gap-3
                  rounded-xl px-3 py-2.5
                  text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {/* Indicador activo animado */}
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-full transition-all duration-300" />
                )}

                <Icon className="w-5 h-5 shrink-0" />

                {!collapsed && (
                  <span className="transition-all duration-200">
                    {label}
                  </span>
                )}

                {/* Tooltip cuando está colapsado */}
                {collapsed && (
                  <span className="
                    absolute left-full ml-3 px-3 py-1.5
                    rounded-md text-xs font-medium
                    bg-[#111827] text-white
                    opacity-0 group-hover:opacity-100
                    translate-x-2 group-hover:translate-x-0
                    transition-all duration-200
                    pointer-events-none
                    whitespace-nowrap
                  ">
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
      </nav>

      {/* FOOTER */}
      {!collapsed && (
        <div className="absolute bottom-0 w-full px-4 py-4 border-t border-white/10">
          <div className="space-y-1">
            <p className="text-xs text-white/60 font-medium">
              Panel administrativo
            </p>
            <p className="text-xs text-white/40">
              Sistema de gestión interna
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
