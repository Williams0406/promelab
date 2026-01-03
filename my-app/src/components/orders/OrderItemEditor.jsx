import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function OrderItemEditor({ item, onChange }) {
  const [errors, setErrors] = useState({});

  const handleQuantityChange = (value) => {
    const quantity = Number(value);
    
    if (quantity < 1) {
      setErrors(prev => ({ ...prev, quantity: "Mínimo 1" }));
      return;
    }
    
    setErrors(prev => ({ ...prev, quantity: null }));
    onChange({ ...item, quantity });
  };

  const handlePriceChange = (value) => {
    const price = Number(value);
    
    if (price <= 0) {
      setErrors(prev => ({ ...prev, price: "Debe ser mayor a 0" }));
      return;
    }
    
    setErrors(prev => ({ ...prev, price: null }));
    onChange({ ...item, price });
  };

  const subtotal = (item.quantity * item.price).toFixed(2);

  return (
    <div className="grid grid-cols-12 gap-4 items-start p-4 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#00A8CC] transition-colors duration-150">
      
      {/* Producto */}
      <div className="col-span-12 md:col-span-5">
        <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">
          Producto
        </label>
        <p className="text-sm font-medium text-[#002366]">
          {item.product.name}
        </p>
      </div>

      {/* Cantidad */}
      <div className="col-span-6 md:col-span-2">
        <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
          Cantidad
        </label>
        <Input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
          className={`h-9 text-center ${
            errors.quantity ? "border-[#E5533D]" : "border-[#E5E7EB]"
          }`}
        />
        {errors.quantity && (
          <p className="text-xs text-[#E5533D] mt-1">{errors.quantity}</p>
        )}
      </div>

      {/* Precio unitario */}
      <div className="col-span-6 md:col-span-2">
        <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
          Precio
        </label>
        <Input
          type="number"
          step="0.01"
          min="0.01"
          value={item.price}
          onChange={(e) => handlePriceChange(e.target.value)}
          className={`h-9 ${
            errors.price ? "border-[#E5533D]" : "border-[#E5E7EB]"
          }`}
        />
        {errors.price && (
          <p className="text-xs text-[#E5533D] mt-1">{errors.price}</p>
        )}
      </div>

      {/* Subtotal */}
      <div className="col-span-12 md:col-span-3 md:text-right">
        <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">
          Subtotal
        </label>
        <p className="text-base font-semibold text-[#002366]">
          S/ {subtotal}
        </p>
      </div>
    </div>
  );
}