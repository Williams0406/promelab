import { Card, CardContent } from "@/components/ui/card";

export default function DashboardCard({ title, value, subtitle }) {
  return (
    <Card className="rounded-lg border-[#E5E7EB] shadow-sm bg-white">
      <CardContent className="p-6">
        {/* Label superior — clara y directa */}
        <p className="text-sm font-medium text-[#6B7280]">{title}</p>
        
        {/* Valor protagonista — Inter para números */}
        <h2 className="text-3xl font-semibold text-[#002366] mt-2 tracking-tight">
          {value}
        </h2>
        
        {/* Subtítulo contextual */}
        {subtitle && (
          <p className="text-xs text-[#6B7280] mt-2">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}