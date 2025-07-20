#!/usr/bin/env python3
"""
Railway Data Persistence Manager
Handles automatic restoration of products and data when Railway database is reset
"""

import requests
import json
import time
import os

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def check_railway_status():
    """Check if Railway backend is accessible"""
    try:
        response = requests.get(f"{RAILWAY_URL}/health")
        return response.status_code == 200
    except:
        return False

def get_products_count():
    """Get the current number of products in Railway"""
    try:
        response = requests.get(f"{RAILWAY_URL}/api/products?limit=1")
        if response.status_code == 200:
            data = response.json()
            return data.get('total', 0)
        return 0
    except:
        return 0

def restore_railway_data():
    """Restore all data to Railway backend"""
    
    print("🔧 Railway Data Persistence Manager")
    print("=" * 50)
    
    # Check Railway status
    if not check_railway_status():
        print("❌ Railway backend is not accessible")
        return False
    
    print("✅ Railway backend is accessible")
    
    # Check current product count
    current_count = get_products_count()
    print(f"📊 Current products in Railway: {current_count}")
    
    if current_count >= 7:
        print("✅ Products already exist in Railway")
        return True
    
    print("🔄 Database appears to be reset, restoring products...")
    
    # Add products
    print("\n🛍️  Adding products to Railway...")
    products_added = add_products()
    
    if products_added:
        print("\n🖼️  Adding images to products...")
        images_added = add_images()
        
        if images_added:
            print("\n✅ Railway data restoration completed successfully!")
            return True
    
    print("\n❌ Railway data restoration failed")
    return False

