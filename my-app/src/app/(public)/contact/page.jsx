"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      {/* 🔬 HERO — CONTACTO DIRECTO */}
      <section className="bg-[#F5F7FA] border-b border-[#E5E7EB]">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <span className="inline-block mb-3 text-xs font-semibold text-[#00A8CC] uppercase tracking-wide">
            Contacto
          </span>

          <h1 className="text-3xl md:text-4xl font-semibold text-[#002366] mb-4 tracking-tight leading-tight">
            Soporte técnico y comercial para cotizaciones especializadas
          </h1>

          <p className="max-w-3xl text-[#374151] leading-relaxed text-lg">
            Comunícate directamente con nuestro equipo técnico para consultas
            sobre especificaciones, cotizaciones institucionales, coordinación de
            entregas y soporte post-venta.
          </p>
        </div>
      </section>

      {/* 🔬 INFORMACIÓN DE CONTACTO PRINCIPAL */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* COLUMNA DATOS */}
            <div>
              <h2 className="text-2xl font-semibold text-[#002366] mb-6 tracking-tight">
                Canales de atención
              </h2>

              <div className="space-y-7">
                {/* TELÉFONO */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#002366]/5 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-[#002366]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#002366] mb-1">
                      Teléfono directo
                    </p>
                    <a
                      href="tel:+51972171964"
                      className="text-[#374151] hover:text-[#00A8CC] transition-colors duration-150"
                    >
                      +51 972 719 164
                    </a>
                  </div>
                </div>

                {/* EMAIL */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#002366]/5 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-[#002366]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#002366] mb-1">
                      Email comercial
                    </p>
                    <a
                      href="mailto:ventas@promelab.com"
                      className="text-[#374151] hover:text-[#00A8CC] transition-colors duration-150"
                    >
                      ventas@promelab.com
                    </a>
                  </div>
                </div>

                {/* WHATSAPP */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#2ECC71]/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-[#2ECC71]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#002366] mb-1">
                      WhatsApp Business
                    </p>
                    <a
                      href="https://wa.me/51972719164"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#374151] hover:text-[#2ECC71] transition-colors duration-150"
                    >
                      Iniciar conversación
                    </a>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Atención inmediata para consultas técnicas
                    </p>
                  </div>
                </div>

                {/* UBICACIÓN */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#002366]/5 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-[#002366]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#002366] mb-1">
                      Ubicación
                    </p>
                    <p className="text-[#374151]">Lima, Perú</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Atención presencial solo con cita previa
                    </p>
                  </div>
                </div>

                {/* HORARIO */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#002366]/5 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-[#002366]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#002366] mb-1">
                      Horario de atención
                    </p>
                    <p className="text-[#374151]">
                      Lunes a Viernes: 9:00 – 18:00
                    </p>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Hora de Perú (GMT-5)
                    </p>
                  </div>
                </div>
              </div>

              {/* REDES */}
              <div className="mt-8 pt-8 border-t border-[#E5E7EB]">
                <p className="text-sm font-medium text-[#002366] mb-3">
                  También en redes profesionales
                </p>
                <div className="flex gap-4 text-sm">
                  <a
                    href="#"
                    className="text-[#002366] hover:text-[#00A8CC] transition-colors duration-150"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="#"
                    className="text-[#002366] hover:text-[#00A8CC] transition-colors duration-150"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </div>

            {/* COLUMNA CTA */}
            <div className="bg-[#F5F7FA] border border-[#E5E7EB] rounded-lg p-8">
              <span className="inline-block mb-2 px-2.5 py-1 rounded text-xs font-semibold text-[#0F766E] bg-[#2ECC71]/10">
                RESPUESTA INMEDIATA
              </span>

              <h3 className="text-xl font-semibold text-[#002366] mb-3 mt-4">
                Consultas técnicas por WhatsApp
              </h3>

              <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
                Nuestro equipo técnico puede orientarte sobre especificaciones,
                cotizaciones, entregas y documentación técnica.
              </p>

              <Link
                href="https://wa.me/51972719164"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#002366] text-white text-sm font-medium rounded-lg hover:bg-[#003380] transition-colors duration-150"
              >
                Iniciar conversación
              </Link>

              <p className="text-xs text-[#6B7280] text-center mt-4">
                Tiempo de respuesta promedio: 15 minutos
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 🔬 TIPOS DE CONSULTA */}
      <section className="py-16 bg-[#F5F7FA] border-y border-[#E5E7EB]">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-semibold text-[#002366] mb-8 tracking-tight">
            Tipos de consulta que atendemos
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Consulta 1 */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
              <h3 className="font-semibold text-[#002366] mb-2">
                Consultas técnicas
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Especificaciones, compatibilidad, aplicaciones, rangos de
                medición, precisión y documentación técnica.
              </p>
            </div>

            {/* Consulta 2 */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
              <h3 className="font-semibold text-[#002366] mb-2">
                Cotizaciones institucionales
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Procesos de compra corporativa, licitaciones públicas, proyectos
                de inversión y órdenes al por mayor.
              </p>
            </div>

            {/* Consulta 3 */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                <h3 className="font-semibold text-[#002366] mb-2">
                Soporte post-venta
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                Instalación, calibración, capacitación, mantenimiento preventivo
                y resolución de incidencias técnicas.
                </p>
            </div>
            </div>
            </div>
        </section>
        {/* 🔬 MENSAJE FINAL */}
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4 max-w-4xl text-center">
            <p className="text-sm text-[#6B7280] leading-relaxed max-w-3xl mx-auto">
                Promelab atiende a laboratorios clínicos, centros de investigación,
                industria regulada, universidades y entidades públicas. Todas las
                consultas son atendidas por personal con formación técnica
                especializada.
            </p>
            </div>
        </section>
    </>
  );
}
