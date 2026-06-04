"use client";

import { useCallback, useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import CartTable from "@/components/cart/CartTable";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, AlertCircle } from "lucide-react";

export default function AdminCartsPage() {
  const { isStaff, loading: authLoading } = useAuth();

  const [carts, setCarts] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCarts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await adminAPI.getCarts({ page, page_size: pageSize });
      setCarts(res.data.results || []);
      setPagination({
        count: res.data.count || 0,
        next: res.data.next,
        previous: res.data.previous,
      });
    } catch (err) {
      console.error("Error cargando carritos:", err);
      setError("No se pudieron cargar los carritos");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    if (!authLoading) {
      if (!isStaff) {
        window.location.href = "/";
      } else {
        fetchCarts();
      }
    }
  }, [authLoading, isStaff, fetchCarts]);

  // 🔬 LOADING CLÍNICO
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-3">
          <Loader2 className="h-7 w-7 animate-spin text-[#002366] mx-auto" />
          <p className="text-sm text-[#6B7280] font-medium">
            Cargando carritos
          </p>
        </div>
      </div>
    );
  }

  // 🔬 ERROR STATE
  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-3">
          <AlertCircle className="h-12 w-12 text-[#E5533D] mx-auto" />
          <p className="text-sm text-[#374151] font-medium">{error}</p>
          <button
            onClick={fetchCarts}
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
      {/* 🔬 HEADER CONSISTENTE */}
      <div className="pb-4 border-b border-[#E5E7EB]">
        <h1 className="text-xl font-semibold text-[#002366] tracking-tight">
          Carritos
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Gestión de carritos activos y abandonados
        </p>
      </div>

      <CartTable
        carts={carts}
        onRefresh={fetchCarts}
        page={page}
        pageSize={pageSize}
        pagination={pagination}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}
