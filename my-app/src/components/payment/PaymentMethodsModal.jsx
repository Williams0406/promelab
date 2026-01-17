import { X, MessageCircle, CreditCard } from "lucide-react";

export default function PaymentMethodsModal({ open, onClose, items, total }) {
  if (!open) return null;

  const phone = "51999999999"; // TU WHATSAPP
  const message = encodeURIComponent(
    `Hola, soy un cliente interesado en comprar:\n\n` +
    items.map(i =>
      `• ${i.product.name} x${i.quantity} - S/ ${(i.price_snapshot * i.quantity).toFixed(2)}`
    ).join("\n") +
    `\n\nTotal: S/ ${total.toFixed(2)}`
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">

        <button onClick={onClose} className="absolute right-4 top-4">
          <X className="h-5 w-5 text-[#6B7280]" />
        </button>

        <h3 className="text-lg font-semibold text-[#002366] mb-4">
          Elige tu método de pago
        </h3>

        <div className="space-y-3">
          <a
            href={`https://wa.me/${phone}?text=${message}`}
            target="_blank"
            className="flex items-center gap-3 p-4 rounded-xl border hover:bg-[#F5F7FA]"
          >
            <MessageCircle className="text-green-500" />
            <span className="font-medium">Comprar por WhatsApp</span>
          </a>

          <button
            disabled
            className="flex items-center gap-3 p-4 rounded-xl border opacity-50 cursor-not-allowed"
          >
            <CreditCard />
            <span>Tarjeta (próximamente)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
