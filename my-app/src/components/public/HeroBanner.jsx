"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { publicAPI } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const AUTOPLAY_DELAY = 7000; // 7s → B2B friendly

export default function HeroBanner() {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    publicAPI
      .getBanners()
      .then((res) => {
        const results = Array.isArray(res.data)
          ? res.data
          : res.data?.results || [];

        setBanners(results.filter(b => b.is_active));
      })
      .catch((err) => {
        console.error("Error loading banners:", err);
        setBanners([]);
      });
  }, []);

  // Autoplay (solo si hay más de 1)
  useEffect(() => {
    if (banners.length <= 1) return;

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(timerRef.current);
  }, [banners]);

  if (!banners.length) return null;

  const banner = banners[index];

  return (
    <section className="relative w-full min-h-[70vh] overflow-hidden flex items-center">
      {/* SLIDE */}
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Imagen */}
          <img
            src={banner.image}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay institucional */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
        </motion.div>
      </AnimatePresence>

      {/* CONTENIDO */}
      <div className="relative z-10 w-full">
        <div className="container-promelab py-24">
          <div className="max-w-2xl space-y-6">
            {/* Badge institucional fijo */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F1] text-xs font-semibold text-[#0F766E] w-fit">
              PROVEEDOR CIENTÍFICO · B2B
            </div>
            <motion.h1
              key={`${banner.id}-title`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-4xl md:text-5xl font-bold text-[#002366] leading-tight"
            >
              {banner.title || "Sistema de abastecimiento científico"}
            </motion.h1>

            <motion.p
              key={`${banner.id}-tagline`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-lg text-[#6B7280] leading-relaxed"
            >
              {banner.tagline ||
                "Instrumentos de laboratorio, reactivos químicos y soluciones para investigación, industria y educación. Estándares internacionales de calidad."}
            </motion.p>

            {/* Indicadores fijos de confianza */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              {[
                "Certificaciones ISO",
                "Soporte técnico",
                "Marcas reconocidas",
                "Envíos a nivel nacional",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-[#002366]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A8CC]" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            <motion.div
              key={`${banner.id}-cta`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex gap-3 pt-4"
            >
              <Link href={banner.link || "/products"} className="btn-primary text-sm">
                Explorar catálogo
              </Link>

              <Link href="/login" className="btn-ghost text-sm">
                Acceso clientes
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* INDICADORES (solo si hay varios banners) */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === index
                  ? "bg-[#002366]"
                  : "bg-[#002366]/30 hover:bg-[#002366]/50"
              }`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
