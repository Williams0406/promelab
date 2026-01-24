"use client";

import {
  X,
  MessageCircle,
  CreditCard,
  Smartphone,
  Landmark,
  Loader2,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { useState } from "react";
import PaymentYapeModal from "@/components/payment/PaymentYapeModal";
import PaymentBankModal from "@/components/payment/PaymentBankModal";
import { clientAPI } from "@/lib/api";

export default function PaymentMethodsModal({ open, onClose, items, total }) {
  if (!open) return null;

  const [showYape, setShowYape] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [loading, setLoading] = useState(false);

  const phone = "51962162027";

  const message = encodeURIComponent(
    `Hola, deseo realizar una compra con el siguiente detalle:\n\n` +
      items
        .map(
          (i) =>
            `• ${i.product.name}\n  Cantidad: ${i.quantity}\n  Subtotal: S/ ${(
              i.price_snapshot * i.quantity
            ).toFixed(2)}`
        )
        .join("\n\n") +
      `\n\nTotal a pagar: S/ ${total.toFixed(2)}`
  );

  /* =========================
     CULQI CHECKOUT
  ========================= */
  const handleCulqi = async () => {
    try {
      setLoading(true);

      if (!window.Culqi) {
        alert("El sistema de pagos no está disponible.");
        return;
      }

      window.Culqi.publicKey =
        process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;

      window.Culqi.settings({
        title: "PROMELAB",
        currency: "PEN",
        amount: Math.round(total * 100),
      });

      window.Culqi.options({
        lang: "es",
        installments: false,
        paymentMethods: {
          tarjeta: true,
          yape: false,
          bancaMovil: false,
          agente: false,
          billetera: false,
        },
        style: {
          logo: "/logo-promelab.svg",
          bannerColor: "#002366",
          buttonBackground: "#002366",
          buttonText: "white",
        },
      });

      window.culqi = async () => {
        if (window.Culqi.token) {
          try {
            await clientAPI.createCulqiCharge(
              window.Culqi.token.id
            );

            window.location.href = "/orders";
          } catch (err) {
            console.error(err);
            alert("No se pudo confirmar el pago.");
          }
        } else {
          alert(
            window.Culqi.error?.user_message ||
              "Error procesando la tarjeta"
          );
        }
      };

      window.Culqi.open();
    } catch (error) {
      console.error(error);
      alert("Error iniciando el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#002366]">
            Confirmar pago
          </h3>
          <p className="text-sm text-gray-500">
            Selecciona el método de pago
          </p>
        </div>

        {/* Total */}
        <div className="mb-6 rounded-xl border bg-[#F5F7FA] p-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Total a pagar
          </span>
          <span className="text-xl font-semibold text-[#002366]">
            S/ {total.toFixed(2)}
          </span>
        </div>

        {/* Main CTA */}
        <button
          onClick={handleCulqi}
          disabled={loading}
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#002366] text-white hover:bg-[#003380] transition disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <CreditCard />
          )}
          <div className="flex-1 text-left">
            <p className="font-medium text-white">
              Pagar con tarjeta
            </p>
            <p className="text-xs text-white/80">
              Visa · Mastercard · Diners
            </p>
          </div>
          <ShieldCheck />
        </button>

        {/* Security note */}
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <Lock className="h-4 w-4" />
          Pago seguro · Cifrado SSL
        </div>

        {/* Alternative methods */}
        <div className="mt-6 space-y-3">

          <a
            href={`https://wa.me/${phone}?text=${message}`}
            target="_blank"
            className="flex items-center gap-3 p-4 rounded-xl border hover:bg-gray-50 transition"
          >
            <MessageCircle className="text-green-500" />
            <div>
              <p className="font-medium">WhatsApp</p>
              <p className="text-xs text-gray-500">
                Asesoría personalizada
              </p>
            </div>
          </a>

          <div
            onClick={() => setShowYape(true)}
            className="flex items-center gap-3 p-4 rounded-xl border bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
          >
            <Smartphone className="text-purple-500" />
            <div>
              <p className="font-medium">Yape / Plin</p>
              <p className="text-xs text-gray-500">
                Validación manual
              </p>
            </div>
          </div>

          <div
            onClick={() => setShowBank(true)}
            className="flex items-center gap-3 p-4 rounded-xl border bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
          >
            <Landmark className="text-blue-500" />
            <div>
              <p className="font-medium">
                Transferencia bancaria
              </p>
              <p className="text-xs text-gray-500">
                BCP · Interbank · BBVA
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-center text-gray-500">
          El pedido se confirma automáticamente o tras validación del pago.
        </p>
      </div>

      <PaymentYapeModal
        open={showYape}
        onClose={() => setShowYape(false)}
        total={total}
      />

      <PaymentBankModal
        open={showBank}
        onClose={() => setShowBank(false)}
        total={total}
      />
    </div>
  );
}
