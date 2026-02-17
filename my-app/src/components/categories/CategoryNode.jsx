"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Package } from "lucide-react";
import CategoryActions from "./CategoryActions";
import CategoryProducts from "./CategoryProducts";
import { adminAPI } from "@/lib/api";

export default function CategoryNode({
  category,
  onRefresh,
  onEdit,
  onAddChild,
  onAssignExisting, // 👈 NUEVO
  onDelete,
  level = 0,
}) {
  const [expanded, setExpanded] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);

  async function loadProducts() {
    if (loading || productsLoaded) return;

    try {
      setLoading(true);
      const res = await adminAPI.getProducts({
        category: category.id,
      });
      setProducts(res.data);
      setProductsLoaded(true);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  }

  function toggle() {
    setExpanded((prev) => !prev);
    if (!expanded && !productsLoaded) {
      loadProducts();
    }
  }

  const hasChildren = category.children && category.children.length > 0;
  const hasProducts = category.products_count > 0;

  return (
    <div className={level > 0 ? "ml-6" : ""}>
      
      {/* HEADER */}
      <div className="flex items-center gap-3 py-2 group hover:bg-[#F5F7FA] rounded-lg px-2 transition-colors duration-150">
        
        {/* Toggle button */}
        <button
          onClick={toggle}
          className="flex items-center justify-center h-6 w-6 rounded hover:bg-[#E5E7EB] transition-colors duration-150"
          aria-label={expanded ? "Contraer" : "Expandir"}
          aria-expanded={expanded}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-[#6B7280]" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[#6B7280]" />
          )}
        </button>

        {/* Ícono de categoría */}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F7FA] border border-[#E5E7EB]">
          <Package className="h-4 w-4 text-[#002366]" />
        </div>

        {/* Nombre */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#002366] truncate">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-xs text-[#6B7280] truncate mt-0.5">
              {category.description}
            </p>
          )}
        </div>

        {/* Contador de productos */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#F5F7FA] border border-[#E5E7EB]">
          <span className="text-xs font-medium text-[#374151]">
            {category.products_count ?? 0}
          </span>
          <span className="text-xs text-[#6B7280]">
            {category.products_count === 1 ? "producto" : "productos"}
          </span>
        </div>

        {/* Actions — visible al hover en desktop */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <CategoryActions
            category={category}
            onRefresh={onRefresh}
            onAddChild={onAddChild}
            onAssignExisting={onAssignExisting}
          />
        </div>
      </div>

      {/* CONTENT EXPANDIDO */}
      {expanded && (
        <div className="ml-6 mt-2 pl-4 border-l-2 border-[#E5E7EB]">
          
          {/* Loading state */}
          {loading && (
            <div className="flex items-center gap-2 py-2 text-sm text-[#6B7280]">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#002366]" />
              Cargando productos...
            </div>
          )}

          {/* Productos */}
          {!loading && productsLoaded && (
            <CategoryProducts products={products} />
          )}

          {/* Subcategorías */}
          {hasChildren && (
            <div className="mt-2 space-y-1">
              {category.children.map((child) => (
                <CategoryNode
                  key={child.id}
                  category={child}
                  onRefresh={onRefresh}
                  onEdit={onEdit}
                  onAddChild={onAddChild}
                  onAssignExisting={onAssignExisting} // 👈 NUEVO
                  onDelete={onDelete}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}