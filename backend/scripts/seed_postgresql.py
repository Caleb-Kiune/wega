#!/usr/bin/env python3
"""
PostgreSQL Database Seeding Script
This script seeds the PostgreSQL database with comprehensive sample data.
"""

import os
import sys
from datetime import datetime
from decimal import Decimal

# Add the parent directory to the path so we can import our models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app_factory import create_app
from models import db, Category, Brand, Product, ProductImage, ProductSpecification, ProductFeature, Review, DeliveryLocation, AdminUser
from werkzeug.security import generate_password_hash
from slugify import slugify

def get_available_images():
    """Get list of available images from uploads directory"""
    upload_dir = os.path.join(os.path.dirname(__file__), '..', 'static', 'uploads')
    images = []
    
    if os.path.exists(upload_dir):
        for filename in os.listdir(upload_dir):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
                images.append(filename)
    
    return sorted(images)

def seed_categories():
    """Seed categories"""
    print("📦 Seeding categories...")
    
    categories_data = [
        {
            "name": "Cookware",
            "description": "Pots, pans, and cooking utensils for every kitchen need",
            "image_url": "/static/uploads/20250619_073656_1752e565.jpeg"
        },
        {
            "name": "Bakeware",
            "description": "Baking pans, molds, and accessories for perfect baked goods",
            "image_url": "/static/uploads/20250619_073707_7a3aa2aa.jpeg"
        },
        {
            "name": "Cutlery",
            "description": "Knives, forks, spoons, and kitchen tools for precise cutting",
            "image_url": "/static/uploads/20250619_073725_b18f60ff.jpeg"
        },
        {
            "name": "Storage",
            "description": "Food storage containers and organizers for kitchen efficiency",
            "image_url": "/static/uploads/20250619_073929_c7872ea1.jpeg"
        },
        {
            "name": "Appliances",
            "description": "Kitchen appliances and gadgets for modern cooking",
            "image_url": "/static/uploads/20250619_073941_321a1550.jpeg"
        }
    ]
    
    categories = {}
    for cat_data in categories_data:
        cat_data['slug'] = slugify(cat_data['name'])
        category = Category.query.filter_by(name=cat_data["name"]).first()
        if not category:
            category = Category(**cat_data)
            db.session.add(category)
        categories[cat_data["name"]] = category
    
    db.session.commit()
    print(f"   ✅ Created {len(categories)} categories")
    return categories

def seed_brands():
    """Seed brands"""
    print("🏷️  Seeding brands...")
    
    brands_data = [
        {
            "name": "Wega Premium",
            "description": "Premium kitchenware brand offering high-quality cooking essentials",
            "logo_url": "/static/uploads/20250619_073954_46b223d4.jpeg"
        },
        {
            "name": "Chef's Choice",
            "description": "Professional chef equipment designed for culinary excellence",
            "logo_url": "/static/uploads/20250619_074010_45e88306.jpeg"
        },
        {
            "name": "Home Essentials",
            "description": "Essential home kitchen items for everyday cooking",
            "logo_url": "/static/uploads/20250619_074144_5d4b81a5.jpeg"
        },
        {
            "name": "Gourmet Pro",
            "description": "Gourmet cooking equipment for serious home chefs",
            "logo_url": "/static/uploads/20250619_074914_b20b2b8b.jpeg"
        }
    ]
    
    brands = {}
    for brand_data in brands_data:
        brand_data['slug'] = slugify(brand_data['name'])
        brand = Brand.query.filter_by(name=brand_data["name"]).first()
        if not brand:
            brand = Brand(**brand_data)
            db.session.add(brand)
        brands[brand_data["name"]] = brand
    
    db.session.commit()
    print(f"   ✅ Created {len(brands)} brands")
    return brands

def seed_delivery_locations():
    """Seed delivery locations"""
    print("🚚 Seeding delivery locations...")
    
    locations_data = [
        {
            "name": "Nairobi Central",
            "slug": "nairobi-central",
            "city": "Nairobi",
            "shipping_price": 500.00,
            "is_active": True
        },
        {
            "name": "Westlands",
            "slug": "westlands",
            "city": "Nairobi",
            "shipping_price": 400.00,
            "is_active": True
        },
        {
            "name": "Kilimani",
            "slug": "kilimani",
            "city": "Nairobi",
            "shipping_price": 450.00,
            "is_active": True
        },
        {
            "name": "Mombasa",
            "slug": "mombasa",
            "city": "Mombasa",
            "shipping_price": 800.00,
            "is_active": True
        },
        {
            "name": "Kisumu",
            "slug": "kisumu",
            "city": "Kisumu",
            "shipping_price": 700.00,
            "is_active": True
        }
    ]
    
    for location_data in locations_data:
        location = DeliveryLocation.query.filter_by(slug=location_data["slug"]).first()
        if not location:
            location = DeliveryLocation(**location_data)
            db.session.add(location)
    
    db.session.commit()
    print(f"   ✅ Created {len(locations_data)} delivery locations")

