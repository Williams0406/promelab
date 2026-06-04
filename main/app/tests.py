import json
from datetime import timedelta
from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase, override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
import pandas as pd
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Cart, CartItem, Product, Vendor


User = get_user_model()


@override_settings(ALLOWED_HOSTS=["testserver", "localhost", "127.0.0.1"])
class LoginIdentifierTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.password = "Admin12345!"
        self.user = User.objects.create_user(
            username="admin",
            email="admin@castromonte.com",
            password=self.password,
            first_name="Admin",
            last_name="Principal",
            role=User.Role.ADMIN,
            is_staff=True,
            is_superuser=True,
        )

    def test_login_accepts_username_in_identifier(self):
        response = self.client.post(
            "/api/auth/login/",
            {"identifier": "admin", "password": self.password},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertEqual(response.data["user"]["username"], self.user.username)

    def test_login_accepts_email_in_identifier(self):
        response = self.client.post(
            "/api/auth/login/",
            {"identifier": "admin@castromonte.com", "password": self.password},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertEqual(response.data["user"]["email"], self.user.email)


@override_settings(ALLOWED_HOSTS=["testserver", "localhost", "127.0.0.1"])
class GuestCartTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.vendor = Vendor.objects.create(name="Proveedor Demo")
        self.product = Product.objects.create(
            vendor=self.vendor,
            name="Microscopio Demo",
            description="Producto de prueba para carrito invitado",
            technical_specs={"marca": "Demo"},
            price="15.00",
        )

    def test_guest_cart_persists_for_same_session(self):
        add_response = self.client.post(
            "/api/cart/",
            {"product_id": str(self.product.id), "quantity": 2},
            format="json",
        )

        self.assertEqual(add_response.status_code, 201)
        self.assertEqual(len(add_response.data["items"]), 1)
        self.assertEqual(add_response.data["items"][0]["quantity"], 2)

        cart_response = self.client.get("/api/cart/")

        self.assertEqual(cart_response.status_code, 200)
        self.assertEqual(len(cart_response.data["items"]), 1)
        self.assertEqual(
            cart_response.data["items"][0]["product"]["id"],
            str(self.product.id),
        )
        self.assertEqual(cart_response.data["items"][0]["quantity"], 2)

        guest_cart = Cart.objects.get(
            session_key=self.client.session.session_key,
            user__isnull=True,
        )
        self.assertEqual(guest_cart.cartitem_set.count(), 1)


@override_settings(ALLOWED_HOSTS=["testserver", "localhost", "127.0.0.1"])
class ProductImportTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="staff-import",
            email="staff@castromonte.com",
            password="Admin12345!",
            role=User.Role.ADMIN,
            is_staff=True,
            is_active=True,
        )
        self.client.force_authenticate(user=self.user)

        self.product = Product.objects.create(
            name="Producto existente",
            sku="SKU-001",
            description="Antes",
            technical_specs={"estado": "original"},
            price="10.00",
            created_by=self.user,
        )

    def test_product_import_updates_and_creates_by_sku(self):
        file = SimpleUploadedFile(
            "productos.csv",
            (
                b"name,sku,price\n"
                b"Producto actualizado,SKU-001,25.50\n"
                b"Producto nuevo,SKU-002,44.90\n"
                b"Sin sku,,11.00\n"
            ),
            content_type="text/csv",
        )

        response = self.client.post(
            "/api/admin/import/",
            {
                "file": file,
                "model": "product",
                "mapping": json.dumps(
                    {
                        "name": "name",
                        "sku": "sku",
                        "price": "price",
                    }
                ),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["reference_field"], "sku")
        self.assertEqual(response.data["created"], 1)
        self.assertEqual(response.data["updated"], 1)
        self.assertEqual(response.data["skipped"], 1)

        self.product.refresh_from_db()
        self.assertEqual(self.product.name, "Producto actualizado")
        self.assertEqual(str(self.product.price), "25.50")

        created_product = Product.objects.get(sku="SKU-002")
        self.assertEqual(created_product.name, "Producto nuevo")
        self.assertEqual(str(created_product.price), "44.90")

    def test_product_import_requires_sku_mapping(self):
        file = SimpleUploadedFile(
            "productos.csv",
            b"name,price\nProducto sin sku,15.00\n",
            content_type="text/csv",
        )

        response = self.client.post(
            "/api/admin/import/",
            {
                "file": file,
                "model": "product",
                "mapping": json.dumps(
                    {
                        "name": "name",
                        "price": "price",
                    }
                ),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("sku", response.data["detail"].lower())

    def test_product_import_accepts_xlsx(self):
        buffer = BytesIO()
        pd.DataFrame(
            [
                {"name": "Producto xlsx", "sku": "SKU-XLSX", "price": 19.9},
            ]
        ).to_excel(buffer, index=False)
        buffer.seek(0)

        file = SimpleUploadedFile(
            "productos.xlsx",
            buffer.getvalue(),
            content_type=(
                "application/vnd.openxmlformats-officedocument."
                "spreadsheetml.sheet"
            ),
        )

        response = self.client.post(
            "/api/admin/import/",
            {
                "file": file,
                "model": "product",
                "mapping": json.dumps(
                    {
                        "name": "name",
                        "sku": "sku",
                        "price": "price",
                    }
                ),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["created"], 1)
        self.assertTrue(Product.objects.filter(sku="SKU-XLSX").exists())


@override_settings(ALLOWED_HOSTS=["testserver", "localhost", "127.0.0.1"])
class PublicProductPaginationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.vendor = Vendor.objects.create(name="Proveedor Publico")

        for index in range(13):
            Product.objects.create(
                vendor=self.vendor,
                name=f"Producto publico {index}",
                sku=f"PUB-{index:03}",
                description="Producto para prueba de paginacion publica",
                technical_specs={"orden": index},
                price="10.00",
                is_active=True,
            )

    def test_public_products_returns_twelve_items_per_page(self):
        response = self.client.get("/api/products/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 13)
        self.assertEqual(len(response.data["results"]), 12)


@override_settings(ALLOWED_HOSTS=["testserver", "localhost", "127.0.0.1"])
class PublicProductSearchTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.vendor = Vendor.objects.create(name="Proveedor Search")

        self.name_match = Product.objects.create(
            vendor=self.vendor,
            name="Microscopio Analitico",
            sku="BUS-001",
            description="Equipo de laboratorio",
            technical_specs={"tipo": "optico"},
            price="20.00",
            is_active=True,
        )
        Product.objects.create(
            vendor=self.vendor,
            name="Centrifuga Clinica",
            sku="MICRO-002",
            description="Incluye modulo para microscopio",
            technical_specs={"tipo": "centrifuga"},
            price="25.00",
            is_active=True,
        )

    def test_public_search_filters_only_by_product_name(self):
        response = self.client.get("/api/products/?search=microscopio")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], str(self.name_match.id))


@override_settings(ALLOWED_HOSTS=["testserver", "localhost", "127.0.0.1"])
class CartAdminBulkDeleteTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="admin-carts",
            email="admin-carts@castromonte.com",
            password="Admin12345!",
            role=User.Role.ADMIN,
            is_staff=True,
            is_active=True,
        )
        self.client.force_authenticate(user=self.user)

        self.vendor = Vendor.objects.create(name="Proveedor Carritos")
        self.product = Product.objects.create(
            vendor=self.vendor,
            name="Producto carrito",
            sku="CART-001",
            description="Producto para prueba de carritos",
            technical_specs={"tipo": "demo"},
            price="15.00",
            created_by=self.user,
        )

        self.cart_one = Cart.objects.create(user=self.user)
        self.cart_two = Cart.objects.create()

        CartItem.objects.create(
            cart=self.cart_one,
            product=self.product,
            quantity=2,
            price_snapshot="15.00",
        )
        CartItem.objects.create(
            cart=self.cart_two,
            product=self.product,
            quantity=1,
            price_snapshot="15.00",
        )

    def test_cart_bulk_delete_removes_selected_carts(self):
        response = self.client.post(
            "/api/admin/carts/bulk-delete/",
            {"ids": [str(self.cart_one.id), str(self.cart_two.id)]},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["deleted"], 2)
        self.assertFalse(Cart.objects.filter(id=self.cart_one.id).exists())
        self.assertFalse(Cart.objects.filter(id=self.cart_two.id).exists())
        self.assertEqual(CartItem.objects.count(), 0)

    def test_cart_admin_list_is_paginated(self):
        response = self.client.get("/api/admin/carts/?page_size=1")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 2)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertIsNotNone(response.data["next"])

    def test_cleanup_guest_carts_removes_only_inactive_guest_carts(self):
        cutoff_date = timezone.now() - timedelta(days=2)

        recent_item_cart = Cart.objects.create()
        recent_item = CartItem.objects.create(
            cart=recent_item_cart,
            product=self.product,
            quantity=1,
            price_snapshot="15.00",
        )

        old_user_cart = Cart.objects.create(user=self.user)
        old_user_item = CartItem.objects.create(
            cart=old_user_cart,
            product=self.product,
            quantity=1,
            price_snapshot="15.00",
        )

        Cart.objects.filter(id=self.cart_two.id).update(
            created_at=cutoff_date,
            updated_at=cutoff_date,
        )
        CartItem.objects.filter(cart=self.cart_two).update(
            created_at=cutoff_date,
            updated_at=cutoff_date,
        )

        Cart.objects.filter(id=recent_item_cart.id).update(
            created_at=cutoff_date,
            updated_at=cutoff_date,
        )
        CartItem.objects.filter(id=recent_item.id).update(updated_at=timezone.now())

        Cart.objects.filter(id=old_user_cart.id).update(
            created_at=cutoff_date,
            updated_at=cutoff_date,
        )
        CartItem.objects.filter(id=old_user_item.id).update(
            created_at=cutoff_date,
            updated_at=cutoff_date,
        )

        call_command("cleanup_guest_carts")

        self.assertFalse(Cart.objects.filter(id=self.cart_two.id).exists())
        self.assertTrue(Cart.objects.filter(id=recent_item_cart.id).exists())
        self.assertTrue(Cart.objects.filter(id=old_user_cart.id).exists())


class SessionLifetimeTests(TestCase):
    def test_refresh_token_lasts_three_days(self):
        user = User.objects.create_user(
            username="session-user",
            email="session@castromonte.com",
            password="Admin12345!",
            role=User.Role.CLIENT,
            is_active=True,
        )

        token = RefreshToken.for_user(user)
        lifetime_seconds = token["exp"] - token["iat"]

        self.assertEqual(lifetime_seconds, 60 * 60 * 24 * 3)
