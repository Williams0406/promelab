"use client";

import { useState } from "react";
import useCart from "@/hooks/useCart";
import { ShieldCheck, CreditCard } from "lucide-react";
import PaymentMethodsModal from "@/components/payment/PaymentMethodsModal";

export default function CheckoutPayPage() {
  const { items, total } = useCart();
  const [open, setOpen] = useState(false);

  if (!items.length) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-[#6B7280]">
        Tu carrito está vacío
      </div>
    );
  }

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* INFO */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border bg-white">
            <h2 className="text-lg font-semibold text-[#002366] mb-3">
              Información importante
            </h2>
            <ul className="text-sm text-[#374151] space-y-2">
              <li>🚚 Envíos a Lima y Callao según distrito</li>
              <li>📦 Provincias vía agencia</li>
              <li>☎️ Un asesor coordinará la entrega</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl border bg-[#F5F7FA]">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-5 w-5 text-[#00A8CC]" />
              <span className="font-medium text-[#002366]">
                Compra segura
              </span>
            </div>
            <p className="text-sm text-[#6B7280]">
              Tus datos están protegidos mediante cifrado SSL.
            </p>
          </div>
        </div>

        {/* PEDIDO */}
        <div className="p-6 rounded-2xl border bg-white">
          <h2 className="text-lg font-semibold text-[#002366] mb-4">
            Tu pedido
          </h2>

          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  S/ {(item.price_snapshot * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-semibold text-[#002366]">
              S/ {total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="mt-6 w-full py-3 rounded-xl bg-[#00A8CC] text-white font-semibold hover:bg-[#0094B3]"
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
