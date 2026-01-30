"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import ProductImagesUploader from "./ProductImagesUploader";
import TechnicalSpecsEditor from "./TechnicalSpecsEditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Tag, DollarSign } from "lucide-react";

export default function ProductDetailModal({ productId, onClose, onSaved }) {
  const [product, setProduct] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      try {
        const res = await adminAPI.getProduct(productId);
        setProduct({
          ...res.data,
          technical_specs: res.data.technical_specs || {},
        });
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el producto");
      }
    }

    fetchProduct();
  }, [productId]);

  const handleSave = async () => {
    setError(null);
    setSaving(true);

    try {
      await adminAPI.updateProduct(product.id, {
        name: product.name,
        description: product.description,
        price: product.price,
        promo_price: product.promo_price || null,
        is_active: product.is_active,
        is_featured: product.is_featured,
        technical_specs: product.technical_specs,
      });
      
      setEditing(false);
      onSaved?.();
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        "No se pudo guardar el producto"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!product) {
    return (
      <Modal open title="Cargando producto..." onClose={onClose} size="xl">
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-[#002366]" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal 
      open 
      title={`Producto: ${product.name}`} 
      onClose={onClose} 
      size="xl"
    >
      <div className="space-y-6">

        {/* Header con estados */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-[#F5F7FA] border border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-[#E5E7EB]">
              <Package className="h-5 w-5 text-[#002366]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                Estado
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  product.is_active 
                    ? "bg-[#E6F4F1] text-[#0F766E]" 
                    : "bg-[#FEF2F2] text-[#E5533D]"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    product.is_active ? "bg-[#2ECC71]" : "bg-[#E5533D]"
                  }`} />
                  {product.is_active ? "Activo" : "Inactivo"}
                </span>
                
                {product.is_featured && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#E0F2FE] text-[#0369A1]">
                    <Tag className="h-3 w-3" />
                    Destacado
                  </span>
                )}
              </div>
            </div>
          </div>

          {!editing && (
            <Button
              size="sm"
              onClick={() => setEditing(true)}
              className="bg-[#002366] text-white hover:bg-[#003380]"
            >
              Editar producto
            </Button>
          )}
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna principal */}
          <div className="space-y-5 lg:col-span-2">
            
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Nombre del producto
              </label>
              <Input
                placeholder="Nombre del producto"
                value={product.name}
                disabled={!editing}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                className="h-10 border-[#E5E7EB]"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Descripción
              </label>
              <textarea
                placeholder="Descripción técnica del producto"
                value={product.description}
                disabled={!editing}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:border-[#00A8CC] focus:ring-1 focus:ring-[#00A8CC] transition-colors duration-150"
              />
            </div>

            {/* Precios */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Precio (S/)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={product.price}
                  disabled={!editing}
                  onChange={(e) =>
                    setProduct({ ...product, price: parseFloat(e.target.value) })
                  }
                  className="h-10 border-[#E5E7EB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Precio promo
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={product.promo_price || ""}
                  disabled={!editing}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      promo_price: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  className="h-10 border-[#E5E7EB]"
                  placeholder="Opcional"
                />
              </div>
            </div>

            {/* Specs técnicas */}
            <TechnicalSpecsEditor
              value={product.technical_specs}
              disabled={!editing}
              onChange={(specs) =>
                setProduct({ ...product, technical_specs: specs })
              }
            />

            {/* Imágenes */}
            <ProductImagesUploader productId={product.id} />
          </div>

          {/* Sidebar clasificación */}
          <div className="space-y-4 p-4 rounded-lg border border-[#E5E7EB] bg-[#F5F7FA] h-fit">
            <h3 className="text-sm font-semibold text-[#002366]">
              Clasificación
            </h3>

            <div>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">
                Categoría
              </p>
              <p className="text-sm text-[#374151]">
                {product.category_name || "Sin categoría"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">
                Proveedor
              </p>
              <p className="text-sm text-[#374151]">
                {product.vendor_name || "Sin proveedor"}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB]">
              <p className="text-xs text-[#6B7280]">
                Creado: {new Date(product.created_at).toLocaleDateString('es-PE')}
              </p>
              {product.updated_at && (
                <p className="text-xs text-[#6B7280] mt-1">
                  Actualizado: {new Date(product.updated_at).toLocaleDateString('es-PE')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Error feedback */}
        {error && (
          <div className="rounded-lg bg-[#FEF2F2] border border-[#E5533D] p-4">
            <p className="text-sm text-[#E5533D]">{error}</p>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
          <Button 
            variant="ghost"
            onClick={onClose}
            className="text-[#374151] hover:bg-[#F5F7FA]"
          >
            Cerrar
          </Button>

          {editing && (
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-[#002366] text-white hover:bg-[#003380]"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}