"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import HeroBanner from "@/components/public/HeroBanner";
import ProductGrid from "@/components/products/ProductGrid";
import { publicAPI } from "@/lib/api";
import { FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import {
  HiOutlineBadgeCheck,
  HiOutlineBeaker,
  HiOutlineTruck,
} from "react-icons/hi";
import VendorsSection from "@/components/public/VendorsSection";

const HOME_PRODUCTS_LIMIT = 4;

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [hasMoreProducts, setHasMoreProducts] = useState(false);

  useEffect(() => {
    publicAPI
      .getProducts({ page: 1 })
      .then((res) => {
        const results = res.data?.results || [];

        setProducts(results.slice(0, HOME_PRODUCTS_LIMIT));
        setHasMoreProducts(res.data.count > HOME_PRODUCTS_LIMIT);
      })
      .catch(() => {
        setProducts([]);
        setHasMoreProducts(false);
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  return (
    <>
      <HeroBanner />

      {/* PROPUESTA DE VALOR TÉCNICA */}
      <section className="bg-[#F5F7FA] py-16 px-4 border-b border-[#E5E7EB]">
        <div className="container mx-auto max-w-5xl">
          {/* Indicadores Técnicos */}
          <div className="flex flex-wrap justify-center gap-10 mb-12 text-sm font-semibold tracking-wide text-[#002366]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#002366] to-[#00A8CC]"></span>
              <span>Certificaciones ISO</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#002366] to-[#00A8CC]"></span>
              <span>Marcas Reconocidas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#002366] to-[#00A8CC]"></span>
              <span>Soporte Técnico</span>
            </div>
          </div>

          {/* Headline Técnico */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-6 leading-tight tracking-tight">
            <span className="block text-[#002366]">
              Abastecimiento científico
            </span>
            <span className="block text-[#00A8CC]">
              para laboratorios e industria
            </span>
          </h1>

          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-gradient-to-r from-[#002366] to-[#00A8CC]" />

          {/* Especificación Clara */}
          <p className="max-w-2xl mx-auto text-[#374151] text-center leading-relaxed text-base md:text-lg">
            Equipos de análisis, instrumentación de precisión y reactivos 
            certificados. Especificaciones técnicas completas y trazabilidad 
            garantizada para cada producto.
          </p>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="py-20 bg-white sm:px-4 lg:px-8">
        <div className="container mx-auto px-4">
          {/* Header Sección */}
          <div className="mb-12">
            <span className="inline-block mb-3 text-xs font-semibold text-[#00A8CC] uppercase tracking-wide">
              CATÁLOGO TÉCNICO
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#002366] mb-3 tracking-tight">
              Equipos listos para cotización
            </h2>
            <p className="text-sm md:text-base text-[#6B7280] max-w-xl">
              Stock disponible con especificaciones completas y documentación técnica
            </p>
          </div>

          <ProductGrid
            products={products}
            loading={loadingProducts}
            variant="preview"
          />

          {hasMoreProducts && (
            <div className="mt-12 flex justify-center">
              <Link 
                href="/products" 
                className="group inline-flex items-center gap-2 px-6 py-3 bg-[#002366] text-white text-sm font-medium rounded-lg hover:bg-[#003380] transition-all duration-150"
              >
                Ver catálogo completo
                <svg
                  className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* PROVEEDORES */}
      <VendorsSection />

      {/* DIFERENCIADORES INSTITUCIONALES */}
      <section className="py-20 bg-[#F5F7FA] border-y border-[#E5E7EB]">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">

            {/* Certificaciones */}
            <div className="group bg-white border border-[#E5E7EB] rounded-xl p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#E6F4F1] text-[#0F766E] mb-6">
                <HiOutlineBadgeCheck className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-semibold text-[#002366] mb-3">
                Certificaciones Verificables
              </h3>

              <p className="text-sm text-[#6B7280] leading-relaxed">
                Documentación técnica completa: fichas técnicas, certificados de análisis
                y manuales de operación.
              </p>
            </div>

            {/* Asesoría */}
            <div className="group bg-white border border-[#E5E7EB] rounded-xl p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#EEF2FF] text-[#3730A3] mb-6">
                <HiOutlineBeaker className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-semibold text-[#002366] mb-3">
                Asesoría Técnica Especializada
              </h3>

              <p className="text-sm text-[#6B7280] leading-relaxed">
                Soporte profesional para selección de equipos y configuración
                según requerimientos de laboratorio.
              </p>
            </div>

            {/* Logística */}
            <div className="group bg-white border border-[#E5E7EB] rounded-xl p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#FFF7ED] text-[#9A3412] mb-6">
                <HiOutlineTruck className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-semibold text-[#002366] mb-3">
                Entrega Programada
              </h3>

              <p className="text-sm text-[#6B7280] leading-relaxed">
                Logística coordinada con seguimiento de pedido y garantía de
                trazabilidad en toda la cadena.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SOPORTE COMERCIAL */} 
      <section className="py-24 bg-gradient-to-b from-white to-[#F5F7FA]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">

            {/* Card principal */}
            <div className="group relative grid gap-12 md:grid-cols-[1.6fr_1fr] 
              rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden
              transition-all duration-300 hover:shadow-xl">

              {/* Glow técnico */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#00A8CC]/10 rounded-full blur-3xl" />
              </div>

              {/* INFO */}
              <div className="relative bg-[#F5F7FA] p-10 md:p-12">
                <span className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wide text-[#002366] uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#00A8CC] animate-pulse" />
                  Soporte comercial
                </span>

                <h2 className="text-2xl md:text-3xl font-bold text-[#002366] mb-4">
                  Cotizaciones técnicas y acompañamiento experto
                </h2>

                <p className="text-[#6B7280] leading-relaxed mb-8 max-w-xl">
                  Asesoría especializada para compras institucionales, 
                  especificación de equipos y soporte post-venta certificado.
                </p>

                {/* Datos */}
                <ul className="space-y-4 text-sm">
                  {[
                    { label: "Teléfono", value: "+51 972 719 164" },
                    { label: "Email", value: "ventas@promelab.com" },
                    { label: "Ubicación", value: "Lima, Perú" },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center gap-3 p-3 rounded-lg 
                        bg-white border border-[#E5E7EB]
                        transition-colors duration-150 hover:border-[#00A8CC]"
                    >
                      <span className="w-24 font-medium text-[#002366]">
                        {item.label}:
                      </span>
                      <span className="text-[#374151]">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="relative p-10 md:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full 
                    bg-[#E6F4F1] text-xs font-semibold text-[#0F766E] mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#0F766E]" />
                    Respuesta inmediata
                  </div>

                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    Atención directa por WhatsApp para consultas técnicas, 
                    tiempos de entrega y coordinación logística.
                  </p>
                </div>

                <Link
                  href="https://wa.me/51972719164"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3
                    px-6 py-4 bg-[#002366] text-white text-sm font-semibold
                    rounded-xl transition-all duration-200
                    hover:bg-[#003380] hover:scale-[1.02]"
                >
                  <svg
                    className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606..." />
                  </svg>
                  Iniciar conversación técnica
                </Link>

                {/* Redes */}
                <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] mb-3">
                    Presencia institucional:
                  </p>
                  <div className="flex gap-4">
                    <FaLinkedinIn className="w-5 h-5 text-[#002366] hover:text-[#00A8CC] transition-colors" />
                    <FaFacebookF className="w-5 h-5 text-[#002366] hover:text-[#00A8CC] transition-colors" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}