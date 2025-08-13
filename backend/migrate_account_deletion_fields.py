#!/usr/bin/env python3
"""
Migration script to add account deletion fields to customer_users table
"""
import sqlite3
import os
from datetime import datetime

def migrate_account_deletion_fields():
    """Add account deletion fields to customer_users table"""
    
    # Get the database path
    db_path = os.path.join(os.path.dirname(__file__), 'app.db')
    
    print(f"🔧 Migrating database: {db_path}")
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if the fields already exist
        cursor.execute("PRAGMA table_info(customer_users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        print(f"Current columns: {columns}")
        
        # Add new fields if they don't exist
        new_fields = [
            ('deleted_at', 'DATETIME'),
            ('deletion_reason', 'VARCHAR(255)'),
            ('data_export_requested', 'BOOLEAN DEFAULT 0'),
            ('data_export_date', 'DATETIME')
        ]
        
        for field_name, field_type in new_fields:
            if field_name not in columns:
                print(f"Adding field: {field_name} ({field_type})")
                cursor.execute(f"ALTER TABLE customer_users ADD COLUMN {field_name} {field_type}")
            else:
                print(f"Field already exists: {field_name}")
        
        # Commit the changes
        conn.commit()
        
        # Verify the changes
        cursor.execute("PRAGMA table_info(customer_users)")
        updated_columns = [column[1] for column in cursor.fetchall()]
        print(f"Updated columns: {updated_columns}")
        
        print("✅ Migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_account_deletion_fields()
