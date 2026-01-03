"use client";

import { createContext, useContext, useState } from "react";

const AdminLayoutContext = createContext(null);

export function AdminLayoutProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AdminLayoutContext.Provider
      value={{ collapsed, setCollapsed }}
    >
      {children}
    </AdminLayoutContext.Provider>
  );
}

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error(
      "useAdminLayout debe usarse dentro de AdminLayoutProvider"
    );
  }
  return context;
}
