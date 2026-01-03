"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default function ProductCard({ product }) {
  const imageSrc =
    typeof product.main_image === "string" && product.main_image.length > 0
      ? product.main_image
      : null;

  const hasPromo = product.promo_price && product.promo_price < product.price;
  const displayPrice = hasPromo ? product.promo_price : product.price;

  return (
    <div className="group flex flex-col rounded-lg border border-[#E5E7EB] bg-white shadow-sm hover:border-[#00A8CC] hover:shadow-md transition-all duration-150">
      
      {/* IMAGEN */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block h-48 w-full bg-[#F5F7FA] rounded-t-lg overflow-hidden"
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-12 w-12 text-[#6B7280]" />
          </div>
        )}

        {/* Badge restricción (si aplica) */}
        {product.is_restricted && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#FFFBEB] text-[#D97706] border border-[#F59E0B]">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Controlado
            </span>
          </div>
        )}
      </Link>

      {/* INFO */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-[#002366] line-clamp-2 hover:text-[#00A8CC] transition-colors duration-150">
            {product.name}
          </h3>
        </Link>

        {product.category_name && (
          <p className="mt-1 text-xs text-[#6B7280]">
            {product.category_name}
          </p>
        )}

        {/* Precio y acción */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
          <div>
            {hasPromo && (
              <span className="block text-xs text-[#6B7280] line-through">
                S/ {parseFloat(product.price).toFixed(2)}
              </span>
            )}
            <span className={`block text-base font-semibold ${
              hasPromo ? "text-[#2ECC71]" : "text-[#002366]"
            }`}>
              S/ {parseFloat(displayPrice).toFixed(2)}
            </span>
          </div>

          <AddToCartButton product={product} size="sm" />
        </div>

        {/* Indicador de stock bajo */}
        {product.stock !== undefined && product.stock > 0 && product.stock <= 10 && (
          <p className="text-xs text-[#F59E0B] mt-2">
            Solo {product.stock} disponibles
          </p>
        )}
      </div>
    </div>
  );
}