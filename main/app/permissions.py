# app/permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """
    Solo ADMIN
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "ADMIN"
        )


class IsStaff(BasePermission):
    """
    ADMIN o STAFF
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in ["ADMIN", "STAFF"]
        )


class IsClient(BasePermission):
    """
    Solo CLIENT
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "CLIENT"
        )


class IsAdminOrReadOnly(BasePermission):
    """
    Público puede leer
    ADMIN puede escribir
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        return (
            request.user.is_authenticated
            and request.user.role == "ADMIN"
        )


class IsStaffOrReadOnly(BasePermission):
    """
    Público puede leer
    STAFF y ADMIN pueden escribir
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        return (
            request.user.is_authenticated
            and request.user.role in ["ADMIN", "STAFF"]
        )


class IsOwner(BasePermission):
    """
    El objeto pertenece al usuario
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