def seed_products(categories, brands):
    """Seed products with comprehensive data"""
    print("🛍️  Seeding products...")
    
    # Get available images
    available_images = get_available_images()
    print(f"   📸 Found {len(available_images)} available images")
    
    products_data = [
        {
            "name": "Stainless Steel Cookware Set",
            "description": "Professional 10-piece stainless steel cookware set with copper bottom for even heat distribution. Perfect for all cooking methods including searing, sautéing, and simmering.",
            "price": 15999.00,
            "original_price": 19999.00,
            "sku": "SS-COOK-001",
            "stock": 25,
            "rating": 0,
            "review_count": 0,
            "category": categories["Cookware"],
            "brand": brands["Wega Premium"],
            "is_featured": True,
            "is_new": True,
            "is_sale": True,
            "features": [
                "10-piece set includes 1.5L, 2L, 3L saucepans with lids",
                "Copper bottom for superior heat conductivity",
                "Stainless steel construction for durability",
                "Oven safe up to 500°F",
                "Dishwasher safe for easy cleaning"
            ],
            "specifications": {
                "Material": "Stainless Steel with Copper Bottom",
                "Set Pieces": "10 pieces",
                "Heat Source": "Gas, Electric, Induction",
                "Oven Safe": "Up to 500°F",
                "Warranty": "Lifetime"
            },
            "images": [
                {"url": f"/static/uploads/{available_images[0] if available_images else 'placeholder.jpg'}", "is_primary": True},
                {"url": f"/static/uploads/{available_images[1] if len(available_images) > 1 else 'placeholder.jpg'}", "is_primary": False},
                {"url": f"/static/uploads/{available_images[2] if len(available_images) > 2 else 'placeholder.jpg'}", "is_primary": False}
            ]
        },
        {
            "name": "Non-Stick Frying Pan Set",
            "description": "Premium non-stick frying pan set with ceramic coating. Features ergonomic handles and even heat distribution for perfect cooking results every time.",
            "price": 8999.00,
            "original_price": 11999.00,
            "sku": "NS-FRY-002",
            "stock": 30,
            "rating": 0,
            "review_count": 0,
            "category": categories["Cookware"],
            "brand": brands["Chef's Choice"],
            "is_featured": False,
            "is_new": False,
            "is_sale": True,
            "features": [
                "Ceramic non-stick coating",
                "Ergonomic heat-resistant handles",
                "Even heat distribution",
                "Dishwasher safe",
                "PFOA-free coating"
            ],
            "specifications": {
                "Material": "Aluminum with Ceramic Coating",
                "Set Pieces": "3 pieces",
                "Heat Source": "Gas, Electric, Induction",
                "Oven Safe": "Up to 400°F",
                "Warranty": "5 years"
            },
            "images": [
                {"url": f"/static/uploads/{available_images[3] if len(available_images) > 3 else 'placeholder.jpg'}", "is_primary": True},
                {"url": f"/static/uploads/{available_images[4] if len(available_images) > 4 else 'placeholder.jpg'}", "is_primary": False}
            ]
        },
        {
            "name": "Professional Chef Knife Set",
            "description": "Professional chef knife set with high-carbon steel blades. Includes essential knives for every kitchen task with ergonomic handles for comfort during extended use.",
            "price": 12999.00,
            "original_price": 15999.00,
            "sku": "KNIFE-SET-003",
            "stock": 15,
            "rating": 0,
            "review_count": 0,
            "category": categories["Cutlery"],
            "brand": brands["Chef's Choice"],
            "is_featured": True,
            "is_new": False,
            "is_sale": True,
            "features": [
                "High-carbon steel blades",
                "Ergonomic handles",
                "Includes 8 essential knives",
                "Knife block included",
                "Lifetime warranty"
            ],
            "specifications": {
                "Material": "High-Carbon Steel",
                "Set Pieces": "8 knives + block",
                "Blade Hardness": "58-60 HRC",
                "Handle Material": "Pakkawood",
                "Warranty": "Lifetime"
            },
            "images": [
                {"url": f"/static/uploads/{available_images[5] if len(available_images) > 5 else 'placeholder.jpg'}", "is_primary": True},
                {"url": f"/static/uploads/{available_images[6] if len(available_images) > 6 else 'placeholder.jpg'}", "is_primary": False},
                {"url": f"/static/uploads/{available_images[7] if len(available_images) > 7 else 'placeholder.jpg'}", "is_primary": False}
            ]
        },
        {
            "name": "Baking Sheet Set",
            "description": "Professional baking sheet set with non-stick coating. Perfect for cookies, pastries, and roasted vegetables. Features rolled edges for easy handling.",
            "price": 5999.00,
            "original_price": 7999.00,
            "sku": "BAKE-SHEET-004",
            "stock": 40,
            "rating": 0,
            "review_count": 0,
            "category": categories["Bakeware"],
            "brand": brands["Home Essentials"],
            "is_featured": False,
            "is_new": True,
            "is_sale": True,
            "features": [
                "Non-stick coating",
                "Rolled edges for easy handling",
                "Set of 3 different sizes",
                "Oven safe up to 450°F",
                "Dishwasher safe"
            ],
            "specifications": {
                "Material": "Aluminum with Non-Stick Coating",
                "Set Pieces": "3 sheets",
                "Oven Safe": "Up to 450°F",
                "Sizes": "13x9, 15x10, 17x11 inches",
                "Warranty": "3 years"
            },
            "images": [
                {"url": f"/static/uploads/{available_images[8] if len(available_images) > 8 else 'placeholder.jpg'}", "is_primary": True},
                {"url": f"/static/uploads/{available_images[9] if len(available_images) > 9 else 'placeholder.jpg'}", "is_primary": False}
            ]
        },
        {
            "name": "Food Storage Container Set",
            "description": "Airtight food storage container set with BPA-free plastic. Perfect for meal prep, leftovers, and pantry organization. Stackable design saves space.",
            "price": 3999.00,
            "original_price": 5999.00,
            "sku": "STORAGE-005",
            "stock": 50,
            "rating": 0,
            "review_count": 0,
            "category": categories["Storage"],
            "brand": brands["Home Essentials"],
            "is_featured": False,
            "is_new": False,
            "is_sale": True,
            "features": [
                "BPA-free plastic",
                "Airtight seal",
                "Stackable design",
                "Microwave safe",
                "Dishwasher safe"
            ],
            "specifications": {
                "Material": "BPA-Free Plastic",
                "Set Pieces": "15 containers",
                "Microwave Safe": "Yes",
                "Freezer Safe": "Yes",
                "Warranty": "2 years"
            },
            "images": [
                {"url": f"/static/uploads/{available_images[0] if available_images else 'placeholder.jpg'}", "is_primary": True},
                {"url": f"/static/uploads/{available_images[1] if len(available_images) > 1 else 'placeholder.jpg'}", "is_primary": False}
            ]
        },
        {
            "name": "Stand Mixer Professional",
            "description": "Professional stand mixer with 5-quart bowl and multiple attachments. Perfect for baking, mixing, and food processing. Includes dough hook, whisk, and paddle attachments.",
            "price": 29999.00,
            "original_price": 35999.00,
            "sku": "MIXER-006",
            "stock": 10,
            "rating": 0,
            "review_count": 0,
            "category": categories["Appliances"],
            "brand": brands["Wega Premium"],
            "is_featured": True,
            "is_new": True,
            "is_sale": True,
            "features": [
                "5-quart capacity",
                "10 speed settings",
                "Planetary mixing action",
                "3 attachments included",
                "Tilt-head design"
            ],
            "specifications": {
                "Power": "325W",
                "Bowl Capacity": "5-quart",
                "Attachments": "3 included",
                "Speed Settings": "10",
                "Warranty": "5 years"
            },
            "images": [
                {"url": f"/static/uploads/{available_images[2] if len(available_images) > 2 else 'placeholder.jpg'}", "is_primary": True},
                {"url": f"/static/uploads/{available_images[3] if len(available_images) > 3 else 'placeholder.jpg'}", "is_primary": False},
                {"url": f"/static/uploads/{available_images[4] if len(available_images) > 4 else 'placeholder.jpg'}", "is_primary": False}
            ]
        }
    ]
    
    added_products = 0
    for product_data in products_data:
        # Check if product already exists
        existing_product = Product.query.filter_by(name=product_data["name"]).first()
        if existing_product:
            continue
        
        # Extract features, specifications, and images
        features = product_data.pop("features")
        specifications = product_data.pop("specifications")
        images = product_data.pop("images")
        
        # Create product
        product = Product(**product_data)
        db.session.add(product)
        db.session.flush()  # Get the product ID
        
        # Add features
        for i, feature_name in enumerate(features):
            feature = ProductFeature(
                product_id=product.id, 
                feature=feature_name,
                display_order=i
            )
            db.session.add(feature)
        
        # Add specifications
        for i, (spec_name, spec_value) in enumerate(specifications.items()):
            spec = ProductSpecification(
                product_id=product.id,
                name=spec_name,
                value=str(spec_value),
                display_order=i
            )
            db.session.add(spec)
        
        # Add images
        for i, image_data in enumerate(images):
            image = ProductImage(
                product_id=product.id,
                image_url=image_data["url"],
                is_primary=image_data["is_primary"],
                display_order=i
            )
            db.session.add(image)
        
        added_products += 1
    
    db.session.commit()
    print(f"   ✅ Created {added_products} products")

