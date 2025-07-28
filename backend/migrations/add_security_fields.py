#!/usr/bin/env python3
"""
Migration script to add security fields to admin_users table
"""

import os
import sys
import sqlite3
from datetime import datetime

def add_security_fields():
    """Add security fields to admin_users table"""
    
    # Database path
    db_path = os.path.join(os.path.dirname(__file__), '..', 'app.db')
    print(f"Adding security fields to database: {db_path}")
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if fields already exist
        cursor.execute("PRAGMA table_info(admin_users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add failed_login_attempts column if it doesn't exist
        if 'failed_login_attempts' not in columns:
            cursor.execute('ALTER TABLE admin_users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0')
            print("✅ Added failed_login_attempts column")
        
        # Add locked_until column if it doesn't exist
        if 'locked_until' not in columns:
            cursor.execute('ALTER TABLE admin_users ADD COLUMN locked_until DATETIME')
            print("✅ Added locked_until column")
        
        # Add last_failed_attempt column if it doesn't exist
        if 'last_failed_attempt' not in columns:
            cursor.execute('ALTER TABLE admin_users ADD COLUMN last_failed_attempt DATETIME')
            print("✅ Added last_failed_attempt column")
        
        conn.commit()
        print("✅ Security fields added successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error adding security fields: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    add_security_fields() 