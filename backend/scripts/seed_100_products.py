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

def seed_100_products():
    """Seed database with 100 products that have short, impactful names"""
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
            {'name': 'Coffee & Tea', 'slug': 'coffee-tea', 'description': 'Coffee and tea accessories'},
            {'name': 'Tableware', 'slug': 'tableware', 'description': 'Plates, bowls, and dining items'},
            {'name': 'Kitchen Tools', 'slug': 'kitchen-tools', 'description': 'Specialized kitchen tools'}
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
            {'name': 'KitchenMaster', 'slug': 'kitchenmaster', 'description': 'Master kitchen tools'},
            {'name': 'Gourmet', 'slug': 'gourmet', 'description': 'Gourmet cooking essentials'},
            {'name': 'Premium', 'slug': 'premium', 'description': 'Premium quality kitchenware'},
            {'name': 'Classic', 'slug': 'classic', 'description': 'Classic kitchen designs'}
        ]
        
        brands = {}
        for brand_data in brands_data:
            brand = Brand(**brand_data)
            db.session.add(brand)
            brands[brand_data['name']] = brand
        
        db.session.commit()
        print(f"✅ Created {len(categories)} categories and {len(brands)} brands")
        
        # 100 SHORT PRODUCT NAMES - Perfect for product cards!
        products_data = [
            # Cookware (20 products)
            {'name': 'Frying Pan', 'category': 'Cookware', 'brand': 'Wega', 'price': 8999, 'original_price': 11999},
            {'name': 'Dutch Oven', 'category': 'Cookware', 'brand': 'ChefPro', 'price': 24999},
            {'name': 'Saucepan Set', 'category': 'Cookware', 'brand': 'HomeStyle', 'price': 15999, 'original_price': 19999},
            {'name': 'Stock Pot', 'category': 'Cookware', 'brand': 'Wega', 'price': 12999},
            {'name': 'Wok Pan', 'category': 'Cookware', 'brand': 'Culinary', 'price': 7999},
            {'name': 'Grill Pan', 'category': 'Cookware', 'brand': 'KitchenMaster', 'price': 6999},
            {'name': 'Casserole Dish', 'category': 'Cookware', 'brand': 'Gourmet', 'price': 5999},
            {'name': 'Steamer Basket', 'category': 'Cookware', 'brand': 'HomeStyle', 'price': 2999},
            {'name': 'Pressure Cooker', 'category': 'Cookware', 'brand': 'Premium', 'price': 18999},
            {'name': 'Slow Cooker', 'category': 'Cookware', 'brand': 'Classic', 'price': 15999},
            {'name': 'Rice Cooker', 'category': 'Cookware', 'brand': 'KitchenMaster', 'price': 12999},
            {'name': 'Skillet', 'category': 'Cookware', 'brand': 'Wega', 'price': 9999},
            {'name': 'Sauce Pot', 'category': 'Cookware', 'brand': 'ChefPro', 'price': 7999},
            {'name': 'Roasting Pan', 'category': 'Cookware', 'brand': 'Gourmet', 'price': 14999},
            {'name': 'Fondue Pot', 'category': 'Cookware', 'brand': 'Premium', 'price': 8999},
            {'name': 'Tea Kettle', 'category': 'Cookware', 'brand': 'Classic', 'price': 6999},
            {'name': 'Double Boiler', 'category': 'Cookware', 'brand': 'HomeStyle', 'price': 4999},
            {'name': 'Paella Pan', 'category': 'Cookware', 'brand': 'Culinary', 'price': 11999},
            {'name': 'Tagine', 'category': 'Cookware', 'brand': 'Gourmet', 'price': 16999},
            {'name': 'Crepe Pan', 'category': 'Cookware', 'brand': 'KitchenMaster', 'price': 5999},
            
            # Bakeware (15 products)
            {'name': 'Baking Sheet', 'category': 'Bakeware', 'brand': 'HomeStyle', 'price': 3999},
            {'name': 'Cake Pan Set', 'category': 'Bakeware', 'brand': 'ChefPro', 'price': 8999, 'original_price': 11999},
            {'name': 'Muffin Tin', 'category': 'Bakeware', 'brand': 'Wega', 'price': 2999},
            {'name': 'Bread Pan', 'category': 'Bakeware', 'brand': 'Culinary', 'price': 1999},
            {'name': 'Pie Dish', 'category': 'Bakeware', 'brand': 'Classic', 'price': 2499},
            {'name': 'Cookie Sheet', 'category': 'Bakeware', 'brand': 'HomeStyle', 'price': 3499},
            {'name': 'Cupcake Pan', 'category': 'Bakeware', 'brand': 'KitchenMaster', 'price': 3999},
            {'name': 'Springform Pan', 'category': 'Bakeware', 'brand': 'Premium', 'price': 5999},
            {'name': 'Bundt Pan', 'category': 'Bakeware', 'brand': 'Gourmet', 'price': 7999},
            {'name': 'Rolling Pin', 'category': 'Bakeware', 'brand': 'Classic', 'price': 1999},
            {'name': 'Pastry Brush', 'category': 'Bakeware', 'brand': 'HomeStyle', 'price': 999},
            {'name': 'Cookie Cutter', 'category': 'Bakeware', 'brand': 'KitchenMaster', 'price': 1499},
            {'name': 'Cake Stand', 'category': 'Bakeware', 'brand': 'Premium', 'price': 3999},
            {'name': 'Baking Rack', 'category': 'Bakeware', 'brand': 'Wega', 'price': 2499},
            {'name': 'Pizza Stone', 'category': 'Bakeware', 'brand': 'Culinary', 'price': 8999},
            
            # Cutlery (12 products)
            {'name': 'Chef Knife', 'category': 'Cutlery', 'brand': 'ChefPro', 'price': 15999},
            {'name': 'Knife Set', 'category': 'Cutlery', 'brand': 'Wega', 'price': 29999, 'original_price': 39999},
            {'name': 'Paring Knife', 'category': 'Cutlery', 'brand': 'HomeStyle', 'price': 3999},
            {'name': 'Bread Knife', 'category': 'Cutlery', 'brand': 'KitchenMaster', 'price': 5999},
            {'name': 'Steak Knife', 'category': 'Cutlery', 'brand': 'Premium', 'price': 7999},
            {'name': 'Utility Knife', 'category': 'Cutlery', 'brand': 'Gourmet', 'price': 4999},
            {'name': 'Carving Knife', 'category': 'Cutlery', 'brand': 'Classic', 'price': 8999},
            {'name': 'Santoku Knife', 'category': 'Cutlery', 'brand': 'ChefPro', 'price': 12999},
            {'name': 'Cleaver', 'category': 'Cutlery', 'brand': 'KitchenMaster', 'price': 9999},
            {'name': 'Scissors', 'category': 'Cutlery', 'brand': 'HomeStyle', 'price': 2999},
            {'name': 'Sharpener', 'category': 'Cutlery', 'brand': 'Wega', 'price': 3999},
            {'name': 'Knife Block', 'category': 'Cutlery', 'brand': 'Premium', 'price': 5999},
            
            # Storage (8 products)
            {'name': 'Food Containers', 'category': 'Storage', 'brand': 'HomeStyle', 'price': 5999},
            {'name': 'Glass Jars', 'category': 'Storage', 'brand': 'Culinary', 'price': 3999},
            {'name': 'Spice Rack', 'category': 'Storage', 'brand': 'KitchenMaster', 'price': 4999},
            {'name': 'Pantry Organizer', 'category': 'Storage', 'brand': 'Premium', 'price': 7999},
            {'name': 'Bread Box', 'category': 'Storage', 'brand': 'Classic', 'price': 3999},
            {'name': 'Oil Dispenser', 'category': 'Storage', 'brand': 'Gourmet', 'price': 2999},
            {'name': 'Salt Shaker', 'category': 'Storage', 'brand': 'HomeStyle', 'price': 1999},
            {'name': 'Butter Keeper', 'category': 'Storage', 'brand': 'Wega', 'price': 2499},
            
            # Appliances (15 products)
            {'name': 'Blender', 'category': 'Appliances', 'brand': 'KitchenMaster', 'price': 19999, 'original_price': 24999},
            {'name': 'Coffee Maker', 'category': 'Appliances', 'brand': 'Wega', 'price': 15999},
            {'name': 'Toaster', 'category': 'Appliances', 'brand': 'HomeStyle', 'price': 8999},
            {'name': 'Mixer', 'category': 'Appliances', 'brand': 'ChefPro', 'price': 39999},
            {'name': 'Food Processor', 'category': 'Appliances', 'brand': 'Premium', 'price': 24999},
            {'name': 'Air Fryer', 'category': 'Appliances', 'brand': 'KitchenMaster', 'price': 18999},
            {'name': 'Juicer', 'category': 'Appliances', 'brand': 'Gourmet', 'price': 22999},
            {'name': 'Ice Cream Maker', 'category': 'Appliances', 'brand': 'Classic', 'price': 15999},
            {'name': 'Bread Maker', 'category': 'Appliances', 'brand': 'HomeStyle', 'price': 19999},
            {'name': 'Waffle Maker', 'category': 'Appliances', 'brand': 'Wega', 'price': 12999},
            {'name': 'Electric Kettle', 'category': 'Appliances', 'brand': 'KitchenMaster', 'price': 9999},
            {'name': 'Stand Mixer', 'category': 'Appliances', 'brand': 'ChefPro', 'price': 45999},
            {'name': 'Immersion Blender', 'category': 'Appliances', 'brand': 'Premium', 'price': 8999},
            {'name': 'Electric Griddle', 'category': 'Appliances', 'brand': 'Gourmet', 'price': 14999},
            {'name': 'Coffee Grinder', 'category': 'Appliances', 'brand': 'Classic', 'price': 12999},
            
            # Utensils (12 products)
            {'name': 'Spatula Set', 'category': 'Utensils', 'brand': 'Culinary', 'price': 2999},
            {'name': 'Whisk', 'category': 'Utensils', 'brand': 'HomeStyle', 'price': 1999},
            {'name': 'Tongs', 'category': 'Utensils', 'brand': 'Wega', 'price': 1499},
            {'name': 'Ladle', 'category': 'Utensils', 'brand': 'KitchenMaster', 'price': 999},
            {'name': 'Slotted Spoon', 'category': 'Utensils', 'brand': 'ChefPro', 'price': 1299},
            {'name': 'Turner', 'category': 'Utensils', 'brand': 'Premium', 'price': 1799},
            {'name': 'Ladle Set', 'category': 'Utensils', 'brand': 'Gourmet', 'price': 3999},
            {'name': 'Skimmer', 'category': 'Utensils', 'brand': 'Classic', 'price': 1499},
            {'name': 'Soup Ladle', 'category': 'Utensils', 'brand': 'HomeStyle', 'price': 1999},
            {'name': 'Serving Fork', 'category': 'Utensils', 'brand': 'Wega', 'price': 1299},
            {'name': 'Carving Fork', 'category': 'Utensils', 'brand': 'KitchenMaster', 'price': 2499},
            {'name': 'Basting Brush', 'category': 'Utensils', 'brand': 'Culinary', 'price': 999},
            
            # Serveware (8 products)
            {'name': 'Serving Bowl', 'category': 'Serveware', 'brand': 'Culinary', 'price': 4999},
            {'name': 'Platter Set', 'category': 'Serveware', 'brand': 'HomeStyle', 'price': 7999, 'original_price': 9999},
            {'name': 'Gravy Boat', 'category': 'Serveware', 'brand': 'Premium', 'price': 3999},
            {'name': 'Butter Dish', 'category': 'Serveware', 'brand': 'Classic', 'price': 2999},
            {'name': 'Salt Cellar', 'category': 'Serveware', 'brand': 'Gourmet', 'price': 2499},
            {'name': 'Serving Tray', 'category': 'Serveware', 'brand': 'Wega', 'price': 5999},
            {'name': 'Trivet Set', 'category': 'Serveware', 'brand': 'KitchenMaster', 'price': 3499},
            {'name': 'Napkin Holder', 'category': 'Serveware', 'brand': 'HomeStyle', 'price': 1999},
            
            # Coffee & Tea (5 products)
            {'name': 'Tea Kettle', 'category': 'Coffee & Tea', 'brand': 'Wega', 'price': 6999},
            {'name': 'Coffee Grinder', 'category': 'Coffee & Tea', 'brand': 'KitchenMaster', 'price': 12999},
            {'name': 'Tea Pot', 'category': 'Coffee & Tea', 'brand': 'Classic', 'price': 4999},
            {'name': 'Coffee Scale', 'category': 'Coffee & Tea', 'brand': 'Premium', 'price': 8999},
            {'name': 'Tea Infuser', 'category': 'Coffee & Tea', 'brand': 'Gourmet', 'price': 1999},
            
            # Tableware (5 products)
            {'name': 'Dinner Plate', 'category': 'Tableware', 'brand': 'HomeStyle', 'price': 2999},
            {'name': 'Soup Bowl', 'category': 'Tableware', 'brand': 'Classic', 'price': 1999},
            {'name': 'Wine Glass', 'category': 'Tableware', 'brand': 'Premium', 'price': 3999},
            {'name': 'Champagne Flute', 'category': 'Tableware', 'brand': 'Gourmet', 'price': 3499},
            {'name': 'Shot Glass', 'category': 'Tableware', 'brand': 'Wega', 'price': 999},
            
            # Kitchen Tools (10 products)
            {'name': 'Can Opener', 'category': 'Kitchen Tools', 'brand': 'KitchenMaster', 'price': 1999},
            {'name': 'Garlic Press', 'category': 'Kitchen Tools', 'brand': 'ChefPro', 'price': 2999},
            {'name': 'Peeler', 'category': 'Kitchen Tools', 'brand': 'HomeStyle', 'price': 1499},
            {'name': 'Mandoline', 'category': 'Kitchen Tools', 'brand': 'Premium', 'price': 5999},
            {'name': 'Egg Slicer', 'category': 'Kitchen Tools', 'brand': 'Classic', 'price': 999},
            {'name': 'Salad Spinner', 'category': 'Kitchen Tools', 'brand': 'Gourmet', 'price': 3999},
            {'name': 'Measuring Cups', 'category': 'Kitchen Tools', 'brand': 'Wega', 'price': 2499},
            {'name': 'Measuring Spoons', 'category': 'Kitchen Tools', 'brand': 'KitchenMaster', 'price': 1499},
            {'name': 'Kitchen Scale', 'category': 'Kitchen Tools', 'brand': 'Premium', 'price': 8999},
            {'name': 'Thermometer', 'category': 'Kitchen Tools', 'brand': 'ChefPro', 'price': 3999}
        ]
        
        # Create products
        print("🛍️  Creating 100 products with short names...")
        
        for i, product_data in enumerate(products_data):
            print(f"Creating product {i+1}/100: {product_data['name']}")
            
            # Generate description
            description = f"High-quality {product_data['name'].lower()} for your kitchen needs."
            
            # Create product
            product = Product(
                name=product_data['name'],
                description=description,
                price=product_data['price'],
                original_price=product_data.get('original_price'),
                sku=f"SKU-{random.randint(10000, 99999)}",
                stock=random.randint(10, 50),
                category_id=categories[product_data['category']].id,
                brand_id=brands[product_data['brand']].id,
                is_new=random.choice([True, False, False, False]),  # 25% chance
                is_sale=random.choice([True, False, False, False]),  # 25% chance
                is_featured=random.choice([True, False, False, False])  # 25% chance
            )
            db.session.add(product)
            db.session.flush()
            
            # Add features
            features = [
                'Premium quality',
                'Dishwasher safe',
                'Heat resistant',
                'Non-stick coating',
                'Stainless steel',
                'Microwave safe',
                'Stackable design',
                'BPA-free',
                'Oven safe'
            ]
            
            for i, feature in enumerate(random.sample(features, random.randint(3, 5))):
                product_feature = ProductFeature(
                    product_id=product.id,
                    feature=feature,
                    display_order=i
                )
                db.session.add(product_feature)
            
            # Add specifications
            specs_options = {
                'Material': ['Stainless Steel', 'Ceramic', 'Glass', 'Plastic', 'Bamboo', 'Porcelain', 'Cast Iron'],
                'Size': ['Small', 'Medium', 'Large', '12-inch', '6-quart', '5-quart'],
                'Color': ['Red', 'Black', 'Silver', 'White', 'Blue', 'Green'],
                'Weight': [f"{round(random.uniform(0.5, 5.0), 2)} kg"],
                'Warranty': ['1 year', '2 years', '5 years', 'Lifetime']
            }
            
            for i, (spec_name, spec_values) in enumerate(random.sample(list(specs_options.items()), 3)):
                product_spec = ProductSpecification(
                    product_id=product.id,
                    name=spec_name,
                    value=str(random.choice(spec_values)),
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
        print(f"✅ Successfully created 100 products with short names!")
        print("🎉 All product names are now short and impactful for better display!")

if __name__ == '__main__':
    seed_100_products() 