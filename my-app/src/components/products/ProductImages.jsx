"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";

export default function ProductImages({ images = [] }) {
  const normalizedImages = images.length
    ? images
    : [{ id: "placeholder", image: null, is_main: true }];

  const mainIndex = normalizedImages.findIndex((img) => img.is_main);
  const [current, setCurrent] = useState(mainIndex >= 0 ? mainIndex : 0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const newMainIndex = normalizedImages.findIndex((img) => img.is_main);
    setCurrent(newMainIndex >= 0 ? newMainIndex : 0);
  }, [images]);

  const prev = () => {
    setLoaded(false);
    setCurrent((prev) =>
      prev === 0 ? normalizedImages.length - 1 : prev - 1
    );
  };

  const next = () => {
    setLoaded(false);
    setCurrent((prev) =>
      prev === normalizedImages.length - 1 ? 0 : prev + 1
    );
  };

  const currentImage = normalizedImages[current];

  return (
    <div className="flex flex-col gap-4">
      
      {/* IMAGEN PRINCIPAL */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
        {currentImage.image ? (
          <img
            src={currentImage.image}
            alt="Imagen del producto"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-contain p-6 transition-all duration-300 ${
              loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            loading="eager"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#F5F7FA]">
            <Package className="h-16 w-16 text-[#6B7280]" />
          </div>
        )}

        {/* CONTROLES */}
        {normalizedImages.length > 1 && currentImage.image && (
          <>
            <button
              onClick={prev}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#E5E7EB] shadow-sm opacity-0 group-hover:opacity-100 hover:bg-[#F5F7FA] transition-all duration-150"
            >
              <ChevronLeft className="h-5 w-5 text-[#002366]" />
            </button>

            <button
              onClick={next}
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#E5E7EB] shadow-sm opacity-0 group-hover:opacity-100 hover:bg-[#F5F7FA] transition-all duration-150"
            >
              <ChevronRight className="h-5 w-5 text-[#002366]" />
            </button>
          </>
        )}
      </div>

      {/* MINIATURAS */}
      {normalizedImages.length > 1 && (
        /* Wrapper: controla altura y separación del scrollbar */
        <div className="relative w-full h-[88px] sm:h-[104px]">
          {/* Contenedor scrolleable */}
          <div
            className="
              absolute inset-x-0 top-0
              flex gap-3
              overflow-x-auto overflow-y-hidden
              px-1 pb-4
            "
          >
            {normalizedImages.map((img, index) => (
              <button
                key={img.id || index}
                onClick={() => {
                  setLoaded(false);
                  setCurrent(index);
                }}
                className={`relative flex-shrink-0 rounded-lg border bg-white transition-all duration-150
                  h-16 w-16 sm:h-20 sm:w-20 p-1 sm:p-2
                  ${
                    index === current
                      ? "border-[#00A8CC] ring-2 ring-[#00A8CC]/20"
                      : "border-[#E5E7EB] hover:border-[#6B7280]"
                  }`}
              >
                {img.image ? (
                  <img
                    src={img.image}
                    alt={`Vista ${index + 1}`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-6 w-6 text-[#6B7280]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}