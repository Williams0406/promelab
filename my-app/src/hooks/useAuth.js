"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authAPI } from "@/lib/api";
import { getUser, setUser, clearTokens, getUserRole, getAccessToken } from "@/lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Inicialización
  // -----------------------------
  useEffect(() => {
    const initAuth = async () => {
      try {
        let storedUser = getUser();

        if (!storedUser && getAccessToken()) {
          try {
            const res = await authAPI.get("/auth/me/"); 
            if (res?.data?.user) {
              storedUser = res.data.user;
              setUser(storedUser);
            }
          } catch (err) {
            console.warn("No se pudo obtener el usuario desde backend:", err.message || err);
          }
        }

        if (storedUser) setUserState(storedUser);
      } catch (err) {
        console.error("Error inicializando AuthProvider:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // -----------------------------
  // Login
  // -----------------------------
  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login(identifier, password);

      if (data?.user) {
        setUser(data.user);
        setUserState(data.user);
      }

      document.cookie = `access_token=${data.access}; path=/;`;

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Credenciales inválidas" };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential) => {
    setLoading(true);
    try {
      const data = await authAPI.googleAuth(credential);

      if (data?.user) {
        setUser(data.user);
        setUserState(data.user);
      }

      document.cookie = `access_token=${data.access}; path=/;`;

      return { success: true, isNewUser: !!data?.is_new_user };
    } catch (error) {
      console.error("Google login error:", error);
      return {
        success: false,
        message:
          error?.response?.data?.detail ||
          "No se pudo continuar con Google",
      };
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const logout = useCallback(async () => {
    try {
      await authAPI.logout(); // llama al backend y limpia tokens
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUserState(null);
      document.cookie = "access_token=; Max-Age=0; path=/;";
      window.location.href = "/login";
    }
  }, []);

  // -----------------------------
  // Roles
  // -----------------------------
  const role = getUserRole();
  const isAdmin = role === "ADMIN";
  const isStaff = role === "STAFF" || role === "ADMIN";
  const isClient = role === "CLIENT";

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      role,
      isAdmin,
      isStaff,
      isClient,
      login,
      loginWithGoogle,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// -----------------------------
// Hook
// -----------------------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}
