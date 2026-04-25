"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";

import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { useAuth } from "@/hooks/useAuth";
import { authAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterForm({ onSwitch }) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const isBusy = loading || googleLoading || success;

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: null }));
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Email invalido";
    }

    if (!form.password || form.password.length < 8) {
      nextErrors.password = "La contrasena debe tener al menos 8 caracteres";
    }

    if (form.password !== form.password2) {
      nextErrors.password2 = "Las contrasenas no coinciden";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await authAPI.register(form);
      setSuccess(true);

      setTimeout(() => {
        onSwitch?.();
      }, 1500);
    } catch (error) {
      const data = error.response?.data;

      if (data) {
        const firstError = Object.values(data)[0];
        setErrors({
          submit: Array.isArray(firstError) ? firstError[0] : firstError,
        });
      } else {
        setErrors({ submit: "No se pudo crear la cuenta" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = useCallback(
    async (credential) => {
      setErrors({});
      setGoogleLoading(true);

      const result = await loginWithGoogle(credential);

      if (!result?.success) {
        setErrors({
          submit: result?.message || "No pudimos continuar con Google",
        });
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
            <UserPlus className="h-5 w-5 text-[#002366]" />
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#002366]">
              Crear cuenta
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Registrate con Google o con tu correo
            </p>
          </div>
        </div>

        {success && (
          <div className="rounded-lg border border-[#2ECC71] bg-[#E6F4F1] p-4">
            <p className="text-sm font-medium text-[#0F766E]">
              Cuenta creada correctamente. Redirigiendo...
            </p>
          </div>
        )}

        {errors.submit && (
          <div className="rounded-lg border border-[#E5533D] bg-[#FEF2F2] p-4">
            <p className="text-sm text-[#E5533D]">{errors.submit}</p>
          </div>
        )}

        <div className="space-y-4">
          <GoogleAuthButton
            mode="register"
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
              Email
            </label>
            <Input
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={handleChange}
              className={`h-10 placeholder:text-[#9CA3AF] ${
                errors.email ? "border-[#E5533D]" : "border-[#E5E7EB]"
              }`}
              disabled={isBusy}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-[#E5533D]">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">
              Contrasena
            </label>
            <Input
              name="password"
              type="password"
              placeholder="Minimo 8 caracteres"
              value={form.password}
              onChange={handleChange}
              className={`h-10 placeholder:text-[#9CA3AF] ${
                errors.password ? "border-[#E5533D]" : "border-[#E5E7EB]"
              }`}
              disabled={isBusy}
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-[#E5533D]">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">
              Confirmar contrasena
            </label>
            <Input
              name="password2"
              type="password"
              placeholder="Repite tu contrasena"
              value={form.password2}
              onChange={handleChange}
              className={`h-10 placeholder:text-[#9CA3AF] ${
                errors.password2 ? "border-[#E5533D]" : "border-[#E5E7EB]"
              }`}
              disabled={isBusy}
            />
            {errors.password2 && (
              <p className="mt-1.5 text-xs text-[#E5533D]">
                {errors.password2}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="h-11 w-full bg-[#002366] text-white transition-colors duration-150 hover:bg-[#003380]"
            disabled={isBusy}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <div className="border-t border-[#E5E7EB] pt-4">
          <p className="text-center text-sm text-[#6B7280]">
            Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="font-medium text-[#002366] transition-colors duration-150 hover:text-[#00A8CC]"
            >
              Inicia sesion
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
