import { Suspense } from "react";
import Spinner from "@/components/ui/Spinner";
import ProductsClient from "./ProductsClient";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" context="Cargando productos..." />
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
