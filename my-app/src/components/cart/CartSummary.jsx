"use client";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import { clientAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";

export default function CartSummary() {
  const { items, total, loadCart } = useCart();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!items.length) return null;

  const subtotal = total;
  const shipping = 0; // Envío gratuito o calcular según lógica
  const finalTotal = subtotal + shipping;

  const handleCreateOrder = async () => {
    setError(null);
    
    try {
      setLoading(true);
      await clientAPI.createOrder();

      // Refrescar carrito (queda vacío)
      await loadCart();

      // Redirigir a órdenes
      router.push("/orders");
    } catch (err) {
      console.error("Error creando la orden:", err);
      setError(
        err.response?.data?.detail || 
        "No se pudo crear la orden. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm sticky top-24">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="h-5 w-5 text-[#002366]" />
        <h3 className="text-base font-semibold text-[#002366]">
          Resumen del pedido
        </h3>
      </div>

      {/* Desglose */}
      <div className="space-y-3 pb-4 border-b border-[#E5E7EB]">
        <div className="flex justify-between text-sm">
          <span className="text-[#6B7280]">Productos ({items.length})</span>
          <span className="font-medium text-[#374151]">
            S/ {subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-[#6B7280]">Envío</span>
          <span className="font-medium text-[#2ECC71]">
            {shipping === 0 ? "Gratis" : `S/ ${shipping.toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-4 border-b border-[#E5E7EB]">
        <span className="text-base font-semibold text-[#002366]">
          Total
        </span>
        <span className="text-xl font-semibold text-[#002366]">
          S/ {finalTotal.toFixed(2)}
        </span>
      </div>

      {/* Error feedback */}
      {error && (
        <div className="mt-4 rounded-lg bg-[#FEF2F2] border border-[#E5533D] p-3">
          <p className="text-sm text-[#E5533D]">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 mt-6">
        {/* CTA Primary — Solo 1 */}
        <Button
          className="w-full h-11 bg-[#002366] text-white hover:bg-[#003380] transition-colors duration-150"
          disabled={loading}
          onClick={handleCreateOrder}
        >
          {loading ? "Procesando..." : "Crear orden de compra"}
        </Button>

        {/* CTA Secondary */}
        <Button
          variant="ghost"
          className="w-full h-11 text-[#374151] hover:bg-[#F5F7FA] transition-colors duration-150"
          onClick={() => router.push("/products")}
          disabled={loading}
        >
          Continuar comprando
        </Button>
      </div>

      {/* Info adicional */}
      <p className="mt-4 text-xs text-center text-[#6B7280]">
        Al crear la orden, aceptas nuestros{" "}
        <a href="/terms" className="text-[#002366] hover:underline">
          términos y condiciones
        </a>
      </p>
    </div>
  );
}