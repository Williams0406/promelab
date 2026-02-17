"use client";

import { useState } from "react";
import Table from "@/components/ui/Table";
import { adminAPI } from "@/lib/api";
import { Eye, CheckCircle2, Trash2, Loader2 } from "lucide-react";

export default function CartTable({ carts, onRefresh }) {
  const [converting, setConverting] = useState(null);

  const handleConvert = async (cart) => {
    if (!confirm("¿Convertir este carrito en orden?")) return;

    try {
      setConverting(cart.id);
      await adminAPI.convertCartToOrder(cart.id);
      onRefresh();
    } catch (error) {
      alert("Error al convertir carrito");
    } finally {
      setConverting(null);
    }
  };

  const handleDelete = async (cart) => {
    if (!confirm("¿Eliminar carrito?")) return;

    await adminAPI.deleteCart(cart.id);
    onRefresh();
  };

  const columns = [
    {
      key: "id",
      label: "Código",
      cell: (row) => (
        <span className="font-mono text-sm text-[#002366]">
          #{row.original.id.slice(0, 8)}
        </span>
      ),
    },
    {
      key: "user",
      label: "Usuario",
      cell: (row) => (
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#002366] truncate">
            {row.original.user?.username || "Invitado"}
          </p>
          <p className="text-xs text-[#6B7280] truncate">
            {row.original.user?.email || "Sin email"}
          </p>
        </div>
      ),
    },
    {
      key: "items",
      label: "Items",
      cell: (row) => (
        <span className="text-sm text-[#374151]">
          {row.original.total_items}
        </span>
      ),
    },
    {
      key: "total",
      label: "Total",
      cell: (row) => (
        <span className="text-sm font-semibold text-[#002366]">
          S/ {parseFloat(row.original.total).toFixed(2)}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Fecha",
      cell: (row) => (
        <div className="text-sm">
          <p className="font-medium text-[#374151]">
            {new Date(row.original.created_at).toLocaleDateString("es-PE")}
          </p>
          <p className="text-xs text-[#6B7280]">
            {new Date(row.original.created_at).toLocaleTimeString("es-PE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      align: "right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleConvert(row.original)}
            disabled={converting === row.original.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-green-600 hover:bg-green-50 transition-colors duration-150"
          >
            {converting === row.original.id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
            Convertir
          </button>

          <button
            onClick={() => handleDelete(row.original)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#E5533D] hover:bg-[#FDECEC] transition-colors duration-150"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={carts} />;
}
