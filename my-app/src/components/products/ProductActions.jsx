"use client";

import { Eye, Edit, Trash2 } from "lucide-react";

export default function ProductActions({ product, onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      {/* Ver */}
      <button
        onClick={() => onView(product)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#374151] hover:bg-[#F5F7FA]"
      >
        <Eye className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Ver</span>
      </button>

      {/* Editar */}
      <button
        onClick={() => onEdit(product)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#00A8CC] hover:bg-[#F0F9FF]"
      >
        <Edit className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Editar</span>
      </button>

      {/* Eliminar */}
      <button
        onClick={() => onDelete(product)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#E5533D] hover:bg-[#FEF2F2]"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Eliminar</span>
      </button>
    </div>
  );
}
