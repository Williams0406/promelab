"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoleGuard({ allow = [], children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      // Si no está autenticado, redirigir a login
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }

      // Si el usuario no tiene el rol permitido, redirigir
      if (allow.length && !allow.includes(user?.role)) {
        router.replace("/");
        return;
      }

      setChecking(false);
    }
  }, [loading, isAuthenticated, user, allow, router]);

  // Loading state — Spinner clínico
  if (loading || checking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-[#002366]" />
        <p className="text-sm font-medium text-[#6B7280] mt-4">
          Verificando permisos...
        </p>
      </div>
    );
  }

  return children;
}