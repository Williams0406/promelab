"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import Link from "next/link";

import { clientAPI } from "@/lib/api";
import OrderTable from "@/components/orders/OrderTable";
import Pagination from "@/components/common/Pagination";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/common/EmptyState";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  async function fetchOrders(pageNumber = page) {
    try {
      const res = await clientAPI.getOrders({
        page: pageNumber,
        page_size: pageSize,
      });

      setOrders(res.data.results);
      setTotalItems(res.data.count);
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchOrders(1);
  }, []);

  if (!orders) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" context="Cargando órdenes..." />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="container mx-auto px-4 py-20">
        <EmptyState
          type="orders"
          instruction="Tus órdenes de compra aparecerán aquí."
          action={
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-[#002366] text-white rounded-lg"
            >
              Explorar productos
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <section className="container mx-auto sm:px-4 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F7FA] border">
          <FileText className="h-5 w-5 text-[#002366]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[#002366]">
            Mis Órdenes
          </h1>
          <p className="text-sm text-[#6B7280]">
            {totalItems} órdenes registradas
          </p>
        </div>
      </div>

      <OrderTable orders={orders} />

      <Pagination
        page={page}
        totalPages={Math.ceil(totalItems / pageSize)}
        onChange={(newPage) => fetchOrders(newPage)}
        itemsPerPage={pageSize}
        totalItems={totalItems}
      />
    </section>
  );
}
