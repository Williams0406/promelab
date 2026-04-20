"use client";

import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function ProductDeleteDialog({
  open,
  product,
  products,
  onClose,
  onDeleted,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const items = useMemo(() => {
    if (Array.isArray(products) && products.length > 0) {
      return products;
    }

    return product ? [product] : [];
  }, [product, products]);

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setError(null);
    }
  }, [open]);

  async function handleDelete() {
    setError(null);
    setLoading(true);

    try {
      await onDeleted();
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
        title={
          items.length > 1 ? "Eliminar productos seleccionados" : "Eliminar producto"
        }
        description={
          items.length > 1
            ? `¿Eliminar ${items.length} productos seleccionados? Esta acción no se puede deshacer.`
            : `¿Eliminar "${product?.name}"? Esta acción no se puede deshacer.`
        }
        onClose={onClose}
        onConfirm={handleDelete}
        confirmText={loading ? "Eliminando..." : "Eliminar"}
        variant="destructive"
      />

      {error && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md rounded-lg border border-[#E5533D] bg-[#FEF2F2] p-4 shadow-lg">
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
