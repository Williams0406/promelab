import { User, Calendar, Package } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderDetail({ order }) {
  // Calcular subtotal de items
  const itemsSubtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="space-y-6">
      
      {/* Header con info del cliente */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-lg bg-[#F5F7FA] border border-[#E5E7EB]">
        
        {/* Cliente */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-[#E5E7EB] shrink-0">
            <User className="h-5 w-5 text-[#002366]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">
              Cliente
            </p>
            <p className="text-sm font-semibold text-[#002366] truncate">
              {order.user.username}
            </p>
            <p className="text-xs text-[#6B7280] truncate">
              {order.user.email}
            </p>
          </div>
        </div>

        {/* Fecha */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-[#E5E7EB] shrink-0">
            <Calendar className="h-5 w-5 text-[#002366]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">
              Fecha de orden
            </p>
            <p className="text-sm font-semibold text-[#374151]">
              {new Date(order.created_at).toLocaleDateString('es-PE', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </p>
            <p className="text-xs text-[#6B7280]">
              {new Date(order.created_at).toLocaleTimeString('es-PE', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Estado */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-[#E5E7EB] shrink-0">
            <Package className="h-5 w-5 text-[#002366]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">
              Estado actual
            </p>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>

      {/* Productos */}
      <div>
        <h3 className="text-base font-semibold text-[#002366] mb-4">
          Productos de la orden
        </h3>

        <div className="rounded-lg border border-[#E5E7EB] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F7FA] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-[#374151]">
                  Producto
                </th>
                <th className="px-4 py-3 text-center font-semibold text-[#374151]">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-right font-semibold text-[#374151]">
                  Precio unit.
                </th>
                <th className="px-4 py-3 text-right font-semibold text-[#374151]">
                  Subtotal
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {order.items.map((item, index) => (
                <tr 
                  key={item.id} 
                  className={`${
                    index !== order.items.length - 1 ? "border-b border-[#E5E7EB]" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-[#002366]">
                      {item.product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-[#374151]">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-[#374151]">
                    S/ {parseFloat(item.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[#002366]">
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-end">
        <div className="w-full md:w-80 space-y-2 p-4 rounded-lg bg-[#F5F7FA] border border-[#E5E7EB]">
          <div className="flex justify-between text-sm">
            <span className="text-[#6B7280]">Subtotal</span>
            <span className="font-medium text-[#374151]">
              S/ {itemsSubtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6B7280]">Envío</span>
            <span className="font-medium text-[#2ECC71]">
              Gratis
            </span>
          </div>
          <div className="pt-2 border-t border-[#E5E7EB] flex justify-between">
            <span className="text-base font-semibold text-[#002366]">
              Total
            </span>
            <span className="text-xl font-semibold text-[#002366]">
              S/ {parseFloat(order.total).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}