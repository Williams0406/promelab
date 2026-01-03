"use client";

import { useState } from "react";
import { adminAPI } from "@/lib/api";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function VendorDeleteDialog({
  open,
  vendor,
  onClose,
  onDeleted,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleDelete() {
    setError(null);
    setLoading(true);

    try {
      await adminAPI.deleteVendor(vendor.id);
      onDeleted();
      onClose();
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        "No se pudo eliminar el proveedor.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ConfirmDialog
        open={open}
        title="Eliminar proveedor"
        description={`¿Estás seguro de eliminar el proveedor "${vendor.name}"? Esta acción no se puede deshacer.`}
        onClose={onClose}
        onConfirm={handleDelete}
        confirmText={loading ? "Eliminando..." : "Eliminar"}
        variant="destructive"
      />

      {/* Feedback de error (igual que Category) */}
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
