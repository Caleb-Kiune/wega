import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app_factory import create_app
from models import db, Product, ProductImage, Category, Brand, ProductFeature, ProductSpecification, Review
from datetime import datetime
import random

# List of Cloudinary URLs from the previous upload
CLOUDINARY_IMAGE_URLS = [
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193414/hc32rvpjeztlnxudk9id.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193416/i4u9p1hnkvt2vewnruaz.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193419/gvgmz0czmqjru8t3feuw.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193421/juxj8aehrtuvj7dsf0yf.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193423/pg3mvq3npknngip8iiwg.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193426/cwmjp37gm7hs7vxbes1d.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193427/xy5cofxxiroxqg2t17oj.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193429/kigy2pajny2iao3mwu3i.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193431/oteqzjkayfso0sxtk7vl.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193432/dye9zs2q1jedbp7srgtq.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193433/fbqjaci1gm5358gzrxny.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193436/vba7iycgkbcxnoxlq0fk.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193438/yoqadnaykrjs80q9h3gu.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193440/wycic9jovwiedef553aj.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193444/zqxsrgj6m77ws73srlrg.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193445/k757fugdgwvjguotglcs.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193447/mncg6ddkvd3uqsczb2qp.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193449/wdlfaub6znymitkcdkmx.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193450/sftjawnlqbo9iu5kfavr.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193452/vmubz4gj59f5zqrrusyt.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193454/b1xo2khnpxlexun2vcvy.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193456/vvqi6zl00vxltkwiupl7.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193457/eibzdn31odtz6j9fvqqt.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193458/gs9ughb8ideu0dlwlcql.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193460/npd9wwblxqdt1cojzlmx.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193461/ddky4ccpwhadyvtdah8a.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193463/sd2h1bjfe1dsc4wricsq.jpg",
    "https://res.cloudinary.com/dy082ykuf/image/upload/v1753193465/gr5d2njzi6zvd8ypjc2t.jpg"
]

