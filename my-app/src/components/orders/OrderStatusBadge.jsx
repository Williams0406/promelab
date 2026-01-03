const ORDER_STATUS_CONFIG = {
  CREATED: {
    label: "Creada",
    color: "text-[#6B7280]",
    bg: "bg-[#F5F7FA]",
    dot: "bg-[#6B7280]",
  },
  PAID: {
    label: "Pagada",
    color: "text-[#0F766E]",
    bg: "bg-[#E6F4F1]",
    dot: "bg-[#00A8CC]",
  },
  PREPARING: {
    label: "Preparando",
    color: "text-[#D97706]",
    bg: "bg-[#FFFBEB]",
    dot: "bg-[#F59E0B]",
  },
  SHIPPED: {
    label: "Enviada",
    color: "text-[#0F766E]",
    bg: "bg-[#E0F2FE]",
    dot: "bg-[#00A8CC]",
  },
  DELIVERED: {
    label: "Entregada",
    color: "text-[#0F766E]",
    bg: "bg-[#E6F4F1]",
    dot: "bg-[#2ECC71]",
  },
  CANCELLED: {
    label: "Cancelada",
    color: "text-[#E5533D]",
    bg: "bg-[#FEF2F2]",
    dot: "bg-[#E5533D]",
  },
};

export default function OrderStatusBadge({ status }) {
  const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.CREATED;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