def seed_reviews():
    """Seed product reviews"""
    print("⭐ Seeding reviews...")
    
    reviews_data = [
        {
            "product_id": 1,
            "user": "Sarah M.",
            "avatar": "/static/uploads/20250619_073656_1752e565.jpeg",
            "title": "Excellent Quality",
            "comment": "This cookware set is amazing! The heat distribution is perfect and the quality is outstanding. Highly recommend!",
            "rating": 5,
            "date": datetime.now()
        },
        {
            "product_id": 1,
            "user": "John D.",
            "avatar": "/static/uploads/20250619_073707_7a3aa2aa.jpeg",
            "title": "Great Value",
            "comment": "Perfect set for the price. The stainless steel is durable and cleans easily. Very satisfied with this purchase.",
            "rating": 4,
            "date": datetime.now()
        },
        {
            "product_id": 2,
            "user": "Maria L.",
            "avatar": "/static/uploads/20250619_073725_b18f60ff.jpeg",
            "title": "Non-stick Perfection",
            "comment": "The non-stick coating works perfectly. Food slides right off and cleanup is a breeze. Love these pans!",
            "rating": 5,
            "date": datetime.now()
        },
        {
            "product_id": 3,
            "user": "Chef Mike",
            "avatar": "/static/uploads/20250619_073929_c7872ea1.jpeg",
            "title": "Professional Quality",
            "comment": "As a professional chef, I can say these knives are excellent. Sharp, well-balanced, and comfortable to use.",
            "rating": 5,
            "date": datetime.now()
        },
        {
            "product_id": 4,
            "user": "Baking Betty",
            "avatar": "/static/uploads/20250619_073941_321a1550.jpeg",
            "title": "Perfect for Baking",
            "comment": "These baking sheets are perfect! Even heat distribution and nothing sticks. My cookies come out perfectly every time.",
            "rating": 4,
            "date": datetime.now()
        }
    ]
    
    for review_data in reviews_data:
        review = Review(**review_data)
        db.session.add(review)
    
    db.session.commit()
    print(f"   ✅ Created {len(reviews_data)} reviews")

