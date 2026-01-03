"use client";

import { useEffect, useState, useCallback } from "react";
import { adminAPI } from "@/lib/api";
import CategoryNode from "./CategoryNode";
import CategoryForm from "./CategoryForm";
import { Button } from "@/components/ui/button";
import { Plus, FolderTree } from "lucide-react";

export default function CategoryTree() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [parentCategory, setParentCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const loadTree = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminAPI.getCategoryTree();
      setTree(res.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        "No se pudo cargar el árbol de categorías."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTree();
  }, [loadTree]);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-[#002366] mx-auto mb-4" />
          <p className="text-sm font-medium text-[#6B7280]">
            Cargando categorías...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg bg-[#FEF2F2] border border-[#E5533D] p-6">
        <h3 className="text-base font-semibold text-[#E5533D] mb-2">
          Error al cargar categorías
        </h3>
        <p className="text-sm text-[#E5533D] mb-4">{error}</p>
        <Button 
          onClick={loadTree}
          className="bg-[#E5533D] text-white hover:bg-[#DC2626]"
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F7FA] border border-[#E5E7EB]">
            <FolderTree className="h-5 w-5 text-[#002366]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#002366]">
              Categorías
            </h2>
            <p className="text-sm text-[#6B7280] mt-0.5">
              {tree.length} {tree.length === 1 ? "categoría" : "categorías"} principales
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            setParentCategory(null);
            setEditingCategory(null);
            setShowForm(true);
          }}
          className="bg-[#002366] text-white hover:bg-[#003380] transition-colors duration-150"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva categoría
        </Button>
      </div>

      {/* Tree */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
        {tree.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F7FA] border border-[#E5E7EB] mb-4">
              <FolderTree className="h-8 w-8 text-[#6B7280]" />
            </div>
            <h3 className="text-base font-semibold text-[#002366] mb-2">
              No hay categorías
            </h3>
            <p className="text-sm text-[#6B7280] mb-4 max-w-md">
              Comienza creando tu primera categoría para organizar los productos.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#002366] text-white hover:bg-[#003380]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear primera categoría
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {tree.map((category) => (
              <CategoryNode
                key={category.id}
                category={category}
                onRefresh={loadTree}
                onEdit={(cat) => {
                  setEditingCategory(cat);
                  setParentCategory(cat.parent || null);
                  setShowForm(true);
                }}
                onAddChild={(cat) => {
                  setParentCategory(cat);
                  setEditingCategory(null);
                  setShowForm(true);
                }}
                level={0}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <CategoryForm
          initialData={editingCategory || {}}
          parent={parentCategory}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
            setParentCategory(null);
          }}
          onSaved={() => {
            setShowForm(false);
            setEditingCategory(null);
            setParentCategory(null);
            loadTree();
          }}
        />
      )}
    </div>
  );
}