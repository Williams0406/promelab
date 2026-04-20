"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Download, Loader2, Package, Plus, Trash2 } from "lucide-react";
import Table from "@/components/ui/Table";
import { Button } from "@/components/ui/button";
import { adminAPI } from "@/lib/api";
import ProductActions from "@/components/products/ProductActions";
import ProductForm from "@/components/products/ProductForm";
import ProductDetailModal from "@/components/products/ProductDetailModal";
import ProductDeleteDialog from "@/components/products/ProductDeleteDialog";
import Pagination from "@/components/common/Pagination";
import ProductImportModal from "@/components/products/ProductImportModal";
import ProductExportModal from "@/components/products/ProductExportModal";

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function normalizeText(value) {
  return (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [modal, setModal] = useState({
    type: null,
    data: null,
  });

  const [feedback, setFeedback] = useState(null);
  const feedbackTimerRef = useRef(null);
  const selectAllRef = useRef(null);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    vendor: "",
  });
  const debouncedFilters = useDebounce(filters, 400);
  const [ordering, setOrdering] = useState("-created_at");
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  function showFeedback(type, message) {
    setFeedback({ type, message });

    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }

    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null);
    }, 4000);
  }

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
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

      setProducts(allProducts);
      const validIds = new Set(allProducts.map((product) => product.id));
      setSelectedProductIds((prev) => prev.filter((id) => validIds.has(id)));
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  }, [ordering]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters]);

  const filteredProducts = useMemo(() => {
    const searchFilter = normalizeText(debouncedFilters.search);
    const categoryFilter = normalizeText(debouncedFilters.category);
    const vendorFilter = normalizeText(debouncedFilters.vendor);

    return products.filter((product) => {
      const sku = normalizeText(product.sku);
      const name = normalizeText(product.name);
      const description = normalizeText(product.description);
      const categoryName = normalizeText(product.category_name);
      const vendorName = normalizeText(product.vendor_name);

      const searchMatch =
        !searchFilter ||
        sku.includes(searchFilter) ||
        name.includes(searchFilter) ||
        description.includes(searchFilter);
      const categoryMatch =
        !categoryFilter || categoryName.includes(categoryFilter);
      const vendorMatch = !vendorFilter || vendorName.includes(vendorFilter);

      return searchMatch && categoryMatch && vendorMatch;
    });
  }, [products, debouncedFilters]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page]);

  useEffect(() => {
    if (totalPages === 0 && page !== 1) {
      setPage(1);
      return;
    }

    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const selectedIdsSet = useMemo(
    () => new Set(selectedProductIds),
    [selectedProductIds]
  );

  const selectedProducts = useMemo(
    () => products.filter((product) => selectedIdsSet.has(product.id)),
    [products, selectedIdsSet]
  );

  const paginatedProductIds = useMemo(
    () => paginatedProducts.map((product) => product.id),
    [paginatedProducts]
  );

  const allVisibleSelected =
    paginatedProductIds.length > 0 &&
    paginatedProductIds.every((id) => selectedIdsSet.has(id));

  const someVisibleSelected =
    paginatedProductIds.some((id) => selectedIdsSet.has(id)) &&
    !allVisibleSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someVisibleSelected;
    }
  }, [someVisibleSelected]);

  function toggleProductSelection(productId, checked) {
    setSelectedProductIds((prev) => {
      if (checked) {
        return prev.includes(productId) ? prev : [...prev, productId];
      }

      return prev.filter((id) => id !== productId);
    });
  }

  function toggleVisibleSelection(checked) {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);

      paginatedProductIds.forEach((id) => {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });

      return Array.from(next);
    });
  }

  async function handleCreate(data) {
    try {
      const res = await adminAPI.createProduct(data);
      showFeedback("success", "Producto creado correctamente.");
      await fetchProducts();
      return res.data;
    } catch (err) {
      console.error("Error creando producto:", err);
      throw err;
    }
  }

  async function handleUpdate(data) {
    try {
      await adminAPI.updateProduct(modal.data.id, data);
      setModal({ type: null, data: null });
      showFeedback("success", "Producto actualizado correctamente.");
      await fetchProducts();
    } catch (err) {
      console.error("Error actualizando producto:", err);
      throw err;
    }
  }

  async function handleDelete() {
    try {
      await adminAPI.deleteProduct(modal.data.id);
      setModal({ type: null, data: null });
      setSelectedProductIds((prev) => prev.filter((id) => id !== modal.data.id));
      showFeedback("success", "Producto eliminado correctamente.");
      await fetchProducts();
    } catch (err) {
      console.error("Error eliminando producto:", err);
      const message =
        err.response?.data?.detail || "No se pudo eliminar el producto.";
      throw new Error(message);
    }
  }

  async function handleBulkDelete() {
    const productsToDelete = Array.isArray(modal.data) ? modal.data : [];

    if (productsToDelete.length === 0) {
      setModal({ type: null, data: null });
      return;
    }

    try {
      const res = await adminAPI.bulkDeleteProducts(
        productsToDelete.map((product) => product.id)
      );

      const deleted = res.data?.deleted || 0;
      const failed = res.data?.failed || [];
      const missing = res.data?.missing || [];
      const failedIds = new Set(failed.map((item) => item.id));
      const attemptedIds = new Set(productsToDelete.map((product) => product.id));

      setModal({ type: null, data: null });
      setSelectedProductIds((prev) =>
        prev.filter((id) => {
          if (!attemptedIds.has(id)) {
            return true;
          }

          return failedIds.has(id);
        })
      );

      await fetchProducts();

      if (failed.length || missing.length) {
        const parts = [];

        if (deleted > 0) {
          parts.push(`Se eliminaron ${deleted} producto${deleted === 1 ? "" : "s"}`);
        }
        if (failed.length > 0) {
          parts.push(`${failed.length} no se pudieron eliminar`);
        }
        if (missing.length > 0) {
          parts.push(`${missing.length} ya no estaban disponibles`);
        }

        showFeedback("error", `${parts.join(". ")}.`);
        return;
      }

      showFeedback(
        "success",
        `Se eliminaron ${deleted} producto${deleted === 1 ? "" : "s"} correctamente.`
      );
    } catch (err) {
      console.error("Error eliminando productos:", err);
      const message =
        err.response?.data?.detail || "No se pudieron eliminar los productos seleccionados.";
      throw new Error(message);
    }
  }

  const columns = [
    {
      key: "select",
      label: (
        <input
          ref={selectAllRef}
          type="checkbox"
          checked={allVisibleSelected}
          onChange={(e) => toggleVisibleSelection(e.target.checked)}
          aria-label="Seleccionar productos visibles"
          className="h-4 w-4 accent-[#002366]"
        />
      ),
      align: "center",
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedIdsSet.has(row.original.id)}
          onChange={(e) =>
            toggleProductSelection(row.original.id, e.target.checked)
          }
          aria-label={`Seleccionar ${row.original.name}`}
          className="h-4 w-4 accent-[#002366]"
        />
      ),
    },
    {
      key: "name",
      label: "Nombre",
      cell: (row) => (
        <div className="font-medium text-[#002366]">{row.original.name}</div>
      ),
    },
    {
      key: "sku",
      label: "SKU",
      cell: (row) => (
        <span className="font-mono text-xs text-[#374151]">
          {row.original.sku || "—"}
        </span>
      ),
    },
    {
      key: "category_name",
      label: "Categoría",
      cell: (row) => (
        <span className="text-[#374151]">
          {row.original.category_name || "—"}
        </span>
      ),
    },
    {
      key: "vendor_name",
      label: "Proveedor",
      cell: (row) => (
        <span className="text-[#374151]">
          {row.original.vendor_name || "—"}
        </span>
      ),
    },
    {
      key: "price",
      label: "Precio",
      cell: (row) => (
        <span className="font-mono text-[#002366]">
          S/ {parseFloat(row.original.price).toFixed(2)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      cell: (row) => (
        <ProductActions
          product={row.original}
          onView={() => setModal({ type: "view", data: row.original })}
          onEdit={() => setModal({ type: "edit", data: row.original })}
          onDelete={() => setModal({ type: "delete", data: row.original })}
        />
      ),
    },
  ];

  if (error && products.length === 0) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="space-y-3 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-[#E5533D]" />
          <p className="text-sm font-medium text-[#374151]">{error}</p>
          <button
            onClick={() => fetchProducts()}
            className="text-sm text-[#002366] underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
            feedback.type === "error"
              ? "border-[#F59E0B]/30 bg-[#FFF7ED]"
              : "border-[#2ECC71]/20 bg-[#2ECC71]/10"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              feedback.type === "error" ? "text-[#B45309]" : "text-[#2ECC71]"
            }`}
          >
            {feedback.message}
          </p>
          <button
            onClick={() => setFeedback(null)}
            className={
              feedback.type === "error"
                ? "text-[#B45309] hover:text-[#92400E]"
                : "text-[#2ECC71] hover:text-[#27AE60]"
            }
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#002366]">
            Productos
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Gestión del catálogo científico
          </p>
        </div>

        <div className="flex gap-3">
          {selectedProducts.length > 0 && (
            <Button
              variant="outline"
              onClick={() =>
                setModal({ type: "delete-multiple", data: selectedProducts })
              }
              className="border-[#E5533D] text-[#E5533D] hover:bg-[#FEF2F2]"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar seleccionados ({selectedProducts.length})
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setModal({ type: "import", data: null })}
            className="text-sm"
          >
            Importar
          </Button>

          <Button
            variant="outline"
            onClick={() => setModal({ type: "export", data: null })}
            className="text-sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>

          <Button
            onClick={() => setModal({ type: "create", data: null })}
            className="rounded-lg bg-[#002366] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#001a4d]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-[#E5E7EB] bg-white p-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#374151]">Buscar</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
            placeholder="Nombre, SKU o descripción"
            className="w-64 rounded-md border border-[#D1D5DB] px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#374151]">Categoría</label>
          <input
            type="text"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            placeholder="Filtrar por categoría"
            className="w-48 rounded-md border border-[#D1D5DB] px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#374151]">Proveedor</label>
          <input
            type="text"
            value={filters.vendor}
            onChange={(e) =>
              setFilters({ ...filters, vendor: e.target.value })
            }
            placeholder="Filtrar por proveedor"
            className="w-48 rounded-md border border-[#D1D5DB] px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#374151]">Ordenar por</label>
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="w-48 rounded-md border border-[#D1D5DB] px-3 py-2 text-sm"
          >
            <option value="-created_at">Más recientes</option>
            <option value="created_at">Más antiguos</option>
            <option value="name">Nombre A-Z</option>
            <option value="-name">Nombre Z-A</option>
            <option value="price">Precio menor</option>
            <option value="-price">Precio mayor</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFilters({ search: "", category: "", vendor: "" });
            }}
            className="text-sm"
          >
            Limpiar
          </Button>

          {selectedProducts.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedProductIds([])}
              className="text-sm"
            >
              Limpiar selección
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-[#002366]" />
          </div>
        )}

        {paginatedProducts.length === 0 ? (
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center">
            <Package className="mx-auto mb-4 h-16 w-16 text-[#E5E7EB]" />
            <p className="text-sm font-medium text-[#6B7280]">
              No hay productos registrados
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Crea uno para comenzar
            </p>
          </div>
        ) : (
          <Table columns={columns} data={paginatedProducts} />
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={(newPage) => setPage(newPage)}
          itemsPerPage={pageSize}
          totalItems={filteredProducts.length}
        />
      )}

      {modal.type === "create" && (
        <ProductForm
          open
          onClose={() => setModal({ type: null, data: null })}
          onSubmit={handleCreate}
        />
      )}

      {modal.type === "edit" && (
        <ProductForm
          open
          initialData={modal.data}
          onClose={() => setModal({ type: null, data: null })}
          onSubmit={handleUpdate}
        />
      )}

      {modal.type === "view" && (
        <ProductDetailModal
          productId={modal.data.id}
          onClose={() => setModal({ type: null, data: null })}
          onSaved={async () => {
            showFeedback("success", "Producto actualizado correctamente.");
            await fetchProducts();
          }}
        />
      )}

      {modal.type === "delete" && (
        <ProductDeleteDialog
          open
          product={modal.data}
          onClose={() => setModal({ type: null, data: null })}
          onDeleted={handleDelete}
        />
      )}

      {modal.type === "delete-multiple" && (
        <ProductDeleteDialog
          open
          products={modal.data}
          onClose={() => setModal({ type: null, data: null })}
          onDeleted={handleBulkDelete}
        />
      )}

      {modal.type === "import" && (
        <ProductImportModal
          open
          onClose={() => setModal({ type: null, data: null })}
          onSuccess={async () => {
            showFeedback("success", "Importación completada correctamente.");
            await fetchProducts();
          }}
        />
      )}

      {modal.type === "export" && (
        <ProductExportModal
          open
          filters={debouncedFilters}
          ordering={ordering}
          onClose={() => setModal({ type: null, data: null })}
          onSuccess={(count) => {
            showFeedback("success", `Exportación completada (${count} productos).`);
          }}
        />
      )}
    </div>
  );
}
