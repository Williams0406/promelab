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
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00A8CC] hover:shadow-xl hover:shadow-[#002366]/[0.08]">
      <Link
        href={`/products/${product.slug}`}
        className="relative block h-64 w-full overflow-hidden border-b border-[#F5F7FA] bg-white"
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-contain p-6 transition-transform duration-500 ease-in-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#F5F7FA]">
            <Package className="h-16 w-16 text-[#687280]" />
          </div>
        )}

        {product.is_restricted && (
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Controlado
            </span>
          </div>
        )}

        {hasPromo && (
          <div className="absolute right-4 top-4">
            <span className="rounded-full bg-[#2ECC71] px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              -
              {Math.round(
                ((product.price - product.promo_price) / product.price) * 100
              )}
              %
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {product.category_name && (
          <span className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#00A8CC]">
            {product.category_name}
          </span>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-[15px] font-bold leading-tight text-[#374151] transition-colors duration-200 group-hover:text-[#002366]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto border-t border-[#F3F6F8] pt-4">
          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col">
              {hasPromo && (
                <span className="text-xs text-[#687280] line-through decoration-red-400/40">
                  S/ {parseFloat(product.price).toFixed(2)}
                </span>
              )}
              <span
                className={`text-2xl font-black tracking-tight ${
                  hasPromo ? "text-[#2ECC71]" : "text-[#002366]"
                }`}
              >
                <small className="mr-0.5 text-sm font-bold">S/</small>
                {parseFloat(displayPrice).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <AddToCartButton product={product} size="sm" layout="card" />
          </div>
        </div>
      </div>
    </article>
  );
}
