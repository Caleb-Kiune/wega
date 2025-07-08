#!/usr/bin/env python3
"""
Script to generate migration for admin_users table
"""

import os
import sys
import subprocess

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def generate_migration():
    """Generate a new migration for admin_users table"""
    
    print("🔧 Generating migration for admin_users table")
    print("=" * 50)
    
    try:
        # Check if we're in the backend directory
        if not os.path.exists('migrations'):
            print("❌ Migrations directory not found!")
            print("Make sure you're in the backend directory")
            return False
        
        # Generate migration
        print("Generating migration...")
        result = subprocess.run([
            'flask', 'db', 'migrate', '-m', 'Add admin_users table'
        ], capture_output=True, text=True, cwd=os.getcwd())
        
        if result.returncode == 0:
            print("✅ Migration generated successfully!")
            print(result.stdout)
            
            # Apply the migration
            print("\nApplying migration...")
            result = subprocess.run([
                'flask', 'db', 'upgrade'
            ], capture_output=True, text=True, cwd=os.getcwd())
            
            if result.returncode == 0:
                print("✅ Migration applied successfully!")
                print(result.stdout)
                return True
            else:
                print("❌ Error applying migration:")
                print(result.stderr)
                return False
        else:
            print("❌ Error generating migration:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def create_admin_user():
    """Create default admin user"""
    
    print("\n👤 Creating default admin user...")
    
    try:
        from app_factory import create_app
        from models import db, AdminUser
        from werkzeug.security import generate_password_hash
        from datetime import datetime
        
        app = create_app()
        
        with app.app_context():
            # Check if admin user exists
            admin_count = AdminUser.query.count()
            
            if admin_count == 0:
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
                print("Username: admin")
                print("Email: admin@wega-kitchenware.com")
                print("Password: Admin123!")
                print("\n⚠️  IMPORTANT: Change this password after first login!")
            else:
                print("✅ Admin users already exist")
                
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        return False
    
    return True

if __name__ == '__main__':
    print("🚀 Setting up admin_users table migration")
    print("=" * 50)
    
    # Generate and apply migration
    if generate_migration():
        # Create admin user
        create_admin_user()
        
        print("\n" + "=" * 50)
        print("🎉 Migration setup complete!")
        print("You can now login to the admin panel.")
    else:
        print("\n❌ Migration setup failed!")
        sys.exit(1) 