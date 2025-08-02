#!/usr/bin/env python3
"""
Fix AdminUsers Schema Script
This script adds missing security columns to the admin_users table.
"""

import os
import sys
from datetime import datetime

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app_factory import create_app
from models import db

def fix_admin_users_schema():
    """Add missing columns to admin_users table"""
    print("🔧 Fixing admin_users table schema...")
    
    app = create_app('development')
    
    with app.app_context():
        try:
            # Add missing columns
            print("📝 Adding missing security columns...")
            
            # Add failed_login_attempts column
            db.engine.execute("""
                ALTER TABLE admin_users 
                ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0
            """)
            print("   ✅ Added failed_login_attempts column")
            
            # Add locked_until column
            db.engine.execute("""
                ALTER TABLE admin_users 
                ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP
            """)
            print("   ✅ Added locked_until column")
            
            # Add last_failed_attempt column
            db.engine.execute("""
                ALTER TABLE admin_users 
                ADD COLUMN IF NOT EXISTS last_failed_attempt TIMESTAMP
            """)
            print("   ✅ Added last_failed_attempt column")
            
            # Verify the table structure
            result = db.engine.execute("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = 'admin_users'
                ORDER BY ordinal_position
            """)
            
            print("\n📊 Current admin_users table structure:")
            for row in result:
                print(f"   - {row[0]}: {row[1]} (nullable: {row[2]}, default: {row[3]})")
            
            print("\n✅ Admin users table schema fixed successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Error fixing schema: {e}")
            return False

def test_admin_user_creation():
    """Test creating an admin user with the new schema"""
    print("\n🧪 Testing admin user creation...")
    
    app = create_app('development')
    
    with app.app_context():
        try:
            from models import AdminUser
            from werkzeug.security import generate_password_hash
            
            # Check if admin user already exists
            existing_admin = AdminUser.query.filter_by(username='admin').first()
            if existing_admin:
                print("   ℹ️  Admin user already exists, updating...")
                existing_admin.password_hash = generate_password_hash('Admin123!')
                existing_admin.role = 'super_admin'
                existing_admin.is_active = True
                db.session.commit()
                print("   ✅ Admin user updated successfully")
            else:
                print("   📝 Creating new admin user...")
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
                print("   ✅ Admin user created successfully")
            
            print("   📋 Admin credentials:")
            print("      Username: admin")
            print("      Email: admin@wega-kitchenware.com")
            print("      Password: Admin123!")
            print("      ⚠️  Change this password after first login!")
            
            return True
            
        except Exception as e:
            print(f"❌ Error creating admin user: {e}")
            return False

def main():
    """Main function"""
    print("🚀 Fixing AdminUsers Schema")
    print("=" * 40)
    
    # Fix the schema
    if not fix_admin_users_schema():
        print("❌ Failed to fix schema")
        return
    
    # Test admin user creation
    if not test_admin_user_creation():
        print("❌ Failed to create admin user")
        return
    
    print("\n🎉 Admin users schema fixed successfully!")
    print("✅ All security columns added")
    print("✅ Admin user created/updated")
    print("✅ Ready for seeding")

if __name__ == "__main__":
    main() 