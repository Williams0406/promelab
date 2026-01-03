"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(username, password);

    if (!result?.success) {
      setError(result?.message || "Credenciales inválidas");
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6 rounded-lg border border-[#E5E7EB] bg-white p-8 shadow-sm">
        
        {/* Header clínico */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F7FA] border border-[#E5E7EB]">
            <Lock className="h-5 w-5 text-[#002366]" />
          </div>
          
          <div>
            <h1 className="text-xl font-semibold text-[#002366] tracking-tight">
              Acceso al sistema
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Ingresa tus credenciales para continuar
            </p>
          </div>
        </div>

        {/* Error feedback */}
        {error && (
          <div className="rounded-lg bg-[#FEF2F2] border border-[#E5533D] p-4">
            <p className="text-sm text-[#E5533D]">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Usuario
            </label>
            <Input
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10 border-[#E5E7EB]"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Contraseña
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 border-[#E5E7EB]"
              disabled={loading}
              required
            />
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full h-11 bg-[#002366] text-white hover:bg-[#003380] transition-colors duration-150" 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Verificando..." : "Iniciar sesión"}
          </Button>
        </div>
      </div>
    </div>
  );
}