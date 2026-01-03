"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function AdminTopbar() {
  const { user, logout } = useAuth();

  // Mapeo de roles legible
  const roleLabels = {
    ADMIN: "Administrador",
    STAFF: "Staff",
    CLIENT: "Cliente",
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-white px-6">
      
      {/* CONTEXTO — Título de sección */}
      <div>
        <h1 className="text-lg font-semibold text-[#002366]">
          Panel Administrativo
        </h1>
      </div>

      {/* ACCIONES — Usuario + navegación */}
      <div className="flex items-center gap-4">
        
        {/* INFO USUARIO — Clara y estructurada */}
        <div className="hidden md:flex flex-col items-end text-sm">
          <span className="font-medium text-[#374151]">
            {user?.username}
          </span>
          <span className="text-xs text-[#6B7280]">
            {roleLabels[user?.role] || user?.role}
          </span>
        </div>

        {/* CTA SECONDARY — Ver sitio */}
        <Link href="/" prefetch={false}>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-[#374151] hover:text-[#002366] hover:bg-[#F5F7FA] transition-colors duration-150"
          >
            Ver sitio
          </Button>
        </Link>

        {/* CTA PRIMARY — Salir */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={logout}
          className="border-[#E5E7EB] text-[#374151] hover:bg-[#F5F7FA] hover:border-[#002366] transition-colors duration-150"
        >
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
}