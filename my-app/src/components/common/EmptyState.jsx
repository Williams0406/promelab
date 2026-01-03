import { Package, Search, FileText, AlertCircle } from "lucide-react";

const EMPTY_STATE_TYPES = {
  products: {
    icon: Package,
    title: "No hay productos",
    description: "No se encontraron productos que coincidan con los filtros aplicados.",
  },
  search: {
    icon: Search,
    title: "Sin resultados",
    description: "No se encontraron coincidencias. Intenta ajustar los términos de búsqueda.",
  },
  orders: {
    icon: FileText,
    title: "No hay órdenes",
    description: "Aún no se han registrado órdenes en el sistema.",
  },
  default: {
    icon: AlertCircle,
    title: "Sin información",
    description: "No hay datos disponibles para mostrar en este momento.",
  },
};

export default function EmptyState({
  type = "default", // "products" | "search" | "orders" | "default"
  title,
  description,
  action,
  instruction, // Texto de instrucción clara
}) {
  const config = EMPTY_STATE_TYPES[type] || EMPTY_STATE_TYPES.default;
  const Icon = config.icon;

  const displayTitle = title || config.title;
  const displayDescription = description || config.description;

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-[#E5E7EB] bg-white p-12 text-center">
      
      {/* Ícono funcional — NO emoji decorativo */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F7FA] border border-[#E5E7EB]">
        <Icon className="h-8 w-8 text-[#6B7280]" />
      </div>

      {/* Título claro */}
      <h3 className="text-base font-semibold text-[#002366] mb-2">
        {displayTitle}
      </h3>

      {/* Descripción funcional */}
      <p className="max-w-md text-sm text-[#6B7280] leading-relaxed mb-1">
        {displayDescription}
      </p>

      {/* Instrucción explícita (clave UX) */}
      {instruction && (
        <p className="max-w-md text-sm text-[#374151] font-medium mt-3">
          {instruction}
        </p>
      )}

      {/* Acción (si existe) */}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}