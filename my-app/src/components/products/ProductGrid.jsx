import ProductCard from "./ProductCard";
import EmptyState from "@/components/common/EmptyState";

export default function ProductGrid({ products, loading }) {
  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-lg border border-[#E5E7EB] bg-white overflow-hidden"
          >
            <div className="h-48 bg-[#F5F7FA] animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-[#F5F7FA] rounded animate-pulse" />
              <div className="h-3 bg-[#F5F7FA] rounded w-2/3 animate-pulse" />
              <div className="h-8 bg-[#F5F7FA] rounded animate-pulse mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!products?.length) {
    return (
      <EmptyState
        type="products"
        instruction="Intenta ajustar los filtros o realiza una nueva búsqueda."
      />
    );
  }

  // Grid normal
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}