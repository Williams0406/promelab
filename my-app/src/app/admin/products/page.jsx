"use client";

import { useEffect, useMemo, useState } from "react";
import Table from "@/components/ui/Table";
import { Button } from "@/components/ui/button";
import { adminAPI } from "@/lib/api";
import ProductActions from "@/components/products/ProductActions";
import ProductForm from "@/components/products/ProductForm";
import ProductDetailModal from "@/components/products/ProductDetailModal";
import ProductDeleteDialog from "@/components/products/ProductDeleteDialog";
import Pagination from "@/components/common/Pagination";
import { Loader2, AlertCircle, Plus, Package, Download } from "lucide-react";
import ProductImportModal from "@/components/products/ProductImportModal";
import ProductExportModal from "@/components/products/ProductExportModal";

export default function AdminProductsPage() {
  // 🔬 ESTADO ORGANIZADO
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔬 PAGINACIÓN
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // 🔬 MODALES (solo uno activo a la vez)
  const [modal, setModal] = useState({
    type: null, // 'create' | 'edit' | 'view' | 'delete' | 'import' | 'export'
    data: null,
  });

  // 🔬 FEEDBACK
  const [successMessage, setSuccessMessage] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    vendor: "",
  });
  const debouncedFilters = useDebounce(filters, 400);
  const [ordering, setOrdering] = useState("-created_at");

  // 🔬 FETCH PRODUCTOS
  async function fetchProducts() {
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
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [ordering]);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters]);

  // 🔬 HANDLERS CON FEEDBACK
  async function handleCreate(data) {
    try {
      const res = await adminAPI.createProduct(data);
      showSuccess("Producto creado correctamente");
      fetchProducts();
      return res.data;
    } catch (err) {
      console.error("Error creando producto:", err);
      throw err; // El form manejará el error
    }
  }

  async function handleUpdate(data) {
    try {
      await adminAPI.updateProduct(modal.data.id, data);
      setModal({ type: null, data: null });
      showSuccess("Producto actualizado correctamente");
      fetchProducts();
    } catch (err) {
      console.error("Error actualizando producto:", err);
      throw err;
    }
  }

  async function handleDelete() {
    try {
      await adminAPI.deleteProduct(modal.data.id);
      setModal({ type: null, data: null });
      showSuccess("Producto eliminado correctamente");
      fetchProducts();
    } catch (err) {
      console.error("Error eliminando producto:", err);
      const message =
        err.response?.data?.detail || "No se pudo eliminar el producto";
      throw new Error(message);
    }
  }

  // 🔬 HELPER: MOSTRAR ÉXITO
  function showSuccess(message) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  }
  

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

  const filteredProducts = useMemo(() => {
    const searchFilter = normalizeText(debouncedFilters.search);
    const categoryFilter = normalizeText(debouncedFilters.category);
    const vendorFilter = normalizeText(debouncedFilters.vendor);

    return products.filter((product) => {
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
  }, [products, debouncedFilters]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page, pageSize]);

  useEffect(() => {
    if (totalPages === 0 && page !== 1) {
      setPage(1);
      return;
    }

    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // 🔬 COLUMNAS CON JERARQUÍA
  const columns = [
    {
      key: "name",
      label: "Nombre",
      cell: (row) => (
        <div className="font-medium text-[#002366]">{row.original.name}</div>
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

  // 🔬 ERROR STATE
  if (error && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-3">
          <AlertCircle className="h-12 w-12 text-[#E5533D] mx-auto" />
          <p className="text-sm text-[#374151] font-medium">{error}</p>
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
      {/* 🔬 SUCCESS MESSAGE */}
      {successMessage && (
        <div className="bg-[#2ECC71]/10 border border-[#2ECC71]/20 rounded-lg px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-[#2ECC71] font-medium">
            {successMessage}
          </p>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-[#2ECC71] hover:text-[#27AE60]"
          >
            ×
          </button>
        </div>
      )}

      {/* 🔬 HEADER CONSISTENTE */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl font-semibold text-[#002366] tracking-tight">
            Productos
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Gestión del catálogo científico
          </p>
        </div>

        <div className="flex gap-3">

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
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>

          <Button
            onClick={() => setModal({ type: "create", data: null })}
            className="bg-[#002366] hover:bg-[#001a4d] text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors duration-150"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>

        </div>
      </div>

      {/* 🔬 FILTROS */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 flex flex-wrap gap-4 items-end">

        {/* Buscar */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#374151]">
            Buscar
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
            placeholder="Nombre del producto"
            className="border border-[#D1D5DB] rounded-md px-3 py-2 text-sm w-64"
          />
        </div>

        {/* Categoría */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#374151]">
            Categoría
          </label>
          <input
            type="text"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            placeholder="Filtrar por nombre de categoría"
            className="border border-[#D1D5DB] rounded-md px-3 py-2 text-sm w-48"
          />
        </div>

        {/* Proveedor */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#374151]">
            Proveedor
          </label>
          <input
            type="text"
            value={filters.vendor}
            onChange={(e) =>
              setFilters({ ...filters, vendor: e.target.value })
            }
            placeholder="ID o nombre"
            className="border border-[#D1D5DB] rounded-md px-3 py-2 text-sm w-48"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#374151]">
            Ordenar por
          </label>
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="border border-[#D1D5DB] rounded-md px-3 py-2 text-sm w-48"
          >
            <option value="-created_at">Más recientes</option>
            <option value="created_at">Más antiguos</option>
            <option value="name">Nombre A–Z</option>
            <option value="-name">Nombre Z–A</option>
            <option value="price">Precio menor</option>
            <option value="-price">Precio mayor</option>
          </select>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">

          <Button
            type="button"   // 🔥 CLAVE
            variant="outline"
            onClick={() => {
              const reset = { search: "", category: "", vendor: "" };
              setFilters(reset);
            }}
            className="text-sm"
          >
            Limpiar
          </Button>
        </div>
      </div>

      {/* 🔬 TABLA CON LOADING INLINE */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-6 w-6 animate-spin text-[#002366]" />
          </div>
        )}

        {paginatedProducts.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center">
            <Package className="h-16 w-16 text-[#E5E7EB] mx-auto mb-4" />
            <p className="text-sm text-[#6B7280] font-medium">
              No hay productos registrados
            </p>
            <p className="text-xs text-[#6B7280] mt-1">
              Crea uno para comenzar
            </p>
          </div>
        ) : (
          <Table columns={columns} data={paginatedProducts} />
        )}
      </div>

      {/* 🔬 PAGINACIÓN */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={(newPage) => setPage(newPage)}
          itemsPerPage={pageSize}
          totalItems={filteredProducts.length}
        />
      )}

      {/* 🔬 MODALES (SOLO UNO ACTIVO) */}
      {/* CREAR */}
      {modal.type === "create" && (
        <ProductForm
          open={true}
          onClose={() => setModal({ type: null, data: null })}
          onSubmit={handleCreate}
        />
      )}

      {/* EDITAR */}
      {modal.type === "edit" && (
        <ProductForm
          open={true}
          initialData={modal.data}
          onClose={() => setModal({ type: null, data: null })}
          onSubmit={handleUpdate}
        />
      )}

      {/* VER DETALLE */}
      {modal.type === "view" && (
        <ProductDetailModal
          productId={modal.data.id}
          onClose={() => setModal({ type: null, data: null })}
        />
      )}

      {/* ELIMINAR */}
      {modal.type === "delete" && (
        <ProductDeleteDialog
          open={true}
          product={modal.data}
          onClose={() => setModal({ type: null, data: null })}
          onDeleted={handleDelete}
        />
      )}

      {modal.type === "import" && (
        <ProductImportModal
          open={true}
          onClose={() => setModal({ type: null, data: null })}
          onSuccess={() => {
            showSuccess("Importación completada correctamente");
            fetchProducts();
          }}
        />
      )}

      {modal.type === "export" && (
        <ProductExportModal
          open={true}
          filters={debouncedFilters}
          ordering={ordering}
          onClose={() => setModal({ type: null, data: null })}
          onSuccess={(count) => {
            showSuccess(`Exportación completada (${count} productos)`);
          }}
        />
      )}
    </div>
  );
}