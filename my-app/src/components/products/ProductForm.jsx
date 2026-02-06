"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminAPI } from "@/lib/api";
import ProductImagesUploader from "@/components/products/ProductImagesUploader";

export default function ProductForm({ open, onClose, initialData, onSubmit }) {
  const safeInitialData = initialData || {};

  const [form, setForm] = useState({
    name: safeInitialData.name || "",
    description: safeInitialData.description || "",
    price: safeInitialData.price || "",
    category: safeInitialData.category || "",
    vendor: safeInitialData.vendor || "",
    is_active: safeInitialData.is_active ?? true,
  });

  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const isEdit = !!safeInitialData.id;

  // Cargar categorías y proveedores
  useEffect(() => {
    async function fetchOptions() {
      if (!open) return;
      
      setLoadingOptions(true);
      try {
        const [catRes, vendorRes] = await Promise.all([
          adminAPI.getCategories(),
          adminAPI.getVendors(),
        ]);

        setCategories(catRes.data?.results || []);
        setVendors(vendorRes.data?.results || []);
      } catch (err) {
        console.error("Error cargando opciones:", err);
        setErrors({ 
          submit: "No se pudieron cargar categorías o proveedores." 
        });
      } finally {
        setLoadingOptions(false);
      }
    }

    fetchOptions();
  }, [open]);

  // Actualizar form al cambiar initialData
  useEffect(() => {
    const data = initialData || {};
    setForm({
      name: data.name || "",
      description: data.description || "",
      price: data.price || "",
      category: data.category || "",
      vendor: data.vendor || "",
      is_active: data.is_active ?? true,
    });
    setErrors({});
  }, [initialData]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }

    setForm((prev) => {
      const updated = { 
        ...prev, 
        [name]: type === "checkbox" ? checked : value 
      };

      return updated;
    });
  }

  function validateForm() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!form.description.trim()) {
      newErrors.description = "La descripción es obligatoria";
    }

    if (!form.price || parseFloat(form.price) <= 0) {
      newErrors.price = "El precio debe ser mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const submitData = {
        ...form,
        category: form.category || null,
        vendor: form.vendor || null,
      };

      await onSubmit(submitData);
      onClose();
    } catch (err) {
      const backendErrors = err?.response?.data;

      if (backendErrors) {
        if (typeof backendErrors === "string") {
          const isHtml =
            backendErrors.toLowerCase().includes("<!doctype") ||
            backendErrors.toLowerCase().includes("<html");
          const statusCode = err?.response?.status;
          setErrors({
            submit: isHtml
              ? `Error del servidor${statusCode ? ` (${statusCode})` : ""} al guardar el producto. Revisa los logs del backend.`
              : backendErrors,
          });
        } else if (backendErrors.detail) {
          setErrors({ submit: backendErrors.detail });
        } else if (Array.isArray(backendErrors)) {
          setErrors({ submit: backendErrors.join(" • ") });
        } else {
          setErrors({
            submit: Object.entries(backendErrors)
              .map(([field, messages]) => `${field}: ${messages[0]}`)
              .join(" • "),
          });
        }
      } else {
        setErrors({ submit: "No se pudo guardar el producto." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={safeInitialData.id ? "Editar producto" : "Nuevo producto"}
      size="lg"
    >
      <div className="space-y-6">
        
        {/* Error general */}
        {errors.submit && (
          <div className="rounded-lg bg-[#FEF2F2] border border-[#E5533D] p-4">
            <p className="text-sm text-[#E5533D]">{errors.submit}</p>
          </div>
        )}

        {/* Nombre y slug */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Nombre del producto
            </label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. Reactivo químico grado analítico"
              className={`h-10 placeholder:text-[#9CA3AF] ${errors.name ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
            />
            {errors.name && (
              <p className="text-xs text-[#E5533D] mt-1.5">{errors.name}</p>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Descripción técnica
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Descripción técnica, uso, presentación, normas aplicables..."
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:border-[#00A8CC] focus:ring-1 focus:ring-[#00A8CC] transition-colors duration-150 ${
              errors.description ? "border-[#E5533D]" : "border-[#E5E7EB]"
            }`}
          />
          {errors.description && (
            <p className="text-xs text-[#E5533D] mt-1.5">{errors.description}</p>
          )}
        </div>

        {/* Imágenes del producto */}
        {isEdit && (
          <div className="pt-4 border-t border-[#E5E7EB]">
            <ProductImagesUploader productId={safeInitialData.id} />
          </div>
        )}

        {/* Categoría y proveedor */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Categoría <span className="text-xs text-[#6B7280] font-normal">(opcional)</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={loadingOptions}
              className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-sm text-[#374151] focus:border-[#00A8CC] focus:ring-1 focus:ring-[#00A8CC] transition-colors duration-150"
            >
              <option value="">
                {loadingOptions ? "Cargando..." : "Sin categoría"}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Proveedor <span className="text-xs text-[#6B7280] font-normal">(opcional)</span>
            </label>
            <select
              name="vendor"
              value={form.vendor}
              onChange={handleChange}
              disabled={loadingOptions}
              className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-sm text-[#374151] focus:border-[#00A8CC] focus:ring-1 focus:ring-[#00A8CC] transition-colors duration-150"
            >
              <option value="">
                {loadingOptions ? "Cargando..." : "Sin proveedor"}
              </option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Precio*/}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Precio (S/)
            </label>
            <Input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              className={`h-10 placeholder:text-[#9CA3AF] ${errors.price ? "border-[#E5533D]" : "border-[#E5E7EB]"}`}
            />
            {errors.price && (
              <p className="text-xs text-[#E5533D] mt-1.5">{errors.price}</p>
            )}
          </div>
        </div>

        {/* Estado activo */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-[#F5F7FA] border border-[#E5E7EB]">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 accent-[#002366]"
          />
          <div>
            <span className="font-medium text-sm text-[#374151]">
              Producto activo
            </span>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Disponible para clientes en el catálogo público
            </p>
          </div>
        </div>

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
            disabled={loading || loadingOptions}
            className="bg-[#002366] text-white hover:bg-[#003380]"
          >
            {loading ? "Guardando..." : "Guardar producto"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}