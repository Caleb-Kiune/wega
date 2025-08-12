#!/usr/bin/env python3
"""
Update Cloudinary URLs with Version Numbers
Updates the database with correct Cloudinary URLs that include version numbers
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

def update_cloudinary_urls():
    """Update Cloudinary URLs with version numbers"""
    app = create_app('development')
    
    with app.app_context():
        print("🔧 Updating Cloudinary URLs with version numbers...")
        
        # Get all product images
        product_images = ProductImage.query.all()
        
        # Mapping of old URLs to new URLs with version numbers
        url_mapping = {
            "https://res.cloudinary.com/dy082ykuf/image/upload/wega-kitchenware/products/black-electric-kettle.jpg": 
                "https://res.cloudinary.com/dy082ykuf/image/upload/v1755014250/wega-kitchenware/products/black-electric-kettle.jpg",
            "https://res.cloudinary.com/dy082ykuf/image/upload/wega-kitchenware/products/black-handle-knife-set.jpg": 
                "https://res.cloudinary.com/dy082ykuf/image/upload/v1755014253/wega-kitchenware/products/black-handle-knife-set.jpg",
            "https://res.cloudinary.com/dy082ykuf/image/upload/wega-kitchenware/products/butcher-knife-set.jpg": 
                "https://res.cloudinary.com/dy082ykuf/image/upload/v1755014253/wega-kitchenware/products/butcher-knife-set.jpg",
            "https://res.cloudinary.com/dy082ykuf/image/upload/wega-kitchenware/products/ceramic-black-flower-pot.jpg": 
                "https://res.cloudinary.com/dy082ykuf/image/upload/v1755014253/wega-kitchenware/products/ceramic-black-flower-pot.jpg",
        }
        
        fixed_count = 0
        for image in product_images:
            if image.image_url in url_mapping:
                old_url = image.image_url
                new_url = url_mapping[old_url]
                
                image.image_url = new_url
                fixed_count += 1
                print(f"✅ Fixed: {old_url} -> {new_url}")
        
        if fixed_count > 0:
            db.session.commit()
            print(f"🎉 Successfully updated {fixed_count} Cloudinary URLs!")
        else:
            print("ℹ️  No URLs needed updating")

if __name__ == "__main__":
    update_cloudinary_urls()
