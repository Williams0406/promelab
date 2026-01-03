"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/api";
import { Loader2, UserPlus } from "lucide-react";

export default function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }

    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "El usuario es obligatorio";
    }

    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email inválido";
    }

    if (!form.password || form.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (form.password !== form.password2) {
      newErrors.password2 = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await authAPI.register(form);
      setSuccess(true);

      setTimeout(() => {
        onSwitch?.();
      }, 1500);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const firstError = Object.values(data)[0];
        setErrors({ 
          submit: Array.isArray(firstError) ? firstError[0] : firstError 
        });
      } else {
        setErrors({ submit: "No se pudo crear la cuenta" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6 rounded-lg border border-[#E5E7EB] bg-white p-8 shadow-sm">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F7FA] border border-[#E5E7EB]">
            <UserPlus className="h-5 w-5 text-[#002366]" />
          </div>
          
          <div>
            <h1 className="text-xl font-semibold text-[#002366] tracking-tight">
              Crear cuenta
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Regístrate para acceder a la plataforma
            </p>
          </div>
        </div>

        {/* Success feedback */}
        {success && (
          <div className="rounded-lg bg-[#E6F4F1] border border-[#2ECC71] p-4">
            <p className="text-sm text-[#0F766E] font-medium">
              Cuenta creada correctamente. Redirigiendo...
            </p>
          </div>
        )}

        {/* Error feedback */}
        {errors.submit && (
          <div className="rounded-lg bg-[#FEF2F2] border border-[#E5533D] p-4">
            <p className="text-sm text-[#E5533D]">{errors.submit}</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Usuario
            </label>
            <Input
              name="username"
              placeholder="Nombre de usuario"
              value={form.username}
              onChange={handleChange}
              className={`h-10 ${errors.username ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
              disabled={loading || success}
            />
            {errors.username && (
              <p className="text-xs text-[#E5533D] mt-1.5">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Email
            </label>
            <Input
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={handleChange}
              className={`h-10 ${errors.email ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
              disabled={loading || success}
            />
            {errors.email && (
              <p className="text-xs text-[#E5533D] mt-1.5">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Contraseña
            </label>
            <Input
              name="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={handleChange}
              className={`h-10 ${errors.password ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
              disabled={loading || success}
            />
            {errors.password && (
              <p className="text-xs text-[#E5533D] mt-1.5">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Confirmar contraseña
            </label>
            <Input
              name="password2"
              type="password"
              placeholder="Repite tu contraseña"
              value={form.password2}
              onChange={handleChange}
              className={`h-10 ${errors.password2 ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
              disabled={loading || success}
            />
            {errors.password2 && (
              <p className="text-xs text-[#E5533D] mt-1.5">{errors.password2}</p>
            )}
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full h-11 bg-[#002366] text-white hover:bg-[#003380] transition-colors duration-150" 
            disabled={loading || success}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </div>

        {/* Switch link */}
        <div className="pt-4 border-t border-[#E5E7EB]">
          <p className="text-center text-sm text-[#6B7280]">
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="font-medium text-[#002366] hover:text-[#00A8CC] transition-colors duration-150"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}