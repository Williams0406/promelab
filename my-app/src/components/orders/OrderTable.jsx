"use client";

import { useState } from "react";
import OrderStatusBadge from "./OrderStatusBadge";
import Modal from "@/components/ui/Modal";
import { Eye } from "lucide-react";
import OrderDetail from "./OrderDetail";

export default function OrderTable({ orders = [] }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center">
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F7FA] border border-[#E5E7EB] mb-4">
            <svg className="h-8 w-8 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-[#002366] mb-2">
            No tienes órdenes
          </h3>
          <p className="text-sm text-[#6B7280]">
            Tus órdenes de compra aparecerán aquí
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-[#E5E7EB] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F7FA] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-[#374151]">
                Orden
              </th>
              <th className="px-4 py-3 text-center font-semibold text-[#374151]">
                Fecha
              </th>
              <th className="px-4 py-3 text-center font-semibold text-[#374151]">
                Estado
              </th>
              <th className="px-4 py-3 text-right font-semibold text-[#374151]">
                Total
              </th>
              <th className="px-4 py-3 text-right font-semibold text-[#374151]">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={`${
                  index !== orders.length - 1 ? "border-b border-[#E5E7EB]" : ""
                } hover:bg-[#F5F7FA] transition-colors duration-150`}
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-sm font-medium text-[#002366]">
                    #{order.id.slice(0, 8)}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="text-sm">
                    <p className="font-medium text-[#374151]">
                      {new Date(order.created_at).toLocaleDateString('es-PE')}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      {new Date(order.created_at).toLocaleTimeString('es-PE', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-3 text-center">
                  <OrderStatusBadge status={order.status} />
                </td>

                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-[#002366]">
                    S/ {parseFloat(order.total).toFixed(2)}
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#002366] hover:bg-[#F5F7FA] transition-colors duration-150"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DETALLE */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={
          selectedOrder
            ? `Detalle de la orden #${selectedOrder.id.slice(0, 8)}`
            : ""
        }
        size="xl"
      >
        {selectedOrder && (
          <OrderDetail order={selectedOrder} />
        )}
      </Modal>
    </>
  );
}