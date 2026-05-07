"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Loader2, Upload } from "lucide-react";

import { adminAPI } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const IMPORT_TYPES = [
  { value: "product", label: "Productos" },
  { value: "category", label: "Categorias" },
  { value: "vendor", label: "Proveedores" },
];

const FIELD_OPTIONS = {
  product: [
    "name",
    "sku",
    "description",
    "technical_specs",
    "price",
    "promo_price",
    "category",
    "vendor",
  ],
  category: ["name"],
  vendor: ["name", "contact_email", "phone", "is_active"],
};

const REFERENCE_CONFIG = {
  product: {
    field: "sku",
    label: "SKU",
    description:
      "Si un producto ya existe con ese SKU, se actualiza. Si no existe, se crea uno nuevo.",
  },
  category: {
    field: "name",
    label: "Nombre",
    description:
      "Las categorias se identifican por nombre para evitar duplicados al importar.",
  },
  vendor: {
    field: "name",
    label: "Nombre",
    description:
      "Los proveedores se identifican por nombre para crear o actualizar registros.",
  },
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
  const referenceInfo = REFERENCE_CONFIG[model];
  const referenceColumn = (mapping[referenceInfo.field] || "").trim();
  const isReferenceMapped = Boolean(referenceColumn);

  const mappedCount = useMemo(
    () => Object.values(mapping).filter(Boolean).length,
    [mapping]
  );

  const canImport = Boolean(file) && mappedCount > 0 && isReferenceMapped && !loading;

  function resetFlow(nextModel = model) {
    setModel(nextModel);
    setFile(null);
    setColumns([]);
    setMapping({});
    setStep(1);
    setLoading(false);
    setError("");
    setResult(null);
  }

  async function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setError("");
    setResult(null);

    try {
      if (selected.name.endsWith(".csv")) {
        const text = await selected.text();
        const header = text.split("\n")[0] || "";
        const cols = header.split(",").map((column) => column.trim());
        setColumns(cols.filter(Boolean));
      } else {
        const buffer = await selected.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheet];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const header = rows[0] || [];
        setColumns(
          header.map((column) => String(column).trim()).filter(Boolean)
        );
      }

      setMapping({});
      setStep(2);
    } catch (err) {
      console.error(err);
      setError("No se pudo leer el archivo.");
    }
  }

  function handleMappingChange(field, column) {
    setMapping((prev) => ({ ...prev, [field]: column }));
  }

  async function handleImport() {
    if (!file) {
      setError("Selecciona un archivo antes de importar.");
      return;
    }

    if (!isReferenceMapped) {
      setError(
        `Debes asignar una columna para ${referenceInfo.label} antes de importar.`
      );
      return;
    }

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
      setError(err.response?.data?.detail || "Error importando datos.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Importacion masiva" size="lg">
      <div className="space-y-6">
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

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#374151]">
                Tipo de importacion
              </label>

              <div className="mt-3">
                <div className="flex w-full overflow-hidden rounded-lg border border-[#E5E7EB]">
                  {IMPORT_TYPES.map((type, index) => {
                    const active = model === type.value;

                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => resetFlow(type.value)}
                        className={[
                          "flex-1 px-4 py-3 text-sm font-semibold transition-all duration-200",
                          active
                            ? "bg-[#002366] text-white"
                            : "bg-white text-[#374151] hover:bg-[#F3F4F6]",
                          index !== IMPORT_TYPES.length - 1
                            ? "border-r border-[#E5E7EB]"
                            : "",
                        ].join(" ")}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#D7E3F8] bg-[#F5F8FF] p-4">
              <p className="text-sm font-semibold text-[#002366]">
                Campo de referencia: {referenceInfo.label}
              </p>
              <p className="mt-1 text-sm text-[#4B5563]">
                {referenceInfo.description}
              </p>
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

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-[#6B7280]">
              <span>
                {mappedCount} de {fields.length} campos asignados
              </span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="font-medium text-[#002366]"
              >
                Cambiar archivo
              </button>
            </div>

            <div
              className={[
                "rounded-xl border p-4",
                isReferenceMapped
                  ? "border-[#D7E3F8] bg-[#F5F8FF]"
                  : "border-[#F3C7C7] bg-[#FFF7F7]",
              ].join(" ")}
            >
              <p className="text-sm font-semibold text-[#002366]">
                Referencia usada para crear o actualizar: {referenceInfo.label}
              </p>
              <p className="mt-1 text-sm text-[#4B5563]">
                {isReferenceMapped
                  ? `Columna seleccionada: ${referenceColumn}`
                  : `Aun no asignaste una columna para ${referenceInfo.label}.`}
              </p>
              {model === "product" && (
                <p className="mt-2 text-xs text-[#6B7280]">
                  Recomendacion: mapea tambien el campo <strong>name</strong> si
                  quieres crear productos nuevos cuando el SKU no exista.
                </p>
              )}
            </div>

            <div className="space-y-3">
              {fields.map((field) => {
                const isReferenceField = field === referenceInfo.field;

                return (
                  <div key={field} className="flex items-center gap-4">
                    <div className="w-40 text-sm font-medium text-[#374151]">
                      <span>{field}</span>
                      {isReferenceField && (
                        <span className="ml-2 rounded-full bg-[#DCE8FF] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#002366]">
                          Referencia
                        </span>
                      )}
                    </div>

                    <select
                      value={mapping[field] || ""}
                      onChange={(e) =>
                        handleMappingChange(field, e.target.value)
                      }
                      className="flex-1 rounded-md border border-[#D1D5DB] px-3 py-2 text-sm"
                    >
                      <option value="">No importar</option>
                      {columns.map((column) => (
                        <option key={column} value={column}>
                          {column}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end border-t pt-4">
              <Button
                type="button"
                onClick={handleImport}
                disabled={!canImport}
                className="bg-[#002366] text-white hover:bg-[#001A4D] disabled:bg-[#002366] disabled:text-white disabled:opacity-100"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Importar
              </Button>
            </div>
          </div>
        )}

        {step === 3 && result && (
          <div className="space-y-4 text-sm">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
              <p className="font-semibold">{result.detail}</p>
              <p className="mt-1">
                Campo de referencia usado:{" "}
                {result.reference_label || referenceInfo.label}
              </p>

              {result.created !== undefined && <p>Creado(s): {result.created}</p>}
              {result.updated !== undefined && (
                <p>Actualizado(s): {result.updated}</p>
              )}
              {result.skipped !== undefined && <p>Omitido(s): {result.skipped}</p>}
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cerrar
              </Button>

              <Button
                type="button"
                className="bg-[#002366] text-white hover:bg-[#001A4D]"
                onClick={() => resetFlow(model)}
              >
                Nueva importacion
              </Button>
            </div>
          </div>
        )}

        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
    </Modal>
  );
}
