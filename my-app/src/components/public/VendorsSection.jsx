"use client";

import { useEffect, useRef, useState } from "react";
import { publicAPI } from "@/lib/api";

export default function VendorsSection() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const scrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Carga de datos
  useEffect(() => {
    publicAPI
      .getVendors()
      .then((res) => setVendors(res.data?.results || []))
      .catch(() => setVendors([]))
      .finally(() => setLoading(false));
  }, []);

  // Handlers para el arrastre manual
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    setIsPaused(true); // Pausamos la animación automática
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsPaused(false); // Reanudamos la animación
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // Multiplicador de velocidad de arrastre
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  // Lógica de Scroll Infinito (Efecto Bucle)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || vendors.length === 0) return;

    let animationFrame;
    const scrollSpeed = 0.8; // Ajusta este valor para la velocidad automática

    const step = () => {
      if (!isPaused && !isDraggingRef.current) {
        container.scrollLeft += scrollSpeed;

        // Si llegamos al final del primer set de items, saltamos al inicio sin que se note
        // Usamos 1/3 del scrollWidth porque renderizamos la lista 3 veces
        if (container.scrollLeft >= container.scrollWidth / 3) {
          container.scrollLeft = 0;
        }
      }
      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [vendors, isPaused]);

  if (loading || vendors.length === 0) return null;

  return (
    <section className="py-24 bg-[#F5F7FA] border-t border-[#E5E7EB] overflow-hidden select-none">
      <div className="container mx-auto px-6">
        
        {/* Cabecera */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block mb-4 text-xs font-semibold tracking-wider uppercase text-[#00A8CC]">
            Proveedores aliados
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#002366] mb-5">
            Trabajamos con marcas líderes
          </h2>
        </div>

        {/* Carrusel Contenedor */}
        <div className="relative group">
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUp}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex gap-20 overflow-x-hidden whitespace-nowrap cursor-grab active:cursor-grabbing py-4"
          >
            {/* Renderizamos 3 veces para un bucle infinito real y suave */}
            {[...vendors, ...vendors, ...vendors].map((vendor, index) => (
              <div
                key={`${vendor.id}-${index}`}
                className="inline-flex items-center justify-center min-w-[180px] h-24 flex-shrink-0"
              >
                {vendor.logo ? (
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    draggable={false}
                    className="h-16 w-auto object-contain grayscale opacity-50 
                             transition-all duration-500 hover:grayscale-0 
                             hover:opacity-100 hover:scale-110"
                  />
                ) : (
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">
                    {vendor.name}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Degradados laterales para suavizado visual (UX) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#F5F7FA] via-[#F5F7FA]/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#F5F7FA] via-[#F5F7FA]/80 to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}