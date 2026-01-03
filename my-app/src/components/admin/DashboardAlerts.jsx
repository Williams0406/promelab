import { AlertTriangle, Package, ShoppingCart } from "lucide-react";

export default function DashboardAlerts({ products, orders, cart }) {
  const alerts = [];

  // Construcción de alertas con prioridad semántica
  if (products.out_of_stock > 0) {
    alerts.push({
      icon: Package,
      severity: "error", // Crítico
      color: "text-[#E5533D]",
      bgColor: "bg-[#FEF2F2]",
      text: `${products.out_of_stock} productos sin stock`,
      action: "Revisar inventario",
    });
  }

  if (orders.by_status?.CREATED > 5) {
    alerts.push({
      icon: AlertTriangle,
      severity: "warning", // Atención
      color: "text-[#F59E0B]",
      bgColor: "bg-[#FFFBEB]",
      text: `${orders.by_status.CREATED} órdenes sin procesar`,
      action: "Ver órdenes",
    });
  }

  if (cart.abandoned_carts > 0) {
    alerts.push({
      icon: ShoppingCart,
      severity: "info", // Informativo
      color: "text-[#00A8CC]",
      bgColor: "bg-[#F0F9FF]",
      text: `${cart.abandoned_carts} carritos abandonados`,
      action: "Ver análisis",
    });
  }

  if (!alerts.length) {
    // Estado positivo explícito
    return (
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F4F1]">
            <svg className="h-5 w-5 text-[#2ECC71]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#002366]">
              Sin alertas pendientes
            </p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Operaciones en estado óptimo
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-6">
      {/* Header sin emoji */}
      <h2 className="text-base font-semibold text-[#002366] mb-4">
        Alertas operativas
      </h2>

      {/* Lista de alertas — Estados claros */}
      <ul className="space-y-3">
        {alerts.map((alert, i) => {
          const Icon = alert.icon;
          return (
            <li 
              key={i} 
              className={`flex items-center justify-between gap-3 p-3 rounded-lg ${alert.bgColor} border border-transparent hover:border-current transition-colors duration-150`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${alert.color} shrink-0`} />
                <span className="text-sm font-medium text-[#374151]">
                  {alert.text}
                </span>
              </div>
              
              {/* Acción rápida */}
              <button className="text-xs font-medium text-[#002366] hover:text-[#00A8CC] transition-colors duration-150">
                {alert.action} →
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
