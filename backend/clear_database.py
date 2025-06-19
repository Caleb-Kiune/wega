#!/usr/bin/env python3
"""
Script to clear all database content while preserving the database structure.
This will truncate all tables but keep the schema intact.
"""

import os
import sys
from sqlalchemy import text
from app import app, db
from models import (
    Product, Category, Brand, ProductImage, ProductSpecification, 
    ProductFeature, Review, Cart, CartItem, DeliveryLocation, Order, OrderItem
)

def clear_database():
    """Clear all data from all tables while preserving the schema."""
    
    with app.app_context():
        try:
            print("🗑️  Clearing database content...")
            
            # Clear tables in reverse dependency order to avoid foreign key constraint issues
            tables_to_clear = [
                OrderItem,      # Depends on Order and Product
                Order,          # Depends on Cart
                CartItem,       # Depends on Cart and Product
                Cart,           # Depends on nothing
                Review,         # Depends on Product
                ProductFeature, # Depends on Product
                ProductSpecification, # Depends on Product
                ProductImage,   # Depends on Product
                Product,        # Depends on Category and Brand
                Category,       # Depends on nothing
                Brand,          # Depends on nothing
                DeliveryLocation # Depends on nothing
            ]
            
            for table_class in tables_to_clear:
                table_name = table_class.__tablename__
                print(f"  Clearing {table_name}...")
                
                # Delete all records from the table
                db.session.query(table_class).delete()
            
            # Commit all changes
            db.session.commit()
            
            print("✅ Database cleared successfully!")
            print("\n📊 Summary of cleared tables:")
            for table_class in tables_to_clear:
                table_name = table_class.__tablename__
                count = db.session.query(table_class).count()
                print(f"  - {table_name}: {count} records")
            
        except Exception as e:
            print(f"❌ Error clearing database: {str(e)}")
            db.session.rollback()
            sys.exit(1)

if __name__ == "__main__":
    clear_database() 