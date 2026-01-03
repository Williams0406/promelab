"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  onChange,
  itemsPerPage,
  totalItems,
}) {
  if (totalPages <= 1) return null;

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E5E7EB]">
      
      {/* Info de items (opcional si se pasan props) */}
      {itemsPerPage && totalItems && (
        <p className="text-sm text-[#6B7280]">
          Mostrando{" "}
          <span className="font-medium text-[#374151]">
            {((page - 1) * itemsPerPage) + 1}
          </span>
          {" "}a{" "}
          <span className="font-medium text-[#374151]">
            {Math.min(page * itemsPerPage, totalItems)}
          </span>
          {" "}de{" "}
          <span className="font-medium text-[#374151]">
            {totalItems}
          </span>
        </p>
      )}

      {/* Controles */}
      <div className="flex items-center gap-2">
        <button
          disabled={!canGoPrevious}
          onClick={() => onChange(page - 1)}
          className="flex h-8 items-center gap-1.5 rounded-md border border-[#E5E7EB] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <span className="text-sm text-[#6B7280] px-3">
          Página <span className="font-medium text-[#374151]">{page}</span> de <span className="font-medium text-[#374151]">{totalPages}</span>
        </span>

        <button
          disabled={!canGoNext}
          onClick={() => onChange(page + 1)}
          className="flex h-8 items-center gap-1.5 rounded-md border border-[#E5E7EB] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
          aria-label="Página siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}