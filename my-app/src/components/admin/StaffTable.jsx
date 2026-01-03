"use client";

import { useState } from "react";
import Table from "@/components/ui/Table";
import { Button } from "@/components/ui/button";

export default function StaffTable({ data, onDelete }) {
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = (staff) => {
    onDelete(staff);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const columns = [
    { 
      key: "username", 
      label: "Usuario",
      cell: (row) => (
        <span className="font-medium text-[#002366]">
          {row.original.username}
        </span>
      )
    },
    { 
      key: "email", 
      label: "Email",
      cell: (row) => (
        <span className="text-[#374151]">
          {row.original.email}
        </span>
      )
    },
    {
      key: "first_name",
      label: "Nombre completo",
      cell: (row) => (
        <span className="text-[#374151]">
          {row.original.first_name} {row.original.last_name}
        </span>
      )
    },
    {
      key: "is_active",
      label: "Estado",
      cell: (row) => {
        const isActive = row.original.is_active;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              isActive
                ? "bg-[#E6F4F1] text-[#0F766E]"
                : "bg-[#FEF2F2] text-[#E5533D]"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              isActive ? "bg-[#2ECC71]" : "bg-[#E5533D]"
            }`} />
            {isActive ? "Activo" : "Inactivo"}
          </span>
        );
      }
    },
    {
      key: "actions",
      label: "Acciones",
      align: "right", // Acciones a la derecha (guía)
      cell: (row) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(row.original)}
            className="text-[#E5533D] hover:bg-[#FEF2F2] hover:text-[#E5533D] transition-colors duration-150"
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} data={data} />
    </>
  );
}