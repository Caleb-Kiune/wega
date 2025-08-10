#!/usr/bin/env python3
"""
Script to create the customer_users table
Run this after adding the CustomerUser model
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app_factory import create_app
from models import db, CustomerUser

def create_customer_users_table():
    """Create the customer_users table"""
    app = create_app()
    
    with app.app_context():
        try:
            # Create the table
            db.create_all()
            print("✅ customer_users table created successfully!")
            
            # Verify the table exists
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            
            if 'customer_users' in tables:
                print("✅ Table verification successful!")
                print(f"Available tables: {tables}")
            else:
                print("❌ Table verification failed!")
                
        except Exception as e:
            print(f"❌ Error creating table: {e}")
            return False
    
    return True

if __name__ == "__main__":
    print("🚀 Creating customer_users table...")
    success = create_customer_users_table()
    
    if success:
        print("🎉 Setup completed successfully!")
    else:
        print("💥 Setup failed!")
        sys.exit(1)
