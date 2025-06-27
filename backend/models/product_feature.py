from datetime import datetime
from . import db

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