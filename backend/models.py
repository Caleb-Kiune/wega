from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    products = db.relationship('Product', backref='category', lazy=True)

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
    description = db.Column(db.Text)
    logo_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    products = db.relationship('Product', backref='brand', lazy=True)

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
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    original_price = db.Column(db.Numeric(10, 2))
    sku = db.Column(db.String(50), unique=True)
    stock = db.Column(db.Integer, default=0)
    rating = db.Column(db.Numeric(3, 2))
    review_count = db.Column(db.Integer, default=0)
    is_new = db.Column(db.Boolean, default=False)
    is_sale = db.Column(db.Boolean, default=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    brand_id = db.Column(db.Integer, db.ForeignKey('brands.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    images = db.relationship('ProductImage', backref='product', lazy=True, order_by='ProductImage.display_order')
    specifications = db.relationship('ProductSpecification', backref='product', lazy=True, order_by='ProductSpecification.display_order')
    features = db.relationship('ProductFeature', backref='product', lazy=True, order_by='ProductFeature.display_order')
    reviews = db.relationship('Review', backref='product', lazy=True)

    def to_dict(self):
        # Get the primary image URL
        primary_image = next((img.image_url for img in self.images if img.is_primary), 
                           self.images[0].image_url if self.images else None)
        
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price) if self.price else None,
            'originalPrice': float(self.original_price) if self.original_price else None,
            'image': primary_image,
            'images': [img.to_dict() for img in self.images],
            'isNew': self.is_new,
            'isSale': self.is_sale,
            'category': self.category.name if self.category else None,
            'brand': self.brand.name if self.brand else None,
            'rating': float(self.rating) if self.rating else None,
            'reviewCount': self.review_count,
            'stock': self.stock,
            'sku': self.sku,
            'features': [feature.to_dict() for feature in self.features],
            'specifications': [spec.to_dict() for spec in self.specifications],
            'reviews': [review.to_dict() for review in self.reviews]
        }

class ProductImage(db.Model):
    __tablename__ = 'product_images'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    image_url = db.Column(db.String(255), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'image_url': self.image_url,
            'is_primary': self.is_primary,
            'display_order': self.display_order,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class ProductSpecification(db.Model):
    __tablename__ = 'product_specifications'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    name = db.Column(db.String(100), nullable=False)
    value = db.Column(db.Text, nullable=False)
    display_order = db.Column(db.Integer, default=0)

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
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    feature = db.Column(db.Text, nullable=False)
    display_order = db.Column(db.Integer, default=0)

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
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    user = db.Column(db.String(100), nullable=False)
    avatar = db.Column(db.String(255))
    title = db.Column(db.String(255), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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