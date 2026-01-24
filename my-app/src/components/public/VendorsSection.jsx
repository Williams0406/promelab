"use client";

import { useEffect, useState } from "react";
import { publicAPI } from "@/lib/api";

export default function VendorsSection() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicAPI
      .getVendors()
      .then((res) => {
        setVendors(res.data?.results || []);
      })
      .catch(() => setVendors([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || vendors.length === 0) return null;

  return (
    <section className="py-20 bg-[#F5F7FA] border-t border-[#E5E7EB] overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block mb-3 text-xs font-semibold tracking-wide uppercase text-[#00A8CC]">
            Proveedores aliados
          </span>

          <h2 className="text-2xl md:text-3xl font-bold text-[#002366] mb-4">
            Trabajamos con marcas reconocidas a nivel internacional
          </h2>

          <p className="text-sm md:text-base text-[#6B7280] leading-relaxed">
            Seleccionamos proveedores con certificaciones, respaldo técnico
            y estándares de calidad comprobados para laboratorios e industria.
          </p>
        </div>

        {/* Carrusel */}
        <div className="relative">
          <div className="flex gap-12 animate-scroll whitespace-nowrap">
            {[...vendors, ...vendors].map((vendor, index) => (
              <div
                key={`${vendor.id}-${index}`}
                className="flex items-center justify-center min-w-[160px] h-20"
              >
                {vendor.logo ? (
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    className="h-14 max-w-[140px] object-contain 
                      grayscale opacity-70 
                      transition-all duration-300 
                      hover:grayscale-0 hover:opacity-100"
                  />
                ) : (
                  <span className="text-sm font-medium text-[#9CA3AF]">
                    {vendor.name}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F5F7FA] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F5F7FA] to-transparent" />
        </div>
      </div>

      {/* Animación */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 35s linear infinite;
        }
      `}</style>
    </section>
  );
}
