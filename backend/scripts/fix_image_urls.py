#!/usr/bin/env python3
"""
Script to fix hardcoded image URLs in the database
"""

import os
import sys
import sqlite3

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def fix_image_urls():
    """Fix hardcoded image URLs in the database"""
    
    print("🔧 Fixing image URLs in database...")
    
    db_path = os.path.join(os.path.dirname(__file__), 'app.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check for hardcoded URLs in product_images table
        cursor.execute("""
            SELECT id, image_url FROM product_images 
            WHERE image_url LIKE '%your-domain.com%'
        """)
        
        hardcoded_images = cursor.fetchall()
        print(f"Found {len(hardcoded_images)} images with hardcoded URLs")
        
        for img_id, image_url in hardcoded_images:
            print(f"  ID: {img_id}, URL: {image_url}")
            
            # Fix the URL to use localhost
            if 'your-domain.com' in image_url:
                new_url = image_url.replace('https://your-domain.com', 'http://localhost:5000')
                cursor.execute("""
                    UPDATE product_images 
                    SET image_url = ? 
                    WHERE id = ?
                """, (new_url, img_id))
                print(f"    Fixed: {new_url}")
        
        # Check for hardcoded URLs in products table (if image_url column exists)
        try:
            cursor.execute("""
                SELECT id, name FROM products 
                WHERE image_url LIKE '%your-domain.com%'
            """)
            
            hardcoded_products = cursor.fetchall()
            print(f"Found {len(hardcoded_products)} products with hardcoded URLs")
            
            for prod_id, name in hardcoded_products:
                print(f"  ID: {prod_id}, Name: {name}")
        except sqlite3.OperationalError as e:
            if "no such column" in str(e):
                print("Products table doesn't have image_url column (this is normal)")
            else:
                print(f"Error checking products table: {e}")
        
        # Commit changes
        conn.commit()
        print("✅ Image URLs fixed successfully!")
        
        # Show summary
        cursor.execute("SELECT COUNT(*) FROM product_images")
        total_images = cursor.fetchone()[0]
        print(f"Total images in database: {total_images}")
        
    except Exception as e:
        print(f"❌ Error fixing image URLs: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    print("🚀 Fixing hardcoded image URLs")
    print("=" * 40)
    fix_image_urls()
    print("\n" + "=" * 40)
    print("✅ Fix complete!") 