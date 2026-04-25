import uuid

import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from rest_framework.exceptions import ValidationError

from .models import Cart, CartItem


User = get_user_model()


def build_unique_username(email="", first_name="", last_name=""):
    base = (
        slugify((email or "").split("@")[0])
        or slugify(f"{first_name} {last_name}".strip())
        or f"user-{uuid.uuid4().hex[:8]}"
    )

    base = base[:150]
    candidate = base
    counter = 1

    while User.objects.filter(username__iexact=candidate).exists():
        suffix = f"-{counter}"
        candidate = f"{base[: 150 - len(suffix)]}{suffix}"
        counter += 1

    return candidate


def find_user_by_email(email):
    normalized_email = (email or "").strip().lower()

    if not normalized_email:
        return None

    queryset = User.objects.filter(email__iexact=normalized_email).order_by(
        "created_at", "id"
    )

    if queryset.count() > 1:
        raise ValidationError(
            {"email": "Hay varias cuentas con este correo. Inicia con usuario."}
        )

    return queryset.first()


def merge_session_cart_to_user(request, user):
    if not request:
        return

    if not request.session.session_key:
        request.session.create()

    session_key = request.session.session_key
    if not session_key:
        return

    session_cart = Cart.objects.filter(
        session_key=session_key,
        user__isnull=True,
    ).first()

    if not session_cart:
        return

    user_cart, _ = Cart.objects.get_or_create(user=user)

    for item in session_cart.cartitem_set.all():
        existing = CartItem.objects.filter(
            cart=user_cart,
            product=item.product,
        ).first()

        if existing:
            existing.quantity += item.quantity
            existing.save(update_fields=["quantity"])
            continue

        item.cart = user_cart
        item.save(update_fields=["cart"])

    session_cart.delete()


def verify_google_credential(credential):
    google_client_id = settings.GOOGLE_CLIENT_ID

    if not google_client_id:
        raise ValidationError(
            {"detail": "Google Sign-In no est\u00e1 configurado en el servidor."}
        )

    if not credential:
        raise ValidationError({"detail": "La credencial de Google es obligatoria."})

    try:
        response = requests.get(
            "https://oauth2.googleapis.com/tokeninfo",
            params={"id_token": credential},
            timeout=10,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise ValidationError(
            {"detail": "No se pudo validar la cuenta de Google."}
        ) from exc

    payload = response.json()

    if payload.get("aud") != google_client_id:
        raise ValidationError({"detail": "La credencial de Google no es v\u00e1lida."})

    if payload.get("iss") not in {
        "accounts.google.com",
        "https://accounts.google.com",
    }:
        raise ValidationError({"detail": "El emisor de Google no es v\u00e1lido."})

    if str(payload.get("email_verified", "")).lower() != "true":
        raise ValidationError(
            {"detail": "Tu cuenta de Google debe tener el correo verificado."}
        )

    if not payload.get("sub") or not payload.get("email"):
        raise ValidationError(
            {"detail": "Google no devolvi\u00f3 los datos necesarios para continuar."}
        )

    return payload


def get_or_create_google_user(payload):
    google_sub = payload["sub"]
    email = payload.get("email", "").strip().lower()
    first_name = payload.get("given_name", "").strip()
    last_name = payload.get("family_name", "").strip()

    user = User.objects.filter(google_sub=google_sub).first()

    if not user:
        user = find_user_by_email(email)

    if user:
        if user.google_sub and user.google_sub != google_sub:
            raise ValidationError(
                {"detail": "Esta cuenta ya est\u00e1 vinculada a otro acceso de Google."}
            )

        if not user.is_active:
            raise ValidationError({"detail": "Tu cuenta se encuentra desactivada."})

        fields_to_update = []

        if user.google_sub != google_sub:
            user.google_sub = google_sub
            fields_to_update.append("google_sub")

        if email and user.email != email:
            user.email = email
            fields_to_update.append("email")

        if first_name and not user.first_name:
            user.first_name = first_name
            fields_to_update.append("first_name")

        if last_name and not user.last_name:
            user.last_name = last_name
            fields_to_update.append("last_name")

        if fields_to_update:
            user.save(update_fields=fields_to_update)

        return user, False

    user = User.objects.create_user(
        username=build_unique_username(
            email=email,
            first_name=first_name,
            last_name=last_name,
        ),
        email=email,
        password=None,
        first_name=first_name,
        last_name=last_name,
        role=User.Role.CLIENT,
        google_sub=google_sub,
        is_active=True,
    )

    return user, True
