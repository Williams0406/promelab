import { X } from "lucide-react";

export default function PaymentYapeModal({ open, onClose, total }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative">

        <button onClick={onClose} className="absolute right-4 top-4">
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <h3 className="text-lg font-semibold text-[#002366] mb-3">
          Pago con Yape / Plin
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Escanea el QR o paga al número indicado.
        </p>

        {/* QR */}
        <div className="flex justify-center mb-4">
          <img
            src="/yape-qr.png"  // 👉 TU QR REAL
            alt="QR Yape"
            className="w-48 h-48 rounded-lg border"
          />
        </div>

        {/* Datos */}
        <div className="text-sm space-y-2">
          <p><strong>Número:</strong> 962 162 027</p>
          <p><strong>Monto:</strong> S/ {total.toFixed(2)}</p>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Una vez realizado el pago, envíanos la confirmación por WhatsApp.
        </div>
      </div>
    </div>
  );
}
