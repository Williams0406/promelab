"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Package, Truck, Shield } from "lucide-react";

import Spinner from "@/components/ui/Spinner";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductImages from "@/components/products/ProductImages";
import ProductGrid from "@/components/products/ProductGrid";
import { publicAPI } from "@/lib/api";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    publicAPI
      .getProduct(slug)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!product?.category_id) return;

    setLoadingRelated(true);

    publicAPI
      .getProducts({
        category: product.category_id, // ✅ UUID
        page_size: 5,
      })
      .then((res) => {
        const results = res.data?.results || [];

        setRelatedProducts(
          results.filter((p) => p.slug !== product.slug).slice(0, 4)
        );
      })
      .catch(() => setRelatedProducts([]))
      .finally(() => setLoadingRelated(false));
  }, [product]);

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" context="Cargando producto..." />
      </div>
    );
  }

  // Not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex flex-col items-center">
          <Package className="h-16 w-16 text-[#6B7280] mb-4" />
          <h2 className="text-xl font-semibold text-[#002366] mb-2">
            Producto no encontrado
          </h2>
          <p className="text-sm text-[#6B7280] mb-6">
            El producto que buscas no está disponible
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-[#002366] text-white text-sm font-medium rounded-lg hover:bg-[#003380] transition-colors duration-150"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  const hasPromo = product.promo_price && product.promo_price < product.price;
  const displayPrice = hasPromo ? product.promo_price : product.price;

  return (
    <section className="container mx-auto px-4 py-10 lg:px-8">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="text-[#6B7280] hover:text-[#002366] transition-colors duration-150">
          Inicio
        </Link>
        <ChevronRight className="h-4 w-4 text-[#6B7280]" />
        <Link href="/products" className="text-[#6B7280] hover:text-[#002366] transition-colors duration-150">
          Productos
        </Link>
        {product.category_name && (
          <>
            <ChevronRight className="h-4 w-4 text-[#6B7280]" />
            <span className="text-[#374151] font-medium">{product.category_name}</span>
          </>
        )}
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        
        {/* GALERÍA */}
        <div>
          <ProductImages images={product.images || []} />
        </div>

        {/* INFO PRINCIPAL */}
        <div className="flex flex-col">
          
          {/* Categoría */}
          {product.category_name && (
            <span className="inline-block mb-3 text-xs font-semibold text-[#00A8CC] uppercase tracking-wide">
              {product.category_name}
            </span>
          )}

          {/* Título */}
          <h1 className="text-3xl font-semibold text-[#002366] mb-4">
            {product.name}
          </h1>

          {/* Precio */}
          <div className="flex items-end gap-4 mb-6 pb-6 border-b border-[#E5E7EB]">
            {hasPromo && (
              <span className="text-base text-[#6B7280] line-through">
                S/ {parseFloat(product.price).toFixed(2)}
              </span>
            )}
            <span className={`text-4xl font-semibold ${
              hasPromo ? "text-[#2ECC71]" : "text-[#002366]"
            }`}>
              S/ {parseFloat(displayPrice).toFixed(2)}
            </span>
            {hasPromo && (
              <span className="px-3 py-1 rounded-full bg-[#FEF2F2] text-xs font-semibold text-[#E5533D]">
                {Math.round(((product.price - product.promo_price) / product.price) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F4F1] text-sm font-medium text-[#0F766E]">
                <span className="w-2 h-2 rounded-full bg-[#2ECC71]" />
                Disponible
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="mb-8">
            <AddToCartButton
              product={product}
              size="default"
            />
          </div>

          {/* Beneficios */}
          <div className="space-y-3 mb-8 p-4 rounded-lg bg-[#F5F7FA] border border-[#E5E7EB]">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-[#00A8CC]" />
              <span className="text-[#374151]">Envío programado y seguimiento</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5 text-[#00A8CC]" />
              <span className="text-[#374151]">Garantía y soporte técnico</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-[#002366] mb-3">
              Descripción del producto
            </h2>
            <p className="text-[#374151] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specs técnicas */}
          {product.technical_specs &&
            Object.keys(product.technical_specs).length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-[#002366] mb-4">
                  Especificaciones técnicas
                </h2>

                <div className="space-y-2">
                  {Object.entries(product.technical_specs).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center px-4 py-3 rounded-lg border border-[#E5E7EB] bg-white text-sm"
                      >
                        <span className="text-[#6B7280]">{key}</span>
                        <span className="font-medium text-[#374151]">
                          {String(value)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
      {/* PRODUCTOS RELACIONADOS */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-[#E5E7EB] pt-16">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <span className="inline-block mb-2 text-xs font-semibold text-[#00A8CC] uppercase tracking-wide">
                También te puede interesar
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#002366]">
                Productos relacionados
              </h2>
            </div>

            <ProductGrid
              products={relatedProducts}
              loading={loadingRelated}
              variant="preview"
            />

            <div className="mt-10 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#002366] hover:text-[#00A8CC]"
              >
                Ver más productos
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}