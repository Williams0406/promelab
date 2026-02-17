# app/import_view.py

import json
import pandas as pd
from decimal import Decimal
from django.db import transaction
from rest_framework.views import APIView
from .permissions import IsStaff
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from app.models import Product, Category, Vendor
import unicodedata

def normalize(text):
    text = str(text).strip().lower()
    return ''.join(
        c for c in unicodedata.normalize('NFD', text)
        if unicodedata.category(c) != 'Mn'
    )


class AdminImportView(APIView):
    permission_classes = [IsStaff]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):

        file = request.FILES.get("file")
        model = request.data.get("model")
        mapping = request.data.get("mapping")

        if not file:
            return Response({"detail": "Archivo requerido"}, status=400)

        if not model:
            return Response({"detail": "Modelo requerido"}, status=400)

        try:
            mapping = json.loads(mapping)
        except Exception:
            return Response({"detail": "Mapping inválido"}, status=400)

        # ======================
        # Leer archivo
        # ======================
        try:
            if file.name.endswith(".csv"):
                df = pd.read_csv(file)
            elif file.name.endswith(".xlsx"):
                df = pd.read_excel(file)
            else:
                return Response(
                    {"detail": "Formato no soportado. Use CSV o XLSX"},
                    status=400
                )
            
            df.columns = df.columns.str.strip()
        except Exception as e:
            return Response({"detail": str(e)}, status=400)

        if model == "product":
            return self.import_products(df, mapping, request.user)

        if model == "category":
            return self.import_categories(df, mapping)

        if model == "vendor":
            return self.import_vendors(df, mapping)

        return Response({"detail": "Modelo no válido"}, status=400)

    # ====================================================
    # PRODUCT
    # ====================================================

    @transaction.atomic
    def import_products(self, df, mapping, user):

        created = 0
        updated = 0

        for _, row in df.iterrows():

            def get_value(field):
                column = mapping.get(field)
                if not column:
                    return None

                column = column.strip()

                # Buscar columna ignorando mayúsculas/minúsculas
                real_column = next(
                    (c for c in df.columns if c.strip().lower() == column.lower()),
                    None
                )

                if not real_column:
                    return None

                value = row[real_column]
                return None if pd.isna(value) else str(value).strip()

            name = get_value("name")
            if not name:
                continue

            # ------------------
            # Relaciones por NAME
            # ------------------

            category_name = get_value("category")
            vendor_name = get_value("vendor")

            category = None
            if category_name:
                category, _ = Category.objects.get_or_create(
                    name=category_name
                )

            vendor = None
            if vendor_name:
                vendor, _ = Vendor.objects.get_or_create(
                    name=vendor_name
                )

            product_data = {
                "description": get_value("description"),
                "technical_specs": get_value("technical_specs"),
                "price": Decimal(get_value("price") or 0),
                "promo_price": (
                    Decimal(get_value("promo_price"))
                    if get_value("promo_price")
                    else None
                ),
                "category": category,
                "vendor": vendor,
                "is_active": True,
            }

            product = Product.objects.filter(name=name).first()

            if product:
                for key, value in product_data.items():
                    setattr(product, key, value)
                product.save()
                updated += 1
            else:
                Product.objects.create(
                    name=name,
                    created_by=user,
                    **product_data
                )
                created += 1

        return Response({
            "detail": "Importación completada",
            "created": created,
            "updated": updated
        })

    # ====================================================
    # CATEGORY
    # ====================================================

    @transaction.atomic
    def import_categories(self, df, mapping):

        created = 0

        column = mapping.get("name")

        if not column:
            return Response(
                {"detail": "Debe mapear un campo como 'name'"},
                status=400
            )

        # Buscar columna real en el archivo
        real_column = next(
            (
                c for c in df.columns
                if normalize(c) == normalize(column)
            ),
            None
        )

        if not real_column:
            return Response(
                {
                    "detail": f"La columna '{column}' no existe en el archivo. "
                            f"Columnas disponibles: {list(df.columns)}"
                },
                status=400
            )

        for _, row in df.iterrows():
            value = row[real_column]

            if pd.isna(value):
                continue

            Category.objects.get_or_create(
                name=str(value).strip()
            )
            created += 1

        return Response({
            "detail": "Categorías importadas correctamente",
            "created": created
        })

    # ====================================================
    # VENDOR
    # ====================================================

    @transaction.atomic
    def import_vendors(self, df, mapping):

        created = 0
        updated = 0

        def get_real_column(column_name):
            return next(
                (c for c in df.columns if c.strip().lower() == column_name.strip().lower()),
                None
            )

        name_column = mapping.get("name")
        if not name_column:
            return Response({"detail": "Debe mapear el campo 'name'"}, status=400)

        name_column = get_real_column(name_column)
        if not name_column:
            return Response({"detail": "Columna name no encontrada"}, status=400)

        email_column = mapping.get("contact_email")
        phone_column = mapping.get("phone")
        active_column = mapping.get("is_active")

        email_column = get_real_column(email_column) if email_column else None
        phone_column = get_real_column(phone_column) if phone_column else None
        active_column = get_real_column(active_column) if active_column else None

        for _, row in df.iterrows():

            name_value = row[name_column]
            if pd.isna(name_value):
                continue

            name = str(name_value).strip()

            contact_email = (
                str(row[email_column]).strip()
                if email_column and not pd.isna(row[email_column])
                else None
            )

            phone = (
                str(row[phone_column]).strip()
                if phone_column and not pd.isna(row[phone_column])
                else None
            )

            is_active = True
            if active_column and not pd.isna(row[active_column]):
                value = str(row[active_column]).strip().lower()
                is_active = value in ["1", "true", "si", "sí", "yes"]

            vendor = Vendor.objects.filter(name=name).first()

            if vendor:
                vendor.contact_email = contact_email
                vendor.phone = phone
                vendor.is_active = is_active
                vendor.save()
                updated += 1
            else:
                Vendor.objects.create(
                    name=name,
                    contact_email=contact_email,
                    phone=phone,
                    is_active=is_active,
                )
                created += 1

        return Response({
            "detail": "Proveedores importados correctamente",
            "created": created,
            "updated": updated
        })