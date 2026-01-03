"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { publicAPI } from "@/lib/api";
import { Package } from "lucide-react";

import ProductGrid from "@/components/products/ProductGrid";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/common/EmptyState";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setLoading(true);

    publicAPI
      .getProducts({
        ...(category ? { category } : {}),
        ...(search ? { search } : {}),
        page,
      })
      .then((res) => {
        const data = res.data;
        setProducts(data.results || []);
        setTotalItems(data.count || 0);
        setTotalPages(Math.ceil((data.count || 0) / ITEMS_PER_PAGE));
      })
      .catch(() => {
        setProducts([]);
        setTotalItems(0);
        setTotalPages(1);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, search, page]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" context="Cargando productos..." />
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="container mx-auto px-4 py-20">
        <EmptyState
          type="products"
          instruction="Intenta ajustar los filtros o explora otras categorías."
          action={
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-[#002366] text-white text-sm font-medium rounded-lg hover:bg-[#003380] transition-colors duration-150"
            >
              Ver todos los productos
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <section className="container mx-auto sm:px-4 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F7FA] border border-[#E5E7EB]">
            <Package className="h-5 w-5 text-[#002366]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[#002366]">
              {category ? "Productos por categoría" : "Catálogo de Productos"}
            </h1>
            <p className="text-sm text-[#6B7280] mt-0.5">
              {products.length}{" "}
              {products.length === 1 ? "producto" : "productos"} disponibles
            </p>
          </div>
        </div>
      </div>

      <ProductGrid products={products} loading={loading} />

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={setPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={totalItems}
      />
    </section>
  );
}
