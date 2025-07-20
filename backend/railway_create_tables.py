#!/usr/bin/env python3
"""
Railway Create Tables Script
Creates database tables directly on Railway PostgreSQL
"""

import os
import sys
from app_factory import create_app

def create_railway_tables():
    """Create database tables on Railway"""
    
    print("🔧 Creating Railway Database Tables")
    print("=" * 50)
    
    # Create the app with production config
    app = create_app('production')
    
    with app.app_context():
        try:
            print("🔄 Creating database tables on Railway...")
            
            # Import all models to ensure they're registered
            from models import db
            from models.product import Product
            from models.category import Category
            from models.brand import Brand
            from models.review import Review
            from models.cart import Cart
            from models.cart_item import CartItem
            from models.order import Order, OrderItem
            from models.user import User
            from models.product_image import ProductImage
            
            # Drop all tables first (in case they exist)
            print("🔄 Dropping existing tables...")
            db.drop_all()
            
            # Create all tables
            print("🔄 Creating new tables...")
            db.create_all()
            
            print("✅ Database tables created successfully on Railway!")
            print("📊 Tables created:")
            
            # List all tables
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            for table in tables:
                print(f"   - {table}")
                
            return True
            
        except Exception as e:
            print(f"❌ Failed to create tables: {e}")
            print(f"❌ Error type: {type(e).__name__}")
            
            try:
                import traceback
                print(f"❌ Full traceback:")
                traceback.print_exc()
            except:
                pass
            
            return False

if __name__ == "__main__":
    create_railway_tables() 