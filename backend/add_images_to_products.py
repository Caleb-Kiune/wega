#!/usr/bin/env python3
"""
Script to add images to existing products in Railway backend
"""

import requests
import json
import os
import time

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def get_sample_images():
    """Get list of sample images from uploads directory"""
    uploads_dir = os.path.join(os.path.dirname(__file__), 'static', 'uploads')
    images = []
    
    for filename in os.listdir(uploads_dir):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
            images.append(filename)
    
    return images

def add_images_to_products():
    """Add images to existing products"""
    
    print("🖼️  Adding images to existing products...")
    
    # Get sample images
    sample_images = get_sample_images()
    print(f"📸 Found {len(sample_images)} sample images")
    
    # Product image mappings (category-based)
    product_images = {
        # Cookware products (category_id: 1)
        "Stainless Steel Frying Pan": [
            "cooker-king-_TKB4ykwJ0c-unsplash.jpg",
            "cooker-king-eVpzgSTL6nk-unsplash.jpg",
            "cooker-king-AOVtEuU9UGc-unsplash.jpg"
        ],
        "Cast Iron Dutch Oven": [
            "cooker-king-_TKB4ykwJ0c-unsplash.jpg",
            "cooker-king-eVpzgSTL6nk-unsplash.jpg"
        ],
        "Non-Stick Saucepan Set": [
            "cooker-king-AOVtEuU9UGc-unsplash.jpg",
            "cooker-king-_TKB4ykwJ0c-unsplash.jpg"
        ],
        
        # Cutlery products (category_id: 3)
        "Professional Chef Knife": [
            "kitchenware1.jpeg",
            "tableware1.jpeg"
        ],
        
        # Bakeware products (category_id: 2)
        "Baking Sheet Set": [
            "homeessentials1.jpeg",
            "homeessentials2.jpeg"
        ],
        
        # Storage products (category_id: 4)
        "Food Storage Containers": [
            "homeessentials3.jpeg",
            "homeessentials4.jpeg"
        ],
        
        # Appliances products (category_id: 5)
        "Blender Pro": [
            "appliances1.jpeg",
            "appliances2.jpeg"
        ]
    }
    
    # First, get all existing products
    try:
        response = requests.get(f"{RAILWAY_URL}/api/products")
        if response.status_code == 200:
            products_data = response.json()
            products = products_data.get('products', [])
            print(f"📦 Found {len(products)} existing products")
            
            for product in products:
                product_name = product['name']
                product_id = product['id']
                
                if product_name in product_images:
                    images_to_add = product_images[product_name]
                    print(f"🖼️  Adding {len(images_to_add)} images to {product_name}...")
                    
                    # Add each image to the product
                    for i, image_filename in enumerate(images_to_add):
                        image_data = {
                            "product_id": product_id,
                            "image_url": f"/static/uploads/{image_filename}",
                            "is_primary": i == 0,  # First image is primary
                            "display_order": i
                        }
                        
                        try:
                            # Add image to product
                            img_response = requests.post(f"{RAILWAY_URL}/api/products/{product_id}/images", json=image_data)
                            if img_response.status_code == 201:
                                print(f"  ✅ Added image: {image_filename}")
                            else:
                                print(f"  ⚠️  Failed to add image {image_filename}: {img_response.status_code}")
                        except Exception as e:
                            print(f"  ❌ Error adding image {image_filename}: {e}")
                    
                    # Add a small delay to avoid overwhelming the server
                    time.sleep(0.5)
                else:
                    print(f"⚠️  No image mapping found for: {product_name}")
        else:
            print(f"❌ Failed to get products: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error getting products: {e}")
    
    print("🎉 Image addition completed!")

if __name__ == "__main__":
    add_images_to_products() 