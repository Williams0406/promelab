export default function Spinner({ size = "md", context }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-[#E5E7EB] border-t-[#002366]`}
        role="status"
        aria-label="Cargando"
      />
      {context && (
        <p className="text-sm font-medium text-[#6B7280]">
          {context}
        </p>
      )}
    </div>
  );
}