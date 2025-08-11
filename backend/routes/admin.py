from flask import Blueprint, jsonify, request
from models import db, Category, Brand, Product, ProductImage, ProductFeature, ProductSpecification
import random
import sys
import os

# Add scripts directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'scripts'))

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/seed-database', methods=['POST'])
def seed_database():
    """Temporary endpoint to seed the database with Cloudinary images"""
    try:
        # Import Cloudinary URLs
        try:
            from scripts.cloudinary_urls import CLOUDINARY_IMAGE_URLS
            cloudinary_urls = CLOUDINARY_IMAGE_URLS
        except ImportError:
            # Fallback URLs
            cloudinary_urls = [
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

        # Clear existing data
        print("🗑️  Clearing existing data...")
        try:
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
            db.session.rollback()
            return jsonify({'error': f'Failed to clear database: {str(e)}'}), 500

        # Create categories
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
        
        # Create brands
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
        
        db.session.commit()
        print(f"✅ Created {len(categories)} categories and {len(brands)} brands")

        # Product definitions
        product_definitions = [
            {
                "name": "Stainless Steel Frying Pan",
                "category": "Cookware",
                "brand": "Wega Premium",
                "price": 89.99,
                "description": "Professional-grade 12-inch stainless steel frying pan with triple-layer construction for even heat distribution.",
                "features": ["Triple-layer construction", "Even heat distribution", "Oven safe up to 500°F", "Dishwasher safe"],
                "specifications": {"Material": "Stainless Steel", "Size": "12-inch", "Weight": "2.5 lbs"}
            },
            {
                "name": "Cast Iron Dutch Oven",
                "category": "Cookware",
                "brand": "Chef's Choice",
                "price": 149.99,
                "description": "Heavy-duty 6-quart cast iron Dutch oven with enamel coating. Ideal for slow cooking and braising.",
                "features": ["Cast iron construction", "Enamel coating", "6-quart capacity", "Oven safe"],
                "specifications": {"Material": "Cast Iron", "Capacity": "6 quarts", "Weight": "9.5 lbs"}
            },
            {
                "name": "Non-Stick Baking Sheet Set",
                "category": "Bakeware",
                "brand": "Wega Premium",
                "price": 45.99,
                "description": "Set of 2 heavy-duty non-stick baking sheets. Perfect for cookies, pastries, and sheet pan dinners.",
                "features": ["Non-stick surface", "Heavy gauge aluminum", "Warp resistant", "Easy cleanup"],
                "specifications": {"Material": "Aluminum", "Set": "2 pieces", "Size": "13x18-inch"}
            },
            {
                "name": "Professional Chef Knife Set",
                "category": "Cutlery",
                "brand": "Chef's Choice",
                "price": 199.99,
                "description": "Set of 8 professional chef knives with wooden storage block. High-carbon steel blades for precision cutting.",
                "features": ["High-carbon steel", "Ergonomic handles", "Wooden storage block", "Sharpener included"],
                "specifications": {"Material": "High-Carbon Steel", "Set": "8 pieces", "Block": "Bamboo"}
            },
            {
                "name": "Glass Food Storage Set",
                "category": "Storage",
                "brand": "Wega Premium",
                "price": 69.99,
                "description": "Set of 6 glass food storage containers with airtight lids. Perfect for meal prep and leftovers.",
                "features": ["Glass construction", "Airtight lids", "6-piece set", "Microwave safe"],
                "specifications": {"Material": "Borosilicate Glass", "Set": "6 pieces", "Lids": "Silicone"}
            },
            {
                "name": "High-Speed Blender",
                "category": "Appliances",
                "brand": "Kitchen Master",
                "price": 129.99,
                "description": "1000W high-speed blender with 6-speed control. Perfect for smoothies, soups, and purees.",
                "features": ["1000W motor", "6-speed control", "Glass jar", "Pulse function"],
                "specifications": {"Power": "1000W", "Jar": "1.5L Glass", "Speeds": "6"}
            },
            {
                "name": "Programmable Coffee Maker",
                "category": "Appliances",
                "brand": "Gourmet Pro",
                "price": 89.99,
                "description": "12-cup programmable coffee maker with auto-shutoff and reusable filter. Fresh coffee anytime.",
                "features": ["12-cup capacity", "Programmable timer", "Auto-shutoff", "Reusable filter"],
                "specifications": {"Capacity": "12 cups", "Timer": "24-hour", "Filter": "Reusable"}
            },
            {
                "name": "Silicone Spatula Set",
                "category": "Utensils",
                "brand": "Home Essentials",
                "price": 34.99,
                "description": "Set of 3 silicone spatulas in different sizes. Heat resistant up to 450°F for safe cooking.",
                "features": ["Silicone heads", "Heat resistant", "3-piece set", "Dishwasher safe"],
                "specifications": {"Material": "Silicone", "Set": "3 pieces", "Heat": "Up to 450°F"}
            },
            {
                "name": "Ceramic Serving Bowl Set",
                "category": "Serveware",
                "brand": "Wega Premium",
                "price": 54.99,
                "description": "Set of 3 ceramic serving bowls in different sizes. Perfect for salads, pasta, and side dishes.",
                "features": ["Ceramic construction", "3-piece set", "Microwave safe", "Dishwasher safe"],
                "specifications": {"Material": "Ceramic", "Set": "3 pieces", "Microwave": "Safe"}
            },
            {
                "name": "Stainless Steel Tea Kettle",
                "category": "Coffee & Tea",
                "brand": "Gourmet Pro",
                "price": 39.99,
                "description": "2L stainless steel tea kettle with whistling spout. Fast boiling for tea and hot beverages.",
                "features": ["Stainless steel", "Whistling spout", "2L capacity", "Heat resistant handle"],
                "specifications": {"Material": "Stainless Steel", "Capacity": "2L", "Spout": "Whistling"}
            }
        ]

        # Create products
        products_created = []
        for product_def in product_definitions:
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

        db.session.commit()
        print(f"✅ Created {len(products_created)} products successfully!")

        return jsonify({
            'success': True,
            'message': 'Database seeded successfully!',
            'summary': {
                'categories': len(categories),
                'brands': len(brands),
                'products': len(products_created),
                'cloudinary_images': len(cloudinary_urls)
            }
        })

    except Exception as e:
        print(f"❌ Critical error during seeding: {str(e)}")
        db.session.rollback()
        return jsonify({'error': f'Seeding failed: {str(e)}'}), 500 