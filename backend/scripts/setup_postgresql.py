#!/usr/bin/env python3
"""
PostgreSQL Database Setup Script
This script creates all tables in PostgreSQL using SQLAlchemy models.
"""

import os
import sys

# Add the parent directory to the path so we can import our models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app_factory import create_app
from models import db

def setup_database():
    """Set up the PostgreSQL database with all tables"""
    print("🚀 Setting up PostgreSQL database...")
    
    # Create Flask app with development config
    app = create_app('development')
    
    with app.app_context():
        try:
            # Create all tables
            print("📋 Creating database tables...")
            db.create_all()
            print("✅ All tables created successfully")
            
            # Verify tables were created
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📊 Created {len(tables)} tables:")
            for table in tables:
                print(f"   - {table}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error setting up database: {e}")
            return False

def verify_connection():
    """Verify PostgreSQL connection"""
    print("🔍 Verifying PostgreSQL connection...")
    
    try:
        app = create_app('development')
        with app.app_context():
            # Test connection
            db.engine.execute("SELECT 1")
            print("✅ PostgreSQL connection successful")
            return True
    except Exception as e:
        print(f"❌ PostgreSQL connection failed: {e}")
        return False

def main():
    """Main setup function"""
    print("=" * 50)
    print("PostgreSQL Database Setup")
    print("=" * 50)
    
    # Verify connection first
    if not verify_connection():
        print("❌ Cannot proceed without database connection")
        return
    
    # Set up database
    if setup_database():
        print("\n🎉 PostgreSQL database setup completed successfully!")
        print("✅ All tables created and ready for data migration")
    else:
        print("\n❌ Database setup failed")

if __name__ == "__main__":
    main() 