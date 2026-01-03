"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StaffCreateModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    if (!form.first_name.trim()) {
      newErrors.first_name = "El nombre es obligatorio";
    }

    if (!form.last_name.trim()) {
      newErrors.last_name = "El apellido es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
      
      // Reset form
      setForm({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
      });
      setErrors({});
    } catch (err) {
      setErrors({ submit: err.message || "Error al crear usuario" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Crear usuario Staff">
      <div className="space-y-5">
        
        {/* INFORMACIÓN BÁSICA */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#002366]">
            Información de acceso
          </h3>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Usuario
            </label>
            <Input
              name="username"
              placeholder="ej: jperez"
              value={form.username}
              onChange={handleChange}
              className={`h-10 ${errors.username ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
            />
            {errors.username && (
              <p className="text-xs text-[#E5533D] mt-1.5">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Email corporativo
            </label>
            <Input
              name="email"
              type="email"
              placeholder="usuario@promelab.com"
              value={form.email}
              onChange={handleChange}
              className={`h-10 ${errors.email ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
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
            />
            {errors.password && (
              <p className="text-xs text-[#E5533D] mt-1.5">{errors.password}</p>
            )}
          </div>
        </div>

        {/* INFORMACIÓN PERSONAL */}
        <div className="space-y-4 pt-4 border-t border-[#E5E7EB]">
          <h3 className="text-sm font-semibold text-[#002366]">
            Información personal
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Nombre
              </label>
              <Input
                name="first_name"
                placeholder="Juan"
                value={form.first_name}
                onChange={handleChange}
                className={`h-10 ${errors.first_name ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
              />
              {errors.first_name && (
                <p className="text-xs text-[#E5533D] mt-1.5">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Apellido
              </label>
              <Input
                name="last_name"
                placeholder="Pérez"
                value={form.last_name}
                onChange={handleChange}
                className={`h-10 ${errors.last_name ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
              />
              {errors.last_name && (
                <p className="text-xs text-[#E5533D] mt-1.5">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Teléfono <span className="text-xs text-[#6B7280] font-normal">(opcional)</span>
            </label>
            <Input
              name="phone"
              placeholder="+51 999 999 999"
              value={form.phone}
              onChange={handleChange}
              className="h-10 border-[#E5E7EB]"
            />
          </div>
        </div>

        {/* ERROR GENERAL */}
        {errors.submit && (
          <div className="rounded-lg bg-[#FEF2F2] border border-[#E5533D] p-4">
            <p className="text-sm text-[#E5533D]">{errors.submit}</p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
          <Button 
            variant="ghost" 
            onClick={onClose}
            disabled={loading}
            className="text-[#374151] hover:bg-[#F5F7FA]"
          >
            Cancelar
          </Button>
          
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#002366] text-white hover:bg-[#003380] transition-colors duration-150"
          >
            {loading ? "Creando..." : "Crear usuario Staff"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}