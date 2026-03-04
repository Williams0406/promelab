"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminAPI } from "@/lib/api";
import ProductImagesUploader from "@/components/products/ProductImagesUploader";
import { Search, ChevronDown, ChevronRight, Building2 } from "lucide-react";

function filterCategoryTree(nodes, query) {
  if (!query.trim()) return nodes;

  const normalizedQuery = query.toLowerCase();

  return nodes
    .map((node) => {
      const filteredChildren = filterCategoryTree(node.children || [], query);
      const matchesNode = node.name.toLowerCase().includes(normalizedQuery);

      if (matchesNode || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren,
        };
      }

      return null;
    })
    .filter(Boolean);
}

function CategoryTreeOption({
  node,
  level,
  selectedCategory,
  onSelect,
  expandedIds,
  onToggle,
  forceExpanded,
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = forceExpanded || expandedIds.has(node.id);
  const isSelected = String(selectedCategory) === String(node.id);

  return (
    <div>
      <div
        className={`group flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors ${
          isSelected ? "bg-[#E0F2FE] text-[#002366]" : "hover:bg-[#EEF2FF] text-[#374151]"
        }`}
        style={{ paddingLeft: `${0.5 + level * 1}rem` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(node.id)}
            className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-[#E5E7EB]"
            aria-label={isExpanded ? "Contraer" : "Expandir"}
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-[#6B7280]" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-[#6B7280]" />
            )}
          </button>
        ) : (
          <span className="h-5 w-5" />
        )}

        <button
          type="button"
          onClick={() => onSelect(node)}
          className="flex-1 text-left truncate"
          title={node.name}
        >
          {node.name}
        </button>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-0.5 space-y-0.5">
          {node.children.map((child) => (
            <CategoryTreeOption
              key={child.id}
              node={child}
              level={level + 1}
              selectedCategory={selectedCategory}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggle={onToggle}
              forceExpanded={forceExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

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

  const [categoryTree, setCategoryTree] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");
  const [expandedCategoryIds, setExpandedCategoryIds] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [createdProductId, setCreatedProductId] = useState(null);
  const isEdit = !!safeInitialData.id || !!createdProductId;
  const uploaderProductId = safeInitialData.id || createdProductId;

  // Cargar categorías y proveedores
  useEffect(() => {
    async function fetchOptions() {
      if (!open) return;

      setLoadingOptions(true);
      try {
        const [catRes, vendorRes] = await Promise.all([
          adminAPI.getCategoryTree(),
          adminAPI.getVendors(),
        ]);

        setCategoryTree(Array.isArray(catRes.data) ? catRes.data : []);
        setVendors(vendorRes.data?.results || []);
      } catch (err) {
        console.error("Error cargando opciones:", err);
        setErrors({
          submit: "No se pudieron cargar categorías o proveedores.",
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
    setCreatedProductId(null);
    setCategorySearch("");
    setVendorSearch("");
    setExpandedCategoryIds(new Set());
  }, [initialData]);

  useEffect(() => {
    if (!open) {
      setCreatedProductId(null);
      setCategorySearch("");
      setVendorSearch("");
      setExpandedCategoryIds(new Set());
    }
  }, [open]);

  const visibleCategoryTree = useMemo(
    () => filterCategoryTree(categoryTree, categorySearch),
    [categoryTree, categorySearch]
  );

  const visibleVendors = useMemo(() => {
    if (!vendorSearch.trim()) return vendors;
    const query = vendorSearch.toLowerCase();
    return vendors.filter((vendor) => vendor.name.toLowerCase().includes(query));
  }, [vendors, vendorSearch]);

  const forceExpandCategories = !!categorySearch.trim();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
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

      const created = await onSubmit(submitData);
      if (created?.id) {
        setCreatedProductId(created.id);
      }
      if (isEdit) {
        onClose();
      }
    } catch (err) {
      const backendErrors = err?.response?.data;

      if (backendErrors) {
        setErrors({
          submit: Object.entries(backendErrors)
            .map(([field, messages]) => `${field}: ${messages[0]}`)
            .join(" • "),
        });
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
      title={isEdit ? "Editar producto" : "Nuevo producto"}
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
        {uploaderProductId && (
          <div className="pt-4 border-t border-[#E5E7EB]">
            <ProductImagesUploader productId={uploaderProductId} />
          </div>
        )}

        {/* Categoría y proveedor */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Categoría <span className="text-xs text-[#6B7280] font-normal">(opcional)</span>
            </label>

            <div className="space-y-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-[#9CA3AF] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Buscar categoría..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="h-10 pl-8 border-[#E5E7EB]"
                  disabled={loadingOptions}
                />
              </div>

              <div className="rounded-lg border border-[#E5E7EB] bg-white max-h-52 overflow-auto p-1">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, category: "" }))}
                  className={`w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors ${
                    !form.category
                      ? "bg-[#E0F2FE] text-[#002366]"
                      : "text-[#374151] hover:bg-[#EEF2FF]"
                  }`}
                >
                  Sin categoría
                </button>

                {loadingOptions ? (
                  <p className="px-2 py-2 text-xs text-[#6B7280]">Cargando categorías...</p>
                ) : visibleCategoryTree.length > 0 ? (
                  <div className="space-y-0.5">
                    {visibleCategoryTree.map((node) => (
                      <CategoryTreeOption
                        key={node.id}
                        node={node}
                        level={0}
                        selectedCategory={form.category}
                        forceExpanded={forceExpandCategories}
                        expandedIds={expandedCategoryIds}
                        onToggle={(id) => {
                          setExpandedCategoryIds((prev) => {
                            const updated = new Set(prev);
                            if (updated.has(id)) {
                              updated.delete(id);
                            } else {
                              updated.add(id);
                            }
                            return updated;
                          });
                        }}
                        onSelect={(nodeSelected) =>
                          setForm((prev) => ({ ...prev, category: nodeSelected.id }))
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <p className="px-2 py-2 text-xs text-[#6B7280]">
                    No encontramos categorías con ese término.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Proveedor <span className="text-xs text-[#6B7280] font-normal">(opcional)</span>
            </label>

            <div className="space-y-2">
              <div className="relative">
                <Building2 className="h-3.5 w-3.5 text-[#9CA3AF] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Buscar proveedor..."
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  className="h-10 pl-8 border-[#E5E7EB]"
                  disabled={loadingOptions}
                />
              </div>

              <div className="rounded-lg border border-[#E5E7EB] bg-white max-h-52 overflow-auto p-1">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, vendor: "" }))}
                  className={`w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors ${
                    !form.vendor
                      ? "bg-[#E0F2FE] text-[#002366]"
                      : "text-[#374151] hover:bg-[#EEF2FF]"
                  }`}
                >
                  Sin proveedor
                </button>

                {loadingOptions ? (
                  <p className="px-2 py-2 text-xs text-[#6B7280]">Cargando proveedores...</p>
                ) : visibleVendors.length > 0 ? (
                  visibleVendors.map((vendor) => (
                    <button
                      key={vendor.id}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, vendor: vendor.id }))}
                      className={`w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors ${
                        String(form.vendor) === String(vendor.id)
                          ? "bg-[#E0F2FE] text-[#002366]"
                          : "text-[#374151] hover:bg-[#EEF2FF]"
                      }`}
                    >
                      {vendor.name}
                    </button>
                  ))
                ) : (
                  <p className="px-2 py-2 text-xs text-[#6B7280]">
                    No encontramos proveedores con ese término.
                  </p>
                )}
              </div>
            </div>
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