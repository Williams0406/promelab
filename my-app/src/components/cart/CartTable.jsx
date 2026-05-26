"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Trash2 } from "lucide-react";

import Table from "@/components/ui/Table";
import { adminAPI } from "@/lib/api";

export default function CartTable({ carts, onRefresh }) {
  const [converting, setConverting] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const validIds = new Set(carts.map((cart) => cart.id));
    setSelectedIds((prev) => prev.filter((id) => validIds.has(id)));
  }, [carts]);

  const allSelected = carts.length > 0 && selectedIds.length === carts.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(carts.map((cart) => cart.id));
  };

  const toggleSelectCart = (cartId) => {
    setSelectedIds((prev) =>
      prev.includes(cartId)
        ? prev.filter((id) => id !== cartId)
        : [...prev, cartId]
    );
  };

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

    try {
      setDeleting(true);
      await adminAPI.deleteCart(cart.id);
      setSelectedIds((prev) => prev.filter((id) => id !== cart.id));
      onRefresh();
    } catch (error) {
      alert("No se pudo eliminar el carrito");
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmMessage =
      selectedIds.length === 1
        ? "¿Eliminar el carrito seleccionado?"
        : `¿Eliminar los ${selectedIds.length} carritos seleccionados?`;

    if (!confirm(confirmMessage)) return;

    try {
      setDeleting(true);
      await adminAPI.bulkDeleteCarts(selectedIds);
      setSelectedIds([]);
      onRefresh();
    } catch (error) {
      alert("No se pudieron eliminar los carritos seleccionados");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "select",
      label: (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            aria-label="Seleccionar todos los carritos"
            className="h-4 w-4 rounded border-[#CBD5E1] text-[#002366] focus:ring-[#002366]"
          />
        </div>
      ),
      align: "center",
      cell: (row) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={selectedIds.includes(row.original.id)}
            onChange={() => toggleSelectCart(row.original.id)}
            aria-label={`Seleccionar carrito ${row.original.id.slice(0, 8)}`}
            className="h-4 w-4 rounded border-[#CBD5E1] text-[#002366] focus:ring-[#002366]"
          />
        </div>
      ),
    },
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
          <p className="truncate text-sm font-semibold text-[#002366]">
            {row.original.user?.username || "Invitado"}
          </p>
          <p className="truncate text-xs text-[#6B7280]">
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
            disabled={converting === row.original.id || deleting}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-green-600 transition-colors duration-150 hover:bg-green-50 disabled:opacity-60"
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
            disabled={deleting}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-[#E5533D] transition-colors duration-150 hover:bg-[#FDECEC] disabled:opacity-60"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#002366]">
            Selección múltiple de carritos
          </p>
          <p className="text-sm text-[#6B7280]">
            {selectedIds.length > 0
              ? `${selectedIds.length} carrito(s) seleccionado(s)`
              : "Selecciona uno o varios carritos para eliminarlos en grupo."}
          </p>
        </div>

        <button
          onClick={handleBulkDelete}
          disabled={selectedIds.length === 0 || deleting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E5533D] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#C63F2B] disabled:cursor-not-allowed disabled:bg-[#F2A8A0]"
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Eliminar seleccionados
        </button>
      </div>

      <Table columns={columns} data={carts} />
    </div>
  );
}
