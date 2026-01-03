"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VendorForm({
  initialData = null,
  onSubmit,
  onClose,
}) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    contact_email: initialData?.contact_email || "",
    phone: initialData?.phone || "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validate() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "El nombre del proveedor es obligatorio";
    }

    if (
      form.contact_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)
    ) {
      newErrors.contact_email = "Formato de email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setErrors({ 
        submit: err.response?.data?.detail || "No se pudo guardar el proveedor" 
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={initialData ? "Editar proveedor" : "Nuevo proveedor"}
    >
      <div className="space-y-6">
        
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Nombre del proveedor
          </label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej. Sigma-Aldrich Perú"
            className={`h-10 ${errors.name ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
          />
          {errors.name && (
            <p className="text-xs text-[#E5533D] mt-1.5">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Email de contacto <span className="text-xs text-[#6B7280] font-normal">(opcional)</span>
          </label>
          <Input
            name="contact_email"
            type="email"
            value={form.contact_email}
            onChange={handleChange}
            placeholder="contacto@proveedor.com"
            className={`h-10 ${errors.contact_email ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
          />
          {errors.contact_email && (
            <p className="text-xs text-[#E5533D] mt-1.5">{errors.contact_email}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Teléfono <span className="text-xs text-[#6B7280] font-normal">(opcional)</span>
          </label>
          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+51 999 999 999"
            className="h-10 border-[#E5E7EB]"
          />
        </div>

        {/* Error general */}
        {errors.submit && (
          <div className="rounded-lg bg-[#FEF2F2] border border-[#E5533D] p-4">
            <p className="text-sm text-[#E5533D]">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={submitting}
            className="text-[#374151] hover:bg-[#F5F7FA]"
          >
            Cancelar
          </Button>

          <Button 
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#002366] text-white hover:bg-[#003380]"
          >
            {submitting
              ? "Guardando..."
              : initialData
              ? "Guardar cambios"
              : "Crear proveedor"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}