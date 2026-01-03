# app/views.py
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.text import slugify
from django.db.models import Count, Sum, Q
from rest_framework.views import APIView
from django.utils import timezone
from rest_framework.generics import CreateAPIView
from django.contrib.auth import get_user_model
from datetime import timedelta
from django.db.models.functions import TruncDate
from django.db.models.deletion import ProtectedError

from .models import (
    User, Category, Vendor, Product, ProductImage,
    Cart, Order, Banner, ContentBlock, CartItem, OrderItem
)
from .serializers import (
    UserSerializer, CategorySerializer, CategoryTreeSerializer, CategoryAdminSerializer,
    VendorSerializer, ProductSerializer, ProductAdminSerializer, ProductImageSerializer,
    CartSerializer, OrderSerializer, OrderAdminSerializer, BannerSerializer,
    ContentBlockSerializer, ClientRegisterSerializer, AddToCartSerializer, CartItemSerializer,
    StaffCreateSerializer
)
from .permissions import IsAdmin, IsStaff, IsStaffOrReadOnly, IsClient


User = get_user_model()

# ======================
# CATEGORY
# ======================
class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class CategoryAdminViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategoryAdminSerializer
    permission_classes = [IsStaff]

    def perform_destroy(self, instance):
        if instance.children.exists():
            raise ValidationError("No se puede eliminar una categoría con subcategorías.")
        if instance.product_set.exists():
            raise ValidationError("No se puede eliminar una categoría con productos asociados.")
        instance.delete()

    @action(detail=False, methods=["get"], url_path="tree")
    def tree(self, request):
        queryset = (
            Category.objects
            .filter(parent__isnull=True)
            .annotate(products_count=Count("product"))
        )
        serializer = CategoryTreeSerializer(queryset, many=True)
        return Response(serializer.data)


# ======================
# VENDOR
# ======================
class VendorAdminViewSet(ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsStaff]
    parser_classes = [MultiPartParser, FormParser]

    def perform_destroy(self, instance):
        if instance.product_set.exists():
            raise ValidationError(
                {"detail": "No se puede eliminar un proveedor con productos asociados."}
            )
        instance.delete()

# ======================
# PRODUCT
# ======================
# views.py
class ProductViewSet(ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)

        # 🔍 SEARCH
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(vendor__name__icontains=search)
            )

        # 📂 CATEGORY
        category_id = self.request.query_params.get("category")
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
                categories = Category.objects.filter(
                    Q(id=category.id) | Q(parent=category)
                )
                queryset = queryset.filter(category__in=categories)
            except Category.DoesNotExist:
                queryset = queryset.none()

        return queryset

    def get_serializer_context(self):
        return {"request": self.request}



class ProductAdminViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductAdminSerializer
    permission_classes = [IsStaff]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category_id=category)
        return qs

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def get_serializer_context(self):
        return {"request": self.request}
    
    def perform_destroy(self, instance):
        try:
            instance.delete()
        except ProtectedError:
            raise ValidationError({
                "detail": (
                    "No se puede eliminar este producto porque "
                    "está siendo utilizado en pedidos o carritos."
                )
            })

# ======================
# PRODUCT IMAGES (ADMIN)
# ======================
class ProductImageAdminViewSet(ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsStaff]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        product_id = self.kwargs.get("product_pk")
        return ProductImage.objects.filter(product_id=product_id)

    def perform_create(self, serializer):
        product_id = self.kwargs.get("product_pk")
        serializer.save(product_id=product_id)
    
    def get_serializer_context(self):
        return {"request": self.request}

# ======================
# CART / ORDERS CLIENT
# ======================
class CartViewSet(ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsClient]
    pagination_class = None

    def list(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(
            CartSerializer(cart, context={"request": request}).data
        )

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data["product_id"]
        quantity = serializer.validated_data["quantity"]

        product = Product.objects.get(id=product_id)

        cart, _ = Cart.objects.get_or_create(user=request.user)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={
                "quantity": quantity,
                "price_snapshot": product.promo_price or product.price
            }
        )

        if not created:
            item.quantity += quantity
            item.save()

        return Response(
            CartSerializer(cart, context={"request": request}).data,
            status=status.HTTP_201_CREATED
        )

