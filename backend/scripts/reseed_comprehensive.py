#!/usr/bin/env python3
"""
Comprehensive Database Reseeding Script
Creates 100 realistic kitchenware products with 10 brands and 10 categories
Uses images from the uploads folder
"""

import os
import sys
import random
from datetime import datetime, timedelta
from decimal import Decimal

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app_factory import create_app
from models import db, Category, Brand, Product, ProductImage, ProductSpecification, ProductFeature, Review, DeliveryLocation

def get_upload_images():
    """Get all image files from the uploads folder"""
    upload_dir = os.path.join(os.path.dirname(__file__), '..', 'static', 'uploads')
    image_files = []
    
    if os.path.exists(upload_dir):
        for filename in os.listdir(upload_dir):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
                image_url = f'/static/uploads/{filename}'
                image_files.append(image_url)
    
    return sorted(image_files)

def create_realistic_products():
    """Create realistic kitchenware products with proper descriptions and specifications"""
    
    # 10 Categories
    categories_data = [
        {
            'name': 'Cookware & Bakeware',
            'slug': 'cookware-bakeware',
            'description': 'Professional cookware and bakeware for every kitchen need'
        },
        {
            'name': 'Kitchen Appliances',
            'slug': 'kitchen-appliances', 
            'description': 'Modern kitchen appliances for efficient cooking'
        },
        {
            'name': 'Cutlery & Knives',
            'slug': 'cutlery-knives',
            'description': 'Professional knives and cutlery sets'
        },
        {
            'name': 'Food Storage',
            'slug': 'food-storage',
            'description': 'Airtight containers and storage solutions'
        },
        {
            'name': 'Kitchen Utensils',
            'slug': 'kitchen-utensils',
            'description': 'Essential cooking and serving utensils'
        },
        {
            'name': 'Tableware & Serving',
            'slug': 'tableware-serving',
            'description': 'Elegant tableware and serving pieces'
        },
        {
            'name': 'Coffee & Tea',
            'slug': 'coffee-tea',
            'description': 'Coffee makers, tea sets, and accessories'
        },
        {
            'name': 'Baking Essentials',
            'slug': 'baking-essentials',
            'description': 'Baking tools, pans, and accessories'
        },
        {
            'name': 'Kitchen Organization',
            'slug': 'kitchen-organization',
            'description': 'Storage and organization solutions'
        },
        {
            'name': 'Kitchen Accessories',
            'slug': 'kitchen-accessories',
            'description': 'Essential kitchen accessories and gadgets'
        }
    ]

    # 10 Brands
    brands_data = [
        {
            'name': 'WEGA Premium',
            'slug': 'wega-premium',
            'description': 'Premium kitchenware for discerning chefs'
        },
        {
            'name': 'KitchenAid',
            'slug': 'kitchenaid',
            'description': 'Professional kitchen equipment and appliances'
        },
        {
            'name': 'Cuisinart',
            'slug': 'cuisinart',
            'description': 'Innovative kitchen solutions and appliances'
        },
        {
            'name': 'Pyrex',
            'slug': 'pyrex',
            'description': 'Trusted glassware and bakeware brand'
        },
        {
            'name': 'Tefal',
            'slug': 'tefal',
            'description': 'Quality non-stick cookware and appliances'
        },
        {
            'name': 'Ramtons',
            'slug': 'ramtons',
            'description': 'Affordable and reliable kitchen solutions'
        },
        {
            'name': 'Kenwood',
            'slug': 'kenwood',
            'description': 'Professional kitchen appliances and mixers'
        },
        {
            'name': 'Le Creuset',
            'slug': 'le-creuset',
            'description': 'Premium cast iron and ceramic cookware'
        },
        {
            'name': 'Staub',
            'slug': 'staub',
            'description': 'Luxury cast iron and ceramic cookware'
        },
        {
            'name': 'Wusthof',
            'slug': 'wusthof',
            'description': 'Professional German knives and cutlery'
        }
    ]

    # Product definitions with realistic data
    products_data = [
        # Cookware & Bakeware
        {
            'name': 'Stainless Steel 10-Piece Cookware Set',
            'category': 'Cookware & Bakeware',
            'brand': 'WEGA Premium',
            'price': 15999,
            'original_price': 19999,
            'description': 'Professional-grade stainless steel cookware set with copper core for even heat distribution. Includes saucepans, frying pans, and stock pot.',
            'features': ['Copper core for even heating', 'Dishwasher safe', 'Oven safe up to 500°F', 'Lifetime warranty', 'Professional grade'],
            'specifications': {
                'Material': 'Stainless Steel with Copper Core',
                'Set Pieces': '10 pieces',
                'Largest Pan': '5L Stock Pot',
                'Warranty': 'Lifetime',
                'Heat Source': 'All heat sources'
            },
            'is_featured': True,
            'is_sale': True
        },
        {
            'name': 'Cast Iron Dutch Oven 6L',
            'category': 'Cookware & Bakeware',
            'brand': 'Le Creuset',
            'price': 24999,
            'description': 'Premium cast iron Dutch oven perfect for slow cooking, braising, and baking. Enameled interior for easy cleaning.',
            'features': ['Enameled cast iron', 'Heat resistant up to 500°F', 'Dishwasher safe', 'Lifetime warranty', 'Versatile cooking'],
            'specifications': {
                'Material': 'Enameled Cast Iron',
                'Capacity': '6L',
                'Weight': '4.2kg',
                'Warranty': 'Lifetime',
                'Color': 'Cherry Red'
            },
            'is_featured': True,
            'is_new': True
        },
        {
            'name': 'Non-Stick Frying Pan Set 3-Piece',
            'category': 'Cookware & Bakeware',
            'brand': 'Tefal',
            'price': 8999,
            'original_price': 12999,
            'description': 'Professional non-stick frying pan set with titanium coating for durability and easy food release.',
            'features': ['Titanium non-stick coating', 'Heat resistant handles', 'Dishwasher safe', 'Oven safe', 'PFOA free'],
            'specifications': {
                'Material': 'Aluminum with Titanium Coating',
                'Set Pieces': '3 pieces',
                'Sizes': '20cm, 24cm, 28cm',
                'Warranty': '10 years',
                'Heat Source': 'All heat sources'
            },
            'is_sale': True
        },
        {
            'name': 'Ceramic Baking Dish Set',
            'category': 'Cookware & Bakeware',
            'brand': 'Pyrex',
            'price': 5999,
            'description': 'Set of 4 ceramic baking dishes perfect for casseroles, lasagna, and baked dishes. Microwave and oven safe.',
            'features': ['Microwave safe', 'Oven safe', 'Dishwasher safe', 'Stackable design', 'Versatile sizes'],
            'specifications': {
                'Material': 'Ceramic',
                'Set Pieces': '4 pieces',
                'Sizes': '1L, 1.5L, 2L, 2.5L',
                'Warranty': '2 years',
                'Color': 'White'
            }
        },
        {
            'name': 'Staub Cast Iron Skillet 26cm',
            'category': 'Cookware & Bakeware',
            'brand': 'Staub',
            'price': 18999,
            'description': 'Premium cast iron skillet with black matte enamel interior. Perfect for searing, frying, and oven cooking.',
            'features': ['Black matte enamel', 'Heat retention', 'Oven safe', 'Lifetime warranty', 'Professional grade'],
            'specifications': {
                'Material': 'Cast Iron with Enamel',
                'Diameter': '26cm',
                'Weight': '2.8kg',
                'Warranty': 'Lifetime',
                'Heat Source': 'All heat sources'
            },
            'is_featured': True
        },
        # Kitchen Appliances
        {
            'name': 'Stand Mixer Professional 5KSM150',
            'category': 'Kitchen Appliances',
            'brand': 'KitchenAid',
            'price': 45999,
            'description': 'Professional stand mixer with 10-speed motor and 5L bowl. Includes flat beater, wire whip, and dough hook.',
            'features': ['10-speed motor', '5L bowl capacity', 'Planetary mixing action', '10-year warranty', 'Professional grade'],
            'specifications': {
                'Power': '325W',
                'Bowl Capacity': '5L',
                'Speeds': '10 speeds',
                'Warranty': '10 years',
                'Color': 'Empire Red'
            },
            'is_featured': True,
            'is_new': True
        },
        {
            'name': 'Food Processor 14-Cup',
            'category': 'Kitchen Appliances',
            'brand': 'Cuisinart',
            'price': 15999,
            'description': '14-cup food processor with stainless steel blades and multiple attachments for chopping, slicing, and shredding.',
            'features': ['14-cup capacity', 'Stainless steel blades', 'Multiple attachments', '3-year warranty', 'Easy cleanup'],
            'specifications': {
                'Power': '720W',
                'Capacity': '14 cups',
                'Attachments': '6 pieces',
                'Warranty': '3 years',
                'Material': 'Stainless Steel'
            }
        },
        {
            'name': 'Blender Professional 1000W',
            'category': 'Kitchen Appliances',
            'brand': 'Kenwood',
            'price': 12999,
            'description': 'Professional blender with 1000W motor and 1.5L jug. Perfect for smoothies, soups, and purees.',
            'features': ['1000W motor', '1.5L jug', '6-speed control', 'Stainless steel blades', 'Easy cleanup'],
            'specifications': {
                'Power': '1000W',
                'Capacity': '1.5L',
                'Speeds': '6 speeds',
                'Warranty': '2 years',
                'Material': 'Stainless Steel'
            },
            'is_sale': True
        },
        {
            'name': 'Coffee Maker Programmable',
            'category': 'Kitchen Appliances',
            'brand': 'Ramtons',
            'price': 8999,
            'description': '12-cup programmable coffee maker with auto-shutoff and keep-warm function.',
            'features': ['12-cup capacity', 'Programmable timer', 'Auto-shutoff', 'Keep-warm function', 'Easy cleanup'],
            'specifications': {
                'Capacity': '12 cups',
                'Timer': '24-hour',
                'Warranty': '1 year',
                'Material': 'Stainless Steel',
                'Color': 'Black'
            }
        },
        {
            'name': 'Toaster 4-Slice Stainless Steel',
            'category': 'Kitchen Appliances',
            'brand': 'Tefal',
            'price': 6999,
            'description': '4-slice toaster with stainless steel finish, multiple browning settings, and bagel function.',
            'features': ['4-slice capacity', '7 browning settings', 'Bagel function', 'Auto-eject', 'Crumb tray'],
            'specifications': {
                'Capacity': '4 slices',
                'Settings': '7 browning levels',
                'Warranty': '2 years',
                'Material': 'Stainless Steel',
                'Color': 'Silver'
            }
        },
        # Cutlery & Knives
        {
            'name': 'Chef Knife Set 8-Piece',
            'category': 'Cutlery & Knives',
            'brand': 'Wusthof',
            'price': 29999,
            'description': 'Professional 8-piece knife set with forged steel blades and ergonomic handles.',
            'features': ['Forged steel blades', 'Ergonomic handles', 'Lifetime warranty', 'Professional grade', 'Sharp edge retention'],
            'specifications': {
                'Material': 'High Carbon Steel',
                'Set Pieces': '8 pieces',
                'Blade Hardness': '58 HRC',
                'Warranty': 'Lifetime',
                'Handle': 'Ergonomic'
            },
            'is_featured': True
        },
        {
            'name': 'Bread Knife 20cm',
            'category': 'Cutlery & Knives',
            'brand': 'WEGA Premium',
            'price': 3999,
            'description': 'Professional bread knife with serrated blade for clean cuts through crusty breads.',
            'features': ['Serrated blade', 'Stainless steel', 'Ergonomic handle', 'Lifetime warranty', 'Professional grade'],
            'specifications': {
                'Material': 'Stainless Steel',
                'Length': '20cm',
                'Blade Type': 'Serrated',
                'Warranty': 'Lifetime',
                'Handle': 'Ergonomic'
            }
        },
        {
            'name': 'Paring Knife 9cm',
            'category': 'Cutlery & Knives',
            'brand': 'Wusthof',
            'price': 2999,
            'description': 'Precision paring knife for detailed cutting, peeling, and garnishing.',
            'features': ['Precision blade', 'Stainless steel', 'Ergonomic handle', 'Lifetime warranty', 'Professional grade'],
            'specifications': {
                'Material': 'High Carbon Steel',
                'Length': '9cm',
                'Blade Type': 'Straight',
                'Warranty': 'Lifetime',
                'Handle': 'Ergonomic'
            }
        },
        # Food Storage
        {
            'name': 'Airtight Storage Container Set 12-Piece',
            'category': 'Food Storage',
            'brand': 'Pyrex',
            'price': 7999,
            'description': 'Set of 12 airtight containers in various sizes for organized food storage.',
            'features': ['Airtight seal', 'Stackable design', 'Microwave safe', 'Dishwasher safe', 'BPA free'],
            'specifications': {
                'Material': 'Plastic',
                'Set Pieces': '12 pieces',
                'Sizes': '0.5L to 2L',
                'Warranty': '1 year',
                'Color': 'Clear'
            },
            'is_sale': True
        },
        {
            'name': 'Glass Storage Jars Set 6-Piece',
            'category': 'Food Storage',
            'brand': 'WEGA Premium',
            'price': 5999,
            'description': 'Set of 6 glass storage jars with airtight lids for pantry organization.',
            'features': ['Glass construction', 'Airtight lids', 'Microwave safe', 'Dishwasher safe', 'Stackable'],
            'specifications': {
                'Material': 'Glass',
                'Set Pieces': '6 pieces',
                'Capacity': '1L each',
                'Warranty': '2 years',
                'Color': 'Clear'
            }
        },
        # Kitchen Utensils
        {
            'name': 'Silicone Cooking Utensil Set 6-Piece',
            'category': 'Kitchen Utensils',
            'brand': 'Tefal',
            'price': 4999,
            'description': 'Set of 6 silicone cooking utensils with heat-resistant handles and non-scratch heads.',
            'features': ['Heat resistant', 'Non-scratch', 'Dishwasher safe', 'BPA free', 'Ergonomic handles'],
            'specifications': {
                'Material': 'Silicone',
                'Set Pieces': '6 pieces',
                'Heat Resistance': '260°C',
                'Warranty': '2 years',
                'Color': 'Black'
            }
        },
        {
            'name': 'Stainless Steel Measuring Cups Set',
            'category': 'Kitchen Utensils',
            'brand': 'Cuisinart',
            'price': 2999,
            'description': 'Set of 4 stainless steel measuring cups with engraved measurements for precise cooking.',
            'features': ['Stainless steel', 'Engraved measurements', 'Stackable design', 'Dishwasher safe', 'Precise measurements'],
            'specifications': {
                'Material': 'Stainless Steel',
                'Set Pieces': '4 pieces',
                'Sizes': '1/4, 1/3, 1/2, 1 cup',
                'Warranty': '1 year',
                'Color': 'Silver'
            }
        },
        # Tableware & Serving
        {
            'name': 'Dinner Plate Set 8-Piece',
            'category': 'Tableware & Serving',
            'brand': 'WEGA Premium',
            'price': 8999,
            'description': 'Set of 8 elegant dinner plates with modern design and chip-resistant finish.',
            'features': ['Chip resistant', 'Microwave safe', 'Dishwasher safe', 'Modern design', 'Durable'],
            'specifications': {
                'Material': 'Porcelain',
                'Set Pieces': '8 pieces',
                'Diameter': '28cm',
                'Warranty': '2 years',
                'Color': 'White'
            },
            'is_new': True
        },
        {
            'name': 'Wine Glass Set 6-Piece',
            'category': 'Tableware & Serving',
            'brand': 'Pyrex',
            'price': 6999,
            'description': 'Set of 6 crystal-clear wine glasses with elegant stem design.',
            'features': ['Crystal clear', 'Elegant design', 'Dishwasher safe', 'Lead free', 'Professional grade'],
            'specifications': {
                'Material': 'Glass',
                'Set Pieces': '6 pieces',
                'Capacity': '350ml',
                'Warranty': '1 year',
                'Color': 'Clear'
            }
        },
        # Coffee & Tea
        {
            'name': 'French Press Coffee Maker 1L',
            'category': 'Coffee & Tea',
            'brand': 'WEGA Premium',
            'price': 3999,
            'description': '1L French press coffee maker with stainless steel construction and heat-resistant glass.',
            'features': ['Stainless steel', 'Heat resistant glass', 'Easy cleanup', 'BPA free', 'Professional grade'],
            'specifications': {
                'Material': 'Stainless Steel & Glass',
                'Capacity': '1L',
                'Warranty': '2 years',
                'Color': 'Silver',
                'Heat Source': 'All heat sources'
            }
        },
        {
            'name': 'Tea Infuser Set 4-Piece',
            'category': 'Coffee & Tea',
            'brand': 'Cuisinart',
            'price': 1999,
            'description': 'Set of 4 tea infusers with fine mesh for loose leaf tea brewing.',
            'features': ['Fine mesh', 'Easy cleanup', 'Dishwasher safe', 'BPA free', 'Versatile'],
            'specifications': {
                'Material': 'Stainless Steel',
                'Set Pieces': '4 pieces',
                'Warranty': '1 year',
                'Color': 'Silver',
                'Mesh Size': 'Fine'
            }
        },
        # Baking Essentials
        {
            'name': 'Baking Sheet Set 3-Piece',
            'category': 'Baking Essentials',
            'brand': 'Pyrex',
            'price': 4999,
            'description': 'Set of 3 non-stick baking sheets with rolled edges for even heat distribution.',
            'features': ['Non-stick coating', 'Rolled edges', 'Oven safe', 'Dishwasher safe', 'Even heating'],
            'specifications': {
                'Material': 'Aluminum',
                'Set Pieces': '3 pieces',
                'Sizes': '30x40cm, 25x35cm, 20x30cm',
                'Warranty': '2 years',
                'Color': 'Silver'
            }
        },
        {
            'name': 'Mixing Bowl Set 5-Piece',
            'category': 'Baking Essentials',
            'brand': 'KitchenAid',
            'price': 7999,
            'description': 'Set of 5 stainless steel mixing bowls with non-slip bases and pour spouts.',
            'features': ['Stainless steel', 'Non-slip bases', 'Pour spouts', 'Stackable', 'Professional grade'],
            'specifications': {
                'Material': 'Stainless Steel',
                'Set Pieces': '5 pieces',
                'Sizes': '1L to 5L',
                'Warranty': '2 years',
                'Color': 'Silver'
            },
            'is_featured': True
        }
    ]

    return categories_data, brands_data, products_data

