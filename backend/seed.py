from app import app, db
from models import Category, Brand, Product, ProductImage, ProductSpecification, ProductFeature, Review, DeliveryLocation, Order, OrderItem
from datetime import datetime, timedelta
import random

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
        DeliveryLocation.query.delete()
        
        # Create delivery locations
        locations = [
            {
                'name': 'Nairobi CBD',
                'slug': 'nairobi-cbd',
                'city': 'Nairobi',
                'shipping_price': 250,
                'is_active': True
            },
            {
                'name': 'Nairobi Westlands',
                'slug': 'nairobi-westlands',
                'city': 'Nairobi',
                'shipping_price': 300,
                'is_active': True
            },
            {
                'name': 'Nairobi Karen',
                'slug': 'nairobi-karen',
                'city': 'Nairobi',
                'shipping_price': 350,
                'is_active': True
            },
            {
                'name': 'Nairobi Langata',
                'slug': 'nairobi-langata',
                'city': 'Nairobi',
                'shipping_price': 300,
                'is_active': True
            },
            {
                'name': 'Nairobi Kilimani',
                'slug': 'nairobi-kilimani',
                'city': 'Nairobi',
                'shipping_price': 250,
                'is_active': True
            },
            {
                'name': 'Nairobi Lavington',
                'slug': 'nairobi-lavington',
                'city': 'Nairobi',
                'shipping_price': 300,
                'is_active': True
            },
            {
                'name': 'Nairobi Runda',
                'slug': 'nairobi-runda',
                'city': 'Nairobi',
                'shipping_price': 350,
                'is_active': True
            },
            {
                'name': 'Nairobi Other Areas',
                'slug': 'nairobi-other',
                'city': 'Nairobi',
                'shipping_price': 400,
                'is_active': True
            },
            {
                'name': 'Mombasa',
                'slug': 'mombasa',
                'city': 'Mombasa',
                'shipping_price': 800,
                'is_active': True
            },
            {
                'name': 'Kisumu',
                'slug': 'kisumu',
                'city': 'Kisumu',
                'shipping_price': 750,
                'is_active': True
            },
            {
                'name': 'Nakuru',
                'slug': 'nakuru',
                'city': 'Nakuru',
                'shipping_price': 600,
                'is_active': True
            },
            {
                'name': 'Eldoret',
                'slug': 'eldoret',
                'city': 'Eldoret',
                'shipping_price': 700,
                'is_active': True
            },
            {
                'name': 'Thika',
                'slug': 'thika',
                'city': 'Thika',
                'shipping_price': 500,
                'is_active': True
            },
            {
                'name': 'Naivasha',
                'slug': 'naivasha',
                'city': 'Naivasha',
                'shipping_price': 550,
                'is_active': True
            },
            {
                'name': 'Nyeri',
                'slug': 'nyeri',
                'city': 'Nyeri',
                'shipping_price': 650,
                'is_active': True
            },
            {
                'name': 'Meru',
                'slug': 'meru',
                'city': 'Meru',
                'shipping_price': 750,
                'is_active': True
            },
            {
                'name': 'Kakamega',
                'slug': 'kakamega',
                'city': 'Kakamega',
                'shipping_price': 800,
                'is_active': True
            },
            {
                'name': 'Other Locations',
                'slug': 'other',
                'city': 'Other',
                'shipping_price': 1000,
                'is_active': True
            }
        ]

        for location_data in locations:
            location = DeliveryLocation(**location_data)
            db.session.add(location)
        
        db.session.commit()

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
                'is_featured': True,
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
                'is_featured': False,
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
                'is_featured': True,
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
                'is_featured': False,
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
                'is_featured': False,
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
                'is_featured': True,
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
                'is_featured': False,
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
                'is_featured': False,
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
                'is_featured': True,
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
                'is_featured': False,
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
            },
            {
                'name': 'Stainless Steel Mixing Bowls (Set of 3)',
                'description': 'These durable stainless steel mixing bowls are perfect for all your cooking and baking needs. The set includes three sizes for versatility.',
                'price': 1499,
                'original_price': None,
                'sku': 'KA-SB-3-SET',
                'stock': 22,
                'category': categories['utensils'],
                'brand': brands['kitchenaid'],
                'is_new': True,
                'is_sale': False,
                'is_featured': False,
                'features': [
                    'Set of 3 mixing bowls',
                    'Stainless steel construction',
                    'Non-slip base',
                    'Dishwasher safe',
                    'Stackable for easy storage',
                    'Lifetime warranty'
                ],
                'specifications': {
                    'Material': 'Stainless steel',
                    'Set Includes': '3 bowls (small, medium, large)',
                    'Weight': '1.5 kg (total)',
                    'Dishwasher Safe': 'Yes',
                    'Warranty': 'Lifetime'
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
                'name': 'Electric Kettle',
                'description': 'Boil water quickly and efficiently with this sleek electric kettle. Features auto-shutoff and a removable filter for easy cleaning.',
                'price': 1999,
                'original_price': None,
                'sku': 'CU-EK-1.7-BLK',
                'stock': 18,
                'category': categories['appliances'],
                'brand': brands['cuisinart'],
                'is_new': True,
                'is_sale': False,
                'is_featured': False,
                'features': [
                    '1.7L capacity',
                    'Auto-shutoff feature',
                    'Removable filter',
                    'Concealed heating element',
                    '360-degree swivel base',
                    '2-year warranty'
                ],
                'specifications': {
                    'Capacity': '1.7L',
                    'Power': '1500W',
                    'Material': 'Stainless steel and plastic',
                    'Dimensions': '8 x 6 x 10 inches',
                    'Warranty': '2 years',
                    'Color': 'Black'
                },
                'images': [
                    '/images/appliances3.jpeg',
                    '/images/appliances1.jpeg',
                    '/images/appliances2.jpeg',
                    '/images/appliances4.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Bamboo Cutting Board',
                'description': 'This eco-friendly bamboo cutting board is perfect for all your chopping needs. Durable, easy to clean, and gentle on your knives.',
                'price': 799,
                'original_price': None,
                'sku': 'WG-CB-18-BAM',
                'stock': 25,
                'category': categories['utensils'],
                'brand': brands['wega'],
                'is_new': True,
                'is_sale': False,
                'is_featured': True,
                'features': [
                    'Eco-friendly bamboo construction',
                    'Reversible design',
                    'Juice groove to catch liquids',
                    'Dishwasher safe',
                    'Non-slip feet',
                    '1-year warranty'
                ],
                'specifications': {
                    'Material': 'Bamboo',
                    'Dimensions': '18 x 12 x 1.5 inches',
                    'Weight': '1.0 kg',
                    'Dishwasher Safe': 'Yes',
                    'Warranty': '1 year'
                },
                'images': [
                    '/images/tableware2.jpeg',
                    '/images/tableware1.jpeg',
                    '/images/tableware3.jpeg',
                    '/images/tableware4.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Stainless Steel Food Storage Containers (Set of 4)',
                'description': 'Keep your food fresh and organized with these premium stainless steel storage containers. Perfect for meal prep and leftovers.',
                'price': 1799,
                'original_price': None,
                'sku': 'PY-SC-4-SET',
                'stock': 20,
                'category': categories['storage'],
                'brand': brands['pyrex'],
                'is_new': True,
                'is_sale': False,
                'is_featured': False,
                'features': [
                    'Set of 4 containers with lids',
                    'Stainless steel construction',
                    'Airtight seal',
                    'Stackable design',
                    'Dishwasher safe',
                    '1-year warranty'
                ],
                'specifications': {
                    'Material': 'Stainless steel',
                    'Set Includes': '4 containers with lids',
                    'Sizes': '0.5L, 1L, 1.5L, 2L',
                    'Dishwasher Safe': 'Yes',
                    'Warranty': '1 year'
                },
                'images': [
                    '/images/homeessentials4.jpeg',
                    '/images/homeessentials1.jpeg',
                    '/images/homeessentials2.jpeg',
                    '/images/homeessentials3.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Ceramic Coffee Mugs (Set of 4)',
                'description': 'Enjoy your favorite beverages with these elegant ceramic coffee mugs. Perfect for everyday use and special occasions.',
                'price': 1299,
                'original_price': None,
                'sku': 'WG-CM-4-SET',
                'stock': 30,
                'category': categories['home'],
                'brand': brands['wega'],
                'is_new': True,
                'is_sale': False,
                'is_featured': False,
                'features': [
                    'Set of 4 coffee mugs',
                    'Premium ceramic construction',
                    'Microwave and dishwasher safe',
                    'Chip-resistant design',
                    'Elegant pattern',
                    'Stackable for easy storage'
                ],
                'specifications': {
                    'Material': 'Premium ceramic',
                    'Set Includes': '4 coffee mugs',
                    'Capacity': '12 oz each',
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
                'name': 'Stainless Steel Measuring Cups (Set of 4)',
                'description': 'Accurate measurements every time with these durable stainless steel measuring cups. Perfect for cooking and baking.',
                'price': 899,
                'original_price': None,
                'sku': 'KA-MC-4-SET',
                'stock': 25,
                'category': categories['utensils'],
                'brand': brands['kitchenaid'],
                'is_new': True,
                'is_sale': False,
                'is_featured': False,
                'features': [
                    'Set of 4 measuring cups',
                    'Stainless steel construction',
                    'Engraved measurements',
                    'Dishwasher safe',
                    'Stackable for easy storage',
                    'Lifetime warranty'
                ],
                'specifications': {
                    'Material': 'Stainless steel',
                    'Set Includes': '4 cups (1/4, 1/3, 1/2, 1 cup)',
                    'Dishwasher Safe': 'Yes',
                    'Warranty': 'Lifetime'
                },
                'images': [
                    '/images/tableware3.jpeg',
                    '/images/tableware1.jpeg',
                    '/images/tableware2.jpeg',
                    '/images/tableware4.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Electric Can Opener',
                'description': 'Open cans effortlessly with this electric can opener. Features a sleek design and easy-to-use operation.',
                'price': 1499,
                'original_price': None,
                'sku': 'CU-CO-1-BLK',
                'stock': 15,
                'category': categories['appliances'],
                'brand': brands['cuisinart'],
                'is_new': True,
                'is_sale': False,
                'is_featured': False,
                'features': [
                    'Electric operation',
                    'Sleek design',
                    'Easy to use',
                    'Dishwasher safe parts',
                    '2-year warranty'
                ],
                'specifications': {
                    'Power': '120V',
                    'Material': 'Plastic and metal',
                    'Dimensions': '6 x 4 x 3 inches',
                    'Warranty': '2 years',
                    'Color': 'Black'
                },
                'images': [
                    '/images/appliances4.jpeg',
                    '/images/appliances1.jpeg',
                    '/images/appliances2.jpeg',
                    '/images/appliances3.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Stainless Steel Spatula Set',
                'description': 'Complete your kitchen with this premium spatula set. Includes all essential tools for cooking and baking, made from high-quality materials for durability and performance.',
                'price': 1299,
                'original_price': None,
                'sku': 'WG-SP-3-SET',
                'stock': 20,
                'category': categories['utensils'],
                'brand': brands['wega'],
                'is_new': True,
                'is_sale': False,
                'is_featured': False,
                'features': [
                    'Set of 3 spatulas',
                    'Stainless steel construction',
                    'Heat-resistant handles',
                    'Dishwasher safe',
                    'Lifetime warranty'
                ],
                'specifications': {
                    'Material': 'Stainless steel and silicone',
                    'Set Includes': '3 spatulas',
                    'Dishwasher Safe': 'Yes',
                    'Warranty': 'Lifetime'
                },
                'images': [
                    '/images/tableware4.jpeg',
                    '/images/tableware1.jpeg',
                    '/images/tableware2.jpeg',
                    '/images/tableware3.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Glass Baking Dish (9x13)',
                'description': 'Perfect for baking casseroles, lasagnas, and more with this durable glass baking dish. Microwave and dishwasher safe for easy cleaning.',
                'price': 999,
                'original_price': None,
                'sku': 'PY-GB-9X13',
                'stock': 18,
                'category': categories['home'],
                'brand': brands['pyrex'],
                'is_new': True,
                'is_sale': False,
                'is_featured': False,
                'features': [
                    'Durable glass construction',
                    'Microwave and dishwasher safe',
                    'Oven safe up to 400°F',
                    'Lid included',
                    '1-year warranty'
                ],
                'specifications': {
                    'Material': 'Tempered glass',
                    'Dimensions': '9 x 13 inches',
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
                'name': 'Stainless Steel Measuring Spoons (Set of 4)',
                'description': 'Accurate measurements every time with these durable stainless steel measuring spoons. Perfect for cooking and baking.',
                'price': 699,
                'original_price': None,
                'sku': 'KA-MS-4-SET',
                'stock': 25,
                'category': categories['utensils'],
                'brand': brands['kitchenaid'],
                'is_new': True,
                'is_sale': False,
                'is_featured': False,
                'features': [
                    'Set of 4 measuring spoons',
                    'Stainless steel construction',
                    'Engraved measurements',
                    'Dishwasher safe',
                    'Stackable for easy storage',
                    'Lifetime warranty'
                ],
                'specifications': {
                    'Material': 'Stainless steel',
                    'Set Includes': '4 spoons (1/4, 1/2, 1, 1/2 tsp)',
                    'Dishwasher Safe': 'Yes',
                    'Warranty': 'Lifetime'
                },
                'images': [
                    '/images/tableware1.jpeg',
                    '/images/tableware2.jpeg',
                    '/images/tableware3.jpeg',
                    '/images/tableware4.jpeg'
                ],
                'reviews': []
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

        # --- Add sample orders and order items ---
        # Get some products for order items
        all_products = Product.query.all()
        if len(all_products) >= 3:
            # Sample customers
            customers = [
                {
                    'first_name': 'Alice',
                    'last_name': 'Wanjiku',
                    'email': 'alice@example.com',
                    'phone': '0712345678',
                    'address': '123 Nairobi St',
                    'city': 'Nairobi',
                    'state': 'Nairobi',
                    'postal_code': '00100',
                },
                {
                    'first_name': 'Brian',
                    'last_name': 'Otieno',
                    'email': 'brian@example.com',
                    'phone': '0722123456',
                    'address': '456 Mombasa Ave',
                    'city': 'Mombasa',
                    'state': 'Mombasa',
                    'postal_code': '80100',
                },
                {
                    'first_name': 'Carol',
                    'last_name': 'Mutua',
                    'email': 'carol@example.com',
                    'phone': '0733123456',
                    'address': '789 Kisumu Rd',
                    'city': 'Kisumu',
                    'state': 'Kisumu',
                    'postal_code': '40100',
                },
            ]
            for i, customer in enumerate(customers):
                order_number = f"ORD-20240{i+1}"
                created_at = datetime.utcnow() - timedelta(days=(i*2))
                shipping_cost = random.choice([250, 350, 400])
                # Pick 2 random products for each order
                order_products = random.sample(all_products, 2)
                total_amount = sum([float(p.price) for p in order_products])
                order = Order(
                    order_number=order_number,
                    first_name=customer['first_name'],
                    last_name=customer['last_name'],
                    email=customer['email'],
                    phone=customer['phone'],
                    address=customer['address'],
                    city=customer['city'],
                    state=customer['state'],
                    postal_code=customer['postal_code'],
                    total_amount=total_amount,
                    shipping_cost=shipping_cost,
                    status=random.choice(['pending', 'processing', 'shipped', 'delivered']),
                    payment_status=random.choice(['pending', 'paid']),
                    created_at=created_at,
                    updated_at=created_at
                )
                db.session.add(order)
                db.session.flush()  # get order.id
                for p in order_products:
                    order_item = OrderItem(
                        order_id=order.id,
                        product_id=p.id,
                        quantity=random.randint(1, 3),
                        price=p.price
                    )
                    db.session.add(order_item)
            db.session.commit()
            print("Sample orders and order items seeded!")

def seed_delivery_locations():
    locations = [
        {
            'name': 'Nairobi CBD',
            'slug': 'nairobi-cbd',
            'city': 'Nairobi',
            'shipping_price': 350.00,
            'is_active': True
        },
        {
            'name': 'Westlands',
            'slug': 'westlands',
            'city': 'Nairobi',
            'shipping_price': 350.00,
            'is_active': True
        },
        {
            'name': 'Mombasa CBD',
            'slug': 'mombasa-cbd',
            'city': 'Mombasa',
            'shipping_price': 700.00,
            'is_active': True
        },
        {
            'name': 'Kisumu CBD',
            'slug': 'kisumu-cbd',
            'city': 'Kisumu',
            'shipping_price': 600.00,
            'is_active': True
        },
        {
            'name': 'Nakuru CBD',
            'slug': 'nakuru-cbd',
            'city': 'Nakuru',
            'shipping_price': 500.00,
            'is_active': True
        },
        {
            'name': 'Eldoret CBD',
            'slug': 'eldoret-cbd',
            'city': 'Eldoret',
            'shipping_price': 700.00,
            'is_active': True
        },
        {
            'name': 'Thika CBD',
            'slug': 'thika-cbd',
            'city': 'Thika',
            'shipping_price': 400.00,
            'is_active': True
        },
        {
            'name': 'Nyeri CBD',
            'slug': 'nyeri-cbd',
            'city': 'Nyeri',
            'shipping_price': 550.00,
            'is_active': True
        }
    ]

    with app.app_context():
        # Clear existing locations
        DeliveryLocation.query.delete()
        
        # Add new locations
        for location_data in locations:
            location = DeliveryLocation(**location_data)
            db.session.add(location)
        
        # Commit the changes
        db.session.commit()
        print("Delivery locations seeded successfully!")

if __name__ == '__main__':
    seed_database()
    seed_delivery_locations() 