def add_products():
    """Add products to Railway backend"""
    
    products = [
        {
            "name": "Stainless Steel Frying Pan",
            "description": "Professional-grade stainless steel frying pan with even heat distribution. Perfect for searing, sautéing, and pan-frying. Features a comfortable handle and dishwasher-safe design.",
            "price": 89.99,
            "original_price": 119.99,
            "sku": "WF-PAN-001",
            "category_id": 1,
            "brand_id": 1,
            "stock_quantity": 50,
            "is_featured": True,
            "is_new": True,
            "is_sale": True,
            "weight": 1.2,
            "dimensions": "12 x 8 x 2 inches",
            "material": "Stainless Steel",
            "care_instructions": "Hand wash recommended, dishwasher safe"
        },
        {
            "name": "Cast Iron Dutch Oven",
            "description": "Heavy-duty cast iron Dutch oven perfect for slow cooking, braising, and baking. Excellent heat retention and even cooking. Pre-seasoned and ready to use.",
            "price": 149.99,
            "original_price": 199.99,
            "sku": "WF-PAN-002",
            "category_id": 1,
            "brand_id": 1,
            "stock_quantity": 30,
            "is_featured": True,
            "is_new": False,
            "is_sale": True,
            "weight": 8.5,
            "dimensions": "10 x 10 x 6 inches",
            "material": "Cast Iron",
            "care_instructions": "Season regularly, hand wash only"
        },
        {
            "name": "Non-Stick Saucepan Set",
            "description": "Complete 3-piece non-stick saucepan set with lids. PFOA-free coating, dishwasher safe, and oven safe up to 400°F. Perfect for everyday cooking.",
            "price": 79.99,
            "original_price": 99.99,
            "sku": "WF-PAN-003",
            "category_id": 1,
            "brand_id": 2,
            "stock_quantity": 40,
            "is_featured": False,
            "is_new": True,
            "is_sale": True,
            "weight": 2.8,
            "dimensions": "Various sizes",
            "material": "Aluminum with Non-Stick Coating",
            "care_instructions": "Dishwasher safe, use wooden or silicone utensils"
        },
        {
            "name": "Professional Chef Knife",
            "description": "High-quality professional chef knife with razor-sharp blade. Ergonomic handle design for comfortable grip during extended use. Perfect for all cutting tasks.",
            "price": 129.99,
            "original_price": 159.99,
            "sku": "WF-KNIFE-001",
            "category_id": 2,
            "brand_id": 3,
            "stock_quantity": 25,
            "is_featured": True,
            "is_new": False,
            "is_sale": True,
            "weight": 0.8,
            "dimensions": "8-inch blade",
            "material": "High Carbon Steel",
            "care_instructions": "Hand wash and dry immediately, sharpen regularly"
        },
        {
            "name": "Baking Sheet Set",
            "description": "Set of 3 heavy-duty baking sheets with non-stick coating. Perfect for cookies, pastries, and roasting. Dishwasher safe and oven safe.",
            "price": 49.99,
            "original_price": 69.99,
            "sku": "WF-BAKE-001",
            "category_id": 3,
            "brand_id": 2,
            "stock_quantity": 60,
            "is_featured": False,
            "is_new": True,
            "is_sale": True,
            "weight": 1.5,
            "dimensions": "13 x 18 inches each",
            "material": "Aluminum with Non-Stick Coating",
            "care_instructions": "Dishwasher safe, avoid metal utensils"
        },
        {
            "name": "Food Storage Containers",
            "description": "Set of 10 airtight food storage containers in various sizes. BPA-free plastic, microwave safe, and dishwasher safe. Perfect for meal prep and leftovers.",
            "price": 39.99,
            "original_price": 59.99,
            "sku": "WF-STORAGE-001",
            "category_id": 4,
            "brand_id": 2,
            "stock_quantity": 100,
            "is_featured": False,
            "is_new": False,
            "is_sale": True,
            "weight": 2.0,
            "dimensions": "Various sizes",
            "material": "BPA-Free Plastic",
            "care_instructions": "Dishwasher safe, microwave safe"
        },
        {
            "name": "Blender Pro",
            "description": "High-powered blender with 1000W motor. Perfect for smoothies, soups, and food processing. Includes multiple speed settings and safety features.",
            "price": 199.99,
            "original_price": 249.99,
            "sku": "WF-APPLIANCE-001",
            "category_id": 5,
            "brand_id": 3,
            "stock_quantity": 20,
            "is_featured": True,
            "is_new": True,
            "is_sale": True,
            "weight": 3.2,
            "dimensions": "12 x 8 x 8 inches",
            "material": "Stainless Steel and Plastic",
            "care_instructions": "Hand wash jar, wipe base with damp cloth"
        }
    ]
    
    added_count = 0
    for product in products:
        try:
            response = requests.post(f"{RAILWAY_URL}/api/products", json=product, headers={
                'Content-Type': 'application/json'
            })
            
            if response.status_code == 201:
                print(f"✅ Added: {product['name']}")
                added_count += 1
            else:
                print(f"❌ Failed to add: {product['name']}")
            
            time.sleep(1)
        except Exception as e:
            print(f"❌ Error adding {product['name']}: {str(e)}")
    
    print(f"📦 Added {added_count} out of {len(products)} products")
    return added_count == len(products)

def add_images():
    """Add images to products in Railway"""
    
    try:
        # Get products from Railway
        response = requests.get(f"{RAILWAY_URL}/api/products")
        if response.status_code != 200:
            print("❌ Failed to get products for image addition")
            return False
        
        products = response.json().get('products', [])
        
        if not products:
            print("❌ No products found for image addition")
            return False
        
        # Sample images
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
            
            # Add 2-3 images per product
            num_images = min(3, len(sample_images) - i * 2)
            
            for j in range(num_images):
                image_index = (i * 2 + j) % len(sample_images)
                image_url = sample_images[image_index]
                
                image_data = {
                    "image_url": image_url,
                    "is_primary": j == 0,
                    "display_order": j + 1
                }
                
                try:
                    img_response = requests.post(f"{RAILWAY_URL}/api/products/{product_id}/images", 
                                               json=image_data, headers={'Content-Type': 'application/json'})
                    
                    if img_response.status_code == 201:
                        added_images += 1
                    
                    time.sleep(0.5)
                except:
                    pass
            
            time.sleep(1)
        
        print(f"🖼️  Added {added_images} images to products")
        return True
        
    except Exception as e:
        print(f"❌ Error adding images: {str(e)}")
        return False

if __name__ == "__main__":
    restore_railway_data() 