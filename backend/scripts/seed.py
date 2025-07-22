import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app_factory import create_app
from models import db, Category, Brand, Product, ProductImage, ProductSpecification, ProductFeature, Review, DeliveryLocation, Order, OrderItem
from datetime import datetime, timedelta
import random

app = create_app('production')

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
                    'Diameter': '28cm',
                    'Height': '5cm',
                    'Weight': '1.2kg',
                    'Handle Length': '20cm',
                    'Warranty': '2 years'
                },
                'images': [
                    '/static/images/products/kitchenware1.jpeg'
                ],
                'reviews': [
                    {
                        'user': 'John Doe',
                        'avatar': 'https://i.pravatar.cc/150?img=1',
                        'title': 'Great quality!',
                        'comment': 'This frying pan is amazing. The non-stick coating works perfectly and it heats up evenly.',
                        'rating': 5,
                        'date': datetime.utcnow() - timedelta(days=30)
                    }
                ]
            },
            {
                'name': 'Professional Stand Mixer',
                'description': 'This professional stand mixer is perfect for baking enthusiasts. With multiple speed settings and various attachments, it can handle any mixing task with ease. The powerful motor ensures consistent results every time.',
                'price': 12999,
                'original_price': 14999,
                'sku': 'KA-SM-5QT-RED',
                'stock': 8,
                'category': categories['appliances'],
                'brand': brands['kitchenaid'],
                'is_new': False,
                'is_sale': True,
                'is_featured': True,
                'features': [
                    '5-quart bowl capacity',
                    '10 speed settings',
                    'Planetary mixing action',
                    'Includes multiple attachments',
                    'Dishwasher safe parts',
                    'Powerful 325-watt motor'
                ],
                'specifications': {
                    'Power': '325 watts',
                    'Bowl Capacity': '5 quarts',
                    'Dimensions': '38 x 30 x 25 cm',
                    'Weight': '12.5 kg',
                    'Color': 'Red',
                    'Warranty': '5 years'
                },
                'images': [
                    '/static/images/products/appliances1.jpeg'
                ],
                'reviews': [
                    {
                        'user': 'Sarah Johnson',
                        'avatar': 'https://i.pravatar.cc/150?img=3',
                        'title': 'Best mixer ever!',
                        'comment': 'This mixer has transformed my baking experience. It\'s powerful and easy to use.',
                        'rating': 5,
                        'date': datetime.utcnow() - timedelta(days=45)
                    }
                ]
            },
            {
                'name': 'Ceramic Dinner Plates Set',
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
                    '/static/images/products/homeessentials1.jpeg'
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
                    '/static/images/products/appliances2.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Glass Storage Containers',
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
                    '/static/images/products/homeessentials2.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Stainless Steel Mixing Bowls',
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
                    '/static/images/products/tableware1.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Ceramic Coffee Mugs Set',
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
                    '/static/images/products/homeessentials3.jpeg'
                ],
                'reviews': []
            },
            {
                'name': 'Stainless Steel Food Storage',
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
                    '/static/images/products/homeessentials4.jpeg'
                ],
                'reviews': []
            }
        ]
        
        for product_data in products_data:
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
            db.session.flush()  # get product.id
            
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