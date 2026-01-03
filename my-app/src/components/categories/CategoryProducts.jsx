import { Package } from "lucide-react";

export default function CategoryProducts({ products }) {
  const safeProducts = Array.isArray(products)
    ? products
    : products?.results || [];

  if (safeProducts.length === 0) {
    return (
      <div className="rounded-lg bg-[#F5F7FA] border border-[#E5E7EB] p-4 text-center">
        <Package className="h-6 w-6 text-[#6B7280] mx-auto mb-2" />
        <p className="text-sm text-[#6B7280]">
          No hay productos en esta categoría
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide">
        Productos ({safeProducts.length})
      </p>

      <ul className="space-y-1.5">
        {safeProducts.map((product) => (
          <li
            key={product.id}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#00A8CC] transition-colors duration-150"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#F5F7FA]">
              <Package className="h-3.5 w-3.5 text-[#6B7280]" />
            </div>
            <span className="text-sm text-[#374151] flex-1 truncate">
              {product.name}
            </span>
            {product.stock !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  product.stock > 0
                    ? "bg-[#E6F4F1] text-[#0F766E]"
                    : "bg-[#FEF2F2] text-[#E5533D]"
                }`}
              >
                Stock: {product.stock}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
