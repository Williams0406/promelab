"use client";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product, size = "default" }) {
  const { addItem, items } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Verificar si el producto ya está en el carrito
  const itemInCart = items.find(item => item.product.id === product.id);

  const disabled =
    product.stock <= 0 ||
    (product.is_restricted && !isAuthenticated) ||
    loading ||
    success;

  const handleAdd = async () => {
    try {
      setLoading(true);
      await addItem(product);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Determinar texto del botón
  const getButtonText = () => {
    if (product.stock <= 0) return "Sin stock";
    if (product.is_restricted && !isAuthenticated) return "Inicia sesión";
    if (loading) return "Agregando...";
    if (success) return "Agregado";
    if (itemInCart) return `En carrito (${itemInCart.quantity})`;
    return "Agregar al carrito";
  };

  return (
    <Button
      size={size}
      disabled={disabled}
      onClick={handleAdd}
      className={`transition-all duration-150 ${
        success ? "bg-[#2ECC71] hover:bg-[#2ECC71]" : ""
      }`}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {success && <Check className="mr-2 h-4 w-4" />}
      {getButtonText()}
    </Button>
  );
}