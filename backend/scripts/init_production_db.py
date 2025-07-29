#!/usr/bin/env python3
"""
Production Database Initialization Script
This script ensures all required tables exist and creates a default admin user.
"""

import os
import sys
from datetime import datetime

# Add the parent directory to the path so we can import our models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app_factory import create_app
from models import db, AdminUser

def init_production_database():
    """Initialize production database with all required tables"""
    
    print("🚀 Initializing Production Database")
    print("=" * 50)
    
    # Create app with production config
    app = create_app('production')
    
    with app.app_context():
        try:
            # Test database connection
            print("🔍 Testing database connection...")
            db.engine.execute("SELECT 1")
            print("✅ Database connection successful")
            
            # Create all tables
            print("🔧 Creating database tables...")
            db.create_all()
            print("✅ All tables created successfully")
            
            # Check if admin user exists
            admin_user = AdminUser.query.filter_by(username='admin').first()
            
            if not admin_user:
                print("👤 Creating default admin user...")
                
                # Create default admin user
                admin_user = AdminUser(
                    username='admin',
                    email='admin@wega-kitchenware.com',
                    role='super_admin',
                    is_active=True,
                    created_at=datetime.utcnow()
                )
                admin_user.set_password('Admin123!')
                
                db.session.add(admin_user)
                db.session.commit()
                
                print("✅ Default admin user created successfully")
                print("   Username: admin")
                print("   Email: admin@wega-kitchenware.com")
                print("   Password: Admin123!")
                print("   ⚠️  Remember to change the password after first login!")
            else:
                print("✅ Admin user already exists")
            
            # Verify all required tables exist
            print("\n🔍 Verifying table structure...")
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            
            required_tables = [
                'admin_users', 'products', 'categories', 'brands',
                'product_images', 'product_specifications', 'product_features',
                'reviews', 'carts', 'cart_items', 'delivery_locations',
                'orders', 'order_items'
            ]
            
            for table in required_tables:
                if table in tables:
                    print(f"   ✅ {table}")
                else:
                    print(f"   ❌ {table} - MISSING!")
            
            # Check admin_users table structure
            print("\n🔍 Checking admin_users table structure...")
            admin_columns = [col['name'] for col in inspector.get_columns('admin_users')]
            required_columns = [
                'id', 'username', 'email', 'password_hash', 'role',
                'is_active', 'created_at', 'last_login', 'updated_at',
                'failed_login_attempts', 'locked_until', 'last_failed_attempt'
            ]
            
            for column in required_columns:
                if column in admin_columns:
                    print(f"   ✅ {column}")
                else:
                    print(f"   ❌ {column} - MISSING!")
            
            print("\n🎉 Production database initialization completed successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Database initialization failed: {e}")
            print(f"Error type: {type(e).__name__}")
            return False

def test_admin_login():
    """Test admin login functionality"""
    print("\n🔐 Testing admin login...")
    
    app = create_app('production')
    
    with app.app_context():
        try:
            # Test admin user query
            admin_user = AdminUser.query.filter_by(username='admin').first()
            
            if admin_user:
                print("✅ Admin user found")
                print(f"   Username: {admin_user.username}")
                print(f"   Email: {admin_user.email}")
                print(f"   Role: {admin_user.role}")
                print(f"   Active: {admin_user.is_active}")
                
                # Test password verification
                if admin_user.check_password('Admin123!'):
                    print("✅ Password verification successful")
                else:
                    print("❌ Password verification failed")
                    return False
                
                return True
            else:
                print("❌ Admin user not found")
                return False
                
        except Exception as e:
            print(f"❌ Login test failed: {e}")
            return False

if __name__ == '__main__':
    # Initialize database
    if init_production_database():
        # Test login functionality
        test_admin_login()
    else:
        print("❌ Database initialization failed!")
        sys.exit(1)