from app_factory import create_app
from models import db, Category, Brand, Product, ProductImage, ProductSpecification, ProductFeature, Review, DeliveryLocation, Order, OrderItem, Cart, CartItem
from datetime import datetime, timedelta
import random
import os

def get_upload_images():
    """Get all image files from the uploads folder"""
    upload_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'uploads'))
    image_files = []
    
    if os.path.exists(upload_dir):
        for filename in os.listdir(upload_dir):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
                image_url = f'/static/uploads/{filename}'
                image_files.append(image_url)
    
    return image_files

def seed_database():
    app = create_app('development')
    with app.app_context():
        # Clear existing data in correct order to avoid foreign key violations
        OrderItem.query.delete()
        Order.query.delete()
        CartItem.query.delete()
        Cart.query.delete()
        Review.query.delete()
        ProductFeature.query.delete()
        ProductSpecification.query.delete()
        ProductImage.query.delete()
        Product.query.delete()
        Category.query.delete()
        Brand.query.delete()
        DeliveryLocation.query.delete()
        
        # Get available images
        available_images = get_upload_images()
        print(f"Found {len(available_images)} images in uploads folder")
        
        if not available_images:
            print("No images found in uploads folder. Please upload some images first.")
            return
        
        # Create delivery locations
        locations = [
            {'name': 'Nairobi CBD', 'slug': 'nairobi-cbd', 'city': 'Nairobi', 'shipping_price': 250, 'is_active': True},
            {'name': 'Mombasa', 'slug': 'mombasa', 'city': 'Mombasa', 'shipping_price': 800, 'is_active': True},
            {'name': 'Kisumu', 'slug': 'kisumu', 'city': 'Kisumu', 'shipping_price': 750, 'is_active': True},
        ]

        for location_data in locations:
            location = DeliveryLocation(**location_data)
            db.session.add(location)
        
        # Create categories
        categories = {
            'cookware': Category(name='Cookware', slug='cookware', description='High-quality cookware'),
            'appliances': Category(name='Appliances', slug='appliances', description='Modern kitchen appliances'),
            'utensils': Category(name='Utensils', slug='utensils', description='Essential kitchen utensils'),
            'storage': Category(name='Storage Solutions', slug='storage', description='Food storage solutions'),
            'home': Category(name='Home Essentials', slug='home-essentials', description='Essential home items')
        }
        
        for category in categories.values():
            db.session.add(category)
        
        # Create brands
        brands = {
            'wega': Brand(name='WEGA', slug='wega', description='Premium kitchenware brand'),
            'kitchenaid': Brand(name='KitchenAid', slug='kitchenaid', description='Professional kitchen equipment'),
            'cuisinart': Brand(name='Cuisinart', slug='cuisinart', description='Innovative kitchen solutions'),
            'pyrex': Brand(name='Pyrex', slug='pyrex', description='Trusted glassware brand'),
            'tefal': Brand(name='Tefal', slug='tefal', description='Quality cookware and appliances'),
            'ramtons': Brand(name='Ramtons', slug='ramtons', description='Affordable kitchen solutions'),
        }
        
        for brand in brands.values():
            db.session.add(brand)
        
        db.session.commit()
        
        # Create products with random images
        adjectives = [
            'Stainless Steel', 'Ceramic', 'Glass', 'Bamboo', 'Premium', 'Non-Stick', 'Insulated',
            'Digital', 'Cast Iron', 'Adjustable', 'Electric', 'Programmable', 'Eco-Friendly',
            'Heavy Duty', 'Lightweight', 'Compact', 'Large', 'Small', 'Professional', 'Classic',
            'Modern', 'Elegant', 'Multi-Purpose', 'High Capacity', 'Portable', 'Stackable', 'Microwave Safe',
            'Oven Safe', 'Dishwasher Safe', 'Ergonomic', 'Heat Resistant', 'Leakproof', 'Reusable', 'Decorative'
        ]
        materials = [
            'Steel', 'Ceramic', 'Glass', 'Bamboo', 'Plastic', 'Silicone', 'Wood', 'Copper', 'Aluminum', 'Porcelain', 'Marble', 'Stoneware'
        ]
        product_types = [
            'Chef Knife', 'Frying Pan', 'Food Storage Set', 'Kettle', 'Cutting Board', 'Bakeware Set', 'Travel Mug',
            'Kitchen Scale', 'Dutch Oven', 'Rolling Pin', 'Mixing Bowl', 'Measuring Cups', 'Spice Rack', 'Bread Box',
            'Water Bottle', 'Lunch Box', 'Thermos', 'Wine Glasses', 'Serving Tray', 'Colander', 'Ice Cream Scoop',
            'Pizza Cutter', 'Can Opener', 'Garlic Press', 'Peeler', 'Mandoline Slicer', 'Egg Slicer', 'Salad Bowl',
            'Soup Pot', 'Stock Pot', 'Casserole Dish', 'Grater', 'Zester', 'Mortar and Pestle', 'Butter Dish',
            'Oil Dispenser', 'Salt Shaker', 'Waffle Maker', 'Toaster', 'Blender', 'Rice Cooker', 'Pressure Cooker',
            'Slow Cooker', 'Juicer', 'Grill Pan', 'Salad Spinner', 'Measuring Spoons', 'Food Processor', 'Baking Sheet',
            'Stand Mixer', 'Electric Griddle', 'Bread Maker', 'Ice Cream Maker', 'Electric Skillet', 'Food Dehydrator',
            'Coffee Maker', 'Toaster Oven', 'Multi-Cooker', 'Immersion Blender', 'Electric Kettle', 'Pan Set', 'Tableware Set',
            'Serving Utensils', 'Storage Jar', 'Tea Pot', 'Chopping Board', 'Pastry Brush', 'Cookie Cutter', 'Cake Stand',
            'Serving Bowl', 'Salad Plate', 'Dinner Plate', 'Soup Bowl', 'Mug Set', 'Espresso Cup', 'Wine Decanter',
            'Champagne Flute', 'Shot Glass', 'Pitcher', 'Carafe', 'Butter Keeper', 'Egg Cup', 'Napkin Holder', 'Trivet',
            'Pot Holder', 'Apron', 'Oven Mitt', 'Kitchen Tongs', 'Whisk', 'Ladle', 'Slotted Spoon', 'Spatula', 'Turner',
            'Skimmer', 'Soup Ladle', 'Serving Fork', 'Carving Knife', 'Bread Knife', 'Utility Knife', 'Paring Knife'
        ]
        used_names = set()
        def generate_unique_name():
            for _ in range(1000):
                name = f"{random.choice(adjectives)} {random.choice(materials)} {random.choice(product_types)}"
                if name not in used_names:
                    used_names.add(name)
                    return name
            # fallback if exhausted
            return f"{random.choice(adjectives)} {random.choice(product_types)}"
        categories_list = list(categories.values())
        brands_list = list(brands.values())
        features_list = [
            'Premium quality', 'Dishwasher safe', 'Ergonomic handle', 'Heat resistant',
            'Non-stick coating', 'Stainless steel', 'Microwave safe', 'Stackable design',
            'BPA-free', 'Oven safe'
        ]
        specs_keys = ['Material', 'Capacity', 'Weight', 'Warranty', 'Color', 'Size']
        colors = ['Red', 'Black', 'Silver', 'White', 'Blue', 'Green', 'Yellow', 'Gray']

        products_data = []
        for _ in range(50):
            name = generate_unique_name()
            sku = f"SKU-{random.randint(10000,99999)}"
            category = random.choice(categories_list)
            brand = random.choice(brands_list)
            price = random.randint(500, 20000)
            stock = random.randint(5, 50)
            is_new = random.choice([True, False])
            is_sale = random.choice([True, False])
            is_featured = random.choice([True, False])
            features = random.sample(features_list, k=random.randint(3, 6))
            specs = {k: random.choice([random.choice(colors), f'{random.randint(1,10)}L', f'{random.randint(0,5)}kg', '1 year', '2 years', '5 years']) for k in random.sample(specs_keys, k=3)}
            products_data.append({
                'name': name,
                'description': f"High quality {name.lower()} for your kitchen.",
                'price': price,
                'sku': sku,
                'stock': stock,
                'category': category,
                'brand': brand,
                'is_new': is_new,
                'is_sale': is_sale,
                'is_featured': is_featured,
                'features': features,
                'specifications': specs
            })
        
        for product_data in products_data:
            product = Product(
                name=product_data['name'],
                description=product_data['description'],
                price=product_data['price'],
                original_price=product_data.get('original_price'),
                sku=product_data['sku'],
                stock=product_data['stock'],
                category_id=product_data['category'].id,
                brand_id=product_data['brand'].id,
                is_new=product_data['is_new'],
                is_sale=product_data['is_sale'],
                is_featured=product_data['is_featured']
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
                    value=value,
                    display_order=i
                )
                db.session.add(product_spec)
            
            # Add random images from uploads folder
            num_images = random.randint(1, 3)
            selected_images = random.sample(available_images, min(num_images, len(available_images)))
            
            for i, image_url in enumerate(selected_images):
                product_image = ProductImage(
                    product_id=product.id,
                    image_url=image_url,
                    is_primary=(i == 0),
                    display_order=i
                )
                db.session.add(product_image)
        
        db.session.commit()
        print("Database seeded successfully with 50 products and random images from uploads folder!")

if __name__ == '__main__':
    seed_database()
