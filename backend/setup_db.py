#!/usr/bin/env python3
"""
Simple script to setup the database and create admin user
"""

import os
import sys
from datetime import datetime

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app_factory import create_app
    from models import db, AdminUser
    from werkzeug.security import generate_password_hash
    
    print("🚀 Setting up database for Wega Kitchenware")
    print("=" * 50)
    
    # Create Flask app
    app = create_app()
    
    with app.app_context():
        # Create all tables
        print("Creating database tables...")
        db.create_all()
        print("✅ Database tables created successfully!")
        
        # Check if admin user exists
        existing_admin = AdminUser.query.first()
        
        if existing_admin:
            print(f"✅ Admin user already exists: {existing_admin.username}")
            print(f"Email: {existing_admin.email}")
            print(f"Role: {existing_admin.role}")
        else:
            # Create default admin user
            print("Creating default admin user...")
            
            admin_user = AdminUser(
                username='admin',
                email='admin@wega-kitchenware.com',
                password_hash=generate_password_hash('Admin123!'),
                role='super_admin',
                is_active=True,
                created_at=datetime.utcnow()
            )
            
            try:
                db.session.add(admin_user)
                db.session.commit()
                print("✅ Default admin user created successfully!")
                print("Username: admin")
                print("Email: admin@wega-kitchenware.com")
                print("Password: Admin123!")
                print("\n⚠️  IMPORTANT: Change this password after first login!")
            except Exception as e:
                db.session.rollback()
                print(f"❌ Error creating admin user: {e}")
                sys.exit(1)
        
        print("\n" + "=" * 50)
        print("🎉 Database setup complete!")
        print("You can now login to the admin panel.")
        
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you have all required dependencies installed:")
    print("pip install flask flask-sqlalchemy werkzeug")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1) 