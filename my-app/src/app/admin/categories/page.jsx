import CategoryTree from "@/components/categories/CategoryTree";

export const metadata = {
  title: "Categorías | Admin PROMELAB",
  description: "Gestión de jerarquía de categorías",
};

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      {/* 🔬 HEADER CONSISTENTE */}
      <div className="pb-4 border-b border-[#E5E7EB]">
        <h1 className="text-xl font-semibold text-[#002366] tracking-tight">
          Categorías
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Jerarquía y organización del catálogo
        </p>
      </div>

      {/* 🔬 COMPONENTE */}
      <CategoryTree />
    </div>
  );
}