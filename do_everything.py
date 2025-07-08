#!/usr/bin/env python3
"""
Comprehensive script to fix everything and start the servers
"""

import os
import sys
import sqlite3
import subprocess
import time
import threading
from datetime import datetime

def fix_database():
    """Fix the admin_users table"""
    print("🔧 Fixing admin_users table...")
    
    # Database path
    db_path = os.path.join('backend', 'app.db')
    print(f"Database path: {db_path}")
    
    # Connect to database
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
        
        # Check if admin user exists
        cursor.execute("SELECT COUNT(*) FROM admin_users")
        count = cursor.fetchone()[0]
        
        if count == 0:
            # Create default admin user (with a simple password hash)
            import hashlib
            password_hash = hashlib.sha256('Admin123!'.encode()).hexdigest()
            
            cursor.execute('''
                INSERT INTO admin_users 
                (username, email, password_hash, role, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                'admin',
                'admin@wega-kitchenware.com',
                password_hash,
                'super_admin',
                True,
                datetime.utcnow()
            ))
            
            print("✅ Default admin user created!")
            print("Username: admin")
            print("Email: admin@wega-kitchenware.com")
            print("Password: Admin123!")
        else:
            print("✅ Admin users already exist")
        
        conn.commit()
        print("✅ admin_users table created successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

def verify_database():
    """Verify the database was created correctly"""
    print("\n🔍 Verifying database...")
    
    db_path = os.path.join('backend', 'app.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if admin_users table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='admin_users'")
        result = cursor.fetchone()
        
        if result:
            print("✅ admin_users table exists")
            
            # Check number of users
            cursor.execute("SELECT COUNT(*) FROM admin_users")
            count = cursor.fetchone()[0]
            print(f"Number of admin users: {count}")
            
            if count > 0:
                cursor.execute("SELECT username, email, role FROM admin_users")
                users = cursor.fetchall()
                print("Admin users:")
                for user in users:
                    print(f"  - {user[0]} ({user[1]}) - {user[2]}")
            
            return True
        else:
            print("❌ admin_users table not found")
            return False
            
    except Exception as e:
        print(f"❌ Error verifying database: {e}")
        return False
    finally:
        conn.close()

def start_backend():
    """Start the backend server"""
    print("\n🚀 Starting backend server...")
    
    try:
        # Change to backend directory
        os.chdir('backend')
        
        # Start the server in a separate thread
        def run_server():
            subprocess.run([sys.executable, 'run.py'])
        
        server_thread = threading.Thread(target=run_server, daemon=True)
        server_thread.start()
        
        # Wait for server to start
        time.sleep(5)
        
        print("✅ Backend server started (running in background)")
        return True
        
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        return False

def check_backend():
    """Check if backend is running"""
    print("\n🔍 Checking backend server...")
    
    try:
        import requests
        response = requests.get('http://localhost:5000/api/health', timeout=5)
        if response.status_code == 200:
            print("✅ Backend server is running on http://localhost:5000")
            return True
        else:
            print(f"⚠️ Backend responded with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"⚠️ Backend server might not be running: {e}")
        return False

def main():
    """Main function to do everything"""
    print("🚀 Starting Wega Kitchenware Complete Setup")
    print("=" * 50)
    
    # Step 1: Fix database
    if not fix_database():
        print("❌ Database fix failed!")
        return False
    
    # Step 2: Verify database
    if not verify_database():
        print("❌ Database verification failed!")
        return False
    
    # Step 3: Start backend
    if not start_backend():
        print("❌ Backend start failed!")
        return False
    
    # Step 4: Check backend
    time.sleep(2)
    check_backend()
    
    # Step 5: Print summary
    print("\n" + "=" * 50)
    print("🎉 Setup Complete!")
    print("=" * 50)
    print("Backend URL: http://localhost:5000")
    print("Admin Login: http://localhost:3000/admin/login")
    print("")
    print("Default Admin Credentials:")
    print("Username: admin")
    print("Email: admin@wega-kitchenware.com")
    print("Password: Admin123!")
    print("")
    print("⚠️ Remember to change the default password after first login!")
    print("")
    print("To start the frontend, run:")
    print("npm run dev")
    print("")
    print("The backend server is running in the background.")
    print("You can now login to the admin panel!")
    
    return True

if __name__ == '__main__':
    success = main()
    if not success:
        sys.exit(1) 