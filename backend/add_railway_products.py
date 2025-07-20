#!/usr/bin/env python3
"""
Script to add products to Railway backend with unique SKUs
"""

import requests
import json
import time

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def add_products():
    """Add products with unique SKUs"""
    
    print("🛍️  Adding products with unique SKUs...")
    
    # Products with unique SKUs
    products = [
        {
            "name": "Stainless Steel Frying Pan",
            "description": "Professional-grade stainless steel frying pan with non-stick coating",
            "price": 89.99,
            "category_id": 1,
            "brand_id": 1,
            "is_featured": True,
            "is_new": True,
            "is_sale": False,
            "sku": f"WF-PAN-{int(time.time())}-001"
        },
        {
            "name": "Cast Iron Dutch Oven",
            "description": "Heavy-duty cast iron dutch oven perfect for slow cooking",
            "price": 149.99,
            "category_id": 1,
            "brand_id": 2,
            "is_featured": True,
            "is_new": False,
            "is_sale": True,
            "sku": f"WF-PAN-{int(time.time())}-002"
        },
        {
            "name": "Non-Stick Saucepan Set",
            "description": "Set of 3 non-stick saucepans with glass lids",
            "price": 79.99,
            "category_id": 1,
            "brand_id": 3,
            "is_featured": False,
            "is_new": True,
            "is_sale": False,
            "sku": f"WF-PAN-{int(time.time())}-003"
        },
        {
            "name": "Professional Chef Knife",
            "description": "High-quality chef knife for professional cooking",
            "price": 129.99,
            "category_id": 3,
            "brand_id": 2,
            "is_featured": True,
            "is_new": True,
            "is_sale": False,
            "sku": f"WF-KNIFE-{int(time.time())}-001"
        },
        {
            "name": "Baking Sheet Set",
            "description": "Set of 3 non-stick baking sheets",
            "price": 45.99,
            "category_id": 2,
            "brand_id": 3,
            "is_featured": False,
            "is_new": False,
            "is_sale": True,
            "sku": f"WF-BAKE-{int(time.time())}-001"
        },
        {
            "name": "Food Storage Containers",
            "description": "Set of 10 airtight food storage containers",
            "price": 35.99,
            "category_id": 4,
            "brand_id": 3,
            "is_featured": False,
            "is_new": True,
            "is_sale": False,
            "sku": f"WF-STORAGE-{int(time.time())}-001"
        },
        {
            "name": "Blender Pro",
            "description": "High-speed blender for smoothies and food processing",
            "price": 199.99,
            "category_id": 5,
            "brand_id": 4,
            "is_featured": True,
            "is_new": True,
            "is_sale": False,
            "sku": f"WF-APPLIANCE-{int(time.time())}-001"
        }
    ]
    
    # Add products
    for product in products:
        try:
            response = requests.post(f"{RAILWAY_URL}/api/products", json=product)
            if response.status_code == 201:
                print(f"✅ Added product: {product['name']} (SKU: {product['sku']})")
            else:
                print(f"⚠️  Product {product['name']}: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Error adding product {product['name']}: {e}")
    
    print("🎉 Products addition completed!")

if __name__ == "__main__":
    add_products() 