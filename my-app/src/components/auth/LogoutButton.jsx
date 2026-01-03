"use client";

import { useAuth } from "@/hooks/useAuth";

export default function LogoutButton({ className = "" }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <button
      onClick={handleLogout}
      className={`w-full text-left text-sm ${className}`}
    >
      Cerrar sesión
    </button>
  );
}