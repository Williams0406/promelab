"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SalesChart({ data }) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-6">
      {/* Header sin emoji — título funcional */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[#002366]">
          Ventas últimos 7 días
        </h2>
        <p className="text-xs text-[#6B7280] mt-1">
          Solo órdenes con estado DELIVERED
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          {/* Grid clínico */}
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#E5E7EB"
            vertical={false}
          />
          
          {/* Ejes con colores sistema */}
          <XAxis 
            dataKey="date" 
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={{ stroke: "#E5E7EB" }}
          />
          <YAxis 
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={{ stroke: "#E5E7EB" }}
          />
          
          {/* Tooltip sobrio */}
          <Tooltip 
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#374151", fontWeight: 600 }}
          />
          
          {/* Línea con color PROMELAB */}
          <Line
            type="monotone"
            dataKey="total"
            stroke="#002366" // Azul Abisal
            strokeWidth={2.5}
            dot={{ 
              fill: "#002366", 
              r: 4,
              strokeWidth: 2,
              stroke: "#FFFFFF"
            }}
            activeDot={{ 
              r: 6,
              fill: "#00A8CC" // Cian interactivo
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}