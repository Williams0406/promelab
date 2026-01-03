"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Protected({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirección silenciosa según guía UX
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Loading state — Spinner clínico con feedback de seguridad
  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white">
        
        {/* Spinner sobrio con marca PROMELAB */}
        <div className="relative">
          {/* Spinner principal */}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-[#002366]" />
          
          {/* Watermark tiburón (geométrico, NO emoji) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-[#002366] opacity-10"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </div>
        
        {/* Feedback con propósito (seguridad) */}
        <div className="text-center">
          <p className="text-sm font-medium text-[#374151] mb-1">
            Verificando credenciales
          </p>
          <p className="text-xs text-[#6B7280]">
            Acceso seguro en proceso...
          </p>
        </div>

        {/* Indicador de progreso técnico */}
        <div className="w-48 h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-[#00A8CC] rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}