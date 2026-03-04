"use client";

import { useEffect, useMemo, useState } from "react";
import { adminAPI } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import ProductImagesUploader from "./ProductImagesUploader";
import TechnicalSpecsEditor from "./TechnicalSpecsEditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Tag, Search, ChevronDown, ChevronRight, Building2 } from "lucide-react";

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

function hasCategoryInTree(nodes, categoryId) {
  for (const node of nodes) {
    if (String(node.id) === String(categoryId)) return true;
    if (node.children?.length && hasCategoryInTree(node.children, categoryId)) return true;
  }
  return false;
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

export default function ProductDetailModal({ productId, onClose, onSaved }) {
  const [product, setProduct] = useState(null);
  const [categoryTree, setCategoryTree] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");
  const [expandedCategoryIds, setExpandedCategoryIds] = useState(new Set());
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

  useEffect(() => {
    if (!editing) return;

    async function fetchFilters() {
      setLoadingFilters(true);
      try {
        const [categoryRes, vendorRes] = await Promise.all([
          adminAPI.getCategoryTree(),
          adminAPI.getVendors(),
        ]);

        setCategoryTree(Array.isArray(categoryRes.data) ? categoryRes.data : []);
        setVendors(vendorRes.data?.results || []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las categorías y proveedores.");
      } finally {
        setLoadingFilters(false);
      }
    }

    fetchFilters();
  }, [editing]);

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

  const handleSave = async () => {
    setError(null);
    setSaving(true);

    try {
      await adminAPI.updateProduct(product.id, {
        name: product.name,
        description: product.description,
        price: product.price,
        promo_price: product.promo_price || null,
        category: product.category || null,
        vendor: product.vendor || null,
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

  const selectedCategoryIsAvailable = hasCategoryInTree(
    categoryTree,
    product.category
  );

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
              {editing ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 text-[#9CA3AF] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <Input
                      placeholder="Buscar categoría..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="h-9 pl-8 border-[#D1D5DB] bg-white"
                      disabled={loadingFilters}
                    />
                  </div>

                  <div className="rounded-lg border border-[#D1D5DB] bg-white max-h-52 overflow-auto p-1">
                    <button
                      type="button"
                      onClick={() =>
                        setProduct({ ...product, category: null, category_name: "" })
                      }
                      className={`w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors ${
                        !product.category
                          ? "bg-[#E0F2FE] text-[#002366]"
                          : "text-[#374151] hover:bg-[#EEF2FF]"
                      }`}
                    >
                      Sin categoría
                    </button>

                    {loadingFilters ? (
                      <p className="px-2 py-2 text-xs text-[#6B7280]">Cargando categorías...</p>
                    ) : visibleCategoryTree.length > 0 ? (
                      <div className="space-y-0.5">
                        {visibleCategoryTree.map((node) => (
                          <CategoryTreeOption
                            key={node.id}
                            node={node}
                            level={0}
                            selectedCategory={product.category}
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
                              setProduct({
                                ...product,
                                category: nodeSelected.id,
                                category_name: nodeSelected.name,
                              })
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

                  {!selectedCategoryIsAvailable && product.category && (
                    <p className="text-xs text-[#B45309]">
                      La categoría seleccionada ya no está disponible. Elige una nueva.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[#374151]">
                  {product.category_name || "Sin categoría"}
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">
                Proveedor
              </p>
              {editing ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Building2 className="h-3.5 w-3.5 text-[#9CA3AF] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <Input
                      placeholder="Buscar proveedor..."
                      value={vendorSearch}
                      onChange={(e) => setVendorSearch(e.target.value)}
                      className="h-9 pl-8 border-[#D1D5DB] bg-white"
                      disabled={loadingFilters}
                    />
                  </div>

                  <div className="rounded-lg border border-[#D1D5DB] bg-white max-h-40 overflow-auto p-1">
                    <button
                      type="button"
                      onClick={() =>
                        setProduct({ ...product, vendor: null, vendor_name: "" })
                      }
                      className={`w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors ${
                        !product.vendor
                          ? "bg-[#E0F2FE] text-[#002366]"
                          : "text-[#374151] hover:bg-[#EEF2FF]"
                      }`}
                    >
                      Sin proveedor
                    </button>

                    {loadingFilters ? (
                      <p className="px-2 py-2 text-xs text-[#6B7280]">Cargando proveedores...</p>
                    ) : visibleVendors.length > 0 ? (
                      visibleVendors.map((vendor) => (
                        <button
                          key={vendor.id}
                          type="button"
                          onClick={() =>
                            setProduct({
                              ...product,
                              vendor: vendor.id,
                              vendor_name: vendor.name,
                            })
                          }
                          className={`w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors ${
                            String(product.vendor) === String(vendor.id)
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
              ) : (
                <p className="text-sm text-[#374151]">
                  {product.vendor_name || "Sin proveedor"}
                </p>
              )}
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