def seed_short_names():
    import os
    print("Using DATABASE_URL:", os.environ.get("DATABASE_URL"))
    app = create_app('production')
    
    with app.app_context():
        print("🛑 Truncating all tables with CASCADE...")
        db.session.execute('TRUNCATE TABLE product_features CASCADE')
        db.session.execute('TRUNCATE TABLE product_specifications CASCADE')
        db.session.execute('TRUNCATE TABLE product_images CASCADE')
        db.session.execute('TRUNCATE TABLE reviews CASCADE')
        db.session.execute('TRUNCATE TABLE products CASCADE')
        db.session.execute('TRUNCATE TABLE categories CASCADE')
        db.session.execute('TRUNCATE TABLE brands CASCADE')
        db.session.commit()
        print("✅ All relevant tables truncated.")
        
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

        # --- PRODUCT GENERATION LOGIC ---
        NATIONALITIES = ["American", "French", "Italian", "German", "Japanese", "Brazilian", None, None, None]  # More None for variety
        BRAND_NAMES = ["Wega", "ChefPro", "HomeStyle", "Culinary", "KitchenMaster"]
        PRODUCT_TYPES = [
            # Cookware
            ("Frying Pan", "Cookware", "A premium non-stick frying pan for everyday cooking."),
            ("Dutch Oven", "Cookware", "Heavy-duty Dutch oven for slow-cooked meals."),
            ("Saucepan", "Cookware", "Versatile saucepan for sauces and soups."),
            ("Stock Pot", "Cookware", "Large stock pot for stews and pasta."),
            ("Wok", "Cookware", "Traditional wok for stir-frying."),
            ("Tagine Pot", "Cookware", "Clay tagine for Moroccan dishes."),
            # Bakeware
            ("Baking Sheet", "Bakeware", "Non-stick baking sheet for cookies and pastries."),
            ("Cake Pan", "Bakeware", "Round cake pan for perfect cakes."),
            ("Muffin Tin", "Bakeware", "12-cup muffin tin for muffins and cupcakes."),
            ("Bread Pan", "Bakeware", "Loaf pan for bread and meatloaf."),
            # Cutlery
            ("Chef Knife", "Cutlery", "Professional chef knife for precise cutting."),
            ("Knife Set", "Cutlery", "Complete knife set for all kitchen needs."),
            ("Paring Knife", "Cutlery", "Small paring knife for detailed work."),
            ("Bread Knife", "Cutlery", "Serrated bread knife for easy slicing."),
            # Storage
            ("Food Containers", "Storage", "Airtight containers for food storage."),
            ("Glass Jars", "Storage", "Glass jars for dry goods and spices."),
            ("Lunch Box", "Storage", "Insulated lunch box for meals on the go."),
            # Appliances
            ("Blender", "Appliances", "High-speed blender for smoothies and purees."),
            ("Coffee Maker", "Appliances", "Programmable coffee maker for fresh coffee."),
            ("Toaster", "Appliances", "2-slice toaster with browning control."),
            ("Mixer", "Appliances", "Stand mixer for baking and mixing."),
            ("Rice Cooker", "Appliances", "Automatic rice cooker for perfect rice."),
            ("Electric Kettle", "Appliances", "Fast-boil electric kettle."),
            # Utensils
            ("Spatula Set", "Utensils", "Set of silicone spatulas for cooking and baking."),
            ("Whisk", "Utensils", "Stainless steel whisk for mixing."),
            ("Tongs", "Utensils", "Kitchen tongs for safe food handling."),
            ("Ladle", "Utensils", "Soup ladle for serving."),
            ("Peeler", "Utensils", "Sharp peeler for fruits and vegetables."),
            # Serveware
            ("Serving Bowl", "Serveware", "Large serving bowl for salads and pasta."),
            ("Platter Set", "Serveware", "Set of serving platters for presentation."),
            ("Salad Plate", "Serveware", "Ceramic salad plate."),
            # Coffee & Tea
            ("Tea Kettle", "Coffee & Tea", "Stainless steel tea kettle for boiling water."),
            ("Coffee Grinder", "Coffee & Tea", "Electric coffee grinder for fresh grounds."),
            ("French Press", "Coffee & Tea", "Glass French press for rich coffee."),
        ]

        FEATURES_POOL = {
            "Frying Pan": ["Non-stick coating", "Even heat distribution", "Dishwasher safe", "Oven safe handle"],
            "Dutch Oven": ["Cast iron", "Oven safe", "Retains heat", "Enamel coating"],
            "Saucepan": ["Glass lid", "Induction compatible", "Pour spout", "Ergonomic handle"],
            "Stock Pot": ["Large capacity", "Heavy bottom", "Easy to clean", "Stainless steel"],
            "Wok": ["Carbon steel", "Seasoned finish", "High heat cooking", "Flat bottom"],
            "Tagine Pot": ["Clay construction", "Conical lid", "Moisture retention", "Handmade"],
            "Baking Sheet": ["Non-stick surface", "Heavy gauge", "Even baking", "Warp resistant"],
            "Cake Pan": ["Non-stick coating", "Even heat", "Stackable", "Removable bottom"],
            "Muffin Tin": ["Easy release", "Even baking", "Non-stick", "12 cups"],
            "Bread Pan": ["Perfect shape", "Non-stick", "Heavy gauge", "Easy clean"],
            "Chef Knife": ["High-carbon steel", "Ergonomic handle", "Razor sharp", "Full tang"],
            "Knife Set": ["Stainless steel", "Wooden block", "Sharpener included", "8 pieces"],
            "Paring Knife": ["Precision blade", "Comfortable grip", "Versatile use", "Lightweight"],
            "Bread Knife": ["Serrated edge", "Long blade", "Comfort grip", "Stainless steel"],
            "Food Containers": ["Airtight seal", "Stackable", "Microwave safe", "BPA free"],
            "Glass Jars": ["Airtight lids", "Clear visibility", "Glass construction", "Reusable"],
            "Lunch Box": ["Insulated", "Leak-proof", "Multiple compartments", "Microwave safe"],
            "Blender": ["1000W motor", "6 speeds", "Glass jar", "Pulse function"],
            "Coffee Maker": ["Programmable", "Auto-shutoff", "12-cup capacity", "Reusable filter"],
            "Toaster": ["6 settings", "Auto-eject", "Crumb tray", "Wide slots"],
            "Mixer": ["5-quart bowl", "10 speeds", "Attachments included", "Tilt-head design"],
            "Rice Cooker": ["Automatic shutoff", "Non-stick bowl", "Steamer tray", "Keep warm"],
            "Electric Kettle": ["Fast boil", "Auto shutoff", "Cordless", "1.7L capacity"],
            "Spatula Set": ["Silicone heads", "Heat resistant", "Non-stick safe", "Dishwasher safe"],
            "Whisk": ["Stainless steel", "Comfortable handle", "Versatile use", "Balloon shape"],
            "Tongs": ["Locking mechanism", "Non-slip grip", "Stainless steel", "Dishwasher safe"],
            "Ladle": ["Deep bowl", "Heat resistant", "Ergonomic handle", "Dishwasher safe"],
            "Peeler": ["Sharp blade", "Comfort grip", "Dishwasher safe", "Swivel head"],
            "Serving Bowl": ["Ceramic", "Microwave safe", "Dishwasher safe", "Large capacity"],
            "Platter Set": ["Ceramic", "Elegant design", "Versatile use", "3 pieces"],
            "Salad Plate": ["Ceramic", "Dishwasher safe", "Microwave safe", "8-inch diameter"],
            "Tea Kettle": ["Whistling spout", "Heat resistant handle", "Stainless steel", "2L capacity"],
            "Coffee Grinder": ["Adjustable grind", "Stainless steel blades", "Compact design", "Easy clean"],
            "French Press": ["Glass carafe", "Stainless steel plunger", "Easy pour", "Dishwasher safe"],
        }

        SPECS_POOL = {
            "Frying Pan": {"Material": "Stainless Steel", "Size": "12-inch", "Weight": "2.5 lbs"},
            "Dutch Oven": {"Material": "Cast Iron", "Capacity": "6L", "Weight": "4.2kg"},
            "Saucepan": {"Material": "Aluminum", "Capacity": "2L", "Weight": "1.1kg"},
            "Stock Pot": {"Material": "Stainless Steel", "Capacity": "8L", "Weight": "3.5kg"},
            "Wok": {"Material": "Carbon Steel", "Size": "14-inch", "Weight": "2.8kg"},
            "Tagine Pot": {"Material": "Clay", "Capacity": "3L", "Weight": "2.2kg"},
            "Baking Sheet": {"Material": "Aluminum", "Size": "13x18-inch", "Weight": "1.2kg"},
            "Cake Pan": {"Material": "Aluminum", "Size": "9-inch", "Weight": "0.7kg"},
            "Muffin Tin": {"Material": "Aluminum", "Cups": "12", "Size": "Standard"},
            "Bread Pan": {"Material": "Aluminum", "Size": "9x5-inch", "Weight": "0.8kg"},
            "Chef Knife": {"Material": "High-Carbon Steel", "Length": "8-inch", "Weight": "0.3kg"},
            "Knife Set": {"Material": "Stainless Steel", "Set": "8 pieces", "Block": "Bamboo"},
            "Paring Knife": {"Material": "Stainless Steel", "Length": "3.5-inch", "Weight": "0.1kg"},
            "Bread Knife": {"Material": "Stainless Steel", "Length": "10-inch", "Weight": "0.2kg"},
            "Food Containers": {"Material": "Plastic", "Set": "6 pieces", "Sizes": "Various"},
            "Glass Jars": {"Material": "Glass", "Set": "4 pieces", "Capacity": "1L each"},
            "Lunch Box": {"Material": "Plastic", "Capacity": "1.2L", "Insulated": "Yes"},
            "Blender": {"Power": "1000W", "Capacity": "1.5L", "Material": "Stainless Steel"},
            "Coffee Maker": {"Capacity": "12 cups", "Timer": "24-hour", "Material": "Stainless Steel"},
            "Toaster": {"Slots": "2", "Settings": "6", "Material": "Stainless Steel"},
            "Mixer": {"Power": "325W", "Bowl": "5-quart", "Attachments": "3 included"},
            "Rice Cooker": {"Power": "700W", "Capacity": "1.8L", "Non-stick": "Yes"},
            "Electric Kettle": {"Power": "1500W", "Capacity": "1.7L", "Material": "Stainless Steel"},
            "Spatula Set": {"Material": "Silicone", "Set": "3 pieces", "Heat": "Up to 450°F"},
            "Whisk": {"Material": "Stainless Steel", "Length": "12-inch", "Weight": "0.2kg"},
            "Tongs": {"Material": "Stainless Steel", "Length": "12-inch", "Weight": "0.3kg"},
            "Ladle": {"Material": "Nylon", "Length": "13-inch", "Weight": "0.2kg"},
            "Peeler": {"Material": "Stainless Steel", "Length": "6-inch", "Weight": "0.05kg"},
            "Serving Bowl": {"Material": "Ceramic", "Capacity": "2L", "Diameter": "12-inch"},
            "Platter Set": {"Material": "Ceramic", "Set": "3 pieces", "Sizes": "Various"},
            "Salad Plate": {"Material": "Ceramic", "Diameter": "8-inch", "Weight": "0.4kg"},
            "Tea Kettle": {"Material": "Stainless Steel", "Capacity": "2L", "Weight": "1.2kg"},
            "Coffee Grinder": {"Power": "150W", "Capacity": "60g", "Material": "Stainless Steel"},
            "French Press": {"Material": "Glass", "Capacity": "1L", "Plunger": "Stainless Steel"},
        }

        BADGES = ["is_featured", "is_sale", "is_new", None, None, None, None]  # More None for variety

        products_data = []
        for i in range(100):
            # Select product type and nationality
            prod_type, category, base_desc = random.choice(PRODUCT_TYPES)
            nationality = random.choice(NATIONALITIES)
            brand = random.choice(BRAND_NAMES)
            # Name construction
            name_parts = []
            if random.random() < 0.5 and nationality:  # 50% chance to use nationality
                name_parts.append(nationality)
            if random.random() < 0.3:
                name_parts.append("Premium")
            name_parts.append(prod_type)
            if random.random() < 0.3:
                name_parts.append(brand)
            name = " ".join(name_parts)
            # Name length control
            if len(name) > 28:
                name = name[:28].rstrip()
            # Description
            desc = f"{base_desc}"
            if nationality:
                desc = f"{nationality} style. {desc}"
            if "Premium" in name:
                desc = f"Premium quality. {desc}"
            # Features/specs
            features = random.sample(FEATURES_POOL[prod_type], k=3)
            specs = SPECS_POOL[prod_type].copy()
            # Pricing
            price = random.randint(2999, 29999)
            if random.random() < 0.6:
                original_price = price + random.randint(1000, 8000)
            else:
                original_price = None
            # Badges
            badge = random.choice(BADGES)
            is_featured = badge == "is_featured"
            is_sale = badge == "is_sale"
            is_new = badge == "is_new"
            # Stock
            stock = random.choices([0, random.randint(1, 10), random.randint(11, 50), random.randint(51, 200)], weights=[0.1,0.3,0.4,0.2])[0]
            # Images
            selected_images = random.sample(CLOUDINARY_IMAGE_URLS, k=3)
            # Compose product dict
            products_data.append({
                'name': name,
                'category': category,
                'brand': brand,
                'price': price,
                'original_price': original_price,
                'description': desc,
                'features': features,
                'specifications': specs,
                'is_featured': is_featured,
                'is_sale': is_sale,
                'is_new': is_new,
                'stock': stock,
                'images': selected_images
            })
        
        # Create products
        print("🛍️  Creating products with short and medium names...")
        for i, product_data in enumerate(products_data):
            print(f"Creating product {i+1}/{len(products_data)}: {product_data['name']}")
            product = Product(
                name=product_data['name'],
                description=product_data['description'],
                price=product_data['price'],
                original_price=product_data['original_price'],
                sku=f"SKU-{random.randint(10000, 99999)}",
                stock=product_data['stock'],
                category_id=categories[product_data['category']].id,
                brand_id=brands[product_data['brand']].id,
                is_new=product_data['is_new'],
                is_sale=product_data['is_sale'],
                is_featured=product_data['is_featured']
            )
            db.session.add(product)
            db.session.flush()
            for i, feature in enumerate(product_data['features']):
                product_feature = ProductFeature(
                    product_id=product.id,
                    feature=feature,
                    display_order=i
                )
                db.session.add(product_feature)
            for i, (name, value) in enumerate(product_data['specifications'].items()):
                product_spec = ProductSpecification(
                    product_id=product.id,
                    name=name,
                    value=str(value),
                    display_order=i
                )
                db.session.add(product_spec)
            for i, image_url in enumerate(product_data['images']):
                product_image = ProductImage(
                    product_id=product.id,
                    image_url=image_url,
                    is_primary=(i == 0),
                    display_order=i
                )
                db.session.add(product_image)
        db.session.commit()
        print(f"✅ Successfully created {len(products_data)} products with short and medium names!")
        print("🎉 All product names are now varied, realistic, and kitchen-related!")

if __name__ == '__main__':
    seed_short_names() 