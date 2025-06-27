from datetime import datetime
from . import db

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
        
        # Format image URL using helper function
        from utils.helpers import format_image_url
        if primary_image:
            primary_image = format_image_url(primary_image)
        
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