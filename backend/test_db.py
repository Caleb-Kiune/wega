#!/usr/bin/env python3
"""
Test database connection and admin_users table
"""

import sqlite3
import os

def test_database():
    """Test the database connection and admin_users table"""
    
    # Database file path
    db_path = os.path.join(os.path.dirname(__file__), 'app.db')
    
    print(f"Testing database at: {db_path}")
    print(f"Database file exists: {os.path.exists(db_path)}")
    
    if not os.path.exists(db_path):
        print("❌ Database file does not exist!")
        return
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if admin_users table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='admin_users'")
        table_exists = cursor.fetchone()
        
        if table_exists:
            print("✅ admin_users table exists")
            
            # Check table structure
            cursor.execute("PRAGMA table_info(admin_users)")
            columns = cursor.fetchall()
            print(f"Table columns: {[col[1] for col in columns]}")
            
            # Check if there are any users
            cursor.execute("SELECT COUNT(*) FROM admin_users")
            count = cursor.fetchone()[0]
            print(f"Number of admin users: {count}")
            
            if count > 0:
                # Show user details
                cursor.execute("SELECT username, email, role, is_active FROM admin_users")
                users = cursor.fetchall()
                print("\nAdmin users:")
                for user in users:
                    print(f"  - Username: {user[0]}, Email: {user[1]}, Role: {user[2]}, Active: {user[3]}")
            else:
                print("❌ No admin users found in the table")
                
        else:
            print("❌ admin_users table does not exist!")
            
            # Show all tables
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = cursor.fetchall()
            print(f"Available tables: {[table[0] for table in tables]}")
        
    except Exception as e:
        print(f"❌ Error testing database: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    print("🔍 Testing Wega Kitchenware Database")
    print("=" * 50)
    test_database()
    print("\n" + "=" * 50) 