"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import HeroBanner from "@/components/public/HeroBanner";
import ProductGrid from "@/components/products/ProductGrid";
import { publicAPI } from "@/lib/api";

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
          <div className="flex flex-wrap justify-center gap-8 mb-10 text-sm font-medium text-[#002366]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A8CC]"></span>
              <span>Certificaciones ISO</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A8CC]"></span>
              <span>Marcas Reconocidas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A8CC]"></span>
              <span>Soporte Técnico</span>
            </div>
          </div>

          {/* Headline Técnico */}
          <h1 className="text-3xl md:text-4xl font-semibold text-[#002366] text-center mb-4 tracking-tight">
            Abastecimiento científico para laboratorios e industria
          </h1>

          {/* Especificación Clara */}
          <p className="max-w-2xl mx-auto text-[#374151] text-center leading-relaxed">
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
            <h2 className="text-2xl font-semibold text-[#002366] mb-2">
              Equipos listos para cotización
            </h2>
            <p className="text-sm text-[#6B7280]">
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#002366] text-white text-sm font-medium rounded-lg hover:bg-[#003380] transition-colors duration-150"
              >
                Ver catálogo completo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* DIFERENCIADORES INSTITUCIONALES */}
      <section className="py-16 bg-[#F5F7FA] border-y border-[#E5E7EB]">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            
            {/* Diferenciador 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white border border-[#E5E7EB] mb-4">
                <svg className="w-6 h-6 text-[#002366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[#002366] mb-2">
                Certificaciones Verificables
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Documentación técnica completa: fichas técnicas, certificados 
                de análisis y manuales de operación
              </p>
            </div>

            {/* Diferenciador 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white border border-[#E5E7EB] mb-4">
                <svg className="w-6 h-6 text-[#002366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[#002366] mb-2">
                Asesoría Técnica Especializada
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Soporte profesional para selección de equipos y 
                configuración según requerimientos de laboratorio
              </p>
            </div>

            {/* Diferenciador 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white border border-[#E5E7EB] mb-4">
                <svg className="w-6 h-6 text-[#002366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[#002366] mb-2">
                Entrega Programada
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Logística coordinada con seguimiento de pedido y 
                garantía de trazabilidad en toda la cadena
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CONTACTO INSTITUCIONAL */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Grid Información + CTA */}
            <div className="grid gap-12 md:grid-cols-[1.5fr_1fr] border border-[#E5E7EB] rounded-xl overflow-hidden">
              
              {/* Columna Información */}
              <div className="bg-[#F5F7FA] p-10">
                <span className="inline-block mb-3 text-xs font-semibold text-[#002366] uppercase tracking-wide">
                  SOPORTE COMERCIAL
                </span>
                
                <h2 className="text-2xl font-semibold text-[#002366] mb-4">
                  Cotizaciones y asesoría técnica
                </h2>

                <p className="text-[#6B7280] mb-8 leading-relaxed">
                  Equipo disponible para especificaciones de proyecto, 
                  cotizaciones institucionales y soporte post-venta.
                </p>

                {/* Datos de Contacto */}
                <dl className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <dt className="font-medium text-[#002366] w-24">Teléfono:</dt>
                    <dd className="text-[#374151]">+51 962 162 027</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="font-medium text-[#002366] w-24">Email:</dt>
                    <dd className="text-[#374151]">ventas@promelab.com</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="font-medium text-[#002366] w-24">Ubicación:</dt>
                    <dd className="text-[#374151]">Lima, Perú</dd>
                  </div>
                </dl>
              </div>

              {/* Columna CTA */}
              <div className="bg-white p-10 flex flex-col justify-center">
                <div className="mb-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#E6F4F1] text-xs font-semibold text-[#0F766E] mb-4">
                    RESPUESTA INMEDIATA
                  </div>
                  
                  <p className="text-sm text-[#6B7280] mb-6">
                    Comunicación directa por WhatsApp para consultas técnicas 
                    y coordinación de entregas.
                  </p>
                </div>

                {/* CTA Primary */}
                <Link
                  href="https://wa.me/51962162027"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#002366] text-white text-sm font-medium rounded-lg hover:bg-[#003380] transition-colors duration-150"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Iniciar conversación
                </Link>

                {/* Links Secundarios */}
                <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] mb-3">También en:</p>
                  <div className="flex gap-4">
                    {[
                      { name: "LinkedIn", href: "#" },
                      { name: "Facebook", href: "#" },
                    ].map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        className="text-xs text-[#002366] hover:text-[#00A8CC] transition-colors duration-150"
                      >
                        {social.name}
                      </a>
                    ))}
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