def seed_admin_users():
    """Seed admin users"""
    print("👤 Seeding admin users...")
    
    admin_data = [
        {
            "username": "admin",
            "email": "admin@wega.com",
            "password": "admin123",
            "role": "admin",
            "is_active": True
        },
        {
            "username": "manager",
            "email": "manager@wega.com",
            "password": "manager123",
            "role": "manager",
            "is_active": True
        }
    ]
    
    for user_data in admin_data:
        # Check if user already exists
        existing_user = AdminUser.query.filter_by(username=user_data["username"]).first()
        if not existing_user:
            user = AdminUser(
                username=user_data["username"],
                email=user_data["email"],
                password_hash=generate_password_hash(user_data["password"]),
                role=user_data["role"],
                is_active=user_data["is_active"]
            )
            db.session.add(user)
    
    db.session.commit()
    print(f"   ✅ Created {len(admin_data)} admin users")

def main():
    """Main seeding function"""
    print("=" * 50)
    print("PostgreSQL Database Seeding")
    print("=" * 50)
    
    # Create Flask app
    app = create_app('development')
    
    with app.app_context():
        try:
            # Seed all data
            categories = seed_categories()
            brands = seed_brands()
            seed_delivery_locations()
            seed_products(categories, brands)
            # seed_reviews()  # Commented out since ratings are set to 0
            seed_admin_users()
            
            print("\n🎉 Database seeding completed successfully!")
            print("✅ All sample data has been added to PostgreSQL")
            print("✅ Your application is ready to use!")
            
        except Exception as e:
            print(f"❌ Seeding failed: {e}")
            db.session.rollback()

if __name__ == "__main__":
    main() 