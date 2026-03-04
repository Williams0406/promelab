"use client";

import Link from "next/link";
import { Package, ShieldCheck } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default function ProductCard({ product }) {
  const imageSrc =
    typeof product.main_image === "string" && product.main_image.length > 0
      ? product.main_image
      : null;

  const hasPromo = product.promo_price && product.promo_price < product.price;
  const displayPrice = hasPromo ? product.promo_price : product.price;

  return (
    <div className="group flex flex-col rounded-lg border border-[#E5E7EB] bg-white shadow-sm hover:shadow-md hover:border-[#00A8CC] hover:-translate-y-1 transition-all duration-200 ease-out h-full overflow-hidden">
      
      {/* SECCIÓN DE IMAGEN: Blanco Clínico y Altura Incrementada */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block h-72 w-full bg-white overflow-hidden border-b border-[#F5F7FA]"
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-contain p-8 group-hover:scale-105 transition-transform duration-500 ease-in-out"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#F5F7FA]">
            <Package className="h-16 w-16 text-[#687280]" />
          </div>
        )}

        {/* Badge de Restricción: Estilo Institucional */}
        {product.is_restricted && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Controlado
            </span>
          </div>
        )}

        {/* Badge de Descuento */}
        {hasPromo && (
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 rounded text-xs font-bold bg-[#2ECC71] text-white shadow-sm">
              -{Math.round(((product.price - product.promo_price) / product.price) * 100)}%
            </span>
          </div>
        )}
      </Link>

      {/* INFO DEL PRODUCTO: Jerarquía Estricta */}
      <div className="flex flex-1 flex-col p-6">
        {product.category_name && (
          <span className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#00A8CC]">
            {product.category_name}
          </span>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-[15px] font-bold text-[#374151] line-clamp-2 leading-tight group-hover:text-[#002366] transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Espaciado para alinear precios y botón al fondo */}
        <div className="mt-auto pt-6 flex items-center justify-between">
          <div className="flex flex-col">
            {hasPromo && (
              <span className="text-xs text-[#687280] line-through decoration-red-400/40">
                S/ {parseFloat(product.price).toFixed(2)}
              </span>
            )}
            <span className={`text-xl font-black tracking-tight ${
              hasPromo ? "text-[#2ECC71]" : "text-[#002366]"
            }`}>
              <small className="text-sm font-bold mr-0.5">S/</small>
              {parseFloat(displayPrice).toFixed(2)}
            </span>
          </div>

          {/* Botón de acción: El movimiento guía, no entretiene */}
          <div className="transition-transform duration-200 active:scale-95">
            <AddToCartButton product={product} size="md" />
          </div>
        </div>
      </div>
    </div>
  );
}