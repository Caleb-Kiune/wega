from datetime import datetime
from . import db

class ProductImage(db.Model):
    __tablename__ = 'product_images'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True)
    image_url = db.Column(db.String(255), nullable=False)
    public_id = db.Column(db.String(255), nullable=True)  # Cloudinary public_id
    is_primary = db.Column(db.Boolean, nullable=True)
    display_order = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)

    # Remove the problematic unique constraint for now
    # We'll handle primary image logic in the application layer
    # __table_args__ = (
    #     db.Index('idx_product_primary_image', 'product_id', 'is_primary', unique=True, 
    #             postgresql_where=db.Column('is_primary') == True),
    # )

    def __repr__(self):
        return f'<ProductImage {self.id}>'

    def to_dict(self):
        # Format image URL using helper function
        from utils.helpers import format_image_url
        image_url = format_image_url(self.image_url)
        
        return {
            'id': self.id,
            'product_id': self.product_id,
            'image_url': image_url,
            'public_id': self.public_id,
            'is_primary': self.is_primary,
            'display_order': self.display_order,
            'created_at': self.created_at.isoformat() if self.created_at else None
        } 