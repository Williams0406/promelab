"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function LoginPage() {
  const [mode, setMode] = useState("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#002366] tracking-tight">
            PROMELAB
          </h1>
          <p className="text-sm text-[#6B7280] mt-2">
            Sistema de abastecimiento científico
          </p>
        </div>

        {/* Forms */}
        {mode === "login" ? (
          <div className="space-y-4">
            <LoginForm />
            
            <div className="text-center pt-4 border-t border-[#E5E7EB]">
              <p className="text-sm text-[#6B7280]">
                ¿No tienes cuenta?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="font-medium text-[#002366] hover:text-[#00A8CC] transition-colors duration-150"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </div>
        ) : (
          <RegisterForm onSwitch={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}