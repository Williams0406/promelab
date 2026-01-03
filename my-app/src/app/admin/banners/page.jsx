"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import BannerForm from "@/components/admin/BannerForm";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { Loader2, Plus, Image as ImageIcon } from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getBanners();
      setBanners(res.data.results || []);
    } catch (err) {
      console.error("Error cargando banners:", err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  // 🔬 LOADING CLÍNICO
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-3">
          <Loader2 className="h-7 w-7 animate-spin text-[#002366] mx-auto" />
          <p className="text-sm text-[#6B7280] font-medium">
            Cargando banners
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🔬 HEADER FUNCIONAL */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl font-semibold text-[#002366] tracking-tight">
            Banners
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Gestión de banners publicitarios
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="bg-[#002366] hover:bg-[#001a4d] text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors duration-150"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Banner
        </Button>
      </div>

      {/* 🔬 TABLA PROTAGONISTA */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F7FA] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#002366] uppercase tracking-wide">
                Imagen
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#002366] uppercase tracking-wide">
                Título
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#002366] uppercase tracking-wide">
                Periodo
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#002366] uppercase tracking-wide">
                Estado
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E5E7EB]">
            {banners.map((banner) => (
              <tr
                key={banner.id}
                className="hover:bg-[#F5F7FA] transition-colors duration-150"
              >
                <td className="px-5 py-4">
                  {banner.image ? (
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="h-12 w-20 object-cover rounded border border-[#E5E7EB]"
                    />
                  ) : (
                    <div className="h-12 w-20 bg-[#F5F7FA] rounded border border-[#E5E7EB] flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-[#6B7280]" />
                    </div>
                  )}
                </td>

                <td className="px-5 py-4">
                  <p className="font-medium text-[#002366]">{banner.title}</p>
                  {banner.tagline && (
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {banner.tagline}
                    </p>
                  )}
                </td>

                <td className="px-5 py-4 text-[#374151]">
                  <span className="font-mono text-xs">
                    {banner.start_date} → {banner.end_date}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                      banner.is_active
                        ? "bg-[#2ECC71]/10 text-[#2ECC71]"
                        : "bg-[#E5E7EB] text-[#6B7280]"
                    }`}
                  >
                    {banner.is_active ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))}

            {/* 🔬 EMPTY STATE */}
            {banners.length === 0 && (
              <tr>
                <td colSpan="4" className="px-5 py-12 text-center">
                  <ImageIcon className="h-12 w-12 text-[#E5E7EB] mx-auto mb-3" />
                  <p className="text-sm text-[#6B7280] font-medium">
                    No hay banners creados
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Crea uno para comenzar
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔬 MODAL SOBRIO */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nuevo Banner"
        size="lg"
      >
        <BannerForm
          onSuccess={() => {
            setOpen(false);
            loadBanners();
          }}
        />
      </Modal>
    </div>
  );
}