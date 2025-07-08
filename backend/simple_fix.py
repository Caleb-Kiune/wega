#!/usr/bin/env python3
import sqlite3
import os
from datetime import datetime

# Database path
db_path = os.path.join(os.path.dirname(__file__), 'app.db')
print(f"Fixing database: {db_path}")

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
    
except Exception as e:
    print(f"❌ Error: {e}")
    conn.rollback()
finally:
    conn.close() 