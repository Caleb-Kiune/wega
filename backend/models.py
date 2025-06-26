from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    
    # Relationships
    products = db.relationship('Product', backref='category', lazy=True)

    def __repr__(self):
        return f'<Category {self.id} {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Brand(db.Model):
    __tablename__ = 'brands'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    logo_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    
    # Relationships
    products = db.relationship('Product', backref='brand', lazy=True)

    def __repr__(self):
        return f'<Brand {self.id} {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'logo_url': self.logo_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    original_price = db.Column(db.Numeric(10, 2), nullable=True)
    sku = db.Column(db.String(50), unique=True, nullable=True)
    stock = db.Column(db.Integer, nullable=True)
    rating = db.Column(db.Numeric(3, 2), nullable=True)
    review_count = db.Column(db.Integer, nullable=True)
    is_new = db.Column(db.Boolean, nullable=True)
    is_sale = db.Column(db.Boolean, nullable=True)
    is_featured = db.Column(db.Boolean, nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    brand_id = db.Column(db.Integer, db.ForeignKey('brands.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)
    
    # Relationships
    images = db.relationship('ProductImage', backref='product', lazy=True, order_by='ProductImage.display_order')
    specifications = db.relationship('ProductSpecification', backref='product', lazy=True, order_by='ProductSpecification.display_order')
    features = db.relationship('ProductFeature', backref='product', lazy=True, order_by='ProductFeature.display_order')
    reviews = db.relationship('Review', backref='product', lazy=True)

    def __repr__(self):
        return f'<Product {self.id} {self.name}>'

    def to_dict(self):
        # Get the primary image URL
        primary_image = next((img.image_url for img in self.images if img.is_primary), 
                           self.images[0].image_url if self.images else None)
        
        # Handle both old and new image URL formats
        if primary_image:
            if primary_image.startswith('http'):
                pass
            elif primary_image.startswith('/static/'):
                primary_image = f'http://localhost:5000{primary_image}'
            else:
                primary_image = f'http://localhost:5000/static/uploads/{primary_image}'
        
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price) if self.price else None,
            'original_price': float(self.original_price) if self.original_price else None,
            'image_url': primary_image,
            'images': [img.to_dict() for img in self.images],
            'is_new': self.is_new,
            'is_sale': self.is_sale,
            'is_featured': self.is_featured,
            'category': self.category.name if self.category else None,
            'brand': self.brand.name if self.brand else None,
            'rating': float(self.rating) if self.rating else None,
            'review_count': self.review_count,
            'stock': self.stock,
            'sku': self.sku,
            'features': [feature.to_dict() for feature in self.features],
            'specifications': [spec.to_dict() for spec in self.specifications],
            'reviews': [review.to_dict() for review in self.reviews]
        }

class ProductImage(db.Model):
    __tablename__ = 'product_images'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True)
    image_url = db.Column(db.String(255), nullable=False)
    is_primary = db.Column(db.Boolean, nullable=True)
    display_order = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)

    # Add a unique constraint to ensure only one primary image per product
    __table_args__ = (
        db.Index('idx_product_primary_image', 'product_id', 'is_primary', unique=True, 
                postgresql_where=db.Column('is_primary') == True),
    )

    def __repr__(self):
        return f'<ProductImage {self.id}>'

    def to_dict(self):
        # Handle both old and new image URL formats
        image_url = self.image_url
        if image_url and not image_url.startswith('http'):
            if image_url.startswith('/static/'):
                image_url = f'http://localhost:5000{image_url}'
            else:
                image_url = f'http://localhost:5000/static/uploads/{image_url}'
        
        return {
            'id': self.id,
            'product_id': self.product_id,
            'image_url': image_url,
            'is_primary': self.is_primary,
            'display_order': self.display_order,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class ProductSpecification(db.Model):
    __tablename__ = 'product_specifications'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True)
    name = db.Column(db.String(100), nullable=False)
    value = db.Column(db.Text, nullable=False)
    display_order = db.Column(db.Integer, nullable=True)

    def __repr__(self):
        return f'<ProductSpecification {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'name': self.name,
            'value': self.value,
            'display_order': self.display_order
        }

class ProductFeature(db.Model):
    __tablename__ = 'product_features'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True)
    feature = db.Column(db.Text, nullable=False)
    display_order = db.Column(db.Integer, nullable=True)

    def __repr__(self):
        return f'<ProductFeature {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'feature': self.feature,
            'display_order': self.display_order
        }

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True)
    user = db.Column(db.String(100), nullable=False)
    avatar = db.Column(db.String(255), nullable=True)
    title = db.Column(db.String(255), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)

    def __repr__(self):
        return f'<Review {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'user': self.user,
            'avatar': self.avatar,
            'title': self.title,
            'comment': self.comment,
            'rating': self.rating,
            'date': self.date.isoformat() if self.date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Cart(db.Model):
    __tablename__ = 'carts'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)
    items = db.relationship('CartItem', backref='cart', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Cart {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'items': [item.to_dict() for item in self.items],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class CartItem(db.Model):
    __tablename__ = 'cart_items'
    
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)
    
    # Relationship
    product = db.relationship('Product', backref='cart_items')

    def __repr__(self):
        return f'<CartItem {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'cart_id': self.cart_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'product': self.product.to_dict() if self.product else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class DeliveryLocation(db.Model):
    __tablename__ = 'delivery_locations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    city = db.Column(db.String(100), nullable=False)
    shipping_price = db.Column(db.Numeric(10, 2), nullable=False)
    is_active = db.Column(db.Boolean, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    def __repr__(self):
        return f'<DeliveryLocation {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'city': self.city,
            'shippingPrice': float(self.shipping_price),
            'isActive': self.is_active
        }

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    shipping_cost = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), default='pending', nullable=True)
    payment_status = db.Column(db.String(50), default='pending', nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Order {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'postal_code': self.postal_code,
            'total_amount': float(self.total_amount) if self.total_amount else 0,
            'shipping_cost': float(self.shipping_cost) if self.shipping_cost else 0,
            'status': self.status,
            'payment_status': self.payment_status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.items]
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    
    # Relationship
    product = db.relationship('Product', backref='order_items')

    def __repr__(self):
        return f'<OrderItem {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'price': float(self.price) if self.price else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'product': {
                'id': self.product.id,
                'name': self.product.name,
                'image_url': self.product.images[0].image_url if self.product.images else None,
                'price': float(self.product.price) if self.product.price else 0
            }
        } 