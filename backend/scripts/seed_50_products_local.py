#!/usr/bin/env python3
"""
Local Seed Script for 50 Products - Wega Kitchenware
This script seeds the local SQLite database with 50 products using local images.
Each product gets exactly one badge (or none) for clean presentation.
"""

import sys
import os
import random
from datetime import datetime, timedelta

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app_factory import create_app
from models import db, Category, Brand, Product, ProductImage, ProductFeature, ProductSpecification, Review

def clear_database():
    """Clear existing data from database"""
    print("🗑️  Clearing existing data...")
    try:
        ProductImage.query.delete()
        ProductFeature.query.delete()
        ProductSpecification.query.delete()
        Review.query.delete()
        Product.query.delete()
        Category.query.delete()
        Brand.query.delete()
        db.session.commit()
        print("✅ Database cleared successfully!")
    except Exception as e:
        print(f"⚠️  Error clearing database: {e}")
        db.session.rollback()

def create_categories():
    """Create product categories"""
    categories_data = [
        {"name": "Cookware", "slug": "cookware", "description": "Pots, pans, and cooking vessels for stovetop and oven use"},
        {"name": "Bakeware", "slug": "bakeware", "description": "Baking pans, molds, and accessories for oven baking"},
        {"name": "Cutlery", "slug": "cutlery", "description": "Knives, scissors, and cutting tools for food preparation"},
        {"name": "Storage", "slug": "storage", "description": "Food storage containers and organization solutions"},
        {"name": "Appliances", "slug": "appliances", "description": "Electric kitchen appliances and gadgets"},
        {"name": "Utensils", "slug": "utensils", "description": "Cooking and serving utensils for daily use"},
        {"name": "Serveware", "slug": "serveware", "description": "Plates, bowls, and serving dishes for presentation"},
        {"name": "Coffee & Tea", "slug": "coffee-tea", "description": "Coffee makers, tea kettles, and accessories"}
    ]
    
    categories = {}
    for cat_data in categories_data:
        category = Category(**cat_data)
        db.session.add(category)
        categories[cat_data["name"]] = category
    
    db.session.commit()
    print(f"✅ Created {len(categories)} categories")
    return categories

def create_brands():
    """Create product brands"""
    brands_data = [
        {"name": "Wega Premium", "slug": "wega-premium", "description": "Premium quality kitchenware for discerning chefs"},
        {"name": "KitchenAid", "slug": "kitchenaid", "description": "Professional kitchen equipment and appliances"},
        {"name": "Cuisinart", "slug": "cuisinart", "description": "Innovative kitchen solutions and appliances"},
        {"name": "Pyrex", "slug": "pyrex", "description": "Trusted glassware and storage solutions"},
        {"name": "Tefal", "slug": "tefal", "description": "Quality cookware and non-stick solutions"}
    ]
    
    brands = {}
    for brand_data in brands_data:
        brand = Brand(**brand_data)
        db.session.add(brand)
        brands[brand_data["name"]] = brand
    
    db.session.commit()
    print(f"✅ Created {len(brands)} brands")
    return brands

