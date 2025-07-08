#!/usr/bin/env python3
"""
Check for remaining hardcoded URLs in the database
"""

import os
import sys
import sqlite3

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def check_remaining_urls():
    """Check for any remaining hardcoded URLs"""
    
    print("🔍 Checking for remaining hardcoded URLs...")
    
    db_path = os.path.join(os.path.dirname(__file__), 'app.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check product_images table
        cursor.execute("""
            SELECT id, image_url FROM product_images 
            WHERE image_url LIKE '%your-domain.com%'
        """)
        
        remaining_images = cursor.fetchall()
        print(f"Found {len(remaining_images)} images with hardcoded URLs:")
        
        for img_id, image_url in remaining_images:
            print(f"  ID: {img_id}, URL: {image_url}")
        
        # Check all image URLs to see what we have
        cursor.execute("""
            SELECT id, image_url FROM product_images 
            LIMIT 10
        """)
        
        sample_images = cursor.fetchall()
        print(f"\nSample image URLs:")
        
        for img_id, image_url in sample_images:
            print(f"  ID: {img_id}, URL: {image_url}")
        
        # Count total images
        cursor.execute("SELECT COUNT(*) FROM product_images")
        total_images = cursor.fetchone()[0]
        print(f"\nTotal images in database: {total_images}")
        
    except Exception as e:
        print(f"❌ Error checking URLs: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    print("🚀 Checking remaining hardcoded URLs")
    print("=" * 40)
    check_remaining_urls()
    print("\n" + "=" * 40)
    print("✅ Check complete!") 