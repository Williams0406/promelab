"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

export default function TechnicalSpecsEditor({
  value = {},
  disabled = false,
  onChange,
}) {
  const [rows, setRows] = useState([]);

  // Sincronizar JSON → filas editables
  useEffect(() => {
    const initial = Object.entries(value).map(([key, val]) => ({
      key,
      value: val,
    }));
    setRows(initial);
  }, [value]);

  const syncToParent = (updatedRows) => {
    const json = {};
    updatedRows.forEach((item) => {
      if (item.key.trim() !== "") {
        json[item.key] = item.value;
      }
    });
    onChange(json);
  };

  const handleChange = (index, field, newValue) => {
    const updated = [...rows];
    updated[index] = {
      ...updated[index],
      [field]: newValue,
    };
    setRows(updated);
    syncToParent(updated);
  };

  const addRow = () => {
    setRows([...rows, { key: "", value: "" }]);
  };

  const removeRow = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
    syncToParent(updated);
  };

  return (
    <div className="space-y-4">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-[#002366]">
          Especificaciones técnicas
        </label>

        {!disabled && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={addRow}
            className="text-[#00A8CC] hover:bg-[#F0F9FF]"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Agregar
          </Button>
        )}
      </div>

      {/* EMPTY STATE */}
      {rows.length === 0 && (
        <div className="rounded-lg bg-[#F5F7FA] border border-[#E5E7EB] p-4 text-center">
          <p className="text-sm text-[#6B7280]">
            No hay especificaciones técnicas agregadas
          </p>
        </div>
      )}

      {/* ROWS */}
      <div className="space-y-3">
        {rows.map((spec, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_1fr_auto] gap-3 items-start"
          >
            {/* Campo (key) */}
            <div>
              {index === 0 && (
                <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-2">
                  Campo
                </label>
              )}
              <Input
                placeholder="Ej: Procesador"
                value={spec.key}
                disabled={disabled}
                onChange={(e) =>
                  handleChange(index, "key", e.target.value)
                }
                className="h-9 border-[#E5E7EB]"
              />
            </div>

            {/* Valor (value) */}
            <div>
              {index === 0 && (
                <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-2">
                  Valor
                </label>
              )}
              <Input
                placeholder="Ej: Intel Core i7"
                value={spec.value}
                disabled={disabled}
                onChange={(e) =>
                  handleChange(index, "value", e.target.value)
                }
                className="h-9 border-[#E5E7EB]"
              />
            </div>

            {/* Botón eliminar */}
            <div>
              {index === 0 && !disabled && (
                <div className="h-[22px] mb-2" /> 
              )}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-[#E5533D] hover:bg-[#FEF2F2] transition-colors duration-150"
                  title="Eliminar especificación"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}