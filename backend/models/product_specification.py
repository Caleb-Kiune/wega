from datetime import datetime
from . import db

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