class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # 1️⃣ Obtener carrito del usuario
        cart = Cart.objects.filter(user=request.user).first()

        if not cart or not cart.cartitem_set.exists():
            raise ValidationError("El carrito está vacío")

        # 2️⃣ Calcular total
        total = sum(
            item.price_snapshot * item.quantity
            for item in cart.cartitem_set.all()
        )

        # 3️⃣ Crear orden
        order = Order.objects.create(
            user=request.user,
            status=Order.Status.CREATED,
            total=total,
        )

        # 4️⃣ Crear OrderItems
        for item in cart.cartitem_set.select_related("product"):
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.price_snapshot,
            )

            # (opcional) descontar stock
            item.product.stock -= item.quantity
            item.product.save()

        # 5️⃣ Vaciar carrito
        cart.cartitem_set.all().delete()

        return Response(
            OrderSerializer(order, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )

# ======================
# ORDER ADMIN / STAFF
# ======================
class OrderAdminViewSet(ModelViewSet):
    queryset = Order.objects.select_related("user").prefetch_related("orderitem_set")
    serializer_class = OrderAdminSerializer
    permission_classes = [IsStaff]

# ======================
# BANNERS / CONTENT
# ======================
class BannerViewSet(ModelViewSet):
    serializer_class = BannerSerializer
    permission_classes = [IsStaffOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        today = timezone.now().date()

        return Banner.objects.filter(
            is_active=True,
            start_date__lte=today,
            end_date__gte=today
        )

    def get_serializer_context(self):
        return {"request": self.request}

class ContentBlockViewSet(ReadOnlyModelViewSet):
    queryset = ContentBlock.objects.all()
    serializer_class = ContentBlockSerializer
    permission_classes = [IsStaffOrReadOnly]

# ======================
# AUTH JWT
# ======================
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"detail": "Logged out successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class ClientRegisterView(CreateAPIView):
    serializer_class = ClientRegisterSerializer
    permission_classes = [AllowAny]

class CartItemViewSet(ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        item = self.get_object()
        quantity = request.data.get("quantity")

        if quantity is None or int(quantity) < 1:
            raise ValidationError("Cantidad inválida")

        item.quantity = quantity
        item.save()

        return Response(
            CartItemSerializer(item, context={"request": request}).data
        )

class StaffAdminViewSet(ModelViewSet):
    """
    Gestión de usuarios STAFF (solo ADMIN)
    """
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return User.objects.filter(role=User.Role.STAFF)

    def get_serializer_class(self):
        if self.action == "create":
            return StaffCreateSerializer
        return UserSerializer

class AdminDashboardView(APIView):
    permission_classes = [IsStaff]

    def get(self, request):
        today = timezone.now().date()
        month_start = today.replace(day=1)

        # ======================
        # USERS
        # ======================
        users_data = {
            "total": User.objects.count(),
            "clients": User.objects.filter(role=User.Role.CLIENT).count(),
            "staff": User.objects.filter(role=User.Role.STAFF).count(),
            "admins": User.objects.filter(role=User.Role.ADMIN).count(),
            "new_today": User.objects.filter(created_at__date=today).count(),
            "new_month": User.objects.filter(created_at__date__gte=month_start).count(),
        }

        # ======================
        # PRODUCTS
        # ======================
        products_data = {
            "total": Product.objects.count(),
            "active": Product.objects.filter(is_active=True).count(),
            "out_of_stock": Product.objects.filter(stock=0).count(),
            "featured": Product.objects.filter(is_featured=True).count(),
        }

        # ======================
        # SALES LAST 7 DAYS (DELIVERED)
        # ======================

        last_7_days = [
            today - timedelta(days=i)
            for i in range(6, -1, -1)
        ]

        sales_qs = (
            Order.objects
            .filter(
                status=Order.Status.DELIVERED,
                created_at__date__gte=last_7_days[0],
                created_at__date__lte=today,
            )
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(total=Sum("total"))
        )

        # Convert queryset to dict for easy lookup
        sales_map = {
            item["day"]: item["total"]
            for item in sales_qs
        }

        sales_by_day = [
            {
                "date": day.strftime("%Y-%m-%d"),
                "total": float(sales_map.get(day, 0)),
            }
            for day in last_7_days
        ]

        # ======================
        # ORDERS
        # ======================
        orders_data = {
            "total": Order.objects.count(),
            "today": Order.objects.filter(created_at__date=today).count(),

            "by_status": {
                status: Order.objects.filter(status=status).count()
                for status, _ in Order.Status.choices
            },

            "total_sales": Order.objects.filter(
                status=Order.Status.DELIVERED
            ).aggregate(total=Sum("total"))["total"] or 0,

            "month_sales": Order.objects.filter(
                status=Order.Status.DELIVERED,
                created_at__date__gte=month_start
            ).aggregate(total=Sum("total"))["total"] or 0,

            # 🔥 NUEVO
            "by_day": sales_by_day,
        }

        # ======================
        # CATALOG
        # ======================
        catalog_data = {
            "categories": Category.objects.count(),
            "vendors": Vendor.objects.count(),
        }

        # ======================
        # CART
        # ======================
        cart_data = {
            "active_carts": Cart.objects.filter(
                cartitem__isnull=False
            ).distinct().count()
        }

        return Response({
            "users": users_data,
            "products": products_data,
            "orders": orders_data,
            "catalog": catalog_data,
            "cart": cart_data,
        })