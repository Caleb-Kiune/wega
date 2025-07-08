#!/usr/bin/env python3
"""
Comprehensive script to fix admin_users table issue
"""

import os
import sys
import sqlite3
from datetime import datetime

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def check_database():
    """Check current database state"""
    
    db_path = os.path.join(os.path.dirname(__file__), 'app.db')
    print(f"🔍 Checking database: {db_path}")
    
    if not os.path.exists(db_path):
        print("❌ Database file does not exist!")
        return False
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if admin_users table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='admin_users'")
        admin_users_exists = cursor.fetchone() is not None
        
        if admin_users_exists:
            print("✅ admin_users table exists in database")
            
            # Check table structure
            cursor.execute("PRAGMA table_info(admin_users)")
            columns = cursor.fetchall()
            print(f"Table columns: {[col[1] for col in columns]}")
            
            # Check if there are any users
            cursor.execute("SELECT COUNT(*) FROM admin_users")
            count = cursor.fetchone()[0]
            print(f"Number of admin users: {count}")
            
            if count > 0:
                cursor.execute("SELECT username, email, role, is_active FROM admin_users")
                users = cursor.fetchall()
                print("\nAdmin users:")
                for user in users:
                    print(f"  - Username: {user[0]}, Email: {user[1]}, Role: {user[2]}, Active: {user[3]}")
            
            conn.close()
            return True
        else:
            print("❌ admin_users table does not exist in database")
            conn.close()
            return False
            
    except Exception as e:
        print(f"❌ Error checking database: {e}")
        conn.close()
        return False

def create_admin_users_table():
    """Create admin_users table manually"""
    
    print("\n🔧 Creating admin_users table...")
    
    db_path = os.path.join(os.path.dirname(__file__), 'app.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Create admin_users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS admin_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(80) UNIQUE NOT NULL,
                email VARCHAR(120) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'admin',
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME NOT NULL,
                last_login DATETIME,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create indexes
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email)')
        
        conn.commit()
        print("✅ admin_users table created successfully!")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating table: {e}")
        conn.rollback()
        conn.close()
        return False

def create_default_admin():
    """Create default admin user"""
    
    print("\n👤 Creating default admin user...")
    
    db_path = os.path.join(os.path.dirname(__file__), 'app.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if admin user exists
        cursor.execute("SELECT COUNT(*) FROM admin_users")
        count = cursor.fetchone()[0]
        
        if count == 0:
            # Import here to avoid circular imports
            from werkzeug.security import generate_password_hash
            
            admin_data = {
                'username': 'admin',
                'email': 'admin@wega-kitchenware.com',
                'password_hash': generate_password_hash('Admin123!'),
                'role': 'super_admin',
                'is_active': True,
                'created_at': datetime.utcnow()
            }
            
            cursor.execute('''
                INSERT INTO admin_users 
                (username, email, password_hash, role, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                admin_data['username'],
                admin_data['email'],
                admin_data['password_hash'],
                admin_data['role'],
                admin_data['is_active'],
                admin_data['created_at']
            ))
            
            conn.commit()
            print("✅ Default admin user created!")
            print("Username: admin")
            print("Email: admin@wega-kitchenware.com")
            print("Password: Admin123!")
            print("\n⚠️  IMPORTANT: Change this password after first login!")
        else:
            print("✅ Admin users already exist")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        conn.rollback()
        conn.close()
        return False

def test_flask_connection():
    """Test Flask SQLAlchemy connection"""
    
    print("\n🧪 Testing Flask SQLAlchemy connection...")
    
    try:
        from app_factory import create_app
        from models import db, AdminUser
        
        app = create_app()
        
        with app.app_context():
            # Test query
            try:
                admin_count = AdminUser.query.count()
                print(f"✅ Flask SQLAlchemy connection successful!")
                print(f"Number of admin users: {admin_count}")
                return True
            except Exception as e:
                print(f"❌ Flask SQLAlchemy query failed: {e}")
                return False
                
    except Exception as e:
        print(f"❌ Error testing Flask connection: {e}")
        return False

def main():
    """Main function to fix admin_users table"""
    
    print("🚀 Fixing admin_users table issue")
    print("=" * 50)
    
    # Step 1: Check current database state
    if check_database():
        print("\n✅ Database is properly configured")
        
        # Test Flask connection
        if test_flask_connection():
            print("\n🎉 Everything is working correctly!")
            return True
        else:
            print("\n❌ Flask connection failed")
            return False
    else:
        print("\n❌ Database needs to be fixed")
        
        # Step 2: Create admin_users table
        if create_admin_users_table():
            # Step 3: Create default admin user
            if create_default_admin():
                # Step 4: Test Flask connection
                if test_flask_connection():
                    print("\n🎉 Database fixed successfully!")
                    return True
                else:
                    print("\n❌ Flask connection still failing")
                    return False
            else:
                print("\n❌ Failed to create admin user")
                return False
        else:
            print("\n❌ Failed to create admin_users table")
            return False

if __name__ == '__main__':
    success = main()
    
    if success:
        print("\n" + "=" * 50)
        print("🎉 Setup complete! You can now login to the admin panel.")
        print("\nDefault credentials:")
        print("Username: admin")
        print("Email: admin@wega-kitchenware.com")
        print("Password: Admin123!")
    else:
        print("\n❌ Setup failed!")
        sys.exit(1) 