"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import useCart from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyState from "@/components/common/EmptyState";
import Spinner from "@/components/ui/Spinner";

export default function CartPage() {
  const { items, initialized } = useCart();

  if (!initialized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" context="Cargando carrito..." />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <EmptyState
          type="default"
          title="Tu carrito está vacío"
          description="No has agregado productos a tu carrito de compras."
          instruction="Explora nuestro catálogo y agrega los productos que necesitas."
          action={
            <Link 
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-[#002366] text-white text-sm font-medium rounded-lg hover:bg-[#003380] transition-colors duration-150"
            >
              Explorar productos
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <section className="container mx-auto sm:px-4 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F7FA] border border-[#E5E7EB]">
          <ShoppingCart className="h-5 w-5 text-[#002366]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[#002366]">
            Carrito de Compras
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            {items.length} {items.length === 1 ? "producto" : "productos"}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </section>
  );
}
