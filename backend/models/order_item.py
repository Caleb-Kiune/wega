from datetime import datetime
from . import db

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
        # Format image URL using helper function
        from utils.helpers import format_image_url
        primary_image = None
        if self.product and self.product.images:
            primary_image = next((img.image_url for img in self.product.images if img.is_primary), 
                               self.product.images[0].image_url if self.product.images else None)
        
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'price': float(self.price) if self.price else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'product': {
                'id': self.product.id if self.product else None,
                'name': self.product.name if self.product else 'Unknown Product',
                'image_url': format_image_url(primary_image) if primary_image else None,
                'price': float(self.product.price) if self.product and self.product.price else 0
            }
        } 