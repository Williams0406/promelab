"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import OrdersTable from "@/components/orders/OrdersTable";
import Pagination from "@/components/common/Pagination";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, AlertCircle } from "lucide-react";

export default function AdminOrdersPage() {
  const { isStaff, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const PAGE_SIZE = 10;

  // 🔬 FETCH ÚNICO Y EFICIENTE
  const fetchOrders = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await adminAPI.getOrders({ page: pageNumber });
      setOrders(res.data.results || []);
      setCount(res.data.count || 0);
      setPage(pageNumber);
    } catch (err) {
      console.error("Error cargando órdenes:", err);
      setError("No se pudieron cargar las órdenes");
    } finally {
      setLoading(false);
    }
  };

  // 🔒 PROTECCIÓN DE RUTA (mejorada)
  useEffect(() => {
    if (!authLoading) {
      if (!isStaff) {
        window.location.href = "/";
      } else {
        fetchOrders(1);
      }
    }
  }, [authLoading, isStaff]);

  // 🔬 LOADING CLÍNICO
  if (authLoading || (loading && page === 1)) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-3">
          <Loader2 className="h-7 w-7 animate-spin text-[#002366] mx-auto" />
          <p className="text-sm text-[#6B7280] font-medium">
            Cargando órdenes
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
            onClick={() => fetchOrders(page)}
            className="text-sm text-[#002366] underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* 🔬 HEADER CONSISTENTE */}
      <div className="pb-4 border-b border-[#E5E7EB]">
        <h1 className="text-xl font-semibold text-[#002366] tracking-tight">
          Órdenes
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Gestión de pedidos de clientes
        </p>
      </div>

      {/* 🔬 TABLA CON LOADING INLINE */}
      <div className="relative">
        {loading && page > 1 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-6 w-6 animate-spin text-[#002366]" />
          </div>
        )}

        <OrdersTable orders={orders} onRefresh={() => fetchOrders(page)} />
      </div>

      {/* 🔬 PAGINACIÓN */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          itemsPerPage={PAGE_SIZE}
          totalItems={count}
          onChange={(newPage) => fetchOrders(newPage)}
        />
      )}
    </div>
  );
}