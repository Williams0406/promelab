"use client";

import { useState } from "react";
import { adminAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import OrderItemEditor from "./OrderItemEditor";
import OrderStatusBadge from "./OrderStatusBadge";

const ORDER_STATUS_CONFIG = {
  CREATED: { label: "Creada", value: "CREATED" },
  PAID: { label: "Pagada", value: "PAID" },
  PREPARING: { label: "Preparando", value: "PREPARING" },
  SHIPPED: { label: "Enviada", value: "SHIPPED" },
  DELIVERED: { label: "Entregada", value: "DELIVERED" },
  CANCELLED: { label: "Cancelada", value: "CANCELLED" },
};

export default function OrderDetailModal({ order, onClose, onSaved }) {
  const [status, setStatus] = useState(order.status);
  const [items, setItems] = useState(order.items);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasChanges = 
    status !== order.status || 
    JSON.stringify(items) !== JSON.stringify(order.items);

  const saveChanges = async () => {
    setError(null);
    setLoading(true);

    try {
      await adminAPI.updateOrder(order.id, {
        status,
        items,
      });
      
      onSaved?.();
      onClose?.();
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        "No se pudo actualizar la orden"
      );
    } finally {
      setLoading(false);
    }
  };

  // Calcular nuevo total
  const newTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ).toFixed(2);

  return (
    <div className="space-y-6">
      
      {/* INFO BÁSICA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-[#F5F7FA] border border-[#E5E7EB]">
        
        {/* Usuario */}
        <div>
          <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
            Cliente
          </label>
          <p className="text-sm font-semibold text-[#002366]">
            {order.user.username}
          </p>
          <p className="text-xs text-[#6B7280]">
            {order.user.email}
          </p>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
            Estado de la orden
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-sm font-medium text-[#374151] focus:border-[#00A8CC] focus:ring-1 focus:ring-[#00A8CC] transition-colors duration-150"
          >
            {Object.values(ORDER_STATUS_CONFIG).map((config) => (
              <option key={config.value} value={config.value}>
                {config.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PRODUCTOS */}
      <div>
        <h4 className="text-base font-semibold text-[#002366] mb-4">
          Productos de la orden
        </h4>

        <div className="space-y-3">
          {items.map((item, index) => (
            <OrderItemEditor
              key={item.id}
              item={item}
              onChange={(updated) => {
                const copy = [...items];
                copy[index] = updated;
                setItems(copy);
              }}
            />
          ))}
        </div>
      </div>

      {/* TOTAL */}
      <div className="flex justify-end">
        <div className="w-full md:w-80 p-4 rounded-lg bg-[#F5F7FA] border border-[#E5E7EB]">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-[#002366]">
              Total actualizado
            </span>
            <span className="text-xl font-semibold text-[#002366]">
              S/ {newTotal}
            </span>
          </div>
          {newTotal !== parseFloat(order.total).toFixed(2) && (
            <p className="text-xs text-[#F59E0B] mt-2">
              Total original: S/ {parseFloat(order.total).toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* ERROR FEEDBACK */}
      {error && (
        <div className="rounded-lg bg-[#FEF2F2] border border-[#E5533D] p-4">
          <p className="text-sm text-[#E5533D]">{error}</p>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
        <Button 
          variant="ghost" 
          onClick={onClose}
          disabled={loading}
          className="text-[#374151] hover:bg-[#F5F7FA]"
        >
          Cancelar
        </Button>
        
        <Button 
          onClick={saveChanges}
          disabled={loading || !hasChanges}
          className="bg-[#002366] text-white hover:bg-[#003380] transition-colors duration-150 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>

      {/* Indicador de cambios sin guardar */}
      {hasChanges && !loading && (
        <p className="text-xs text-center text-[#F59E0B]">
          Hay cambios sin guardar
        </p>
      )}
    </div>
  );
}