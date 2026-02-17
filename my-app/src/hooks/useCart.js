"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { clientAPI } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated, loading: authLoading, isClient } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  /* =========================
     LOAD CART FROM BACKEND
  ========================= */
  const loadCart = async () => {
    try {
      const res = await clientAPI.getCart();
      const cart = Array.isArray(res.data) ? res.data[0] : res.data;
      setItems(cart?.items || []);
    } catch (error) {
      console.error("Error loading cart:", error);
      setItems([]);
    } finally {
      setInitialized(true);
    }
  };

  useEffect(() => {
    if (authLoading) return;   // ⬅️ CLAVE
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  /* =========================
     CART ACTIONS
  ========================= */
  const addItem = async (product, quantity = 1) => {
    setLoading(true);
    try {
      await clientAPI.addToCart(product.id, quantity);
      await loadCart();
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    await clientAPI.updateCartItem(itemId, quantity);
    await loadCart();
  };

  const removeItem = async (itemId) => {
    await clientAPI.removeCartItem(itemId);
    await loadCart();
  };

  const clearCart = async () => {
    for (const item of items) {
      await clientAPI.removeCartItem(item.id);
    }
    setItems([]);
  };

  /* =========================
     DERIVED VALUES
  ========================= */
  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = items.reduce(
    (sum, item) => sum + Number(item.price_snapshot) * item.quantity,
    0
  );
  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        total,
        loading,
        initialized,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }

  return context;
}
