from flask_sqlalchemy import SQLAlchemy

# Create a shared database instance
db = SQLAlchemy()

# Import all models
from .category import Category
from .brand import Brand
from .product import Product
from .product_image import ProductImage
from .product_specification import ProductSpecification
from .product_feature import ProductFeature
from .review import Review
from .cart import Cart
from .cart_item import CartItem
from .delivery_location import DeliveryLocation
from .customer import Customer, CustomerAddress
from .order import Order
from .order_item import OrderItem
from .admin_user import AdminUser

# Re-export all models
__all__ = [
    'db',
    'Category',
    'Brand', 
    'Product',
    'ProductImage',
    'ProductSpecification',
    'ProductFeature',
    'Review',
    'Cart',
    'CartItem',
    'DeliveryLocation',
    'Customer',
    'CustomerAddress',
    'Order',
    'OrderItem',
    'AdminUser'
] 