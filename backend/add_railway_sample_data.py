#!/usr/bin/env python3
"""
Script to add sample data to Railway backend
Run this locally to populate the Railway database
"""

import requests
import json
import re

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def slugify(name):
    """Convert name to slug"""
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

def add_sample_data():
    """Add sample data to Railway backend via API"""
    
    print("🗄️  Adding sample data to Railway backend...")
    
    # Sample categories
    categories = [
        {"name": "Cookware", "description": "Pots, pans, and cooking utensils", "slug": "cookware"},
        {"name": "Bakeware", "description": "Baking pans, molds, and accessories", "slug": "bakeware"},
        {"name": "Cutlery", "description": "Knives, forks, spoons, and kitchen tools", "slug": "cutlery"},
        {"name": "Storage", "description": "Food storage containers and organizers", "slug": "storage"},
        {"name": "Appliances", "description": "Kitchen appliances and gadgets", "slug": "appliances"}
    ]
    
    # Sample brands
    brands = [
        {"name": "Wega Premium", "description": "Premium kitchenware brand", "slug": "wega-premium"},
        {"name": "Chef's Choice", "description": "Professional chef equipment", "slug": "chefs-choice"},
        {"name": "Home Essentials", "description": "Essential home kitchen items", "slug": "home-essentials"},
        {"name": "Gourmet Pro", "description": "Gourmet cooking equipment", "slug": "gourmet-pro"}
    ]
    
    # Sample products
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
            "sku": "WF-PAN-001"
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
            "sku": "WF-PAN-002"
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
            "sku": "WF-PAN-003"
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
            "sku": "WF-KNIFE-001"
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
            "sku": "WF-BAKE-001"
        }
    ]
    
    # Add categories
    print("📂 Adding categories...")
    for category in categories:
        try:
            response = requests.post(f"{RAILWAY_URL}/api/categories", json=category)
            if response.status_code == 201:
                print(f"✅ Added category: {category['name']}")
            else:
                print(f"⚠️  Category {category['name']}: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Error adding category {category['name']}: {e}")
    
    # Add brands
    print("🏷️  Adding brands...")
    for brand in brands:
        try:
            response = requests.post(f"{RAILWAY_URL}/api/brands", json=brand)
            if response.status_code == 201:
                print(f"✅ Added brand: {brand['name']}")
            else:
                print(f"⚠️  Brand {brand['name']}: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Error adding brand {brand['name']}: {e}")
    
    # Add products
    print("🛍️  Adding products...")
    for product in products:
        try:
            response = requests.post(f"{RAILWAY_URL}/api/products", json=product)
            if response.status_code == 201:
                print(f"✅ Added product: {product['name']}")
            else:
                print(f"⚠️  Product {product['name']}: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Error adding product {product['name']}: {e}")
    
    print("🎉 Sample data addition completed!")

if __name__ == "__main__":
    add_sample_data() 