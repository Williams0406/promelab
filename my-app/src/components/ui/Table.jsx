"use client";

import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

export default function Table({ columns, data }) {
  const tableColumns = columns.map((col) => ({
    accessorKey: col.key,
    header: col.label,
    cell: col.cell
      ? (info) => col.cell(info.row)
      : (info) => info.getValue(),
    meta: {
      align: col.align || "left", // left | center | right
    },
  }));

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center">
        <p className="text-sm text-[#6B7280]">
          No hay datos para mostrar
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[#E5E7EB] bg-white">
      <table className="w-full text-sm">
        
        {/* THEAD */}
        <thead className="bg-[#F5F7FA] border-b border-[#E5E7EB]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const align = header.column.columnDef.meta?.align || "left";
                return (
                  <th
                    key={header.id}
                    className={`px-4 py-3 font-semibold text-[#374151] ${
                      align === "right" ? "text-right" :
                      align === "center" ? "text-center" :
                      "text-left"
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        {/* TBODY */}
        <tbody>
          {table.getRowModel().rows.map((row, rowIndex) => (
            <tr
              key={row.id}
              className={`${
                rowIndex !== table.getRowModel().rows.length - 1
                  ? "border-b border-[#E5E7EB]"
                  : ""
              } hover:bg-[#F5F7FA] transition-colors duration-150`}
            >
              {row.getVisibleCells().map((cell) => {
                const align = cell.column.columnDef.meta?.align || "left";
                return (
                  <td
                    key={cell.id}
                    className={`px-4 py-3 text-[#374151] ${
                      align === "right" ? "text-right" :
                      align === "center" ? "text-center" :
                      "text-left"
                    }`}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}