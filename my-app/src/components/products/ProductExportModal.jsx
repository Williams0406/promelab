"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { adminAPI } from "@/lib/api";

const EXPORT_FORMATS = [
  {
    value: "xlsx",
    label: "Excel (.xlsx)",
    description: "Ideal para análisis y edición en hojas de cálculo.",
    icon: FileSpreadsheet,
  },
  {
    value: "csv",
    label: "CSV (.csv)",
    description: "Ligero y compatible con múltiples plataformas.",
    icon: FileText,
  },
];


function normalizeText(value) {
  return (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function toExportRows(products) {
  return products.map((product) => ({
    ID: product.id,
    Nombre: product.name || "",
    Descripción: product.description || "",
    Precio: product.price ?? "",
    "Precio Promo": product.promo_price ?? "",
    Categoría: product.category_name || "",
    Proveedor: product.vendor_name || "",
    Activo: product.is_active ? "Sí" : "No",
    Destacado: product.is_featured ? "Sí" : "No",
    "Fecha Creación": product.created_at
      ? new Date(product.created_at).toLocaleDateString("es-PE")
      : "",
  }));
}

export default function ProductExportModal({
  open,
  onClose,
  filters,
  ordering,
  onSuccess,
}) {
  const [format, setFormat] = useState("xlsx");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchAllProducts() {
    const allProducts = [];
    let nextPage = 1;

    while (nextPage) {
      const res = await adminAPI.getProducts({
        page: nextPage,
        page_size: 100,
        ordering,
      });

      allProducts.push(...(res.data.results || []));
      nextPage = res.data.next ? nextPage + 1 : null;
    }

    return allProducts;
  }

  async function handleExport() {
    setLoading(true);
    setError("");

    try {
      const products = await fetchAllProducts();

      const searchFilter = normalizeText(filters.search);
      const categoryFilter = normalizeText(filters.category);
      const vendorFilter = normalizeText(filters.vendor);
      const filteredProducts = products.filter((product) => {
        const name = normalizeText(product.name);
        const description = normalizeText(product.description);
        const categoryName = normalizeText(product.category_name);
        const vendorName = normalizeText(product.vendor_name);

        const searchMatch =
          !searchFilter ||
          name.includes(searchFilter) ||
          description.includes(searchFilter);
        const categoryMatch =
          !categoryFilter || categoryName.includes(categoryFilter);
        const vendorMatch = !vendorFilter || vendorName.includes(vendorFilter);

        return searchMatch && categoryMatch && vendorMatch;
      });

      if (filteredProducts.length === 0) {
        setError("No hay productos para exportar con los filtros actuales.");
        return;
      }

      const rows = toExportRows(filteredProducts);
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

      const dateTag = new Date().toISOString().slice(0, 10);
      const filename = `productos-${dateTag}.${format}`;

      XLSX.writeFile(
        workbook,
        filename,
        format === "csv" ? { bookType: "csv" } : undefined
      );

      onSuccess?.(filteredProducts.length);
      onClose();
    } catch (err) {
      console.error(err);
      setError("No se pudo completar la exportación. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Exportar productos" size="sm">
      <div className="space-y-5">
        <p className="text-sm text-[#6B7280]">
          Descarga tu catálogo de productos respetando los filtros aplicados en la tabla.
          Los campos <strong>Categoría</strong> y <strong>Proveedor</strong> se exportan con sus
          nombres para facilitar lectura y análisis.
        </p>

        <div className="space-y-2">
          <p className="text-sm font-medium text-[#374151]">Formato de archivo</p>
          <div className="grid gap-2">
            {EXPORT_FORMATS.map((option) => {
              const Icon = option.icon;
              const active = format === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormat(option.value)}
                  className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                    active
                      ? "border-[#002366] bg-[#EEF2FF]"
                      : "border-[#E5E7EB] hover:border-[#CBD5E1]"
                  }`}
                >
                  <Icon className={`h-4 w-4 mt-0.5 ${active ? "text-[#002366]" : "text-[#6B7280]"}`} />
                  <div>
                    <p className="text-sm font-medium text-[#111827]">{option.label}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-[#E5533D] bg-[#FEF2F2] p-3">
            <p className="text-sm text-[#E5533D]">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={loading}
            className="bg-[#002366] text-white hover:bg-[#003380]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}