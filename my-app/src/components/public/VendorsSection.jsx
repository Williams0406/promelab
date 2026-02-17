"use client";

import { useEffect, useRef, useState } from "react";
import { publicAPI } from "@/lib/api";

export default function VendorsSection() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // =========================
  // DRAG FUNCIONAL REAL
  // =========================
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;

    isDraggingRef.current = true;
    startXRef.current = e.pageX;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !scrollRef.current) return;

    const walk = (e.pageX - startXRef.current) * 1.2;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  // =========================
  // FETCH VENDORS
  // =========================
  useEffect(() => {
    publicAPI
      .getVendors()
      .then((res) => {
        setVendors(res.data?.results || []);
      })
      .catch(() => setVendors([]))
      .finally(() => setLoading(false));
  }, []);

  // =========================
  // AUTO SCROLL INFINITO SUAVE
  // =========================
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrame;

    const autoScroll = () => {
      if (!isDraggingRef.current) {
        container.scrollLeft += 0.5;

        // reinicio perfecto infinito
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }

      animationFrame = requestAnimationFrame(autoScroll);
    };

    animationFrame = requestAnimationFrame(autoScroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [vendors]);

  if (loading || vendors.length === 0) return null;

  return (
    <section className="py-24 bg-[#F5F7FA] border-t border-[#E5E7EB] overflow-hidden">
      <div className="container mx-auto px-6">

        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block mb-4 text-xs font-semibold tracking-wider uppercase text-[#00A8CC]">
            Proveedores aliados
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-[#002366] mb-5">
            Trabajamos con marcas reconocidas internacionalmente
          </h2>

          <p className="text-base text-[#6B7280] leading-relaxed">
            Seleccionamos proveedores con certificaciones y estándares de calidad
            comprobados para laboratorios e industria.
          </p>
        </div>

        {/* Carrusel */}
        <div className="relative">
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUp}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex gap-24 overflow-x-scroll scrollbar-hide select-none cursor-grab active:cursor-grabbing"
          >
            {[...vendors, ...vendors].map((vendor, index) => (
              <div
                key={`${vendor.id}-${index}`}
                className="flex items-center justify-center min-w-[240px] h-32"
              >
                {vendor.logo ? (
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    draggable={false}
                    className="h-20 max-w-[220px] object-contain
                      grayscale opacity-60
                      transition-all duration-300
                      hover:grayscale-0 hover:opacity-100 hover:scale-110"
                  />
                ) : (
                  <span className="text-sm font-medium text-[#9CA3AF]">
                    {vendor.name}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Fade Promelab */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F5F7FA] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F5F7FA] to-transparent" />
        </div>
      </div>
    </section>
  );
}
