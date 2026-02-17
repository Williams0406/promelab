"use client";

import { useState } from "react";
import useCart from "@/hooks/useCart";
import { ShieldCheck, CreditCard, Truck } from "lucide-react";
import PaymentMethodsModal from "@/components/payment/PaymentMethodsModal";

export default function CheckoutPayPage() {
  const { items, total } = useCart();
  const [open, setOpen] = useState(false);

  if (!items.length) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-[#6B7280] text-lg">
        Tu carrito está vacío
      </div>
    );
  }

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ================= INFO ================= */}
        <div className="space-y-8">

          {/* Información */}
          <div className="p-8 rounded-3xl border border-[#E5E7EB] bg-white shadow-sm transition-all duration-300 hover:shadow-md">
            <h2 className="text-xl font-semibold text-[#002366] mb-5">
              Información importante
            </h2>

            <ul className="space-y-4 text-sm text-[#374151]">
              <li className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-[#00A8CC] mt-0.5" />
                <span>Envíos a Lima y Callao según distrito</span>
              </li>
              <li className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-[#00A8CC] mt-0.5" />
                <span>Provincias vía agencia de transporte</span>
              </li>
              <li className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-[#00A8CC] mt-0.5" />
                <span>Un asesor coordinará la entrega y facturación</span>
              </li>
            </ul>
          </div>

          {/* Seguridad */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[#F5F7FA] to-white border border-[#E5E7EB] shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-6 w-6 text-[#00A8CC]" />
              <span className="font-semibold text-[#002366]">
                Compra 100% segura
              </span>
            </div>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Tus datos están protegidos mediante cifrado SSL y protocolos de seguridad certificados.
            </p>
          </div>

        </div>

        {/* ================= PEDIDO ================= */}
        <div className="p-8 rounded-3xl border border-[#E5E7EB] bg-white shadow-md transition-all duration-300 hover:shadow-lg">

          <h2 className="text-xl font-semibold text-[#002366] mb-6">
            Resumen del pedido
          </h2>

          <div className="space-y-5 max-h-[300px] overflow-y-auto pr-2">
            {items.map(item => (
              <div
                key={item.id}
                className="flex justify-between items-start gap-6 text-sm border-b border-[#F0F2F5] pb-4"
              >
                <div className="flex-1">
                  <p className="font-medium text-[#111827] leading-snug">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Cantidad: {item.quantity}
                  </p>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="font-semibold text-[#002366]">
                    S/ {(item.price_snapshot * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t mt-8 pt-6 flex justify-between items-center">
            <span className="text-lg font-semibold text-[#111827]">
              Total
            </span>
            <span className="text-2xl font-bold text-[#002366]">
              S/ {total.toFixed(2)}
            </span>
          </div>

          {/* Botón */}
          <button
            onClick={() => setOpen(true)}
            className="mt-8 w-full py-4 rounded-2xl bg-[#00A8CC] text-white font-semibold text-base
                       transition-all duration-300
                       hover:bg-[#0094B3] hover:shadow-lg hover:scale-[1.02]
                       active:scale-[0.98]"
          >
            Elegir método de pago
          </button>

        </div>

      </section>

      <PaymentMethodsModal
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        total={total}
      />
    </>
  );
}
