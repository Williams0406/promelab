"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import VendorTable from "@/components/vendors/VendorTable";
import VendorForm from "@/components/vendors/VendorForm";
import VendorDeleteDialog from "@/components/vendors/VendorDeleteDialog";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/common/Pagination";
import { Loader2, AlertCircle, Plus, Building2 } from "lucide-react";

export default function AdminVendorsPage() {
  // 🔬 ESTADO
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔬 PAGINACIÓN
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // 🔬 MODALES
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [deletingVendor, setDeletingVendor] = useState(null);

  // 🔬 FEEDBACK
  const [successMessage, setSuccessMessage] = useState(null);

  // 🔬 FETCH VENDORS
  async function loadVendors(pageNumber = page) {
    setLoading(true);
    setError(null);

    try {
      const res = await adminAPI.getVendors({ page: pageNumber });

      setVendors(res.data.results || []);
      setTotalItems(res.data.count || 0);
      setPage(pageNumber);
    } catch (err) {
      console.error("Error cargando proveedores:", err);
      setError("No se pudieron cargar los proveedores");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVendors(1);
  }, []);

  // 🔬 GUARDAR VENDOR
  async function handleSaveVendor(data) {
    try {
      if (editingVendor) {
        await adminAPI.updateVendor(editingVendor.id, data);
        showSuccess("Proveedor actualizado correctamente");
      } else {
        await adminAPI.createVendor(data);
        showSuccess("Proveedor creado correctamente");
      }

      setShowForm(false);
      setEditingVendor(null);
      loadVendors(editingVendor ? page : 1);
    } catch (err) {
      console.error("Error guardando proveedor:", err);
      throw err; // El form manejará el error
    }
  }

  // 🔬 HELPER: MOSTRAR ÉXITO
  function showSuccess(message) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  }

  // 🔬 LOADING CLÍNICO
  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-3">
          <Loader2 className="h-7 w-7 animate-spin text-[#002366] mx-auto" />
          <p className="text-sm text-[#6B7280] font-medium">
            Cargando proveedores
          </p>
        </div>
      </div>
    );
  }

  // 🔬 ERROR STATE
  if (error && vendors.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-3">
          <AlertCircle className="h-12 w-12 text-[#E5533D] mx-auto" />
          <p className="text-sm text-[#374151] font-medium">{error}</p>
          <button
            onClick={() => loadVendors(page)}
            className="text-sm text-[#002366] underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* 🔬 SUCCESS MESSAGE */}
      {successMessage && (
        <div className="bg-[#2ECC71]/10 border border-[#2ECC71]/20 rounded-lg px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-[#2ECC71] font-medium">
            {successMessage}
          </p>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-[#2ECC71] hover:text-[#27AE60]"
          >
            ×
          </button>
        </div>
      )}

      {/* 🔬 HEADER CONSISTENTE */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl font-semibold text-[#002366] tracking-tight">
            Proveedores
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Gestión de proveedores científicos
          </p>
        </div>

        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#002366] hover:bg-[#001a4d] text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors duration-150"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      {/* 🔬 TABLA CON LOADING INLINE */}
      <div className="relative">
        {loading && page > 1 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-6 w-6 animate-spin text-[#002366]" />
          </div>
        )}

        {vendors.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center">
            <Building2 className="h-16 w-16 text-[#E5E7EB] mx-auto mb-4" />
            <p className="text-sm text-[#6B7280] font-medium">
              No hay proveedores registrados
            </p>
            <p className="text-xs text-[#6B7280] mt-1">
              Crea uno para comenzar
            </p>
          </div>
        ) : (
          <VendorTable
            vendors={vendors}
            onEdit={(vendor) => {
              setEditingVendor(vendor);
              setShowForm(true);
            }}
            onDelete={(vendor) => setDeletingVendor(vendor)}
          />
        )}
      </div>

      {/* 🔬 PAGINACIÓN */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={(newPage) => loadVendors(newPage)}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      )}

      {/* 🔬 FORM MODAL */}
      {showForm && (
        <VendorForm
          initialData={editingVendor}
          onClose={() => {
            setShowForm(false);
            setEditingVendor(null);
          }}
          onSubmit={handleSaveVendor}
        />
      )}

      {/* 🔬 DELETE DIALOG */}
      {deletingVendor && (
        <VendorDeleteDialog
          open={true}
          vendor={deletingVendor}
          onClose={() => setDeletingVendor(null)}
          onDeleted={() => {
            showSuccess("Proveedor eliminado correctamente");
            loadVendors(page);
          }}
        />
      )}
    </div>
  );
}