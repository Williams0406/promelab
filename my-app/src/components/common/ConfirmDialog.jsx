"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  description = "Esta acción no se puede deshacer.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default", // "default" | "destructive"
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-5">
        
        {/* Header con indicador visual */}
        <div className="flex items-start gap-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${
            variant === "destructive" 
              ? "bg-[#FEF2F2] border border-[#E5533D]" 
              : "bg-[#F5F7FA] border border-[#E5E7EB]"
          }`}>
            <AlertTriangle className={`h-5 w-5 ${
              variant === "destructive" ? "text-[#E5533D]" : "text-[#002366]"
            }`} />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#002366]">
              {title}
            </h3>
            <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Actions — Confirmación explícita */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-[#374151] hover:bg-[#F5F7FA] transition-colors duration-150"
          >
            {cancelText}
          </Button>
          
          <Button 
            onClick={onConfirm}
            className={
              variant === "destructive"
                ? "bg-[#E5533D] text-white hover:bg-[#DC2626] transition-colors duration-150"
                : "bg-[#002366] text-white hover:bg-[#003380] transition-colors duration-150"
            }
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