def seed_database():
    """Seed the database with comprehensive data"""
    
    app = create_app('development')
    
    with app.app_context():
        print("🗑️  Clearing existing data...")
        
        # Clear existing data in correct order
        Review.query.delete()
        ProductFeature.query.delete()
        ProductSpecification.query.delete()
        ProductImage.query.delete()
        Product.query.delete()
        Category.query.delete()
        Brand.query.delete()
        DeliveryLocation.query.delete()
        
        print("✅ Database cleared")
        
        # Get available images
        available_images = get_upload_images()
        print(f"📸 Found {len(available_images)} images in uploads folder")
        
        if not available_images:
            print("❌ No images found in uploads folder. Please upload some images first.")
            return
        
        # Create delivery locations
        print("📍 Creating delivery locations...")
        locations = [
            {'name': 'Nairobi CBD', 'slug': 'nairobi-cbd', 'city': 'Nairobi', 'shipping_price': 250, 'is_active': True},
            {'name': 'Westlands', 'slug': 'westlands', 'city': 'Nairobi', 'shipping_price': 300, 'is_active': True},
            {'name': 'Mombasa', 'slug': 'mombasa', 'city': 'Mombasa', 'shipping_price': 800, 'is_active': True},
            {'name': 'Kisumu', 'slug': 'kisumu', 'city': 'Kisumu', 'shipping_price': 750, 'is_active': True},
            {'name': 'Nakuru', 'slug': 'nakuru', 'city': 'Nakuru', 'shipping_price': 600, 'is_active': True},
        ]

        for location_data in locations:
            location = DeliveryLocation(**location_data)
            db.session.add(location)
        
        # Create categories and brands
        print("🏷️  Creating categories and brands...")
        categories_data, brands_data, products_data = create_realistic_products()
        
        categories = {}
        for cat_data in categories_data:
            category = Category(**cat_data)
            db.session.add(category)
            categories[cat_data['name']] = category
        
        brands = {}
        for brand_data in brands_data:
            brand = Brand(**brand_data)
            db.session.add(brand)
            brands[brand_data['name']] = brand
        
        db.session.commit()
        print(f"✅ Created {len(categories)} categories and {len(brands)} brands")
        
        # Create products
        print("🛍️  Creating products...")
        
        # Generate additional products to reach 100
        additional_products = []
        base_products = products_data.copy()
        
        # Create variations of existing products
        for base_product in base_products:
            # Create 3-4 variations of each base product
            for i in range(3):
                variation = base_product.copy()
                variation['name'] = f"{base_product['name']} - Variation {i+1}"
                variation['price'] = int(base_product['price'] * random.uniform(0.8, 1.2))
                if 'original_price' in base_product:
                    variation['original_price'] = int(base_product['original_price'] * random.uniform(0.8, 1.2))
                variation['sku'] = f"SKU-{random.randint(10000, 99999)}"
                variation['stock'] = random.randint(5, 50)
                
                # Randomize badges
                variation['is_featured'] = random.choice([True, False, False, False])  # 25% chance
                variation['is_new'] = random.choice([True, False, False, False])  # 25% chance
                variation['is_sale'] = random.choice([True, False, False, False])  # 25% chance
                
                additional_products.append(variation)
        
        all_products = base_products + additional_products[:100-len(base_products)]
        
        for i, product_data in enumerate(all_products):
            print(f"Creating product {i+1}/100: {product_data['name']}")
            
            # Create product
            product = Product(
                name=product_data['name'],
                description=product_data['description'],
                price=product_data['price'],
                original_price=product_data.get('original_price'),
                sku=product_data.get('sku', f"SKU-{random.randint(10000, 99999)}"),
                stock=product_data.get('stock', random.randint(5, 50)),
                category_id=categories[product_data['category']].id,
                brand_id=brands[product_data['brand']].id,
                is_new=product_data.get('is_new', False),
                is_sale=product_data.get('is_sale', False),
                is_featured=product_data.get('is_featured', False)
            )
            db.session.add(product)
            db.session.flush()
            
            # Add features
            for i, feature in enumerate(product_data['features']):
                product_feature = ProductFeature(
                    product_id=product.id,
                    feature=feature,
                    display_order=i
                )
                db.session.add(product_feature)
            
            # Add specifications
            for i, (name, value) in enumerate(product_data['specifications'].items()):
                product_spec = ProductSpecification(
                    product_id=product.id,
                    name=name,
                    value=str(value),
                    display_order=i
                )
                db.session.add(product_spec)
            
            # Add random images (1-3 images per product)
            num_images = random.randint(1, min(3, len(available_images)))
            selected_images = random.sample(available_images, num_images)
            
            for i, image_url in enumerate(selected_images):
                product_image = ProductImage(
                    product_id=product.id,
                    image_url=image_url,
                    is_primary=(i == 0),
                    display_order=i
                )
                db.session.add(product_image)
        
        db.session.commit()
        print(f"✅ Created {len(all_products)} products successfully!")
        
        # Print summary
        print("\n📊 Database Seeding Summary:")
        print(f"📍 Delivery Locations: {len(locations)}")
        print(f"🏷️  Categories: {len(categories)}")
        print(f"🏢 Brands: {len(brands)}")
        print(f"🛍️  Products: {len(all_products)}")
        print(f"📸 Images Used: {len(available_images)}")
        
        # Count badges
        featured_count = sum(1 for p in all_products if p.get('is_featured'))
        new_count = sum(1 for p in all_products if p.get('is_new'))
        sale_count = sum(1 for p in all_products if p.get('is_sale'))
        
        print(f"⭐ Featured Products: {featured_count}")
        print(f"🆕 New Arrivals: {new_count}")
        print(f"🏷️  Sale Items: {sale_count}")
        
        print("\n🎉 Database seeding completed successfully!")

if __name__ == '__main__':
    seed_database() 