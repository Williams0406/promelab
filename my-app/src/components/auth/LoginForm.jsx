"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export default function LoginForm() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isBusy = loading || googleLoading;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(identifier, password);

    if (!result?.success) {
      setError(result?.message || "Credenciales invalidas");
      setLoading(false);
      return;
    }

    router.push("/");
  };

  const handleGoogleAuth = useCallback(
    async (credential) => {
      setError(null);
      setGoogleLoading(true);

      const result = await loginWithGoogle(credential);

      if (!result?.success) {
        setError(result?.message || "No pudimos continuar con Google");
        setGoogleLoading(false);
        return;
      }

      router.push("/");
    },
    [loginWithGoogle, router]
  );

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="space-y-6 rounded-lg border border-[#E5E7EB] bg-white p-8 shadow-sm">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F5F7FA]">
            <Lock className="h-5 w-5 text-[#002366]" />
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#002366]">
              Acceso al sistema
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Ingresa con tu correo, tu usuario o Google
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-[#E5533D] bg-[#FEF2F2] p-4">
            <p className="text-sm text-[#E5533D]">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <GoogleAuthButton
            mode="login"
            onCredential={handleGoogleAuth}
            disabled={isBusy}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#9CA3AF]">
                o con tu correo
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">
              Correo o usuario
            </label>
            <Input
              type="text"
              placeholder="correo@ejemplo.com"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="h-10 border-[#E5E7EB] placeholder:text-[#9CA3AF]"
              disabled={isBusy}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">
              Contrasena
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 border-[#E5E7EB] placeholder:text-[#9CA3AF]"
              disabled={isBusy}
              required
            />
          </div>

          <Button
            type="submit"
            className="h-11 w-full bg-[#002366] text-white transition-colors duration-150 hover:bg-[#003380]"
            disabled={isBusy}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Verificando..." : "Iniciar sesion"}
          </Button>
        </form>
      </div>
    </div>
  );
}
