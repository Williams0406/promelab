"use client";

import { Edit, Trash2, Building2 } from "lucide-react";

export default function VendorTable({ vendors, onEdit, onDelete }) {
  if (vendors.length === 0) {
    return (
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center">
        <Building2 className="h-12 w-12 text-[#6B7280] mx-auto mb-3" />
        <p className="text-sm text-[#6B7280]">
          No hay proveedores registrados
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
      <table className="w-full text-sm">
        <thead className="bg-[#F5F7FA] border-b border-[#E5E7EB]">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-[#374151]">Proveedor</th>
            <th className="px-4 py-3 text-left font-semibold text-[#374151]">Email</th>
            <th className="px-4 py-3 text-left font-semibold text-[#374151]">Teléfono</th>
            <th className="px-4 py-3 text-right font-semibold text-[#374151]">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {vendors.map((vendor, index) => (
            <tr
              key={vendor.id}
              className={`${
                index !== vendors.length - 1 ? "border-b border-[#E5E7EB]" : ""
              } hover:bg-[#F5F7FA] transition-colors duration-150`}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {vendor.logo ? (
                    <img
                      src={vendor.logo}
                      alt={vendor.name}
                      className="h-10 w-10 object-contain rounded-md border bg-white"
                    />
                  ) : (
                    <div className="h-10 w-10 flex items-center justify-center rounded-md border bg-[#F5F7FA]">
                      <Building2 className="h-5 w-5 text-[#9CA3AF]" />
                    </div>
                  )}

                  <span className="font-medium text-[#002366]">
                    {vendor.name}
                  </span>
                </div>
              </td>

              <td className="px-4 py-3 text-[#374151]">
                {vendor.contact_email || (
                  <span className="text-[#6B7280]">—</span>
                )}
              </td>

              <td className="px-4 py-3 text-[#374151]">
                {vendor.phone || (
                  <span className="text-[#6B7280]">—</span>
                )}
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(vendor)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#00A8CC] hover:bg-[#F0F9FF] transition-colors duration-150"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Editar
                  </button>

                  <button
                    onClick={() => onDelete(vendor)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#E5533D] hover:bg-[#FEF2F2] transition-colors duration-150"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}