#!/usr/bin/env python3
"""
Script to check the current state of the database.
"""

from app import app, db
from models import (
    Product, Category, Brand, ProductImage, ProductSpecification, 
    ProductFeature, Review, Cart, CartItem, DeliveryLocation, Order, OrderItem
)

def check_database():
    """Check what data is currently in the database."""
    
    with app.app_context():
        print("📊 Database Status Report")
        print("=" * 50)
        
        tables_to_check = [
            Product, Category, Brand, ProductImage, ProductSpecification, 
            ProductFeature, Review, Cart, CartItem, DeliveryLocation, Order, OrderItem
        ]
        
        for table_class in tables_to_check:
            table_name = table_class.__tablename__
            count = db.session.query(table_class).count()
            print(f"  {table_name}: {count} records")
            
            # If there are records, show some details
            if count > 0:
                records = db.session.query(table_class).limit(3).all()
                for i, record in enumerate(records):
                    if hasattr(record, 'name'):
                        print(f"    - {i+1}. {record.name}")
                    elif hasattr(record, 'id'):
                        print(f"    - {i+1}. ID: {record.id}")
                    if hasattr(record, 'sku'):
                        print(f"      SKU: {record.sku}")
        
        print("\n" + "=" * 50)

if __name__ == "__main__":
    check_database() 