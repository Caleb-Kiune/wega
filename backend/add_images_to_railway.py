#!/usr/bin/env python3
"""
Script to add images to products in Railway backend via API
"""

import requests
import json
import time

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def get_products_from_railway():
    """Get all products from Railway backend"""
    url = f"{RAILWAY_URL}/api/products"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get('products', [])
        else:
            print(f"❌ Failed to get products: {response.status_code}")
            return []
    except Exception as e:
        print(f"❌ Error getting products: {str(e)}")
        return []

def add_image_to_product(product_id, image_data):
    """Add an image to a product via API"""
    url = f"{RAILWAY_URL}/api/products/{product_id}/images"
    
    try:
        response = requests.post(url, json=image_data, headers={
            'Content-Type': 'application/json'
        })
        
        if response.status_code == 201:
            print(f"✅ Added image to product {product_id}")
            return response.json()
        else:
            print(f"❌ Failed to add image to product {product_id}: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error adding image to product {product_id}: {str(e)}")
        return None

def add_images_to_railway_products():
    """Add images to all products in Railway backend"""
    
    print("🖼️  Adding images to Railway products...")
    
    # Get products from Railway
    products = get_products_from_railway()
    
    if not products:
        print("❌ No products found in Railway backend")
        return
    
    print(f"📦 Found {len(products)} products in Railway backend")
    
    # Sample images to use
    sample_images = [
        "https://wega-production.up.railway.app/static/uploads/homeessentials1.jpeg",
        "https://wega-production.up.railway.app/static/uploads/homeessentials2.jpeg",
        "https://wega-production.up.railway.app/static/uploads/homeessentials3.jpeg",
        "https://wega-production.up.railway.app/static/uploads/homeessentials4.jpeg",
        "https://wega-production.up.railway.app/static/uploads/appliances1.jpeg",
        "https://wega-production.up.railway.app/static/uploads/appliances2.jpeg",
        "https://wega-production.up.railway.app/static/uploads/kitchenware1.jpeg",
        "https://wega-production.up.railway.app/static/uploads/tableware1.jpeg",
        "https://wega-production.up.railway.app/static/uploads/cooker-king-_TKB4ykwJ0c-unsplash.jpg",
        "https://wega-production.up.railway.app/static/uploads/cooker-king-eVpzgSTL6nk-unsplash.jpg",
        "https://wega-production.up.railway.app/static/uploads/cooker-king-AOVtEuU9UGc-unsplash.jpg"
    ]
    
    added_images = 0
    
    for i, product in enumerate(products):
        product_id = product['id']
        product_name = product['name']
        
        print(f"🖼️  Adding images to {product_name}...")
        
        # Add 2-3 images per product
        num_images = min(3, len(sample_images) - i * 2)
        
        for j in range(num_images):
            image_index = (i * 2 + j) % len(sample_images)
            image_url = sample_images[image_index]
            
            image_data = {
                "image_url": image_url,
                "is_primary": j == 0,  # First image is primary
                "display_order": j + 1
            }
            
            result = add_image_to_product(product_id, image_data)
            if result:
                added_images += 1
            
            time.sleep(0.5)  # Small delay between requests
        
        time.sleep(1)  # Delay between products
    
    print(f"🎉 Added {added_images} images to Railway products!")

if __name__ == "__main__":
    add_images_to_railway_products() 