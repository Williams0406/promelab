"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import DashboardCard from "@/components/admin/DashboardCard";
import { Loader2 } from "lucide-react";
import SalesChart from "@/components/admin/SalesChart";
import OrdersStatusChart from "@/components/admin/OrdersStatusChart";
import DashboardAlerts from "@/components/admin/DashboardAlerts";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Dashboard error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔬 LOADING CLÍNICO (fondo blanco, spinner sobrio)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] bg-white">
        <div className="text-center space-y-3">
          <Loader2 className="h-7 w-7 animate-spin text-[#002366] mx-auto" />
          <p className="text-sm text-[#6B7280] font-medium">
            Cargando métricas
          </p>
        </div>
      </div>
    );
  }

  // 🔬 ERROR STATE
  if (!data) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-2">
          <p className="text-sm text-[#374151] font-medium">
            No se pudieron cargar las métricas
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-[#002366] underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const { users, products, orders, catalog, cart } = data;

  return (
    <div className="space-y-6">
      {/* 🔬 HEADER SOBRIO */}
      <div className="pb-4 border-b border-[#E5E7EB]">
        <h1 className="text-xl font-semibold text-[#002366] tracking-tight">
          Dashboard Operativo
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Métricas en tiempo real del sistema
        </p>
      </div>

      {/* 🔬 KPI CARDS (Reducido a 4 esenciales) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Ventas Totales"
          value={`S/ ${parseFloat(orders.total_sales).toFixed(2)}`}
          subtitle="Órdenes entregadas"
          trend={orders.month_sales > 0 ? "up" : null}
        />
        <DashboardCard
          title="Ventas del Mes"
          value={`S/ ${parseFloat(orders.month_sales).toFixed(2)}`}
          subtitle="Mes en curso"
        />
        <DashboardCard
          title="Órdenes Hoy"
          value={orders.today}
          subtitle="Nuevas"
        />
        <DashboardCard
          title="Carritos Activos"
          value={cart.active_carts}
          subtitle="Con productos"
        />
      </div>

      {/* 🔬 ALERTAS CRÍTICAS */}
      <DashboardAlerts products={products} orders={orders} cart={cart} />

      {/* 🔬 GRÁFICOS (SIN DECORACIÓN) */}
      <div className="grid gap-4 md:grid-cols-2">
        <SalesChart data={orders.by_day} />
        <OrdersStatusChart data={orders.by_status} />
      </div>

      {/* 🔬 TABLAS PROTAGONISTAS (reducido border-radius) */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* ÓRDENES */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <div className="px-5 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-semibold text-[#002366]">
              Estados de Órdenes
            </h2>
          </div>
          <div className="p-5">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[#E5E7EB]">
                {Object.entries(orders.by_status).map(([status, count]) => (
                  <tr key={status}>
                    <td className="py-2.5 text-[#374151]">{status}</td>
                    <td className="py-2.5 text-right font-medium text-[#002366]">
                      {count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PRODUCTOS */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <div className="px-5 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-semibold text-[#002366]">
              Inventario
            </h2>
          </div>
          <div className="p-5">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[#E5E7EB]">
                <tr>
                  <td className="py-2.5 text-[#374151]">Total</td>
                  <td className="py-2.5 text-right font-medium text-[#002366]">
                    {products.total}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#374151]">Activos</td>
                  <td className="py-2.5 text-right font-medium text-[#002366]">
                    {products.active}
                  </td>
                </tr>
                <tr className="bg-red-50">
                  <td className="py-2.5 text-[#E5533D] font-medium">
                    Sin stock
                  </td>
                  <td className="py-2.5 text-right font-semibold text-[#E5533D]">
                    {products.out_of_stock}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#374151]">Destacados</td>
                  <td className="py-2.5 text-right font-medium text-[#002366]">
                    {products.featured}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 🔬 MÉTRICAS SECUNDARIAS */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* USUARIOS */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <div className="px-5 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-semibold text-[#002366]">Usuarios</h2>
          </div>
          <div className="p-5">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[#E5E7EB]">
                <tr>
                  <td className="py-2.5 text-[#374151]">Total</td>
                  <td className="py-2.5 text-right font-medium text-[#002366]">
                    {users.total}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#374151]">Clientes</td>
                  <td className="py-2.5 text-right font-medium text-[#002366]">
                    {users.clients}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#374151]">Staff</td>
                  <td className="py-2.5 text-right font-medium text-[#002366]">
                    {users.staff}
                  </td>
                </tr>
                <tr className="bg-[#F5F7FA]">
                  <td className="py-2.5 text-[#374151] font-medium">
                    Nuevos hoy
                  </td>
                  <td className="py-2.5 text-right font-semibold text-[#00A8CC]">
                    {users.new_today}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CATÁLOGO */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <div className="px-5 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-semibold text-[#002366]">Catálogo</h2>
          </div>
          <div className="p-5">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[#E5E7EB]">
                <tr>
                  <td className="py-2.5 text-[#374151]">Categorías</td>
                  <td className="py-2.5 text-right font-medium text-[#002366]">
                    {catalog.categories}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#374151]">Proveedores</td>
                  <td className="py-2.5 text-right font-medium text-[#002366]">
                    {catalog.vendors}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}