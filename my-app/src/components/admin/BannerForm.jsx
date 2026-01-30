"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminAPI } from "@/lib/api";

export default function BannerForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    tagline: "",
    image: null,
    link: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "file"
          ? files[0]
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "El título es obligatorio";
    }

    if (!form.image) {
      newErrors.image = "La imagen es obligatoria";
    }

    if (!form.start_date) {
      newErrors.start_date = "La fecha de inicio es obligatoria";
    }

    if (!form.end_date) {
      newErrors.end_date = "La fecha de fin es obligatoria";
    }

    // Validación: end_date > start_date
    if (form.start_date && form.end_date) {
      if (new Date(form.end_date) < new Date(form.start_date)) {
        newErrors.end_date = "La fecha de fin debe ser posterior al inicio";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      await adminAPI.createBanner(data);
      onSuccess?.();
      
      // Reset form
      setForm({
        title: "",
        tagline: "",
        image: null,
        link: "",
        start_date: "",
        end_date: "",
        is_active: true,
      });
    } catch (err) {
      console.error(err);
      setErrors({ 
        submit: err.response?.data?.detail || "Error al crear el banner" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* TÍTULO */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">
          Título del banner
        </label>
        <Input
          name="title"
          placeholder="Ej: Equipos certificados ISO 9001"
          value={form.title}
          onChange={handleChange}
          className={`h-10 placeholder:text-[#9CA3AF] ${errors.title ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
        />
        {errors.title && (
          <p className="text-xs text-[#E5533D] mt-1.5">{errors.title}</p>
        )}
      </div>

      {/* TAGLINE */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">
          Tagline <span className="text-xs text-[#6B7280] font-normal">(opcional)</span>
        </label>
        <Input
          name="tagline"
          placeholder="Ej: Respaldo técnico garantizado"
          value={form.tagline}
          onChange={handleChange}
          className="h-10 placeholder:text-[#9CA3AF] border-[#E5E7EB]"
        />
      </div>

      {/* IMAGEN */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">
          Imagen del banner
        </label>
        <Input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className={`h-10 placeholder:text-[#9CA3AF] ${errors.image ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
        />
        {errors.image && (
          <p className="text-xs text-[#E5533D] mt-1.5">{errors.image}</p>
        )}
        <p className="text-xs text-[#6B7280] mt-1.5">
          Formato recomendado: 1920x600px, JPG o PNG
        </p>
      </div>

      {/* LINK */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">
          URL de destino <span className="text-xs text-[#6B7280] font-normal">(opcional)</span>
        </label>
        <Input
          name="link"
          type="url"
          placeholder="https://promelab.com/productos"
          value={form.link}
          onChange={handleChange}
          className="h-10 placeholder:text-[#9CA3AF] border-[#E5E7EB]"
        />
      </div>

      {/* FECHAS */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Fecha de inicio
          </label>
          <Input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className={`h-10 placeholder:text-[#9CA3AF] ${errors.start_date ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
          />
          {errors.start_date && (
            <p className="text-xs text-[#E5533D] mt-1.5">{errors.start_date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Fecha de fin
          </label>
          <Input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            className={`h-10 placeholder:text-[#9CA3AF] ${errors.end_date ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
          />
          {errors.end_date && (
            <p className="text-xs text-[#E5533D] mt-1.5">{errors.end_date}</p>
          )}
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
          type="button"
          variant="ghost"
          onClick={() => onSuccess?.()}
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
          {loading ? "Guardando..." : "Crear banner"}
        </Button>
      </div>
    </div>
  );
}