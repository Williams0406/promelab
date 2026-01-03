"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCart from "@/hooks/useCart";
import { Trash2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const { product } = item;
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > product.stock) {
      alert(`Stock máximo disponible: ${product.stock}`);
      return;
    }
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.id);
    setShowDeleteConfirm(false);
  };

  const price = product.promo_price || product.price;
  const subtotal = (price * item.quantity).toFixed(2);

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-6 border-b border-[#E5E7EB]">
        
        {/* Imagen del producto */}
        <div className="shrink-0">
          <div className="relative h-20 w-20 rounded-lg border border-[#E5E7EB] bg-[#F5F7FA] overflow-hidden">
            {product.main_image ? (
              <img
                src={product.main_image}
                alt={product.name}
                className="h-full w-full object-contain p-2"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[#6B7280]">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Info del producto */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[#002366] mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-[#6B7280]">
            Precio unitario: S/ {price}
          </p>
          {product.stock <= 10 && (
            <p className="text-xs text-[#F59E0B] mt-1">
              Solo {product.stock} disponibles
            </p>
          )}
        </div>

        {/* Controles de cantidad */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] text-[#374151] hover:bg-[#F5F7FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            aria-label="Disminuir cantidad"
          >
            <Minus className="h-4 w-4" />
          </button>

          <Input
            type="number"
            min={1}
            max={product.stock}
            value={item.quantity}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            className="h-8 w-16 text-center text-sm border-[#E5E7EB]"
          />

          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= product.stock}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] text-[#374151] hover:bg-[#F5F7FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[100px]">
          <p className="text-base font-semibold text-[#002366]">
            S/ {subtotal}
          </p>
        </div>

        {/* Botón eliminar */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#E5533D] hover:bg-[#FEF2F2] transition-colors duration-150"
          aria-label="Eliminar producto"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleRemove}
        title="Eliminar producto"
        description={`¿Deseas eliminar "${product.name}" del carrito?`}
        confirmText="Eliminar"
        variant="destructive"
      />
    </>
  );
}