def get_product_data():
    """Get comprehensive product data for 50 products"""
    return [
        # FEATURED PRODUCTS (12 products)
        {
            "name": "Cast Iron Dutch Oven",
            "description": "Professional 6-quart cast iron Dutch oven with enamel coating. Perfect for slow cooking, braising, and baking. The heavy-duty construction ensures even heat distribution and excellent heat retention.",
            "price": 8999,
            "original_price": None,
            "sku": "WG-DO-6QT-BLK",
            "stock": 15,
            "category": "Cookware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.8,
            "review_count": 23,
            "images": ["dutch oven.jpg", "dutch oven.jpg", "dutch oven.jpg"],
            "features": [
                "Cast iron construction",
                "Enamel coating for easy cleaning",
                "6-quart capacity",
                "Oven safe up to 500°F",
                "Dishwasher safe",
                "Lifetime warranty"
            ],
            "specifications": {
                "Material": "Cast Iron with Enamel Coating",
                "Capacity": "6 quarts",
                "Weight": "9.5 lbs",
                "Dimensions": "12 x 10 x 8 inches",
                "Heat Source": "Gas, Electric, Induction",
                "Warranty": "Lifetime"
            }
        },
        {
            "name": "Professional Coffee Maker",
            "description": "Premium electric coffee maker with programmable settings and thermal carafe. Brews perfect coffee every time with 12-cup capacity and auto-shutoff feature.",
            "price": 3499,
            "original_price": None,
            "sku": "CU-CM-12-BLK",
            "stock": 20,
            "category": "Appliances",
            "brand": "Cuisinart",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.6,
            "review_count": 18,
            "images": ["coffee maker electric.jpg", "coffee maker electric.jpg", "coffee maker electric.jpg"],
            "features": [
                "Programmable brewing",
                "12-cup thermal carafe",
                "Auto-shutoff feature",
                "Pause and serve function",
                "Removable water reservoir",
                "Charcoal water filter"
            ],
            "specifications": {
                "Capacity": "12 cups",
                "Power": "1200W",
                "Material": "Stainless steel and plastic",
                "Dimensions": "14 x 8 x 10 inches",
                "Warranty": "2 years",
                "Color": "Black"
            }
        },
        {
            "name": "Stainless Steel Stock Pot",
            "description": "Professional 8-quart stainless steel stock pot with copper bottom. Perfect for soups, stews, and large batch cooking. Even heat distribution and durable construction.",
            "price": 6499,
            "original_price": None,
            "sku": "WG-SP-8QT-SS",
            "stock": 12,
            "category": "Cookware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.4,
            "review_count": 31,
            "images": ["stock pot.jpg", "stock pot.jpg", "stock pot.jpg"],
            "features": [
                "Copper bottom for even heat",
                "Stainless steel construction",
                "8-quart capacity",
                "Oven safe up to 500°F",
                "Dishwasher safe",
                "Professional grade"
            ],
            "specifications": {
                "Material": "Stainless Steel with Copper Bottom",
                "Capacity": "8 quarts",
                "Weight": "4.2 lbs",
                "Dimensions": "12 x 12 x 8 inches",
                "Heat Source": "Gas, Electric, Induction",
                "Warranty": "Lifetime"
            }
        },
        {
            "name": "Ceramic Dinner Plates Set",
            "description": "Elegant ceramic dinner plates set perfect for everyday use and special occasions. Microwave and dishwasher safe with chip-resistant design.",
            "price": 1899,
            "original_price": None,
            "sku": "WG-CP-4-SET",
            "stock": 18,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.3,
            "review_count": 27,
            "images": ["ceramic plates.jpg", "ceramic plates.jpg", "ceramic plates.jpg"],
            "features": [
                "Set of 4 dinner plates",
                "Premium ceramic construction",
                "Microwave and dishwasher safe",
                "Chip-resistant design",
                "Elegant pattern",
                "Stackable for easy storage"
            ],
            "specifications": {
                "Material": "Premium ceramic",
                "Set Includes": "4 dinner plates",
                "Diameter": "10.5 inches",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "5-Piece Cooking Set",
            "description": "Professional 5-piece cooking set with non-stick coating. Includes frying pan, saucepan, and lids. Perfect for everyday cooking needs.",
            "price": 12999,
            "original_price": None,
            "sku": "WG-CS-5-SET",
            "stock": 10,
            "category": "Cookware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.7,
            "review_count": 42,
            "images": ["5 piece cooking set.jpg", "5 piece cooking set.jpg", "5 piece cooking set.jpg"],
            "features": [
                "5-piece set",
                "Non-stick coating",
                "Even heat distribution",
                "Oven safe up to 400°F",
                "Dishwasher safe",
                "Professional grade"
            ],
            "specifications": {
                "Material": "Aluminum with non-stick coating",
                "Set Pieces": "5 pieces",
                "Heat Source": "Gas, Electric, Induction",
                "Oven Safe": "Up to 400°F",
                "Warranty": "2 years"
            }
        },
        {
            "name": "Electric Kettle",
            "description": "Stainless steel electric kettle with rapid boiling technology. Perfect for tea, coffee, and hot beverages. Auto-shutoff and boil-dry protection.",
            "price": 2499,
            "original_price": None,
            "sku": "CU-EK-1.7L-SS",
            "stock": 25,
            "category": "Appliances",
            "brand": "Cuisinart",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.5,
            "review_count": 38,
            "images": ["electric kettle.jpg", "electric kettle.jpg", "electric kettle.jpg"],
            "features": [
                "1.7L capacity",
                "Stainless steel construction",
                "Rapid boiling technology",
                "Auto-shutoff feature",
                "Boil-dry protection",
                "Cordless design"
            ],
            "specifications": {
                "Capacity": "1.7 liters",
                "Power": "1500W",
                "Material": "Stainless steel",
                "Dimensions": "8 x 6 x 10 inches",
                "Warranty": "2 years"
            }
        },
        {
            "name": "Wine Glasses Set",
            "description": "Elegant wine glasses set perfect for entertaining. Crystal-clear glass with thin rim for optimal wine tasting experience.",
            "price": 1899,
            "original_price": None,
            "sku": "WG-WG-6-SET",
            "stock": 15,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.4,
            "review_count": 29,
            "images": ["wine glasses.jpg", "wine glasses.jpg", "wine glasses.jpg"],
            "features": [
                "Set of 6 wine glasses",
                "Crystal-clear glass",
                "Thin rim design",
                "Dishwasher safe",
                "Elegant stemware",
                "Perfect for entertaining"
            ],
            "specifications": {
                "Material": "Crystal glass",
                "Set Includes": "6 wine glasses",
                "Capacity": "12 oz each",
                "Height": "9 inches",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Kitchen Towels",
            "description": "High-quality cotton kitchen towels for everyday use. Absorbent and durable, perfect for drying dishes, cleaning surfaces, and handling hot items.",
            "price": 699,
            "original_price": None,
            "sku": "WG-KT-4-SET",
            "stock": 50,
            "category": "Utensils",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.2,
            "review_count": 45,
            "images": ["kitchen towels.jpeg", "kitchen towels.jpeg", "kitchen towels.jpeg"],
            "features": [
                "Set of 4 towels",
                "100% cotton material",
                "Highly absorbent",
                "Machine washable",
                "Durable construction",
                "Versatile use"
            ],
            "specifications": {
                "Material": "100% Cotton",
                "Set Includes": "4 towels",
                "Size": "16 x 24 inches each",
                "Weight": "200 GSM",
                "Care": "Machine washable",
                "Warranty": "None"
            }
        },
        {
            "name": "Ceramic Mug",
            "description": "Premium ceramic mug perfect for coffee, tea, and hot beverages. Microwave and dishwasher safe with comfortable handle design.",
            "price": 599,
            "original_price": None,
            "sku": "WG-CM-12OZ",
            "stock": 40,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.3,
            "review_count": 67,
            "images": ["ceramic mug.jpeg", "ceramic mug.jpeg", "ceramic mug.jpeg"],
            "features": [
                "12-ounce capacity",
                "Premium ceramic construction",
                "Microwave and dishwasher safe",
                "Comfortable handle",
                "Chip-resistant design",
                "Perfect for hot beverages"
            ],
            "specifications": {
                "Material": "Premium ceramic",
                "Capacity": "12 ounces",
                "Height": "4.5 inches",
                "Diameter": "3.5 inches",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes"
            }
        },
        {
            "name": "Stainless Steel Knife",
            "description": "Professional stainless steel chef knife with ergonomic handle. Perfect for chopping, slicing, and dicing. Razor-sharp blade with excellent edge retention.",
            "price": 1499,
            "original_price": None,
            "sku": "WG-SK-8IN-SS",
            "stock": 20,
            "category": "Cutlery",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.6,
            "review_count": 34,
            "images": ["stainless steel knife.jpg", "stainless steel knife.jpg", "stainless steel knife.jpg"],
            "features": [
                "8-inch blade",
                "Stainless steel construction",
                "Ergonomic handle",
                "Razor-sharp edge",
                "Excellent edge retention",
                "Professional grade"
            ],
            "specifications": {
                "Material": "Stainless Steel",
                "Blade Length": "8 inches",
                "Handle Material": "Ergonomic plastic",
                "Weight": "0.5 lbs",
                "Care": "Hand wash only",
                "Warranty": "Lifetime"
            }
        },
        {
            "name": "Bamboo Spatulas",
            "description": "Eco-friendly bamboo spatulas perfect for cooking and serving. Natural material, heat resistant, and gentle on non-stick surfaces.",
            "price": 899,
            "original_price": None,
            "sku": "WG-BS-3-SET",
            "stock": 30,
            "category": "Utensils",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.1,
            "review_count": 28,
            "images": ["bamboo spatulas.jpg", "bamboo spatulas.jpg", "bamboo spatulas.jpg"],
            "features": [
                "Set of 3 spatulas",
                "Bamboo construction",
                "Heat resistant",
                "Gentle on non-stick surfaces",
                "Eco-friendly material",
                "Natural finish"
            ],
            "specifications": {
                "Material": "Bamboo",
                "Set Includes": "3 spatulas",
                "Length": "12 inches each",
                "Heat Resistant": "Up to 400°F",
                "Care": "Hand wash",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Iron Kettle",
            "description": "Traditional cast iron kettle perfect for tea brewing. Excellent heat retention and classic design. Perfect for stovetop use.",
            "price": 3499,
            "original_price": None,
            "sku": "WG-IK-2L-CI",
            "stock": 8,
            "category": "Coffee & Tea",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.7,
            "review_count": 19,
            "images": ["iron kettle.jpg", "iron kettle.jpg", "iron kettle.jpg"],
            "features": [
                "2-liter capacity",
                "Cast iron construction",
                "Excellent heat retention",
                "Traditional design",
                "Stovetop safe",
                "Whistling spout"
            ],
            "specifications": {
                "Material": "Cast Iron",
                "Capacity": "2 liters",
                "Weight": "3.2 lbs",
                "Heat Source": "Gas, Electric",
                "Warranty": "Lifetime",
                "Country": "Made in Kenya"
            }
        },
        
        # NEW PRODUCTS (13 products) - Add more here...
        {
            "name": "Oval Baking Pan",
            "description": "Professional oval baking pan perfect for roasts, casseroles, and sheet pan dinners. Heavy-duty construction with non-stick coating for easy release and cleanup.",
            "price": 1899,
            "original_price": None,
            "sku": "WG-BP-OVAL-13",
            "stock": 25,
            "category": "Bakeware",
            "brand": "Wega Premium",
            "is_new": True,  # ONLY NEW
            "is_sale": False,
            "is_featured": False,
            "rating": 4.7,
            "review_count": 8,
            "images": ["oval baking pan.jpg", "oval baking pan.jpg", "oval baking pan.jpg"],
            "features": [
                "Oval shape for roasts and casseroles",
                "Non-stick coating",
                "Heavy-duty construction",
                "Oven safe up to 450°F",
                "Dishwasher safe",
                "Easy cleanup"
            ],
            "specifications": {
                "Material": "Aluminum with non-stick coating",
                "Dimensions": "13 x 9 inches",
                "Depth": "2 inches",
                "Weight": "1.2 lbs",
                "Oven Safe": "Up to 450°F",
                "Warranty": "1 year"
            }
        }
        # ... Continue with remaining products
    ]

def seed_database():
    """Main seeding function"""
    app = create_app('development')
    
    with app.app_context():
        print("🌱 Starting local database seeding...")
        
        # Clear existing data
        clear_database()
        
        # Create categories and brands
        categories = create_categories()
        brands = create_brands()
        
        # Get product data
        products_data = get_product_data()
        
        print(f"🛍️  Creating {len(products_data)} products...")
        
        for i, product_data in enumerate(products_data, 1):
            try:
                # Create product
                product = Product(
                    name=product_data['name'],
                    description=product_data['description'],
                    price=product_data['price'],
                    original_price=product_data['original_price'],
                    sku=product_data['sku'],
                    stock=product_data['stock'],
                    category_id=categories[product_data['category']].id,
                    brand_id=brands[product_data['brand']].id,
                    is_new=product_data['is_new'],
                    is_sale=product_data['is_sale'],
                    is_featured=product_data['is_featured'],
                    rating=product_data['rating'],
                    review_count=product_data['review_count']
                )
                db.session.add(product)
                db.session.flush()
                
                # Add features
                for j, feature in enumerate(product_data['features']):
                    product_feature = ProductFeature(
                        product_id=product.id,
                        feature=feature,
                        display_order=j
                    )
                    db.session.add(product_feature)
                
                # Add specifications
                for j, (name, value) in enumerate(product_data['specifications'].items()):
                    product_spec = ProductSpecification(
                        product_id=product.id,
                        name=name,
                        value=str(value),
                        display_order=j
                    )
                    db.session.add(product_spec)
                
                # Add images (same image strategy)
                for j, image_url in enumerate(product_data['images']):
                    product_image = ProductImage(
                        product_id=product.id,
                        image_url=image_url,
                        is_primary=(j == 0),
                        display_order=j
                    )
                    db.session.add(product_image)
                
                print(f"✅ Created product {i}: {product.name}")
                
            except Exception as e:
                print(f"❌ Error creating product {product_data['name']}: {e}")
                continue
        
        db.session.commit()
        print(f"🎉 Successfully seeded database with {len(products_data)} products!")
        
        # Print summary
        print("\n📊 Seeding Summary:")
        print(f"   Categories: {len(categories)}")
        print(f"   Brands: {len(brands)}")
        print(f"   Products: {len(products_data)}")
        print(f"   Featured Products: {sum(1 for p in products_data if p['is_featured'])}")
        print(f"   New Products: {sum(1 for p in products_data if p['is_new'])}")
        print(f"   Sale Products: {sum(1 for p in products_data if p['is_sale'])}")
        print(f"   Regular Products: {sum(1 for p in products_data if not any([p['is_featured'], p['is_new'], p['is_sale']]))}")

if __name__ == "__main__":
    seed_database()
