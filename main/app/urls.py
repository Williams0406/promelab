# app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers

from .views import (
    CategoryViewSet, CategoryAdminViewSet,
    VendorAdminViewSet, ProductViewSet, ProductAdminViewSet,
    ProductImageAdminViewSet, CartViewSet, OrderViewSet, OrderAdminViewSet,
    BannerViewSet, ContentBlockViewSet, ClientRegisterView, CartItemViewSet,
    StaffAdminViewSet, AdminDashboardView
)

# Rutas principales
router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="categories")
router.register("admin/categories", CategoryAdminViewSet, basename="admin-categories")
router.register("admin/vendors", VendorAdminViewSet, basename="admin-vendors")
router.register("products", ProductViewSet, basename="products")
router.register("admin/products", ProductAdminViewSet, basename="admin-products")
router.register("cart", CartViewSet, basename="cart")
router.register("orders", OrderViewSet, basename="orders")
router.register("admin/orders", OrderAdminViewSet, basename="admin-orders")
router.register("banners", BannerViewSet, basename="banners")
router.register("content", ContentBlockViewSet, basename="content")
router.register("cart-items", CartItemViewSet, basename="cart-items")
router.register("admin/staff", StaffAdminViewSet, basename="admin-staff")

# Rutas anidadas para ProductImage
products_router = routers.NestedDefaultRouter(router, "admin/products", lookup="product")
products_router.register("images", ProductImageAdminViewSet, basename="admin-product-images")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(products_router.urls)),
    path("auth/register/", ClientRegisterView.as_view(), name="register"),
    path("admin/dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
]
