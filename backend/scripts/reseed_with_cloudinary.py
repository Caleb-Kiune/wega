#!/usr/bin/env python3
"""
Enhanced seed script for Wega Kitchenware database with Cloudinary images
This script will:
1. Import Cloudinary URLs from the generated file
2. Create realistic product data with proper categorization
3. Use actual Cloudinary URLs for all product images
4. Provide comprehensive product information
"""

import os
import sys
import random
from datetime import datetime

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app_factory import create_app
from models import db, Category, Brand, Product, ProductImage, ProductFeature, ProductSpecification

def import_cloudinary_urls():
    """Import Cloudinary URLs from the generated file"""
    try:
        # Try to import from the generated file
        from .cloudinary_urls import CLOUDINARY_IMAGE_URLS
        print(f"✅ Imported {len(CLOUDINARY_IMAGE_URLS)} Cloudinary URLs")
        return CLOUDINARY_IMAGE_URLS
    except ImportError:
        print("⚠️  Could not import cloudinary_urls.py, using fallback URLs")
        # Fallback URLs (you can replace these with your actual URLs)
        return [
            "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193414/hc32rvpjeztlnxudk9id.jpg",
            "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193416/i4u9p1hnkvt2vewnruaz.jpg",
            "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193419/gvgmz0czmqjru8t3feuw.jpg",
            "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193421/juxj8aehrtuvj7dsf0yf.jpg",
            "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193423/pg3mvq3npknngip8iiwg.jpg",
            "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193426/cwmjp37gm7hs7vxbes1d.jpg",
            "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193427/xy5cofxxiroxqg2t17oj.jpg",
            "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193429/kigy2pajny2iao3mwu3i.jpg",
            "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193431/oteqzjkayfso0sxtk7vl.jpg",
            "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193432/dye9zs2q1jedbp7srgtq.jpg"
        ]

def clear_database(app):
    """Clear existing data from database"""
    with app.app_context():
        print("🗑️  Clearing existing data...")
        try:
            # Use TRUNCATE for PostgreSQL, DELETE for SQLite
            if 'postgresql' in str(db.engine.url):
                print("🗄️  Using PostgreSQL - executing TRUNCATE commands...")
                db.session.execute('TRUNCATE TABLE product_features CASCADE')
                db.session.execute('TRUNCATE TABLE product_specifications CASCADE')
                db.session.execute('TRUNCATE TABLE product_images CASCADE')
                db.session.execute('TRUNCATE TABLE reviews CASCADE')
                db.session.execute('TRUNCATE TABLE products CASCADE')
                db.session.execute('TRUNCATE TABLE categories CASCADE')
                db.session.execute('TRUNCATE TABLE brands CASCADE')
            else:
                print("🗄️  Using SQLite - executing DELETE commands...")
                ProductImage.query.delete()
                ProductFeature.query.delete()
                ProductSpecification.query.delete()
                Product.query.delete()
                Category.query.delete()
                Brand.query.delete()
            
            db.session.commit()
            print("✅ Database cleared successfully!")
        except Exception as e:
            print(f"⚠️  Error clearing database: {e}")
            print("🔄 Attempting to continue with seeding...")
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
    
    return categories

def create_brands():
    """Create product brands"""
    brands_data = [
        {"name": "Wega Premium", "slug": "wega-premium", "description": "Premium quality kitchenware for discerning chefs"},
        {"name": "Chef's Choice", "slug": "chefs-choice", "description": "Professional-grade tools for culinary experts"},
        {"name": "Home Essentials", "slug": "home-essentials", "description": "Essential kitchen items for everyday cooking"},
        {"name": "Gourmet Pro", "slug": "gourmet-pro", "description": "Gourmet cooking equipment for food enthusiasts"},
        {"name": "Kitchen Master", "slug": "kitchen-master", "description": "Master-quality kitchen tools and accessories"}
    ]
    
    brands = {}
    for brand_data in brands_data:
        brand = Brand(**brand_data)
        db.session.add(brand)
        brands[brand_data["name"]] = brand
    
    return brands

