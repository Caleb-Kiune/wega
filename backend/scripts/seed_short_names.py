import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app_factory import create_app
from models import db, Product, ProductImage, Category, Brand, ProductFeature, ProductSpecification
from datetime import datetime
import random

def get_upload_images():
    """Get list of available images from uploads folder"""
    uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'uploads')
    if not os.path.exists(uploads_dir):
        return []
    
    image_extensions = {'.jpg', '.jpeg', '.png', '.webp'}
    images = []
    
    for filename in os.listdir(uploads_dir):
        if any(filename.lower().endswith(ext) for ext in image_extensions):
            images.append(filename)
    
    return images

def seed_short_names():
    """Seed database with products that have short, impactful names"""
    app = create_app('development')
    
    with app.app_context():
        print("🗑️  Clearing existing data...")
        
        # Clear existing data
        ProductFeature.query.delete()
        ProductSpecification.query.delete()
        ProductImage.query.delete()
        Product.query.delete()
        Category.query.delete()
        Brand.query.delete()
        
        print("✅ Database cleared")
        
        # Get available images
        available_images = get_upload_images()
        print(f"📸 Found {len(available_images)} images")
        
        if not available_images:
            print("❌ No images found! Please add some images to static/uploads/")
            return
        
        # Create categories
        categories_data = [
            {'name': 'Cookware', 'slug': 'cookware', 'description': 'Pots, pans, and cooking vessels'},
            {'name': 'Bakeware', 'slug': 'bakeware', 'description': 'Baking pans and molds'},
            {'name': 'Cutlery', 'slug': 'cutlery', 'description': 'Knives and kitchen tools'},
            {'name': 'Storage', 'slug': 'storage', 'description': 'Food storage containers'},
            {'name': 'Appliances', 'slug': 'appliances', 'description': 'Kitchen appliances'},
            {'name': 'Utensils', 'slug': 'utensils', 'description': 'Cooking utensils'},
            {'name': 'Serveware', 'slug': 'serveware', 'description': 'Serving dishes'},
            {'name': 'Coffee & Tea', 'slug': 'coffee-tea', 'description': 'Coffee and tea accessories'}
        ]
        
        categories = {}
        for cat_data in categories_data:
            category = Category(**cat_data)
            db.session.add(category)
            categories[cat_data['name']] = category
        
        # Create brands
        brands_data = [
            {'name': 'Wega', 'slug': 'wega', 'description': 'Premium kitchenware'},
            {'name': 'ChefPro', 'slug': 'chefpro', 'description': 'Professional chef tools'},
            {'name': 'HomeStyle', 'slug': 'homestyle', 'description': 'Home kitchen essentials'},
            {'name': 'Culinary', 'slug': 'culinary', 'description': 'Culinary excellence'},
            {'name': 'KitchenMaster', 'slug': 'kitchenmaster', 'description': 'Master kitchen tools'}
        ]
        
        brands = {}
        for brand_data in brands_data:
            brand = Brand(**brand_data)
            db.session.add(brand)
            brands[brand_data['name']] = brand
        
        db.session.commit()
        print(f"✅ Created {len(categories)} categories and {len(brands)} brands")
        
        # SHORT PRODUCT NAMES - Perfect for product cards!
        products_data = [
            # Cookware (Short, impactful names)
            {
                'name': 'Frying Pan',
                'category': 'Cookware',
                'brand': 'Wega',
                'price': 8999,
                'original_price': 11999,
                'description': 'Professional non-stick frying pan with even heat distribution.',
                'features': ['Non-stick coating', 'Even heat distribution', 'Dishwasher safe'],
                'specifications': {'Material': 'Stainless Steel', 'Size': '12-inch', 'Weight': '2.5 lbs'},
                'is_featured': True,
                'is_sale': True
            },
            {
                'name': 'Dutch Oven',
                'category': 'Cookware',
                'brand': 'ChefPro',
                'price': 24999,
                'description': 'Cast iron Dutch oven perfect for slow cooking and braising.',
                'features': ['Cast iron construction', 'Oven safe', 'Retains heat'],
                'specifications': {'Material': 'Cast Iron', 'Capacity': '6L', 'Weight': '4.2kg'},
                'is_featured': True,
                'is_new': True
            },
            {
                'name': 'Saucepan Set',
                'category': 'Cookware',
                'brand': 'HomeStyle',
                'price': 15999,
                'original_price': 19999,
                'description': 'Set of 3 saucepans with glass lids for versatile cooking.',
                'features': ['Glass lids', 'Induction compatible', 'Stackable design'],
                'specifications': {'Material': 'Aluminum', 'Set': '3 pieces', 'Sizes': '1.5, 2, 3L'},
                'is_sale': True
            },
            {
                'name': 'Stock Pot',
                'category': 'Cookware',
                'brand': 'Wega',
                'price': 12999,
                'description': 'Large stock pot for soups, stews, and pasta.',
                'features': ['Large capacity', 'Heavy bottom', 'Easy to clean'],
                'specifications': {'Material': 'Stainless Steel', 'Capacity': '8L', 'Weight': '3.5kg'},
                'is_featured': False
            },
            {
                'name': 'Wok Pan',
                'category': 'Cookware',
                'brand': 'Culinary',
                'price': 7999,
                'description': 'Traditional wok for stir-frying and Asian cooking.',
                'features': ['Carbon steel', 'Seasoned finish', 'High heat cooking'],
                'specifications': {'Material': 'Carbon Steel', 'Size': '14-inch', 'Weight': '2.8kg'},
                'is_new': True
            },
            
            # Bakeware
            {
                'name': 'Baking Sheet',
                'category': 'Bakeware',
                'brand': 'HomeStyle',
                'price': 3999,
                'description': 'Heavy-duty baking sheet for cookies and pastries.',
                'features': ['Non-stick surface', 'Heavy gauge', 'Even baking'],
                'specifications': {'Material': 'Aluminum', 'Size': '13x18-inch', 'Weight': '1.2kg'},
                'is_featured': False
            },
            {
                'name': 'Cake Pan Set',
                'category': 'Bakeware',
                'brand': 'ChefPro',
                'price': 8999,
                'original_price': 11999,
                'description': 'Set of 3 round cake pans for perfect baking.',
                'features': ['Non-stick coating', 'Even heat', 'Stackable'],
                'specifications': {'Material': 'Aluminum', 'Set': '3 pieces', 'Sizes': '6, 8, 9-inch'},
                'is_sale': True
            },
            {
                'name': 'Muffin Tin',
                'category': 'Bakeware',
                'brand': 'Wega',
                'price': 2999,
                'description': '12-cup muffin tin for perfect muffins and cupcakes.',
                'features': ['Non-stick coating', 'Easy release', 'Even baking'],
                'specifications': {'Material': 'Aluminum', 'Cups': '12', 'Size': 'Standard'},
                'is_new': True
            },
            {
                'name': 'Bread Pan',
                'category': 'Bakeware',
                'brand': 'Culinary',
                'price': 1999,
                'description': 'Loaf pan for homemade bread and meatloaf.',
                'features': ['Non-stick surface', 'Heavy gauge', 'Perfect shape'],
                'specifications': {'Material': 'Aluminum', 'Size': '9x5-inch', 'Weight': '0.8kg'},
                'is_featured': False
            },
            
            # Cutlery
            {
                'name': 'Chef Knife',
                'category': 'Cutlery',
                'brand': 'ChefPro',
                'price': 15999,
                'description': 'Professional chef knife for precise cutting.',
                'features': ['High-carbon steel', 'Ergonomic handle', 'Razor sharp'],
                'specifications': {'Material': 'High-Carbon Steel', 'Length': '8-inch', 'Weight': '0.3kg'},
                'is_featured': True,
                'is_new': True
            },
            {
                'name': 'Knife Set',
                'category': 'Cutlery',
                'brand': 'Wega',
                'price': 29999,
                'original_price': 39999,
                'description': 'Complete knife set with block for every cutting need.',
                'features': ['Stainless steel', 'Wooden block', 'Sharpener included'],
                'specifications': {'Material': 'Stainless Steel', 'Set': '8 pieces', 'Block': 'Bamboo'},
                'is_sale': True
            },
            {
                'name': 'Paring Knife',
                'category': 'Cutlery',
                'brand': 'HomeStyle',
                'price': 3999,
                'description': 'Small paring knife for detailed cutting tasks.',
                'features': ['Precision blade', 'Comfortable grip', 'Versatile use'],
                'specifications': {'Material': 'Stainless Steel', 'Length': '3.5-inch', 'Weight': '0.1kg'},
                'is_featured': False
            },
            
            # Storage
            {
                'name': 'Food Containers',
                'category': 'Storage',
                'brand': 'HomeStyle',
                'price': 5999,
                'description': 'Set of airtight containers for food storage.',
                'features': ['Airtight seal', 'Stackable', 'Microwave safe'],
                'specifications': {'Material': 'Plastic', 'Set': '6 pieces', 'Sizes': 'Various'},
                'is_new': True
            },
            {
                'name': 'Glass Jars',
                'category': 'Storage',
                'brand': 'Culinary',
                'price': 3999,
                'description': 'Set of glass storage jars with lids.',
                'features': ['Glass construction', 'Airtight lids', 'Clear visibility'],
                'specifications': {'Material': 'Glass', 'Set': '4 pieces', 'Capacity': '1L each'},
                'is_featured': False
            },
            
            # Appliances
            {
                'name': 'Blender',
                'category': 'Appliances',
                'brand': 'KitchenMaster',
                'price': 19999,
                'original_price': 24999,
                'description': 'High-speed blender for smoothies and purees.',
                'features': ['1000W motor', '6 speeds', 'Glass jar'],
                'specifications': {'Power': '1000W', 'Capacity': '1.5L', 'Material': 'Stainless Steel'},
                'is_sale': True,
                'is_featured': True
            },
            {
                'name': 'Coffee Maker',
                'category': 'Appliances',
                'brand': 'Wega',
                'price': 15999,
                'description': 'Programmable coffee maker for perfect brew.',
                'features': ['Programmable', 'Auto-shutoff', '12-cup capacity'],
                'specifications': {'Capacity': '12 cups', 'Timer': '24-hour', 'Material': 'Stainless Steel'},
                'is_new': True
            },
            {
                'name': 'Toaster',
                'category': 'Appliances',
                'brand': 'HomeStyle',
                'price': 8999,
                'description': '2-slice toaster with multiple settings.',
                'features': ['6 settings', 'Auto-eject', 'Crumb tray'],
                'specifications': {'Slots': '2', 'Settings': '6', 'Material': 'Stainless Steel'},
                'is_featured': False
            },
            {
                'name': 'Mixer',
                'category': 'Appliances',
                'brand': 'ChefPro',
                'price': 39999,
                'description': 'Stand mixer for baking and mixing.',
                'features': ['5-quart bowl', '10 speeds', 'Attachments included'],
                'specifications': {'Power': '325W', 'Bowl': '5-quart', 'Attachments': '3 included'},
                'is_featured': True
            },
            
            # Utensils
            {
                'name': 'Spatula Set',
                'category': 'Utensils',
                'brand': 'Culinary',
                'price': 2999,
                'description': 'Set of silicone spatulas for cooking and baking.',
                'features': ['Silicone heads', 'Heat resistant', 'Non-stick safe'],
                'specifications': {'Material': 'Silicone', 'Set': '3 pieces', 'Heat': 'Up to 450°F'},
                'is_new': True
            },
            {
                'name': 'Whisk',
                'category': 'Utensils',
                'brand': 'HomeStyle',
                'price': 1999,
                'description': 'Stainless steel whisk for mixing and beating.',
                'features': ['Stainless steel', 'Comfortable handle', 'Versatile use'],
                'specifications': {'Material': 'Stainless Steel', 'Length': '12-inch', 'Weight': '0.2kg'},
                'is_featured': False
            },
            {
                'name': 'Tongs',
                'category': 'Utensils',
                'brand': 'Wega',
                'price': 1499,
                'description': 'Kitchen tongs for safe food handling.',
                'features': ['Stainless steel', 'Locking mechanism', 'Non-slip grip'],
                'specifications': {'Material': 'Stainless Steel', 'Length': '12-inch', 'Weight': '0.3kg'},
                'is_new': True
            },
            
            # Serveware
            {
                'name': 'Serving Bowl',
                'category': 'Serveware',
                'brand': 'Culinary',
                'price': 4999,
                'description': 'Large serving bowl for salads and pasta.',
                'features': ['Ceramic construction', 'Microwave safe', 'Dishwasher safe'],
                'specifications': {'Material': 'Ceramic', 'Capacity': '2L', 'Diameter': '12-inch'},
                'is_featured': False
            },
            {
                'name': 'Platter Set',
                'category': 'Serveware',
                'brand': 'HomeStyle',
                'price': 7999,
                'original_price': 9999,
                'description': 'Set of 3 serving platters for elegant presentation.',
                'features': ['Ceramic construction', 'Elegant design', 'Versatile use'],
                'specifications': {'Material': 'Ceramic', 'Set': '3 pieces', 'Sizes': 'Various'},
                'is_sale': True
            },
            
            # Coffee & Tea
            {
                'name': 'Tea Kettle',
                'category': 'Coffee & Tea',
                'brand': 'Wega',
                'price': 6999,
                'description': 'Stainless steel tea kettle for boiling water.',
                'features': ['Stainless steel', 'Whistling spout', 'Heat resistant handle'],
                'specifications': {'Material': 'Stainless Steel', 'Capacity': '2L', 'Weight': '1.2kg'},
                'is_new': True
            },
            {
                'name': 'Coffee Grinder',
                'category': 'Coffee & Tea',
                'brand': 'KitchenMaster',
                'price': 12999,
                'description': 'Electric coffee grinder for fresh ground coffee.',
                'features': ['Adjustable grind', 'Stainless steel blades', 'Compact design'],
                'specifications': {'Power': '150W', 'Capacity': '60g', 'Material': 'Stainless Steel'},
                'is_featured': False
            }
        ]
        
        # Create products
        print("🛍️  Creating products with short names...")
        
        for i, product_data in enumerate(products_data):
            print(f"Creating product {i+1}/{len(products_data)}: {product_data['name']}")
            
            # Create product
            product = Product(
                name=product_data['name'],
                description=product_data['description'],
                price=product_data['price'],
                original_price=product_data.get('original_price'),
                sku=f"SKU-{random.randint(10000, 99999)}",
                stock=random.randint(10, 50),
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
            
            # Add random images (1-2 images per product)
            num_images = random.randint(1, min(2, len(available_images)))
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
        print(f"✅ Successfully created {len(products_data)} products with short names!")
        print("🎉 All product names are now short and impactful for better display!")

if __name__ == '__main__':
    seed_short_names() 