"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function ProductDeleteDialog({
  open,
  product,
  onClose,
  onDeleted,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleDelete() {
    setError(null);
    setLoading(true);

    try {
      await onDeleted(); // 🔥 AQUÍ ESTÁ EL FIX
      onClose();
    } catch (err) {
      const message =
        err.message ||
        err.response?.data?.detail ||
        "No se pudo eliminar el producto.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ConfirmDialog
        open={open}
        title="Eliminar producto"
        description={`¿Eliminar "${product?.name}"? Esta acción no se puede deshacer.`}
        onClose={onClose}
        onConfirm={handleDelete}
        confirmText={loading ? "Eliminando..." : "Eliminar"}
        variant="destructive"
      />

      {/* Error inline (igual que Category) */}
      {error && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md rounded-lg bg-[#FEF2F2] border border-[#E5533D] p-4 shadow-lg">
          <p className="text-sm text-[#E5533D]">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-xs font-medium text-[#E5533D] hover:underline"
          >
            Cerrar
          </button>
        </div>
      )}
    </>
  );
}
