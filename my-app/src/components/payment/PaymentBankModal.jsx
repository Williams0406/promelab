import { X } from "lucide-react";

export default function PaymentBankModal({ open, onClose, total }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">

        <button onClick={onClose} className="absolute right-4 top-4">
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <h3 className="text-lg font-semibold text-[#002366] mb-4">
          Transferencia bancaria
        </h3>

        <div className="space-y-4 text-sm">

          <div className="p-4 rounded-xl border">
            <p className="font-medium">🏦 BCP</p>
            <p>Cuenta: 123-4567890-0-12</p>
            <p>CCI: 00212345678900123</p>
            <p>Titular: CASTROMONTE SAC</p>
          </div>

          <div className="p-4 rounded-xl border">
            <p className="font-medium">🏦 BBVA</p>
            <p>Cuenta: 0011-0000-02-123456</p>
            <p>CCI: 01112345678900123</p>
            <p>Titular: CASTROMONTE SAC</p>
          </div>

          <div className="flex justify-between font-semibold border-t pt-3">
            <span>Total a pagar</span>
            <span>S/ {total.toFixed(2)}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500 text-center">
          Luego de transferir, envíanos el comprobante por WhatsApp.
        </p>
      </div>
    </div>
  );
}
