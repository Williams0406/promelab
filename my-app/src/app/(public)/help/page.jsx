"use client";

import Link from "next/link";
import {
  FileText,
  Package,
  Truck,
  Shield,
  HelpCircle,
  Phone,
} from "lucide-react";

export default function HelpPage() {
  return (
    <>
      {/* 🔬 HERO — AYUDA */}
      <section className="bg-[#F5F7FA] border-b border-[#E5E7EB]">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <span className="inline-block mb-3 text-xs font-semibold text-[#00A8CC] uppercase tracking-wide">
            Centro de ayuda
          </span>

          <h1 className="text-3xl md:text-4xl font-semibold text-[#002366] mb-4 tracking-tight leading-tight">
            Documentación técnica y soporte para compras especializadas
          </h1>

          <p className="max-w-3xl text-[#374151] leading-relaxed text-lg">
            Encuentra información sobre procesos de compra, especificaciones
            técnicas, documentación requerida, logística y soporte post-venta.
          </p>
        </div>
      </section>

      {/* 🔬 ACCESOS RÁPIDOS — CATEGORÍAS */}
      <section className="py-12 bg-white border-b border-[#E5E7EB]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Package,
                title: "Productos y especificaciones",
                href: "#productos",
              },
              {
                icon: FileText,
                title: "Documentación técnica",
                href: "#documentacion",
              },
              { icon: Truck, title: "Logística y entregas", href: "#logistica" },
              {
                icon: Shield,
                title: "Garantías y devoluciones",
                href: "#garantias",
              },
              {
                icon: HelpCircle,
                title: "Preguntas frecuentes",
                href: "#faq",
              },
              { icon: Phone, title: "Contacto directo", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-lg hover:border-[#00A8CC] hover:bg-[#F5F7FA] transition-all duration-150 group"
              >
                <item.icon className="h-5 w-5 text-[#002366] group-hover:text-[#00A8CC]" />
                <span className="text-sm font-medium text-[#374151] group-hover:text-[#002366]">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 🔬 CÓMO COMPRAR — PROCESO CLARO */}
      <section id="productos" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-semibold text-[#002366] mb-8 tracking-tight">
            Proceso de compra
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Paso 1 */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#002366] text-white flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <h3 className="font-semibold text-[#002366]">
                  Búsqueda y selección
                </h3>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed pl-11">
                Explora el catálogo técnico filtrando por categoría, marca o
                especificación. Cada producto incluye ficha técnica descargable.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#002366] text-white flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <h3 className="font-semibold text-[#002366]">
                  Cotización y validación
                </h3>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed pl-11">
                Solicita cotización formal con precios, plazos de entrega y
                condiciones comerciales. Nuestro equipo valida compatibilidad
                técnica.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#002366] text-white flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <h3 className="font-semibold text-[#002366]">
                  Confirmación y entrega
                </h3>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed pl-11">
                Aprobada la cotización, coordinamos logística, empaque
                especializado y seguimiento hasta la entrega en tu institución.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-[#F5F7FA] border border-[#E5E7EB] rounded-lg">
            <p className="text-sm text-[#374151]">
              <span className="font-medium text-[#002366]">Nota:</span> Para
              compras institucionales, licitaciones o proyectos específicos,
              contacta directamente a nuestro equipo comercial para un
              acompañamiento personalizado.
            </p>
          </div>
        </div>
      </section>

      {/* 🔬 DOCUMENTACIÓN TÉCNICA */}
      <section
        id="documentacion"
        className="py-16 bg-[#F5F7FA] border-y border-[#E5E7EB]"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-semibold text-[#002366] mb-8 tracking-tight">
            Documentación técnica disponible
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* COLUMNA 1 */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
              <h3 className="text-base font-semibold text-[#002366] mb-4">
                Documentación del producto
              </h3>
              <ul className="space-y-2.5 text-sm text-[#374151]">
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>
                    <strong className="text-[#002366]">
                      Fichas técnicas (Datasheet):
                    </strong>{" "}
                    Especificaciones completas, rangos de medición, precisión,
                    condiciones de operación.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>
                    <strong className="text-[#002366]">
                      Certificados de análisis (COA):
                    </strong>{" "}
                    Para reactivos y estándares de referencia.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>
                    <strong className="text-[#002366]">
                      Hojas de seguridad (MSDS):
                    </strong>{" "}
                    Información de riesgos, manejo y almacenamiento.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>
                    <strong className="text-[#002366]">
                      Manuales de operación:
                    </strong>{" "}
                    Instrucciones de uso, mantenimiento y troubleshooting.
                  </span>
                </li>
              </ul>
            </div>

            {/* COLUMNA 2 */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
              <h3 className="text-base font-semibold text-[#002366] mb-4">
                Certificaciones y cumplimiento
              </h3>
              <ul className="space-y-2.5 text-sm text-[#374151]">
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>
                    <strong className="text-[#002366]">
                      Certificados de fabricante:
                    </strong>{" "}
                    ISO 9001, ISO 13485, ISO 17025 según el tipo de producto.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>
                    <strong className="text-[#002366]">
                      Trazabilidad de lote:
                    </strong>{" "}
                    Información de fabricación y cadena de custodia.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>
                    <strong className="text-[#002366]">
                      Declaraciones de conformidad:
                    </strong>{" "}
                    Cumplimiento con regulaciones aplicables (GMP, GLP, FDA).
                  </span>
                </li>
              </ul>

              <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                <p className="text-xs text-[#6B7280]">
                  La documentación se entrega en formato digital junto con el
                  producto. Para solicitar documentación adicional, contacta a
                  soporte técnico.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔬 LOGÍSTICA Y ENTREGAS */}
      <section id="logistica" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-semibold text-[#002366] mb-8 tracking-tight">
            Logística y entregas
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-[#002366] mb-4">
                Alcance de entrega
              </h3>
              <p className="text-sm text-[#374151] leading-relaxed mb-4">
                Realizamos entregas a nivel nacional coordinadas según el tipo
                de producto y condiciones de transporte requeridas.
              </p>
              <ul className="space-y-2 text-sm text-[#374151]">
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>Entregas programadas con confirmación previa</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>
                    Empaque especializado para equipos sensibles o frágiles
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>Seguimiento de pedido en tiempo real</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>
                    Coordinación para proyectos con múltiples puntos de entrega
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#002366] mb-4">
                Tiempos de entrega
              </h3>
              <p className="text-sm text-[#374151] leading-relaxed mb-4">
                Los plazos varían según disponibilidad de stock, ubicación y
                tipo de producto:
              </p>
              <table className="w-full text-sm border border-[#E5E7EB] rounded-lg overflow-hidden">
                <tbody className="divide-y divide-[#E5E7EB]">
                  <tr className="bg-[#F5F7FA]">
                    <td className="px-4 py-2.5 font-medium text-[#002366]">
                      Stock Lima
                    </td>
                    <td className="px-4 py-2.5 text-[#374151]">
                      1-3 días hábiles
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[#002366]">
                      Provincias
                    </td>
                    <td className="px-4 py-2.5 text-[#374151]">
                      3-7 días hábiles
                    </td>
                  </tr>
                  <tr className="bg-[#F5F7FA]">
                    <td className="px-4 py-2.5 font-medium text-[#002366]">
                      Importación
                    </td>
                    <td className="px-4 py-2.5 text-[#374151]">
                      30-60 días hábiles
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-[#6B7280] mt-3">
                Los plazos se confirman en la cotización formal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔬 GARANTÍAS Y DEVOLUCIONES */}
      <section
        id="garantias"
        className="py-16 bg-[#F5F7FA] border-y border-[#E5E7EB]"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-semibold text-[#002366] mb-8 tracking-tight">
            Garantías y políticas de devolución
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
              <h3 className="text-base font-semibold text-[#002366] mb-3">
                Garantía de productos
              </h3>
              <p className="text-sm text-[#374151] leading-relaxed mb-3">
                Todos los equipos e instrumentos cuentan con garantía del
                fabricante según las condiciones especificadas:
              </p>
              <ul className="space-y-2 text-sm text-[#374151]">
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>Garantía estándar: 1 año (equipos)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>Garantía extendida: disponible según producto</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>Soporte técnico post-venta incluido</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
              <h3 className="text-base font-semibold text-[#002366] mb-3">
                Política de devoluciones
              </h3>
              <p className="text-sm text-[#374151] leading-relaxed mb-3">
                Aceptamos devoluciones bajo las siguientes condiciones:
              </p>
              <ul className="space-y-2 text-sm text-[#374151]">
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>Producto defectuoso o dañado en tránsito</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>Error en el pedido (producto incorrecto)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00A8CC]">•</span>
                  <span>Plazo: 7 días desde la recepción</span>
                </li>
              </ul>
              <p className="text-xs text-[#6B7280] mt-3">
                No aplica para reactivos, consumibles o productos personalizados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔬 FAQ TÉCNICO */}
      <section id="faq" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-semibold text-[#002366] mb-8 tracking-tight">
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "¿Los productos cuentan con certificaciones ISO?",
                a: "Sí, todos nuestros proveedores cuentan con certificaciones ISO 9001 como mínimo. Para dispositivos médicos e instrumentación clínica, trabajamos exclusivamente con fabricantes con ISO 13485. La documentación certificada se entrega junto con cada producto.",
              },
              {
                q: "¿Pueden asesorar en la selección técnica del equipo?",
                a: "Sí, nuestro equipo incluye especialistas técnicos que pueden orientarte sobre la selección correcta según tu aplicación, volumen de trabajo, precisión requerida y presupuesto disponible. El servicio de asesoría técnica es gratuito.",
              },
              {
                q: "¿Trabajan con licitaciones públicas y compras estatales?",
                a: "Sí, tenemos amplia experiencia en procesos de compra institucional, licitaciones públicas según la Ley de Contrataciones del Estado y proyectos de inversión pública. Podemos proveer la documentación técnica y legal requerida.",
              },
              {
                q: "¿Ofrecen capacitación para el uso de los equipos?",
                a: "Sí, para equipos de mediana y alta complejidad ofrecemos capacitación técnica presencial o remota según el caso. La capacitación básica está incluida; para programas extendidos, se cotiza por separado.",
              },
              {
                q: "¿Qué documentación se entrega con cada producto?",
                a: "Cada producto incluye: ficha técnica, manual de operación, certificado de garantía y, cuando aplica, certificado de análisis (COA), hoja de seguridad (MSDS) y certificaciones del fabricante. Todo en formato digital y/o físico.",
              },
              {
                q: "¿Realizan mantenimiento preventivo y calibración?",
                a: "Sí, ofrecemos servicios de mantenimiento preventivo y calibración para los equipos que comercializamos. Los servicios se coordinan según la ubicación del cliente y el tipo de equipo. Trabajamos con técnicos certificados por los fabricantes.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-[#E5E7EB] rounded-lg p-6 hover:border-[#00A8CC] transition-colors duration-150"
              >
                <h3 className="font-semibold text-[#002366] mb-2 flex items-start gap-2">
                  <span className="text-[#00A8CC] flex-shrink-0">Q:</span>
                  <span>{item.q}</span>
                </h3>
                <p className="text-sm text-[#374151] leading-relaxed pl-6">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔬 CTA FINAL — SOBRIO */}
      <section className="py-16 bg-[#F5F7FA] border-t border-[#E5E7EB]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#002366] mb-3 tracking-tight">
              ¿No encontraste la información que necesitas?
            </h2>

            <p className="text-[#6B7280] mb-6 max-w-2xl mx-auto">
              Nuestro equipo técnico y comercial puede resolver consultas
              específicas sobre productos, procesos de compra, documentación o
              soporte especializado.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="https://wa.me/5197719164"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#002366] text-white text-sm font-medium rounded-lg hover:bg-[#003380] transition-colors duration-150"
              >
                Contactar por WhatsApp
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white border border-[#E5E7EB] text-[#002366] text-sm font-medium rounded-lg hover:bg-[#F5F7FA] transition-colors duration-150"
              >
                Ver todos los canales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}