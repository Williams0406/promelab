"use client";

import { useState } from "react";
import { adminAPI } from "@/lib/api";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function CategoryDeleteDialog({
  open,
  category,
  onClose,
  onDeleted,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleDelete() {
    setError(null);
    setLoading(true);

    try {
      await adminAPI.deleteCategory(category.id);
      onDeleted();
      onClose();
    } catch (err) {
      const errorMsg = 
        err.response?.data?.detail || 
        "No se pudo eliminar la categoría.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ConfirmDialog
        open={open}
        title="Eliminar categoría"
        description={`¿Estás seguro de eliminar "${category.name}"? Esta acción eliminará también todas sus subcategorías y no se puede deshacer.`}
        onClose={onClose}
        onConfirm={handleDelete}
        confirmText={loading ? "Eliminando..." : "Eliminar"}
        variant="destructive"
      />

      {/* Error feedback inline (si ConfirmDialog no lo soporta) */}
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