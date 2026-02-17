"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

export default function AssignSubcategoryModal({
  parentCategory,
  onClose,
  onSaved,
}) {
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCategories() {
        try {
        const res = await adminAPI.getCategories();

        // 🔥 Si hay paginación
        const data = Array.isArray(res.data)
            ? res.data
            : res.data.results || [];

        setCategories(data);
        } catch {
        setError("No se pudieron cargar las categorías.");
        }
    }
    loadCategories();
    }, []);

  async function handleAssign() {
    if (!selectedId) return;

    try {
      setLoading(true);
      await adminAPI.updateCategory(selectedId, {
        parent: parentCategory.id,
      });

      onSaved();
    } catch {
      setError("No se pudo asignar la subcategoría.");
    } finally {
      setLoading(false);
    }
  }

  const filteredCategories = categories.filter(
    (cat) => cat.id !== parentCategory.id
  );

  return (
    <Modal open={true} onClose={onClose} title="Asignar subcategoría existente">
      <div className="space-y-4">

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Seleccionar categoría</option>
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {error && (
          <div className="text-sm text-[#E5533D]">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedId || loading}
            className="bg-[#002366] text-white hover:bg-[#003380]"
          >
            {loading ? "Asignando..." : "Asignar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
