#!/usr/bin/env python3
"""
Script to initialize the database with a default admin user
Run this script to create the initial admin user for JWT authentication
"""

import os
import sys
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app_factory import create_app
from models import db, AdminUser

def create_default_admin():
    """Create a default admin user if none exists"""
    app = create_app()
    
    with app.app_context():
        # Create database tables
        db.create_all()
        
        # Check if any admin users exist
        existing_admin = AdminUser.query.first()
        
        if existing_admin:
            print("Admin user already exists!")
            print(f"Username: {existing_admin.username}")
            print(f"Email: {existing_admin.email}")
            print(f"Role: {existing_admin.role}")
            return
        
        # Create default admin user
        default_username = os.environ.get('DEFAULT_ADMIN_USERNAME', 'admin')
        default_email = os.environ.get('DEFAULT_ADMIN_EMAIL', 'admin@wega-kitchenware.com')
        default_password = os.environ.get('DEFAULT_ADMIN_PASSWORD', 'Admin123!')
        
        print("Creating default admin user...")
        print(f"Username: {default_username}")
        print(f"Email: {default_email}")
        print(f"Password: {default_password}")
        print("\n⚠️  IMPORTANT: Change this password after first login!")
        
        # Create admin user
        admin_user = AdminUser(
            username=default_username,
            email=default_email,
            role='super_admin',
            is_active=True,
            created_at=datetime.utcnow()
        )
        admin_user.set_password(default_password)
        
        try:
            db.session.add(admin_user)
            db.session.commit()
            print("\n✅ Default admin user created successfully!")
            print("\nYou can now login to the admin panel with these credentials.")
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Error creating admin user: {e}")
            return False
        
        return True

if __name__ == '__main__':
    print("🚀 Initializing Admin User for Wega Kitchenware")
    print("=" * 50)
    
    success = create_default_admin()
    
    if success:
        print("\n" + "=" * 50)
        print("🎉 Setup complete! You can now start the application.")
        print("\nNext steps:")
        print("1. Start the backend server: python app.py")
        print("2. Start the frontend: npm run dev")
        print("3. Navigate to /admin and login with the credentials above")
        print("4. Change the default password immediately")
    else:
        print("\n❌ Setup failed. Please check the error messages above.")
        sys.exit(1) 