"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import StaffTable from "@/components/admin/StaffTable";
import StaffCreateModal from "@/components/admin/StaffCreateModal";
import Pagination from "@/components/common/Pagination";
import { Loader2, AlertCircle, Plus, Users } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function AdminStaffPage() {
  // 🔬 ESTADO
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔬 PAGINACIÓN
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // 🔬 MODALES
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingStaff, setDeletingStaff] = useState(null);

  // 🔬 FEEDBACK
  const [successMessage, setSuccessMessage] = useState(null);

  // 🔬 FETCH STAFF
  const loadStaff = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);

    try {
      const res = await adminAPI.getStaff({ page: pageNumber });

      setStaff(res.data.results || []);
      setTotalItems(res.data.count || 0);
      setTotalPages(Math.ceil((res.data.count || 0) / 10));
      setPage(pageNumber);
    } catch (err) {
      console.error("Error cargando staff:", err);
      setError("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff(1);
  }, []);

  // 🔬 CREAR STAFF
  const handleCreate = async (data) => {
    try {
      await adminAPI.createStaff(data);
      setShowCreateModal(false);
      showSuccess("Usuario STAFF creado correctamente");
      loadStaff(1); // Volver a página 1
    } catch (err) {
      console.error("Error creando staff:", err);
      throw err; // El modal manejará el error
    }
  };

  // 🔬 ELIMINAR STAFF
  const handleDelete = async () => {
    try {
      await adminAPI.deleteStaff(deletingStaff.id);
      setDeletingStaff(null);
      showSuccess("Usuario STAFF eliminado correctamente");

      // Si era el único en la página, volver a la anterior
      const newTotal = totalItems - 1;
      const newTotalPages = Math.ceil(newTotal / 10);
      const targetPage = page > newTotalPages ? newTotalPages : page;

      loadStaff(targetPage || 1);
    } catch (err) {
      console.error("Error eliminando staff:", err);
      setError("No se pudo eliminar el usuario");
    }
  };

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
            Cargando usuarios STAFF
          </p>
        </div>
      </div>
    );
  }

  // 🔬 ERROR STATE
  if (error && staff.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-3">
          <AlertCircle className="h-12 w-12 text-[#E5533D] mx-auto" />
          <p className="text-sm text-[#374151] font-medium">{error}</p>
          <button
            onClick={() => loadStaff(page)}
            className="text-sm text-[#002366] underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
            Usuarios STAFF
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Gestión de equipo interno
          </p>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#002366] hover:bg-[#001a4d] text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors duration-150"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo STAFF
        </Button>
      </div>

      {/* 🔬 TABLA CON LOADING INLINE */}
      <div className="relative">
        {loading && page > 1 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-6 w-6 animate-spin text-[#002366]" />
          </div>
        )}

        {staff.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center">
            <Users className="h-16 w-16 text-[#E5E7EB] mx-auto mb-4" />
            <p className="text-sm text-[#6B7280] font-medium">
              No hay usuarios STAFF registrados
            </p>
            <p className="text-xs text-[#6B7280] mt-1">
              Crea uno para comenzar
            </p>
          </div>
        ) : (
          <StaffTable data={staff} onDelete={setDeletingStaff} />
        )}
      </div>

      {/* 🔬 PAGINACIÓN */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={10}
          onChange={(newPage) => loadStaff(newPage)}
        />
      )}

      {/* 🔬 MODAL CREAR */}
      {showCreateModal && (
        <StaffCreateModal
          open={true}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />
      )}

      {/* 🔬 CONFIRM DIALOG (CLÍNICO) */}
      {deletingStaff && (
        <ConfirmDialog
          open={true}
          title="Eliminar usuario STAFF"
          message={`¿Estás seguro de eliminar a ${deletingStaff.username}? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeletingStaff(null)}
        />
      )}
    </div>
  );
}