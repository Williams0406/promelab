import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "lg",
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open || !mounted) return null;

  const sizeClasses = {
    sm: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
    full: "max-w-[95vw]",
  };

  return createPortal(
    <div
      onClick={onClose} // 👈 CLICK FUERA CIERRA
      className="
        fixed inset-0
        z-[9999]
        bg-[#002366]/40
        flex items-center justify-center
      "
    >
      <div
        onClick={(e) => e.stopPropagation()} // 👈 EVITA CIERRE INTERNO
        className={`w-full ${sizeClasses[size]} max-h-[90vh] rounded-lg bg-white shadow-xl flex flex-col`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
          <h3 className="text-lg font-semibold text-[#002366]">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#6B7280] hover:bg-[#F5F7FA]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="px-6 py-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
