"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { publicAPI } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const AUTOPLAY_DELAY = 7000; // 7s → B2B friendly

export default function HeroBanner() {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const { isAuthenticated, loading } = useAuth();

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

  const textContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const textItem = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

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
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            className="max-w-2xl space-y-6"
            variants={textContainer}
            initial="hidden"
            animate="show"
          >
            {/* Badge institucional */}
            <motion.div
              variants={textItem}
              whileHover={{ scale: 1.03 }}
              className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                bg-[#E6F4F1] text-xs font-semibold text-[#0F766E] w-fit
                shadow-sm hover:shadow-md transition-all"
            >
              {/* Punto vivo */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F766E] opacity-30" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0F766E]" />
              </span>

              PROVEEDOR CIENTÍFICO · B2B
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={textItem}
              className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight"
            >
              <span className="block text-[#002366]">
                {banner.title || "Abastecimiento científico"}
              </span>
              <span className="block bg-gradient-to-r from-[#002366] to-[#00A8CC] 
                bg-clip-text text-transparent">
                para laboratorios e industria
              </span>
            </motion.h1>

            {/* Descripción */}
            <motion.p
              variants={textItem}
              className="text-lg text-[#6B7280] leading-relaxed"
            >
              {banner.tagline ||
                "Equipos de análisis, reactivos certificados e instrumentación de precisión. Soluciones técnicas con respaldo documental y estándares internacionales de calidad."}
            </motion.p>

            {/* Indicadores */}
            <motion.div
              variants={textItem}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6"
            >
              {[
                "Certificaciones ISO",
                "Soporte técnico",
                "Marcas reconocidas",
                "Cobertura nacional",
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-2 text-sm text-[#002366]
                    transition-all cursor-default"
                >
                  <span className="flex items-center justify-center w-4 h-4 rounded-full 
                    bg-[#E6F4F1] text-[#00A8CC] text-[10px] font-bold">
                    ✓
                  </span>
                  <span className="font-medium">{item}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={textItem}
              className="flex gap-3 pt-6"
            >
              <Link
                href={banner.link || "/products"}
                className="group relative inline-flex items-center gap-3
                  px-6 py-3 text-sm font-semibold text-white
                  bg-[#002366] rounded-xl overflow-hidden
                  shadow-lg shadow-[#002366]/20
                  transition-all duration-200
                  hover:bg-[#003380] hover:shadow-xl hover:shadow-[#002366]/30"
              >
                {/* Glow animado */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r 
                    from-transparent via-white/20 to-transparent rotate-12" />
                </span>

                <span className="relative z-10">
                  Explorar catálogo
                </span>

                <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              {!loading && !isAuthenticated && (
                <Link href="/login" className="btn-ghost text-sm">
                  Acceso clientes
                </Link>
              )}
            </motion.div>
          </motion.div>
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
