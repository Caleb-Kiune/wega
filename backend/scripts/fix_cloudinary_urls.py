#!/usr/bin/env python3
"""
Fix Cloudinary URLs in Database
Removes version numbers from Cloudinary URLs to make them work properly
"""

import sys
import os
from dotenv import load_dotenv

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app_factory import create_app
from models import db, ProductImage

# Load environment variables
load_dotenv()

def fix_cloudinary_urls():
    """Fix Cloudinary URLs by removing version numbers"""
    app = create_app('development')
    
    with app.app_context():
        print("🔧 Fixing Cloudinary URLs in database...")
        
        # Get all product images
        product_images = ProductImage.query.all()
        
        fixed_count = 0
        for image in product_images:
            if 'cloudinary.com' in image.image_url and '/v1754930203/' in image.image_url:
                # Remove the version number from the URL
                old_url = image.image_url
                new_url = old_url.replace('/v1754930203/', '/')
                
                image.image_url = new_url
                fixed_count += 1
                print(f"✅ Fixed: {old_url} -> {new_url}")
        
        if fixed_count > 0:
            db.session.commit()
            print(f"🎉 Successfully fixed {fixed_count} Cloudinary URLs!")
        else:
            print("ℹ️  No URLs needed fixing")

if __name__ == "__main__":
    fix_cloudinary_urls()
