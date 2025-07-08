#!/usr/bin/env python3
"""
Comprehensive URL fix script
"""

import os
import sys
import sqlite3

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def check_and_fix_urls():
    """Check and fix all hardcoded URLs"""
    
    print("🔍 Comprehensive URL check and fix")
    print("=" * 50)
    
    db_path = os.path.join(os.path.dirname(__file__), 'app.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check product_images table
        print("\n📸 Checking product_images table...")
        cursor.execute("""
            SELECT id, image_url FROM product_images 
            WHERE image_url LIKE '%your-domain.com%'
        """)
        
        remaining_images = cursor.fetchall()
        print(f"Found {len(remaining_images)} images with hardcoded URLs:")
        
        for img_id, image_url in remaining_images:
            print(f"  ID: {img_id}, URL: {image_url}")
            
            # Fix the URL
            new_url = image_url.replace('https://your-domain.com', 'http://localhost:5000')
            cursor.execute("""
                UPDATE product_images 
                SET image_url = ? 
                WHERE id = ?
            """, (new_url, img_id))
            print(f"  ✅ Fixed: {new_url}")
        
        # Check if there are any other tables with image URLs
        print("\n🔍 Checking for other tables with image URLs...")
        
        # Get all table names
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        for table in tables:
            table_name = table[0]
            try:
                # Check if table has image_url column
                cursor.execute(f"PRAGMA table_info({table_name})")
                columns = cursor.fetchall()
                has_image_url = any(col[1] == 'image_url' for col in columns)
                
                if has_image_url:
                    print(f"  Checking table: {table_name}")
                    cursor.execute(f"""
                        SELECT id, image_url FROM {table_name} 
                        WHERE image_url LIKE '%your-domain.com%'
                    """)
                    
                    bad_urls = cursor.fetchall()
                    if bad_urls:
                        print(f"    Found {len(bad_urls)} bad URLs in {table_name}")
                        for row_id, image_url in bad_urls:
                            new_url = image_url.replace('https://your-domain.com', 'http://localhost:5000')
                            cursor.execute(f"""
                                UPDATE {table_name} 
                                SET image_url = ? 
                                WHERE id = ?
                            """, (new_url, row_id))
                            print(f"    ✅ Fixed: {new_url}")
            except Exception as e:
                print(f"    ⚠️ Error checking {table_name}: {e}")
        
        # Show sample of current URLs
        print("\n📋 Sample of current image URLs:")
        cursor.execute("""
            SELECT id, image_url FROM product_images 
            LIMIT 5
        """)
        
        sample_images = cursor.fetchall()
        for img_id, image_url in sample_images:
            print(f"  ID: {img_id}, URL: {image_url}")
        
        # Count total images
        cursor.execute("SELECT COUNT(*) FROM product_images")
        total_images = cursor.fetchone()[0]
        print(f"\n📊 Total images in database: {total_images}")
        
        # Commit changes
        conn.commit()
        print("\n✅ All changes committed to database")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    check_and_fix_urls()
    print("\n" + "=" * 50)
    print("✅ Comprehensive URL fix complete!") 