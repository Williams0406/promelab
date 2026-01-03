"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import CategoryForm from "./CategoryForm";
import CategoryDeleteDialog from "./CategoryDeleteDialog";

export default function CategoryActions({ category, onRefresh, onAddChild }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Agregar subcategoría */}
        <button
          onClick={() => onAddChild(category)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#00A8CC] hover:bg-[#F0F9FF] transition-colors duration-150"
          title="Agregar subcategoría"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Subcategoría</span>
        </button>

        {/* Editar */}
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors duration-150"
          title="Editar categoría"
        >
          <Edit className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Editar</span>
        </button>

        {/* Eliminar */}
        <button
          onClick={() => setDeleting(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#E5533D] hover:bg-[#FEF2F2] transition-colors duration-150"
          title="Eliminar categoría"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Eliminar</span>
        </button>
      </div>

      {/* Modales */}
      {editing && (
        <CategoryForm
          initialData={category}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            onRefresh();
          }}
        />
      )}

      {deleting && (
        <CategoryDeleteDialog
          open={deleting}
          category={category}
          onClose={() => setDeleting(false)}
          onDeleted={onRefresh}
        />
      )}
    </>
  );
}