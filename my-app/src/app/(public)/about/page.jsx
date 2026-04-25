"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* 🔬 HERO — IDENTIDAD CLARA */}
      <section className="bg-[#F5F7FA] border-b border-[#E5E7EB]">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <span className="inline-block mb-3 text-xs font-semibold text-[#00A8CC] uppercase tracking-wide">
            Sobre Promelab
          </span>

          <h1 className="text-3xl md:text-4xl font-semibold text-[#002366] mb-4 tracking-tight leading-tight">
            Proveedor técnico de equipamiento científico para entornos críticos
          </h1>

          <p className="max-w-3xl text-[#374151] leading-relaxed text-lg">
            Promelab provee instrumentación analítica, equipos de laboratorio y
            reactivos especializados a instituciones que requieren trazabilidad,
            documentación técnica completa y cumplimiento normativo verificable.
          </p>
        </div>
      </section>

      {/* 🔬 PROOF POINTS — NÚMEROS TÉCNICOS */}
      <section className="py-12 bg-white border-b border-[#E5E7EB]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-semibold text-[#002366] mb-1">
                15+
              </div>
              <div className="text-sm text-[#6B7280]">Años de operación</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-[#002366] mb-1">
                500+
              </div>
              <div className="text-sm text-[#6B7280]">
                Proyectos institucionales
              </div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-[#002366] mb-1">
                40+
              </div>
              <div className="text-sm text-[#6B7280]">Marcas certificadas</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-[#002366] mb-1">
                100%
              </div>
              <div className="text-sm text-[#6B7280]">
                Trazabilidad documentada
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔬 QUIÉNES SOMOS — ESCANEABLE */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] items-start">
            {/* COLUMNA COPY */}
            <div>
              <h2 className="text-2xl font-semibold text-[#002366] mb-4 tracking-tight">
                Especialización técnica verificable
              </h2>

              <p className="text-[#374151] leading-relaxed mb-4">
                Desde 2009 proveemos soluciones de instrumentación a
                laboratorios clínicos, centros de investigación, industrias
                reguladas y universidades en Perú y América Latina.
              </p>

              <p className="text-[#374151] leading-relaxed">
                Nuestro equipo incluye ingenieros, químicos y especialistas
                técnicos que garantizan la correcta especificación de equipos
                según normativas ISO, GMP, GLP y estándares de la industria.
              </p>
            </div>

            {/* COLUMNA DIFERENCIADORES */}
            <div className="bg-[#F5F7FA] border border-[#E5E7EB] rounded-lg p-6">
              <h3 className="text-base font-semibold text-[#002366] mb-4">
                Modelo operativo
              </h3>

              <ul className="space-y-3 text-sm text-[#374151]">
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[#2ECC71] flex-shrink-0" />
                  <span>
                    Especificación técnica basada en aplicación real del cliente
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[#2ECC71] flex-shrink-0" />
                  <span>
                    Documentación completa: COA, fichas técnicas, MSDS, manuales
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[#2ECC71] flex-shrink-0" />
                  <span>
                    Soporte técnico pre y post-venta por personal especializado
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[#2ECC71] flex-shrink-0" />
                  <span>
                    Garantía de trazabilidad en toda la cadena de suministro
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[#2ECC71] flex-shrink-0" />
                  <span>
                    Procesos claros para compras institucionales y licitaciones
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 🔬 CERTIFICACIONES */}
      <section className="py-20 bg-transparent border-y border-[#E5E7EB]">
        <div className="container mx-auto px-4 max-w-4xl text-center">

          {/* TÍTULO */}
          <h2 className="text-2xl md:text-3xl font-semibold text-[#002366] mb-4 tracking-tight">
            Certificaciones y cumplimiento técnico
          </h2>

          <p className="text-[#6B7280] max-w-2xl mx-auto mb-12 text-sm md:text-base">
            Operamos bajo estándares reconocidos que garantizan calidad, seguridad y trazabilidad en cada proceso.
          </p>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-start justify-center">

            {/* BPA */}
            <div className="flex flex-col items-center text-center">
              <img
                src="/logo_bpa.png"
                alt="BPA"
                className="w-28 h-28 md:w-36 md:h-36 object-contain mb-4"
              />

              <p className="text-sm font-medium text-[#002366]">
                Buenas Prácticas de Almacenamiento
              </p>

              <p className="text-xs text-[#6B7280] mt-1 max-w-[220px]">
                Garantiza condiciones óptimas de conservación, control y trazabilidad de productos.
              </p>
            </div>

            {/* BPDT */}
            <div className="flex flex-col items-center text-center">
              <img
                src="/logo_bpdt.png"
                alt="BPDT"
                className="w-28 h-28 md:w-36 md:h-36 object-contain mb-4"
              />

              <p className="text-sm font-medium text-[#002366]">
                Buenas Prácticas de Distribución y Transporte
              </p>

              <p className="text-xs text-[#6B7280] mt-1 max-w-[220px]">
                Asegura integridad, seguridad y control durante toda la cadena logística.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 🔬 SECTORES QUE ATENDEMOS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-semibold text-[#002366] mb-6 tracking-tight">
            Sectores que atendemos
          </h2>

          <div className="grid gap-6 md:grid-cols-2 text-sm text-[#374151]">
            <div className="space-y-2">
              <p className="font-medium text-[#002366] mb-3">Sector público</p>
              <ul className="space-y-1.5 pl-4">
                <li>• Hospitales e institutos nacionales de salud</li>
                <li>• Universidades públicas</li>
                <li>• Laboratorios de referencia nacional</li>
                <li>• Centros de investigación científica</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-[#002366] mb-3">Sector privado</p>
              <ul className="space-y-1.5 pl-4">
                <li>• Laboratorios clínicos y centros de diagnóstico</li>
                <li>• Industria farmacéutica y alimentaria</li>
                <li>• Empresas de control de calidad</li>
                <li>• Universidades privadas e institutos técnicos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 🔬 CERTIFICACIONES Y CUMPLIMIENTO */}
      <section className="py-16 bg-[#F5F7FA] border-y border-[#E5E7EB]">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-semibold text-[#002366] mb-4 tracking-tight">
            Certificaciones y cumplimiento normativo
          </h2>

          <p className="text-[#374151] leading-relaxed mb-6 max-w-3xl">
            Trabajamos exclusivamente con fabricantes que cumplen estándares
            internacionales de calidad y que pueden proporcionar documentación
            técnica completa para procesos de validación y auditoría.
          </p>

          <div className="grid gap-4 md:grid-cols-3 text-sm text-[#374151]">
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
              <p className="font-medium text-[#002366] mb-2">
                Estándares de calidad
              </p>
              <ul className="space-y-1 text-[#6B7280]">
                <li>• ISO 9001</li>
                <li>• ISO 13485 (Dispositivos médicos)</li>
                <li>• ISO 17025 (Laboratorios)</li>
              </ul>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
              <p className="font-medium text-[#002366] mb-2">
                Regulaciones aplicables
              </p>
              <ul className="space-y-1 text-[#6B7280]">
                <li>• GMP (Good Manufacturing Practice)</li>
                <li>• GLP (Good Laboratory Practice)</li>
                <li>• FDA (cuando aplique)</li>
              </ul>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
              <p className="font-medium text-[#002366] mb-2">
                Documentación técnica
              </p>
              <ul className="space-y-1 text-[#6B7280]">
                <li>• Certificados de análisis (COA)</li>
                <li>• Fichas de seguridad (MSDS)</li>
                <li>• Manuales de operación</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 🔬 CTA FINAL — SOBRIO */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="border border-[#E5E7EB] rounded-lg p-10 text-center">
            <h2 className="text-2xl font-semibold text-[#002366] mb-3 tracking-tight">
              ¿Necesitas asesoría técnica especializada?
            </h2>

            <p className="text-[#6B7280] mb-6 max-w-2xl mx-auto">
              Nuestro equipo puede ayudarte a definir especificaciones, validar
              compatibilidad de equipos y coordinar entregas para proyectos
              institucionales o compras corporativas.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#002366] text-white text-sm font-medium rounded-lg hover:bg-[#003380] transition-colors duration-150"
              >
                Contactar a Promelab
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-white border border-[#E5E7EB] text-[#002366] text-sm font-medium rounded-lg hover:bg-[#F5F7FA] transition-colors duration-150"
              >
                Ver catálogo técnico
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}