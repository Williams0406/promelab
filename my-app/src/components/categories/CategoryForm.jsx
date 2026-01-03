"use client";

import { useState } from "react";
import { adminAPI } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CategoryForm({ 
  initialData = {}, 
  parent, 
  onClose, 
  onSaved 
}) {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(initialData.id);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        parent: parent ? parent.id : null,
      };

      if (isEdit) {
        await adminAPI.updateCategory(initialData.id, payload);
      } else {
        await adminAPI.createCategory(payload);
      }

      onSaved();
    } catch (err) {
      setErrors({ 
        submit: err.response?.data?.detail || "No se pudo guardar la categoría." 
      });
    } finally {
      setLoading(false);
    }
  }

  const modalTitle = isEdit 
    ? "Editar categoría" 
    : parent 
      ? `Nueva subcategoría de "${parent.name}"` 
      : "Nueva categoría";

  return (
    <Modal open={true} onClose={onClose} title={modalTitle}>
      <div className="space-y-5">
        
        {/* Campo nombre */}
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Nombre de la categoría
          </label>
          <Input
            placeholder="Ej: Equipos de laboratorio"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors(prev => ({ ...prev, name: null }));
            }}
            className={`h-10 ${errors.name ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
            disabled={loading}
          />
          {errors.name && (
            <p className="text-xs text-[#E5533D] mt-1.5">{errors.name}</p>
          )}
        </div>

        {/* Campo descripción (opcional) */}
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Descripción <span className="text-xs text-[#6B7280] font-normal">(opcional)</span>
          </label>
          <textarea
            placeholder="Breve descripción de la categoría..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:border-[#00A8CC] focus:ring-1 focus:ring-[#00A8CC] transition-colors duration-150"
            disabled={loading}
          />
        </div>

        {/* Contexto (si es subcategoría) */}
        {parent && (
          <div className="rounded-lg bg-[#F5F7FA] border border-[#E5E7EB] p-3">
            <p className="text-xs text-[#6B7280]">
              <span className="font-medium text-[#374151]">Categoría padre:</span> {parent.name}
            </p>
          </div>
        )}

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
            {loading 
              ? "Guardando..." 
              : isEdit 
                ? "Guardar cambios" 
                : "Crear categoría"
            }
          </Button>
        </div>
      </div>
    </Modal>
  );
}