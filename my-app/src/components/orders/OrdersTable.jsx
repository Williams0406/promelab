"use client";

import { useState } from "react";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import OrderDetailModal from "./OrderDetailModal";
import OrderStatusBadge from "./OrderStatusBadge";
import { Eye } from "lucide-react";

export default function OrdersTable({ orders, onRefresh }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const columns = [
    {
      key: "id",
      label: "Código",
      cell: (row) => (
        <span className="font-mono text-sm text-[#002366]">
          #{row.original.id.slice(0, 8)}
        </span>
      ),
    },
    {
      key: "user",
      label: "Cliente",
      cell: (row) => (
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#002366] truncate">
            {row.original.user.username}
          </p>
          <p className="text-xs text-[#6B7280] truncate">
            {row.original.user.email}
          </p>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Fecha",
      cell: (row) => (
        <div className="text-sm">
          <p className="font-medium text-[#374151]">
            {new Date(row.original.created_at).toLocaleDateString('es-PE')}
          </p>
          <p className="text-xs text-[#6B7280]">
            {new Date(row.original.created_at).toLocaleTimeString('es-PE', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Estado",
      cell: (row) => (
        <OrderStatusBadge status={row.original.status} />
      ),
    },
    {
      key: "total",
      label: "Total",
      cell: (row) => (
        <span className="text-sm font-semibold text-[#002366]">
          S/ {parseFloat(row.original.total).toFixed(2)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      align: "right", // Acciones a la derecha (guía)
      cell: (row) => (
        <div className="flex justify-end">
          <button
            onClick={() => setSelectedOrder(row.original)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#002366] hover:bg-[#F5F7FA] transition-colors duration-150"
          >
            <Eye className="h-3.5 w-3.5" />
            Ver detalle
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} data={orders} />

      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={
          selectedOrder
            ? `Orden #${selectedOrder.id.slice(0, 8)}`
            : ""
        }
        size="xl"
      >
        {selectedOrder && (
          <OrderDetailModal 
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onSaved={() => {
              setSelectedOrder(null);
              onRefresh?.();
            }}
          />
        )}
      </Modal>
    </>
  );
}