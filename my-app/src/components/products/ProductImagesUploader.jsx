"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { adminAPI } from "@/lib/api";
import { Upload, Trash2, Check, Image as ImageIcon } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function ProductImagesUploader({ productId }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [settingMain, setSettingMain] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState(null);
  const fileRef = useRef(null);

  const fetchImages = async () => {
    try {
      const res = await adminAPI.getProductImages(productId);
      setImages(res.data.results || []);
    } catch (err) {
      console.error("Error cargando imágenes:", err);
    }
  };

  useEffect(() => {
    if (productId) fetchImages();
  }, [productId]);

  const handleUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      await adminAPI.uploadProductImage(productId, formData);
      fetchImages();
    } catch (err) {
      console.error("Error subiendo imagen:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteImageId) return;

    try {
      await adminAPI.deleteProductImage(productId, deleteImageId);
      fetchImages();
      setDeleteImageId(null);
    } catch (err) {
      console.error("Error eliminando imagen:", err);
    }
  };

  const handleSetMain = async (imageId) => {
    setSettingMain(true);
    try {
      const formData = new FormData();
      formData.append("is_main", true);

      await adminAPI.updateProductImage(productId, imageId, formData);
      fetchImages();
    } catch (err) {
      console.error("Error estableciendo imagen principal:", err);
    } finally {
      setSettingMain(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-[#002366]">
            Imágenes del producto
          </label>
          
          <Button
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="bg-[#002366] text-white hover:bg-[#003380]"
          >
            <Upload className="w-4 h-4 mr-1.5" />
            {uploading ? "Subiendo..." : "Subir imagen"}
          </Button>
        </div>

        {/* INPUT OCULTO */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleUpload(e.target.files[0]);
            e.target.value = null; // Reset
          }}
        />

        {/* GRID DE IMÁGENES */}
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 rounded-lg border border-[#E5E7EB] bg-[#F5F7FA]">
            <ImageIcon className="h-12 w-12 text-[#6B7280] mb-3" />
            <p className="text-sm text-[#6B7280]">
              No hay imágenes cargadas
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className={`group relative rounded-lg overflow-hidden border ${
                  img.is_main ? "border-[#00A8CC] ring-2 ring-[#00A8CC]/20" : "border-[#E5E7EB]"
                } bg-white`}
              >
                {/* Imagen */}
                <img
                  src={img.image}
                  alt="Producto"
                  className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-200"
                />

                {/* Overlay con acciones */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center gap-2">
                  
                  {/* Botón eliminar */}
                  <button
                    onClick={() => setDeleteImageId(img.id)}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E5533D] text-white text-xs font-medium hover:bg-[#DC2626] transition-all duration-150"
                  >
                    <Trash2 className="h-3 w-3" />
                    Eliminar
                  </button>
                </div>

                {/* Radio principal */}
                <label className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg cursor-pointer text-xs font-medium">
                  <input
                    type="radio"
                    name="mainImage"
                    checked={img.is_main}
                    disabled={settingMain}
                    onChange={() => handleSetMain(img.id)}
                    className="accent-[#00A8CC]"
                  />
                  <span className="text-[#374151]">Principal</span>
                  {img.is_main && (
                    <Check className="h-3 w-3 text-[#00A8CC]" />
                  )}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={!!deleteImageId}
        onClose={() => setDeleteImageId(null)}
        onConfirm={handleDelete}
        title="Eliminar imagen"
        description="¿Estás seguro de eliminar esta imagen? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="destructive"
      />
    </>
  );
}