def create_products(categories, brands, cloudinary_urls):
    """Create products with realistic data"""
    
    # Product definitions with detailed information
    product_definitions = [
        # Cookware
        {
            "name": "Stainless Steel Frying Pan",
            "category": "Cookware",
            "brand": "Wega Premium",
            "price": 89.99,
            "description": "Professional-grade 12-inch stainless steel frying pan with triple-layer construction for even heat distribution. Perfect for searing, sautéing, and pan-frying.",
            "features": ["Triple-layer construction", "Even heat distribution", "Oven safe up to 500°F", "Dishwasher safe", "Induction compatible"],
            "specifications": {"Material": "Stainless Steel", "Size": "12-inch", "Weight": "2.5 lbs", "Handle": "Stainless Steel"}
        },
        {
            "name": "Cast Iron Dutch Oven",
            "category": "Cookware",
            "brand": "Chef's Choice",
            "price": 149.99,
            "description": "Heavy-duty 6-quart cast iron Dutch oven with enamel coating. Ideal for slow cooking, braising, and making soups and stews.",
            "features": ["Cast iron construction", "Enamel coating", "6-quart capacity", "Oven safe", "Retains heat"],
            "specifications": {"Material": "Cast Iron", "Capacity": "6 quarts", "Weight": "9.5 lbs", "Lid": "Enameled Cast Iron"}
        },
        {
            "name": "Non-Stick Saucepan Set",
            "category": "Cookware",
            "brand": "Home Essentials",
            "price": 79.99,
            "description": "Set of 3 non-stick saucepans with glass lids. Perfect for sauces, soups, and small batch cooking.",
            "features": ["Non-stick coating", "Glass lids", "3-piece set", "Dishwasher safe", "Induction compatible"],
            "specifications": {"Material": "Aluminum", "Set": "3 pieces", "Sizes": "1L, 2L, 3L", "Coating": "Ceramic"}
        },
        
        # Bakeware
        {
            "name": "Non-Stick Baking Sheet Set",
            "category": "Bakeware",
            "brand": "Wega Premium",
            "price": 45.99,
            "description": "Set of 2 heavy-duty non-stick baking sheets. Perfect for cookies, pastries, and sheet pan dinners.",
            "features": ["Non-stick surface", "Heavy gauge aluminum", "Warp resistant", "Easy cleanup", "Oven safe"],
            "specifications": {"Material": "Aluminum", "Set": "2 pieces", "Size": "13x18-inch", "Thickness": "0.8mm"}
        },
        {
            "name": "Silicone Muffin Pan",
            "category": "Bakeware",
            "brand": "Gourmet Pro",
            "price": 29.99,
            "description": "Flexible silicone muffin pan with 12 cups. Non-stick surface ensures easy release and cleanup.",
            "features": ["Silicone construction", "12-cup capacity", "Non-stick surface", "Flexible design", "Dishwasher safe"],
            "specifications": {"Material": "Food-grade Silicone", "Cups": "12", "Size": "Standard", "Temperature": "-40°F to 450°F"}
        },
        
        # Cutlery
        {
            "name": "Professional Chef Knife Set",
            "category": "Cutlery",
            "brand": "Chef's Choice",
            "price": 199.99,
            "description": "Set of 8 professional chef knives with wooden storage block. High-carbon steel blades for precision cutting.",
            "features": ["High-carbon steel", "Ergonomic handles", "Wooden storage block", "Sharpener included", "8-piece set"],
            "specifications": {"Material": "High-Carbon Steel", "Set": "8 pieces", "Block": "Bamboo", "Sharpener": "Included"}
        },
        {
            "name": "Kitchen Scissors",
            "category": "Cutlery",
            "brand": "Home Essentials",
            "price": 24.99,
            "description": "Heavy-duty kitchen scissors for cutting herbs, meat, and other food items. Comfortable grip handles.",
            "features": ["Stainless steel blades", "Comfortable handles", "Easy to clean", "Dishwasher safe", "Lifetime warranty"],
            "specifications": {"Material": "Stainless Steel", "Length": "8-inch", "Grip": "Ergonomic", "Warranty": "Lifetime"}
        },
        
        # Storage
        {
            "name": "Glass Food Storage Set",
            "category": "Storage",
            "brand": "Wega Premium",
            "price": 69.99,
            "description": "Set of 6 glass food storage containers with airtight lids. Perfect for meal prep and leftovers.",
            "features": ["Glass construction", "Airtight lids", "6-piece set", "Microwave safe", "Stackable design"],
            "specifications": {"Material": "Borosilicate Glass", "Set": "6 pieces", "Lids": "Silicone", "Microwave": "Safe"}
        },
        
        # Appliances
        {
            "name": "High-Speed Blender",
            "category": "Appliances",
            "brand": "Kitchen Master",
            "price": 129.99,
            "description": "1000W high-speed blender with 6-speed control. Perfect for smoothies, soups, and purees.",
            "features": ["1000W motor", "6-speed control", "Glass jar", "Pulse function", "Easy cleanup"],
            "specifications": {"Power": "1000W", "Jar": "1.5L Glass", "Speeds": "6", "Material": "Stainless Steel"}
        },
        {
            "name": "Programmable Coffee Maker",
            "category": "Appliances",
            "brand": "Gourmet Pro",
            "price": 89.99,
            "description": "12-cup programmable coffee maker with auto-shutoff and reusable filter. Fresh coffee anytime.",
            "features": ["12-cup capacity", "Programmable timer", "Auto-shutoff", "Reusable filter", "24-hour programming"],
            "specifications": {"Capacity": "12 cups", "Timer": "24-hour", "Filter": "Reusable", "Material": "Stainless Steel"}
        },
        
        # Utensils
        {
            "name": "Silicone Spatula Set",
            "category": "Utensils",
            "brand": "Home Essentials",
            "price": 34.99,
            "description": "Set of 3 silicone spatulas in different sizes. Heat resistant up to 450°F for safe cooking.",
            "features": ["Silicone heads", "Heat resistant", "3-piece set", "Dishwasher safe", "Non-stick safe"],
            "specifications": {"Material": "Silicone", "Set": "3 pieces", "Heat": "Up to 450°F", "Sizes": "Small, Medium, Large"}
        },
        
        # Serveware
        {
            "name": "Ceramic Serving Bowl Set",
            "category": "Serveware",
            "brand": "Wega Premium",
            "price": 54.99,
            "description": "Set of 3 ceramic serving bowls in different sizes. Perfect for salads, pasta, and side dishes.",
            "features": ["Ceramic construction", "3-piece set", "Microwave safe", "Dishwasher safe", "Elegant design"],
            "specifications": {"Material": "Ceramic", "Set": "3 pieces", "Microwave": "Safe", "Dishwasher": "Safe"}
        },
        
        # Coffee & Tea
        {
            "name": "Stainless Steel Tea Kettle",
            "category": "Coffee & Tea",
            "brand": "Gourmet Pro",
            "price": 39.99,
            "description": "2L stainless steel tea kettle with whistling spout. Fast boiling for tea and hot beverages.",
            "features": ["Stainless steel", "Whistling spout", "2L capacity", "Heat resistant handle", "Fast boiling"],
            "specifications": {"Material": "Stainless Steel", "Capacity": "2L", "Spout": "Whistling", "Handle": "Heat Resistant"}
        }
    ]
    
    products_created = []
    
    for i, product_def in enumerate(product_definitions):
        try:
            # Create product
            product = Product(
                name=product_def["name"],
                description=product_def["description"],
                price=product_def["price"],
                category_id=categories[product_def["category"]].id,
                brand_id=brands[product_def["brand"]].id,
                is_featured=random.choice([True, False]),
                is_new=random.choice([True, False]),
                is_sale=random.choice([True, False]),
                stock=random.randint(10, 100),
                sku=f"SKU-{random.randint(10000, 99999)}"
            )
            
            db.session.add(product)
            db.session.flush()
            
            # Add features
            for feature in product_def["features"]:
                feature_obj = ProductFeature(
                    product_id=product.id,
                    feature=feature,
                    display_order=product_def["features"].index(feature)
                )
                db.session.add(feature_obj)
            
            # Add specifications
            for spec_name, spec_value in product_def["specifications"].items():
                spec = ProductSpecification(
                    product_id=product.id,
                    name=spec_name,
                    value=str(spec_value),
                    display_order=list(product_def["specifications"].keys()).index(spec_name)
                )
                db.session.add(spec)
            
            # Add images (1-3 random images from Cloudinary)
            num_images = random.randint(1, min(3, len(cloudinary_urls)))
            chosen_images = random.sample(cloudinary_urls, num_images)
            
            for j, image_url in enumerate(chosen_images):
                product_image = ProductImage(
                    product_id=product.id,
                    image_url=image_url,
                    is_primary=(j == 0),
                    display_order=j
                )
                db.session.add(product_image)
            
            products_created.append(product)
            print(f"✅ Created: {product.name} (${product.price}) with {num_images} images")
            
        except Exception as e:
            print(f"❌ Error creating product {product_def['name']}: {e}")
            continue
    
    return products_created

