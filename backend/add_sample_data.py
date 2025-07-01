#!/usr/bin/env python3
"""
Script to add sample data to the Wega Kitchenware database
Run this script to populate the database with sample products, categories, and brands
"""

import os
import sys
from datetime import datetime
from app_factory import create_app
from models import db, Category, Brand, Product, ProductImage, ProductFeature, ProductSpecification

def add_sample_data():
    """Add sample data to the database"""
    app = create_app('production')
    
    with app.app_context():
        # Create database tables if they don't exist
        db.create_all()
        
        print("🗄️  Adding sample data to the database...")
        
        # Add Categories
        categories_data = [
            {"name": "Cookware", "description": "Pots, pans, and cooking utensils"},
            {"name": "Bakeware", "description": "Baking pans, molds, and accessories"},
            {"name": "Cutlery", "description": "Knives, forks, spoons, and kitchen tools"},
            {"name": "Storage", "description": "Food storage containers and organizers"},
            {"name": "Appliances", "description": "Kitchen appliances and gadgets"}
        ]
        
        categories = {}
        for cat_data in categories_data:
            category = Category.query.filter_by(name=cat_data["name"]).first()
            if not category:
                category = Category(**cat_data)
                db.session.add(category)
                print(f"✅ Added category: {cat_data['name']}")
            categories[cat_data["name"]] = category
        
        # Add Brands
        brands_data = [
            {"name": "Wega Premium", "description": "Premium kitchenware brand"},
            {"name": "Chef's Choice", "description": "Professional chef equipment"},
            {"name": "Home Essentials", "description": "Essential home kitchen items"},
            {"name": "Gourmet Pro", "description": "Gourmet cooking equipment"}
        ]
        
        brands = {}
        for brand_data in brands_data:
            brand = Brand.query.filter_by(name=brand_data["name"]).first()
            if not brand:
                brand = Brand(**brand_data)
                db.session.add(brand)
                print(f"✅ Added brand: {brand_data['name']}")
            brands[brand_data["name"]] = brand
        
        # Add Products
        products_data = [
            {
                "name": "Stainless Steel Frying Pan",
                "description": "Professional-grade stainless steel frying pan with non-stick coating",
                "price": 89.99,
                "stock_quantity": 50,
                "category": categories["Cookware"],
                "brand": brands["Wega Premium"],
                "is_featured": True,
                "is_new": True,
                "is_sale": False,
                "features": ["Non-stick coating", "Heat resistant", "Dishwasher safe"],
                "specifications": {
                    "Material": "Stainless Steel",
                    "Size": "12-inch",
                    "Weight": "2.5 lbs",
                    "Handle": "Stainless Steel"
                }
            },
            {
                "name": "Ceramic Baking Dish Set",
                "description": "Set of 3 ceramic baking dishes in different sizes",
                "price": 45.99,
                "stock_quantity": 30,
                "category": categories["Bakeware"],
                "brand": brands["Chef's Choice"],
                "is_featured": True,
                "is_new": False,
                "is_sale": True,
                "features": ["Oven safe", "Microwave safe", "Easy clean"],
                "specifications": {
                    "Material": "Ceramic",
                    "Sizes": "8x8, 9x13, 10x10 inches",
                    "Color": "White",
                    "Set": "3 pieces"
                }
            },
            {
                "name": "Professional Chef Knife Set",
                "description": "Complete set of professional chef knives with wooden block",
                "price": 199.99,
                "stock_quantity": 25,
                "category": categories["Cutlery"],
                "brand": brands["Gourmet Pro"],
                "is_featured": True,
                "is_new": True,
                "is_sale": False,
                "features": ["High-carbon steel", "Ergonomic handles", "Sharpener included"],
                "specifications": {
                    "Material": "High-carbon Steel",
                    "Set": "8 pieces",
                    "Block": "Bamboo",
                    "Warranty": "Lifetime"
                }
            },
            {
                "name": "Glass Food Storage Containers",
                "description": "Set of 10 airtight glass storage containers",
                "price": 34.99,
                "stock_quantity": 100,
                "category": categories["Storage"],
                "brand": brands["Home Essentials"],
                "is_featured": False,
                "is_new": False,
                "is_sale": True,
                "features": ["Airtight seal", "Microwave safe", "Stackable"],
                "specifications": {
                    "Material": "Glass",
                    "Set": "10 pieces",
                    "Sizes": "Various",
                    "Lids": "BPA-free plastic"
                }
            },
            {
                "name": "Stand Mixer Professional",
                "description": "Professional stand mixer with 5-quart bowl and attachments",
                "price": 299.99,
                "stock_quantity": 15,
                "category": categories["Appliances"],
                "brand": brands["Wega Premium"],
                "is_featured": True,
                "is_new": True,
                "is_sale": False,
                "features": ["5-quart capacity", "10 speeds", "Planetary mixing"],
                "specifications": {
                    "Power": "325W",
                    "Bowl": "5-quart",
                    "Attachments": "3 included",
                    "Color": "Silver"
                }
            }
        ]
        
        for product_data in products_data:
            # Check if product already exists
            existing_product = Product.query.filter_by(name=product_data["name"]).first()
            if existing_product:
                print(f"⏭️  Product already exists: {product_data['name']}")
                continue
            
            # Extract features and specifications
            features = product_data.pop("features")
            specifications = product_data.pop("specifications")
            
            # Create product
            product = Product(**product_data)
            db.session.add(product)
            db.session.flush()  # Get the product ID
            
            # Add features
            for feature_name in features:
                feature = ProductFeature(product_id=product.id, name=feature_name)
                db.session.add(feature)
            
            # Add specifications
            for spec_name, spec_value in specifications.items():
                spec = ProductSpecification(
                    product_id=product.id,
                    name=spec_name,
                    value=str(spec_value)
                )
                db.session.add(spec)
            
            print(f"✅ Added product: {product_data['name']} - ${product_data['price']}")
        
        # Commit all changes
        db.session.commit()
        print("🎉 Sample data added successfully!")
        print(f"📊 Added {len(categories_data)} categories, {len(brands_data)} brands, and {len(products_data)} products")

if __name__ == "__main__":
    add_sample_data() 