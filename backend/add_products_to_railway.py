#!/usr/bin/env python3
"""
Script to add products directly to Railway backend via API
"""

import requests
import json
import time

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def add_product_to_railway(product_data):
    """Add a product to Railway backend via API"""
    url = f"{RAILWAY_URL}/api/products"
    
    try:
        response = requests.post(url, json=product_data, headers={
            'Content-Type': 'application/json'
        })
        
        if response.status_code == 201:
            print(f"✅ Added product: {product_data['name']}")
            return response.json()
        else:
            print(f"❌ Failed to add {product_data['name']}: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error adding {product_data['name']}: {str(e)}")
        return None

def add_products_to_railway():
    """Add all products to Railway backend"""
    
    print("🛍️  Adding products to Railway backend...")
    
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
        result = add_product_to_railway(product)
        if result:
            added_count += 1
        time.sleep(1)  # Small delay between requests
    
    print(f"🎉 Added {added_count} out of {len(products)} products to Railway backend!")

if __name__ == "__main__":
    add_products_to_railway() 