def main():
    """Main seeding function"""
    print("🌱 Starting Wega Kitchenware Database Seeding")
    print("=" * 60)
    
    try:
        # Import Cloudinary URLs
        cloudinary_urls = import_cloudinary_urls()
        
        # Create Flask app
        app = create_app('production')
        
        with app.app_context():
            try:
                # Ensure database tables exist
                print("🗄️  Creating database tables...")
                db.create_all()
                
                # Clear existing data
                clear_database(app)
                
                # Create categories and brands
                print("🏷️  Creating categories and brands...")
                categories = create_categories()
                brands = create_brands()
                db.session.commit()
                print(f"✅ Created {len(categories)} categories and {len(brands)} brands")
                
                # Create products
                print("🛍️  Creating products...")
                products = create_products(categories, brands, cloudinary_urls)
                db.session.commit()
                print(f"✅ Created {len(products)} products successfully!")
                
                print("=" * 60)
                print("🎉 Database seeding completed successfully!")
                print(f"📊 Summary:")
                print(f"   • Categories: {len(categories)}")
                print(f"   • Brands: {len(brands)}")
                print(f"   • Products: {len(products)}")
                print(f"   • Cloudinary Images: {len(cloudinary_urls)}")
                print()
                print("🚀 Your Wega Kitchenware backend is now ready with Cloudinary images!")
                
            except Exception as e:
                print(f"❌ Error during seeding: {str(e)}")
                db.session.rollback()
                raise
                
    except Exception as e:
        print(f"❌ Critical error: {str(e)}")
        print("🔄 Seeding failed, but build will continue...")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("✅ Seeding completed successfully!")
        sys.exit(0)
    else:
        print("❌ Seeding failed!")
        sys.exit(1)
