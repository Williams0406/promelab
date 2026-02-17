"use client";

import { useMemo, useState } from "react";
import { adminAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/Modal";
import { Loader2, Upload } from "lucide-react";
import * as XLSX from "xlsx";

const IMPORT_TYPES = [
  { value: "product", label: "Productos" },
  { value: "category", label: "Categorías" },
  { value: "vendor", label: "Proveedores" },
];

const FIELD_OPTIONS = {
  product: [
    "name",
    "description",
    "technical_specs",
    "price",
    "promo_price",
    "category",
    "vendor",
  ],
  category: ["name"],
  vendor: [
    "name",
    "contact_email",
    "phone",
    "is_active",
    ],
};

export default function ProductImportModal({ open, onClose, onSuccess }) {
  const [model, setModel] = useState("product");
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [mapping, setMapping] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const fields = FIELD_OPTIONS[model];

  const mappedCount = useMemo(
    () => Object.values(mapping).filter(Boolean).length,
    [mapping]
  );

  // ===============================
  // Leer archivo
  // ===============================
  async function handleFileChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setError("");
    setResult(null);

    try {
      if (selected.name.endsWith(".csv")) {
        const text = await selected.text();
        const header = text.split("\n")[0];
        const cols = header.split(",").map((c) => c.trim());
        setColumns(cols);
      } else {
        const buffer = await selected.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheet];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const header = rows[0] || [];
        setColumns(header.map((c) => String(c).trim()));
      }

      setMapping({});
      setStep(2);
    } catch (err) {
      console.error(err);
      setError("No se pudo leer el archivo");
    }
  }

  function handleMappingChange(field, column) {
    setMapping((prev) => ({ ...prev, [field]: column }));
  }

  // ===============================
  // Importar
  // ===============================
  async function handleImport() {
    if (!file || mappedCount === 0) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", model);
      formData.append("mapping", JSON.stringify(mapping));

      const res = await adminAPI.importData(formData);

      setResult(res.data);
      setStep(3);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Error importando datos"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Importación Masiva" size="lg">
      <div className="space-y-6">

        {/* STEP INDICATOR */}
        <div className="flex items-center justify-between text-xs text-[#6B7280]">
          <span className={step === 1 ? "font-semibold text-[#002366]" : ""}>
            Paso 1 · Archivo
          </span>
          <span className={step === 2 ? "font-semibold text-[#002366]" : ""}>
            Paso 2 · Mapear
          </span>
          <span className={step === 3 ? "font-semibold text-[#002366]" : ""}>
            Paso 3 · Resultado
          </span>
        </div>

        {/* ===============================
            PASO 1
        =============================== */}
        {step === 1 && (
          <div className="space-y-4">

            <div>
                <label className="text-sm font-medium text-[#374151]">
                    Tipo de importación
                </label>
                <div className="mt-3">
                    <div className="flex w-full rounded-lg border border-[#E5E7EB] overflow-hidden">
                        {IMPORT_TYPES.map((type, index) => {
                        const active = model === type.value;

                        return (
                            <button
                            key={type.value}
                            onClick={() => setModel(type.value)}
                            className={`
                                flex-1 px-4 py-3 text-sm font-semibold transition-all duration-200
                                ${active
                                ? "bg-[#002366] text-white"
                                : "bg-white text-[#374151] hover:bg-[#F3F4F6]"
                                }
                                ${index !== IMPORT_TYPES.length - 1 ? "border-r border-[#E5E7EB]" : ""}
                            `}
                            >
                            {type.label}
                            </button>
                        );
                        })}
                    </div>
                </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#374151]">
                Archivo (.csv o .xlsx)
              </label>
              <Input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                className="mt-2"
              />
            </div>
          </div>
        )}

        {/* ===============================
            PASO 2
        =============================== */}
        {step === 2 && (
          <div className="space-y-4">

            <div className="flex justify-between text-xs text-[#6B7280]">
              <span>
                {mappedCount} de {fields.length} campos asignados
              </span>
              <button
                onClick={() => setStep(1)}
                className="text-[#002366]"
              >
                Cambiar archivo
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((field) => (
                <div key={field} className="flex gap-4 items-center">
                  <div className="w-40 text-sm text-[#374151]">
                    {field}
                  </div>

                  <select
                    value={mapping[field] || ""}
                    onChange={(e) =>
                      handleMappingChange(field, e.target.value)
                    }
                    className="flex-1 border border-[#D1D5DB] rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">No importar</option>
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handleImport}
                disabled={loading}
                className="bg-[#002366] text-white"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Importar
              </Button>
            </div>
          </div>
        )}

        {/* ===============================
            PASO 3
        =============================== */}
        {step === 3 && result && (
          <div className="space-y-4 text-sm">

            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
              <p className="font-semibold">{result.detail}</p>

              {result.created !== undefined && (
                <p>Creado(s): {result.created}</p>
              )}

              {result.updated !== undefined && (
                <p>Actualizado(s): {result.updated}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>

              <Button
                className="bg-[#002366] text-white"
                onClick={() => {
                  setStep(1);
                  setFile(null);
                  setColumns([]);
                  setMapping({});
                  setResult(null);
                }}
              >
                Nueva Importación
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}

      </div>
    </Modal>
  );
}
