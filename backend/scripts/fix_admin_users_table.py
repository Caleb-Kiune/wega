#!/usr/bin/env python3
"""
Fix admin_users table by adding missing security columns
"""

import os
import sys
from datetime import datetime

# Add the parent directory to the path so we can import our models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app_factory import create_app
from models import db

def fix_admin_users_table():
    """Add missing security columns to admin_users table"""
    
    print("🔧 Fixing admin_users table structure...")
    print("=" * 50)
    
    # Create app with production config
    app = create_app('production')
    
    with app.app_context():
        try:
            # Test database connection
            print("🔍 Testing database connection...")
            db.engine.execute("SELECT 1")
            print("✅ Database connection successful")
            
            # Check if columns exist
            inspector = db.inspect(db.engine)
            admin_columns = [col['name'] for col in inspector.get_columns('admin_users')]
            
            print(f"Current columns: {admin_columns}")
            
            # Columns that need to be added
            missing_columns = []
            
            if 'failed_login_attempts' not in admin_columns:
                missing_columns.append('failed_login_attempts INTEGER DEFAULT 0')
            
            if 'locked_until' not in admin_columns:
                missing_columns.append('locked_until TIMESTAMP')
            
            if 'last_failed_attempt' not in admin_columns:
                missing_columns.append('last_failed_attempt TIMESTAMP')
            
            if missing_columns:
                print(f"Missing columns: {missing_columns}")
                print("🔧 Adding missing columns...")
                
                for column_def in missing_columns:
                    column_name = column_def.split()[0]
                    print(f"  Adding column: {column_name}")
                    db.engine.execute(f"ALTER TABLE admin_users ADD COLUMN {column_def}")
                
                print("✅ All missing columns added successfully")
            else:
                print("✅ All required columns already exist")
            
            # Verify the fix
            print("\n🔍 Verifying table structure...")
            inspector = db.inspect(db.engine)
            admin_columns = [col['name'] for col in inspector.get_columns('admin_users')]
            
            required_columns = [
                'id', 'username', 'email', 'password_hash', 'role',
                'is_active', 'created_at', 'last_login', 'updated_at',
                'failed_login_attempts', 'locked_until', 'last_failed_attempt'
            ]
            
            all_good = True
            for column in required_columns:
                if column in admin_columns:
                    print(f"   ✅ {column}")
                else:
                    print(f"   ❌ {column} - MISSING!")
                    all_good = False
            
            if all_good:
                print("\n🎉 admin_users table structure is now correct!")
        return True
            else:
                print("\n❌ Some columns are still missing")
                return False
        
    except Exception as e:
            print(f"❌ Error fixing admin_users table: {e}")
            print(f"Error type: {type(e).__name__}")
        return False

def create_admin_user():
    """Create admin user if it doesn't exist"""
    
    print("\n👤 Checking admin user...")
    
    app = create_app('production')
    
    with app.app_context():
        try:
            from models import AdminUser
            
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
            
        return True
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        return False

def test_login():
    """Test login functionality"""
    
    print("\n🔐 Testing login functionality...")
    
    app = create_app('production')
        
        with app.app_context():
        try:
            from models import AdminUser
            
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
    # Fix table structure
    if fix_admin_users_table():
        # Create admin user
        if create_admin_user():
            # Test login
            test_login()
        else:
            print("❌ Failed to create admin user")
    else:
        print("❌ Failed to fix admin_users table")
        sys.exit(1) 