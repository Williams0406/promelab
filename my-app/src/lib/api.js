import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  setUser,
} from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * ============================
 * AXIOS INSTANCE
 * ============================
 */
const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * ============================
 * REQUEST INTERCEPTOR
 * ============================
 */
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ============================
 * RESPONSE INTERCEPTOR
 * ============================
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh/`,
          { refresh: getRefreshToken() }
        );

        setTokens(res.data);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * ============================
 * AUTH API
 * ============================
 */
export const authAPI = {
  login: async (username, password) => {
    const res = await api.post("/auth/login/", { username, password });
    setTokens(res.data);
    if (res.data.user) setUser(res.data.user);
    return res.data;
  },

  register: (data) => api.post("/auth/register/", data),

  logout: async () => {
    const refresh = getRefreshToken();
    if (refresh) {
      try {
        await api.post("/auth/logout/", { refresh });
      } catch {}
    }
    clearTokens();
  },

  get: (url) => api.get(url),
};

/**
 * ============================
 * PUBLIC API
 * ============================
 */
export const publicAPI = {
  searchProducts: (search) =>
    api.get("/products/", {
      params: {
        search,
        page_size: 5, // 👈 autocomplete
      },
    }),
  // Products / Categories
  getCategories: () => api.get("/categories/"),
  getProducts: (params) => api.get("/products/", { params }),
  getProduct: (id) => api.get(`/products/${id}/`),

  // CMS
  getBanners: () => api.get("/banners/"),
  getContentBlock: (key) => api.get(`/content/?key=${key}`),
};

/**
 * ============================
 * CLIENT API
 * ============================
 */
export const clientAPI = {
  // Cart
  getCart: () => api.get("/cart/"),
  addToCart: (product_id, quantity) =>
    api.post("/cart/", { product_id, quantity }),
  updateCartItem: (item_id, quantity) =>
    api.patch(`/cart-items/${item_id}/`, { quantity }),
  removeCartItem: (item_id) =>
    api.delete(`/cart-items/${item_id}/`),

  // Orders
  createOrder: () => api.post("/orders/"),
  getOrders: () => api.get("/orders/"),
  getOrder: (id) => api.get(`/orders/${id}/`),
};

/**
 * ============================
 * ADMIN / STAFF API
 * ============================
 */
export const adminAPI = {

  getDashboard: () => api.get("/admin/dashboard/"),

  // --------------------------
  // Banners
  // --------------------------
  getBanners: () => api.get("/banners/"),
  createBanner: (formData) =>
    api.post("/banners/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateBanner: (id, formData) =>
    api.patch(`/banners/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteBanner: (id) => api.delete(`/banners/${id}/`),

  // --------------------------
  // Vendors
  // --------------------------
  getVendors: () => api.get("/admin/vendors/"),
  createVendor: (formData) =>
    api.post("/admin/vendors/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateVendor: (id, formData) =>
    api.patch(`/admin/vendors/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteVendor: (id) => api.delete(`/admin/vendors/${id}/`),

  // --------------------------
  // Products
  // --------------------------
  getProducts: (params) => api.get("/admin/products/", { params }),
  createProduct: (data) => api.post("/admin/products/", data),
  updateProduct: (id, data) =>
    api.patch(`/admin/products/${id}/`, data),
  deleteProduct: (id) =>
    api.delete(`/admin/products/${id}/`),
  getProduct: (id) =>
    api.get(`/admin/products/${id}/`),

  // Product Images
  getProductImages: (productId) =>
    api.get(`/admin/products/${productId}/images/`),
  uploadProductImage: (productId, formData) =>
    api.post(`/admin/products/${productId}/images/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteProductImage: (productId, imageId) =>
    api.delete(`/admin/products/${productId}/images/${imageId}/`),
  updateProductImage: (productId, imageId, formData) =>
    api.patch(
      `/admin/products/${productId}/images/${imageId}/`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    ),

  // --------------------------
  // Orders
  // --------------------------
  getOrders: () => api.get("/admin/orders/"),
  getOrder: (id) => api.get(`/admin/orders/${id}/`),
  updateOrder: (id, data) =>
    api.patch(`/admin/orders/${id}/`, data),

  // --------------------------
  // Categories
  // --------------------------
  getCategories: () => api.get("/admin/categories/"),
  getCategoryTree: () => api.get("/admin/categories/tree/"),
  createCategory: (data) =>
    api.post("/admin/categories/", data),
  updateCategory: (id, data) =>
    api.patch(`/admin/categories/${id}/`, data),
  deleteCategory: (id) =>
    api.delete(`/admin/categories/${id}/`),

  // --------------------------
  // Content Blocks
  // --------------------------
  getContent: () => api.get("/content/"),
  createContent: (data) => api.post("/content/", data),
  updateContent: (id, data) =>
    api.patch(`/content/${id}/`, data),
  deleteContent: (id) =>
    api.delete(`/content/${id}/`),

  // --------------------------
  // STAFF (SOLO ADMIN)
  // --------------------------
  getStaff: () => api.get("/admin/staff/"),

  createStaff: (data) =>
    api.post("/admin/staff/", data),

  updateStaff: (id, data) =>
    api.patch(`/admin/staff/${id}/`, data),

  deleteStaff: (id) =>
    api.delete(`/admin/staff/${id}/`),
  };

export default api;
