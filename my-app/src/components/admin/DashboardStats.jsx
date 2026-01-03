export default function DashboardStats({ stats }) {
  const cards = [
    { 
      label: "Ventas totales", 
      value: `S/ ${stats.revenue.toLocaleString('es-PE')}`, 
      trend: "+12% vs mes anterior" 
    },
    { 
      label: "Órdenes", 
      value: stats.orders.toLocaleString('es-PE'),
      trend: `${stats.orders_today} hoy`
    },
    { 
      label: "Productos", 
      value: stats.products.toLocaleString('es-PE'),
      trend: `${stats.products_active} activos`
    },
    { 
      label: "Clientes", 
      value: stats.clients.toLocaleString('es-PE'),
      trend: `${stats.clients_new} nuevos`
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-[#E5E7EB] bg-white p-6 hover:border-[#00A8CC] transition-colors duration-150"
        >
          {/* Label funcional */}
          <p className="text-sm font-medium text-[#6B7280]">
            {card.label}
          </p>
          
          {/* Valor protagonista — números claros */}
          <p className="mt-3 text-2xl font-semibold text-[#002366] tracking-tight">
            {card.value}
          </p>

          {/* Contexto adicional */}
          {card.trend && (
            <p className="mt-2 text-xs text-[#6B7280]">
              {card.trend}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}