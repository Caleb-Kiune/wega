#!/usr/bin/env python3
"""
Script to fix missing admin_users table migration
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
    
    print("🔍 Checking database and migration status")
    print("=" * 50)
    
    # Create Flask app
    app = create_app()
    
    with app.app_context():
        # Check current tables in metadata
        print("Tables in SQLAlchemy metadata:")
        for table_name in db.metadata.tables.keys():
            print(f"  - {table_name}")
        
        # Check if admin_users table exists in database
        try:
            result = db.session.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='admin_users'")
            admin_users_exists = result.fetchone() is not None
            print(f"\nadmin_users table exists in database: {admin_users_exists}")
        except Exception as e:
            print(f"Error checking admin_users table: {e}")
            admin_users_exists = False
        
        if not admin_users_exists:
            print("\n❌ admin_users table is missing from database!")
            print("Creating admin_users table...")
            
            # Create the table manually
            db.create_all()
            
            # Check again
            result = db.session.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='admin_users'")
            admin_users_exists = result.fetchone() is not None
            print(f"admin_users table created: {admin_users_exists}")
            
            if admin_users_exists:
                # Create default admin user
                print("\nCreating default admin user...")
                
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
        else:
            print("✅ admin_users table exists in database")
            
            # Check if admin user exists
            try:
                admin_count = AdminUser.query.count()
                print(f"Number of admin users: {admin_count}")
                
                if admin_count == 0:
                    print("\nCreating default admin user...")
                    
                    admin_user = AdminUser(
                        username='admin',
                        email='admin@wega-kitchenware.com',
                        password_hash=generate_password_hash('Admin123!'),
                        role='super_admin',
                        is_active=True,
                        created_at=datetime.utcnow()
                    )
                    
                    db.session.add(admin_user)
                    db.session.commit()
                    print("✅ Default admin user created!")
                else:
                    print("✅ Admin users already exist")
                    
            except Exception as e:
                print(f"❌ Error checking admin users: {e}")
        
        print("\n" + "=" * 50)
        print("🎉 Database setup complete!")
        
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you have all required dependencies installed:")
    print("pip install flask flask-sqlalchemy flask-migrate werkzeug")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1) 