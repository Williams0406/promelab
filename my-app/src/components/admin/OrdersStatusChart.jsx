"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Colores semánticos PROMELAB
const STATUS_COLORS = {
  CREATED: "#6B7280",    // Gris — pendiente
  PAID: "#00A8CC",       // Cian — en proceso
  PREPARING: "#F59E0B",  // Amarillo — atención
  SHIPPED: "#2ECC71",    // Verde — positivo
  DELIVERED: "#2ECC71",  // Verde — completado
  CANCELLED: "#E5533D",  // Rojo — error
};

const STATUS_LABELS = {
  CREATED: "Creadas",
  PAID: "Pagadas",
  PREPARING: "Preparando",
  SHIPPED: "Enviadas",
  DELIVERED: "Entregadas",
  CANCELLED: "Canceladas",
};

export default function OrdersStatusChart({ data }) {
  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0) // Solo estados con datos
    .map(([key, value]) => ({
      name: STATUS_LABELS[key] || key,
      value,
      status: key,
    }));

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-6">
      {/* Header funcional */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[#002366]">
          Órdenes por estado
        </h2>
        <p className="text-xs text-[#6B7280] mt-1">
          Total: {Object.values(data).reduce((a, b) => a + b, 0)} órdenes
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) => 
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            labelLine={{ stroke: "#E5E7EB" }}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={STATUS_COLORS[entry.status] || "#6B7280"}
              />
            ))}
          </Pie>
          
          {/* Tooltip sobrio */}
          <Tooltip 
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />

          {/* Leyenda funcional */}
          <Legend 
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "12px", color: "#374151" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}