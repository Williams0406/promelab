"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { clientAPI } from "@/lib/api";
import { ShieldCheck, CreditCard } from "lucide-react";

export default function OrderPaymentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientAPI.getOrder(id).then(res => {
      setOrder(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-[#6B7280]">
        Cargando pedido…
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* Información / Facturación */}
      <div className="space-y-6">
        <div className="p-6 rounded-2xl border border-[#E5E7EB] bg-white">
          <h2 className="text-lg font-semibold text-[#002366] mb-4">
            Información importante para tu compra
          </h2>
          <ul className="space-y-2 text-sm text-[#374151]">
            <li>🚚 Envíos a Lima y Callao con costo según distrito</li>
            <li>📦 Envíos a provincia vía agencia</li>
            <li>☎️ Un asesor coordinará la entrega tras el pago</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl border border-[#E5E7EB] bg-[#F5F7FA]">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-[#00A8CC]" />
            <span className="font-medium text-[#002366]">Pago 100% seguro</span>
          </div>
          <p className="text-sm text-[#6B7280]">
            Utilizamos cifrado SSL y validación de identidad.
          </p>
        </div>
      </div>

      {/* Resumen / Pago */}
      <div className="p-6 rounded-2xl border border-[#E5E7EB] bg-white">
        <h2 className="text-lg font-semibold text-[#002366] mb-4">
          Tu pedido
        </h2>

        <div className="space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-[#374151]">
                {item.product.name} × {item.quantity}
              </span>
              <span className="font-medium text-[#002366]">
                S/ {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#E5E7EB] mt-4 pt-4 flex justify-between">
          <span className="text-base font-semibold text-[#002366]">Total</span>
          <span className="text-xl font-semibold text-[#002366]">
            S/ {parseFloat(order.total).toFixed(2)}
          </span>
        </div>

        <button
          className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00A8CC] text-white font-semibold hover:bg-[#0094B3] transition"
        >
          <CreditCard className="h-5 w-5" />
          Pagar ahora
        </button>
      </div>
    </div>
  );
}
