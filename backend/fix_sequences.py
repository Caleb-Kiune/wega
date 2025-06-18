#!/usr/bin/env python3
"""
Script to fix database sequences that are out of sync.
This happens when data is inserted with specific IDs or when sequences get corrupted.
"""

import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_database_url():
    """Get database URL from environment or use default SQLite"""
    db_url = os.getenv('DATABASE_URL')
    if db_url:
        return db_url
    else:
        # Default to SQLite
        basedir = os.path.abspath(os.path.dirname(__file__))
        return f'sqlite:///{os.path.join(basedir, "app.db")}'

def fix_sequences():
    """Fix all sequences in the database"""
    db_url = get_database_url()
    engine = create_engine(db_url)
    
    print(f"Connecting to database: {db_url}")
    
    with engine.connect() as conn:
        # Check if it's PostgreSQL
        if 'postgresql' in db_url:
            print("Detected PostgreSQL database")
            
            # Fix product_images sequence
            print("Fixing product_images sequence...")
            conn.execute(text("""
                SELECT setval('product_images_id_seq', 
                    COALESCE((SELECT MAX(id) FROM product_images), 0) + 1, false);
            """))
            
            # Fix product_specifications sequence
            print("Fixing product_specifications sequence...")
            conn.execute(text("""
                SELECT setval('product_specifications_id_seq', 
                    COALESCE((SELECT MAX(id) FROM product_specifications), 0) + 1, false);
            """))
            
            # Fix product_features sequence
            print("Fixing product_features sequence...")
            conn.execute(text("""
                SELECT setval('product_features_id_seq', 
                    COALESCE((SELECT MAX(id) FROM product_features), 0) + 1, false);
            """))
            
            # Fix products sequence
            print("Fixing products sequence...")
            conn.execute(text("""
                SELECT setval('products_id_seq', 
                    COALESCE((SELECT MAX(id) FROM products), 0) + 1, false);
            """))
            
            # Fix categories sequence
            print("Fixing categories sequence...")
            conn.execute(text("""
                SELECT setval('categories_id_seq', 
                    COALESCE((SELECT MAX(id) FROM categories), 0) + 1, false);
            """))
            
            # Fix brands sequence
            print("Fixing brands sequence...")
            conn.execute(text("""
                SELECT setval('brands_id_seq', 
                    COALESCE((SELECT MAX(id) FROM brands), 0) + 1, false);
            """))
            
        elif 'sqlite' in db_url:
            print("Detected SQLite database")
            print("SQLite doesn't use sequences, but we can check for any issues...")
            
            # For SQLite, we can check if there are any duplicate IDs
            result = conn.execute(text("SELECT COUNT(*) as count FROM product_images"))
            count = result.fetchone()[0]
            print(f"Total product_images: {count}")
            
            result = conn.execute(text("SELECT MAX(id) as max_id FROM product_images"))
            max_id = result.fetchone()[0]
            print(f"Max product_images ID: {max_id}")
        
        conn.commit()
        print("Database sequences fixed successfully!")

if __name__ == "__main__":
    try:
        fix_sequences()
        print("✅ All sequences have been fixed!")
    except Exception as e:
        print(f"❌ Error fixing sequences: {e}")
        sys.exit(1) 