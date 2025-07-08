#!/usr/bin/env python3
"""
Simple script to create database tables
"""

import sqlite3
import os
from datetime import datetime

def create_tables():
    """Create the admin_users table"""
    
    # Database file path
    db_path = os.path.join(os.path.dirname(__file__), 'app.db')
    
    print(f"Creating database at: {db_path}")
    
    # Connect to database (creates it if it doesn't exist)
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
        cursor.execute('SELECT COUNT(*) FROM admin_users')
        count = cursor.fetchone()[0]
        
        if count == 0:
            # Create default admin user
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
            
            print("✅ Default admin user created!")
            print("Username: admin")
            print("Email: admin@wega-kitchenware.com")
            print("Password: Admin123!")
            print("\n⚠️  IMPORTANT: Change this password after first login!")
        else:
            print("✅ Admin user already exists")
        
        # Commit changes
        conn.commit()
        print("✅ Database tables created successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    print("🚀 Creating database tables for Wega Kitchenware")
    print("=" * 50)
    create_tables()
    print("\n🎉 Setup complete!") 