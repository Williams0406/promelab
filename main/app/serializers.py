from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Count
from .models import (
    Category, Vendor, Product, ProductImage,
    Cart, CartItem,
    Order, OrderItem,
    Address, Banner, ContentBlock
)
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

# ======================
# USER
# ======================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "is_active", "first_name", "last_name"]

# ======================
# CATEGORY (PUBLIC - FLAT)
# ======================
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description"]


# ======================
# CATEGORY (ADMIN - TREE)
# ======================
class CategoryTreeSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    products_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "products_count",
            "children",
        ]

    def get_children(self, obj):
        queryset = obj.children.annotate(
            products_count=Count("product")
        )
        return CategoryTreeSerializer(queryset, many=True).data


# ======================
# CATEGORY (ADMIN CRUD)
# ======================
class CategoryAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "parent",
            "is_active",
        ]
        read_only_fields = ["slug"] 

# ======================
# VENDOR
# ======================
class VendorSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = Vendor
        fields = "__all__"

    def get_logo(self, obj):
        if obj.logo:
            return obj.logo.url
        return None

# ======================
# PRODUCT IMAGES
# ======================
class ProductImageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "is_main"]

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "image", "is_main"]

    def get_image(self, obj):
        return obj.image.url if obj.image else None

# ======================
# PRODUCT (PUBLIC)
# ======================
class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(
        many=True, source="productimage_set", read_only=True
    )

    main_image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source="category.name", read_only=True)
    vendor_name = serializers.CharField(source="vendor.name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",

            # PRECIOS
            "price",
            "promo_price",

            # STOCK
            "stock",

            # EXTRAS
            "technical_specs",

            # RELACIONES
            "category_name",
            "vendor_name",

            # IMÁGENES
            "images",
            "main_image",
        ]

    def get_main_image(self, obj):
        image = obj.productimage_set.filter(is_main=True).first()
        if image:
            return image.image.url
        return None



# ======================
# PRODUCT (ADMIN)
# ======================
class ProductAdminSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    vendor_name = serializers.CharField(source="vendor.name", read_only=True)

    images = ProductImageSerializer(
        many=True, source="productimage_set", read_only=True
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "technical_specs",
            "price",
            "promo_price",
            "stock",
            "category",
            "category_name",
            "vendor",
            "vendor_name",
            "is_active",
            "is_featured",
            "created_at",
            "updated_at",
            "images",
        ]

# ======================
# CART
# ======================
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "quantity",
            "price_snapshot",
            "created_at",
        ]

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, source="cartitem_set", read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "user", "items", "created_at"]

# ======================
# ORDER
# ======================
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity", "price"]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, source="orderitem_set", read_only=True)

    class Meta:
        model = Order
        fields = ["id", "user", "status", "total", "items", "created_at"]

# ======================
# ADDRESS
# ======================
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"

# ======================
# CMS
# ======================
class BannerCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = "__all__"

class BannerSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Banner
        fields = "__all__"

    def get_image(self, obj):
        return obj.image.url if obj.image else None


class ContentBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentBlock
        fields = "__all__"

# ======================
# ORDER (ADMIN)
# ======================
class OrderAdminSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    items = OrderItemSerializer(many=True, source="orderitem_set", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "status",
            "total",
            "internal_notes",
            "items",
            "created_at",
        ]

class ClientRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "password2",
            "first_name",
            "last_name",
            "phone",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        validate_password(attrs["password"])
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            phone=validated_data.get("phone", ""),
            role=User.Role.CLIENT,  # 🔒 FORZADO
        )

        return user

class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1)

class StaffCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "phone",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User.objects.create_user(
            **validated_data,
            password=password,
            role=User.Role.STAFF,  # 🔒 FORZADO
            is_active=True,
        )

        return user