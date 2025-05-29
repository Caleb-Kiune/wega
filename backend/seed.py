from app import app, db
from models import Category, Brand, Product, ProductImage, ProductSpecification, ProductFeature, Review
from datetime import datetime

def seed_database():
    with app.app_context():
        # Clear existing data
        Review.query.delete()
        ProductFeature.query.delete()
        ProductSpecification.query.delete()
        ProductImage.query.delete()
        Product.query.delete()
        Category.query.delete()
        Brand.query.delete()
        
        # Create categories
        categories = {
            'cookware': Category(name='Cookware', slug='cookware', description='High-quality cookware for your kitchen'),
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
            'tefal': Brand(name='Tefal', slug='tefal', description='Quality cookware and appliances')
        }
        
        for brand in brands.values():
            db.session.add(brand)
        
        db.session.commit()
        
        # Create products
        products_data = [
            {
                'name': 'Premium Non-Stick Frying Pan',
                'description': 'This premium non-stick frying pan is perfect for everyday cooking. Made with high-quality materials, it ensures even heat distribution and long-lasting performance. The non-stick coating makes cooking and cleaning a breeze.',
                'price': 2499,
                'original_price': None,
                'sku': 'WG-FP-28-BLK',
                'stock': 15,
                'category': categories['cookware'],
                'brand': brands['wega'],
                'is_new': True,
                'is_sale': False,
                'features': [
                    'Premium non-stick coating',
                    'Even heat distribution',
                    'Ergonomic handle for comfortable grip',
                    'Suitable for all stovetops including induction',
                    'Dishwasher safe',
                    'Heat resistant up to 240°C'
                ],
                'specifications': {
                    'Material': 'Aluminum with non-stick coating',
                    'Diameter': '28 cm',
                    'Weight': '1.2 kg',
                    'Handle Material': 'Bakelite',
                    'Dishwasher Safe': 'Yes',
                    'Induction Compatible': 'Yes',
                    'Warranty': '2 years'
                },
                'images': [
                    '/images/kitchenware1.jpeg',
                    '/images/kitchenware2.jpeg',
                    '/images/kitchenware3.jpeg',
                    '/images/kitchenware4.jpeg'
                ],
                'reviews': [
                    {
                        'user': 'Jane Doe',
                        'avatar': '/placeholder.svg?height=50&width=50',
                        'title': 'Excellent quality pan',
                        'comment': 'I love this frying pan! The non-stick coating works perfectly, and it heats up evenly. Cleaning is super easy, and the handle stays cool while cooking. Highly recommend!',
                        'rating': 5,
                        'date': datetime(2023, 10, 15)
                    },
                    {
                        'user': 'John Smith',
                        'avatar': '/placeholder.svg?height=50&width=50',
                        'title': 'Good value for money',
                        'comment': 'Great pan for the price. The non-stick surface works well, and it feels sturdy. The only reason I\'m giving 4 stars instead of 5 is that the handle gets a bit warm during extended cooking sessions.',
                        'rating': 4,
                        'date': datetime(2023, 9, 28)
                    },
                    {
                        'user': 'Mary Johnson',
                        'avatar': '/placeholder.svg?height=50&width=50',
                        'title': 'Perfect size and quality',
                        'comment': 'This pan is the perfect size for my family\'s needs. The quality is excellent, and food doesn\'t stick at all. I\'ve been using it daily for a month now, and it still looks brand new. Very happy with my purchase!',
                        'rating': 5,
                        'date': datetime(2023, 9, 10)
                    }
                ]
            },
            {
                'name': 'Stainless Steel Cooking Pot Set',
                'description': 'This premium stainless steel cooking pot set includes everything you need for your kitchen. The set features durable construction, even heat distribution, and elegant design that will last for years.',
                'price': 5999,
                'original_price': 7499,
                'sku': 'KA-SS-POT-SET',
                'stock': 8,
                'category': categories['cookware'],
                'brand': brands['kitchenaid'],
                'is_new': False,
                'is_sale': True,
                'features': [
                    'Premium stainless steel construction',
                    'Set includes 3 pots with lids (2L, 4L, 6L)',
                    'Even heat distribution',
                    'Suitable for all stovetops including induction',
                    'Dishwasher safe',
                    'Oven safe up to 260°C'
                ],
                'specifications': {
                    'Material': '18/10 Stainless Steel',
                    'Set Includes': '2L, 4L, and 6L pots with lids',
                    'Weight': '4.5 kg (total)',
                    'Handle Material': 'Stainless Steel',
                    'Dishwasher Safe': 'Yes',
                    'Induction Compatible': 'Yes',
                    'Warranty': '5 years'
                },
                'images': [
                    '/images/appliances1.jpeg',
                    '/images/appliances2.jpeg',
                    '/images/appliances3.jpeg',
                    '/images/appliances4.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Electric Coffee Maker',
                'description': 'Brew the perfect cup of coffee every time with our premium electric coffee maker. Features programmable settings, thermal carafe, and auto-shutoff for convenience and safety.',
                'price': 3499,
                'original_price': None,
                'sku': 'CU-CM-12-BLK',
                'stock': 12,
                'category': categories['appliances'],
                'brand': brands['cuisinart'],
                'is_new': True,
                'is_sale': False,
                'features': [
                    'Programmable brewing',
                    '12-cup thermal carafe',
                    'Auto-shutoff feature',
                    'Pause and serve function',
                    'Removable water reservoir',
                    'Charcoal water filter'
                ],
                'specifications': {
                    'Capacity': '12 cups',
                    'Power': '1200W',
                    'Material': 'Stainless steel and plastic',
                    'Dimensions': '14 x 8 x 10 inches',
                    'Warranty': '2 years',
                    'Color': 'Black'
                },
                'images': [
                    '/images/appliances2.jpeg',
                    '/images/appliances1.jpeg',
                    '/images/appliances3.jpeg',
                    '/images/appliances4.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Kitchen Utensil Set',
                'description': 'Complete your kitchen with this premium utensil set. Includes all essential tools for cooking and baking, made from high-quality materials for durability and performance.',
                'price': 1899,
                'original_price': 2499,
                'sku': 'WG-UT-12-SIL',
                'stock': 20,
                'category': categories['utensils'],
                'brand': brands['wega'],
                'is_new': False,
                'is_sale': True,
                'features': [
                    'Set of 12 essential utensils',
                    'Stainless steel construction',
                    'Heat-resistant handles',
                    'Dishwasher safe',
                    'Hanging storage included',
                    'Lifetime warranty'
                ],
                'specifications': {
                    'Material': 'Stainless steel and silicone',
                    'Set Includes': '12 pieces',
                    'Storage': 'Hanging rack included',
                    'Dishwasher Safe': 'Yes',
                    'Warranty': 'Lifetime',
                    'Color': 'Silver'
                },
                'images': [
                    '/images/tableware1.jpeg',
                    '/images/tableware2.jpeg',
                    '/images/tableware3.jpeg',
                    '/images/tableware4.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Glass Food Storage Containers (Set of 5)',
                'description': 'Keep your food fresh and organized with these premium glass storage containers. Perfect for meal prep, leftovers, and pantry organization.',
                'price': 1299,
                'original_price': None,
                'sku': 'PY-GC-5-SET',
                'stock': 25,
                'category': categories['storage'],
                'brand': brands['pyrex'],
                'is_new': True,
                'is_sale': False,
                'features': [
                    'Set of 5 containers with lids',
                    'BPA-free plastic lids',
                    'Microwave and dishwasher safe',
                    'Airtight seal',
                    'Stackable design',
                    'Oven safe up to 400°F'
                ],
                'specifications': {
                    'Material': 'Tempered glass and BPA-free plastic',
                    'Set Includes': '5 containers with lids',
                    'Sizes': '0.5L, 1L, 1.5L, 2L, 2.5L',
                    'Microwave Safe': 'Yes',
                    'Dishwasher Safe': 'Yes',
                    'Warranty': '1 year'
                },
                'images': [
                    '/images/homeessentials1.jpeg',
                    '/images/homeessentials2.jpeg',
                    '/images/homeessentials3.jpeg',
                    '/images/homeessentials4.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Ceramic Dinner Plates (Set of 4)',
                'description': 'Elevate your dining experience with these elegant ceramic dinner plates. Perfect for everyday use and special occasions.',
                'price': 1899,
                'original_price': None,
                'sku': 'WG-CP-4-SET',
                'stock': 18,
                'category': categories['home'],
                'brand': brands['wega'],
                'is_new': True,
                'is_sale': False,
                'features': [
                    'Set of 4 dinner plates',
                    'Premium ceramic construction',
                    'Microwave and dishwasher safe',
                    'Chip-resistant design',
                    'Elegant pattern',
                    'Stackable for easy storage'
                ],
                'specifications': {
                    'Material': 'Premium ceramic',
                    'Set Includes': '4 dinner plates',
                    'Diameter': '10.5 inches',
                    'Microwave Safe': 'Yes',
                    'Dishwasher Safe': 'Yes',
                    'Warranty': '1 year'
                },
                'images': [
                    '/images/homeessentials2.jpeg',
                    '/images/homeessentials1.jpeg',
                    '/images/homeessentials3.jpeg',
                    '/images/homeessentials4.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Professional Chef Knife',
                'description': 'Experience professional-grade cutting performance with this premium chef knife. Perfect for all your kitchen needs.',
                'price': 2999,
                'original_price': None,
                'sku': 'WG-CK-8-PRO',
                'stock': 10,
                'category': categories['utensils'],
                'brand': brands['wega'],
                'is_new': True,
                'is_sale': False,
                'features': [
                    'High-carbon stainless steel blade',
                    'Ergonomic handle',
                    'Full tang construction',
                    'Razor-sharp edge',
                    'Dishwasher safe',
                    'Lifetime warranty'
                ],
                'specifications': {
                    'Material': 'High-carbon stainless steel',
                    'Blade Length': '8 inches',
                    'Handle Material': 'Pakkawood',
                    'Weight': '0.4 kg',
                    'Dishwasher Safe': 'Yes',
                    'Warranty': 'Lifetime'
                },
                'images': [
                    '/images/kitchenware1.jpeg',
                    '/images/kitchenware2.jpeg',
                    '/images/kitchenware3.jpeg',
                    '/images/kitchenware4.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Electric Hand Mixer',
                'description': 'Make baking easier with this powerful electric hand mixer. Features multiple speed settings and comes with various attachments.',
                'price': 2499,
                'original_price': 2999,
                'sku': 'TF-HM-250-WHT',
                'stock': 15,
                'category': categories['appliances'],
                'brand': brands['tefal'],
                'is_new': False,
                'is_sale': True,
                'features': [
                    '5 speed settings',
                    'Includes 2 beaters and 2 dough hooks',
                    'Ergonomic design',
                    'Easy-grip handle',
                    'Storage case included',
                    '2-year warranty'
                ],
                'specifications': {
                    'Power': '250W',
                    'Speeds': '5 settings',
                    'Attachments': '2 beaters, 2 dough hooks',
                    'Weight': '1.2 kg',
                    'Warranty': '2 years',
                    'Color': 'White'
                },
                'images': [
                    '/images/appliances2.jpeg',
                    '/images/appliances1.jpeg',
                    '/images/appliances3.jpeg',
                    '/images/appliances4.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Premium Cast Iron Skillet',
                'description': 'Experience the perfect sear and even heat distribution with our premium cast iron skillet. Perfect for searing, frying, and even baking.',
                'price': 3999,
                'original_price': 4999,
                'sku': 'WG-CI-12-BLK',
                'stock': 8,
                'category': categories['cookware'],
                'brand': brands['wega'],
                'is_new': False,
                'is_sale': True,
                'features': [
                    'Pre-seasoned cast iron construction',
                    '12-inch cooking surface',
                    'Ergonomic handle with hanging hole',
                    'Oven safe up to 500°F',
                    'Perfect for all stovetops',
                    'Lifetime warranty'
                ],
                'specifications': {
                    'Material': 'Cast iron',
                    'Diameter': '12 inches',
                    'Weight': '2.8 kg',
                    'Handle Material': 'Cast iron',
                    'Oven Safe': 'Yes, up to 500°F',
                    'Induction Compatible': 'Yes',
                    'Warranty': 'Lifetime'
                },
                'images': [
                    '/images/kitchenware2.jpeg',
                    '/images/kitchenware1.jpeg',
                    '/images/kitchenware3.jpeg',
                    '/images/kitchenware4.jpeg'
                ],
                'reviews': [
                    {
                        'user': 'Sarah Wilson',
                        'avatar': '/placeholder.svg?height=50&width=50',
                        'title': 'Best cast iron skillet ever!',
                        'comment': 'This cast iron skillet is amazing! The pre-seasoning is perfect, and it heats up evenly. I use it for everything from searing steaks to baking cornbread. The handle stays cool enough to handle, and the hanging hole is a nice touch.',
                        'rating': 5,
                        'date': datetime(2023, 11, 5)
                    },
                    {
                        'user': 'Michael Brown',
                        'avatar': '/placeholder.svg?height=50&width=50',
                        'title': 'Great quality, heavy duty',
                        'comment': 'This is a solid cast iron skillet. It\'s heavy and well-made, just what you\'d expect from a premium product. The pre-seasoning is good, but I still gave it an extra coat of seasoning before first use. Works great on my induction stove.',
                        'rating': 4,
                        'date': datetime(2023, 10, 20)
                    }
                ]
            },
            {
                'name': 'Digital Kitchen Timer with Magnet',
                'description': 'Keep track of your cooking time with this versatile digital kitchen timer. Features a strong magnet for easy mounting and multiple timer functions.',
                'price': 999,
                'original_price': None,
                'sku': 'CU-TM-3-BLK',
                'stock': 30,
                'category': categories['home'],
                'brand': brands['cuisinart'],
                'is_new': True,
                'is_sale': False,
                'features': [
                    'Digital display with large numbers',
                    'Strong magnetic back',
                    'Multiple timer functions',
                    'Volume control',
                    'Battery included',
                    'Auto shut-off'
                ],
                'specifications': {
                    'Display': 'Digital LED',
                    'Timer Range': '1 second to 99 hours',
                    'Power': '1 AAA battery (included)',
                    'Dimensions': '3 x 2 x 1 inches',
                    'Magnet Strength': 'Strong hold',
                    'Warranty': '1 year'
                },
                'images': [
                    '/images/homeessentials3.jpeg',
                    '/images/homeessentials1.jpeg',
                    '/images/homeessentials2.jpeg',
                    '/images/homeessentials4.jpeg'
                ],
                'reviews': [
                    {
                        'user': 'Emily Davis',
                        'avatar': '/placeholder.svg?height=50&width=50',
                        'title': 'Perfect kitchen timer',
                        'comment': 'This timer is exactly what I needed! The magnet is strong enough to hold it on my fridge, and the display is easy to read. I love that it can handle long timers for slow cooking.',
                        'rating': 5,
                        'date': datetime(2023, 11, 10)
                    }
                ]
            }
        ]
        
        for product_data in products_data:
            # Create product
            product = Product(
                name=product_data['name'],
                description=product_data['description'],
                price=product_data['price'],
                original_price=product_data['original_price'],
                sku=product_data['sku'],
                stock=product_data['stock'],
                category_id=product_data['category'].id,
                brand_id=product_data['brand'].id,
                is_new=product_data['is_new'],
                is_sale=product_data['is_sale']
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
            
            # Add images
            for i, image_url in enumerate(product_data['images']):
                product_image = ProductImage(
                    product_id=product.id,
                    image_url=image_url,
                    is_primary=(i == 0),
                    display_order=i
                )
                db.session.add(product_image)
            
            # Add reviews
            for review_data in product_data['reviews']:
                review = Review(
                    product_id=product.id,
                    user=review_data['user'],
                    avatar=review_data['avatar'],
                    title=review_data['title'],
                    comment=review_data['comment'],
                    rating=review_data['rating'],
                    date=review_data['date']
                )
                db.session.add(review)
            
            # Update product rating and review count
            if product_data['reviews']:
                product.review_count = len(product_data['reviews'])
                product.rating = sum(r['rating'] for r in product_data['reviews']) / len(product_data['reviews'])
        
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database() 