// ==============================
// API
// ==============================
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ==============================
// AUTH
// ==============================
export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_STORAGE_KEY = "auth_user";

// ==============================
// CART
// ==============================
export const CART_STORAGE_KEY = "shopping_cart";

// ==============================
// ROLES
// ==============================
export const ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  CLIENT: "CLIENT",
};

// ==============================
// ORDER STATUS
// ==============================
export const ORDER_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  SHIPPED: "SHIPPED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

// ==============================
// UI
// ==============================
export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 10,
};

export const TOAST_DURATION = 3000;
