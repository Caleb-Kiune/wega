from app import app, db
from models import Category, Brand, Product, ProductImage, ProductSpecification, ProductFeature
from datetime import datetime

def seed_database():
    with app.app_context():
        # Clear existing data
        ProductFeature.query.delete()
        ProductSpecification.query.delete()
        ProductImage.query.delete()
        Product.query.delete()
        Category.query.delete()
        Brand.query.delete()
        
        # Create Categories
        categories = [
            Category(name='Cookware Sets', slug='cookware-sets', description='Complete cookware sets for every kitchen'),
            Category(name='Bakeware', slug='bakeware', description='Professional bakeware for perfect results'),
            Category(name='Cutlery', slug='cutlery', description='High-quality knives and cutting tools'),
            Category(name='Kitchen Tools', slug='kitchen-tools', description='Essential kitchen tools and accessories')
        ]
        
        # Create Brands
        brands = [
            Brand(name='ChefCraft', slug='chefcraft', description='Professional-grade kitchen equipment'),
            Brand(name='BakeMaster', slug='bakemaster', description='Premium bakeware and kitchen accessories'),
            Brand(name='KitchenPro', slug='kitchenpro', description='Innovative kitchen solutions for home chefs')
        ]
        
        # Add categories and brands to database
        for category in categories:
            db.session.add(category)
        for brand in brands:
            db.session.add(brand)
        db.session.commit()
        
        # Create Products
        products = [
            # Cookware Sets Products
            Product(
                name='Professional 10-Piece Cookware Set',
                description='Complete stainless steel cookware set with non-stick coating',
                price=299.99,
                original_price=399.99,
                sku='PCS-001',
                stock=25,
                rating=4.9,
                review_count=187,
                is_new=True,
                is_sale=True,
                category=categories[0],
                brand=brands[0]
            ),
            Product(
                name='Ceramic Non-Stick Cookware Set',
                description='8-piece ceramic cookware set with tempered glass lids',
                price=199.99,
                original_price=249.99,
                sku='CNS-002',
                stock=40,
                rating=4.8,
                review_count=156,
                is_new=False,
                is_sale=True,
                category=categories[0],
                brand=brands[2]
            ),
            
            # Bakeware Products
            Product(
                name='Professional Baking Sheet Set',
                description='Set of 3 heavy-duty baking sheets with cooling racks',
                price=49.99,
                original_price=69.99,
                sku='PBS-001',
                stock=60,
                rating=4.7,
                review_count=234,
                is_new=True,
                is_sale=False,
                category=categories[1],
                brand=brands[1]
            ),
            Product(
                name='Silicone Baking Mat Set',
                description='Set of 2 non-stick silicone baking mats with measurements',
                price=24.99,
                original_price=34.99,
                sku='SBM-001',
                stock=100,
                rating=4.9,
                review_count=312,
                is_new=False,
                is_sale=True,
                category=categories[1],
                brand=brands[2]
            ),
            
            # Cutlery Products
            Product(
                name='Professional Chef Knife Set',
                description='Set of 5 high-carbon steel knives with sharpener',
                price=149.99,
                original_price=199.99,
                sku='PCK-001',
                stock=35,
                rating=4.8,
                review_count=178,
                is_new=True,
                is_sale=False,
                category=categories[2],
                brand=brands[0]
            ),
            Product(
                name='Stainless Steel Kitchen Shears',
                description='Heavy-duty kitchen shears with bottle opener',
                price=19.99,
                original_price=29.99,
                sku='SSS-001',
                stock=80,
                rating=4.6,
                review_count=145,
                is_new=False,
                is_sale=True,
                category=categories[2],
                brand=brands[2]
            ),
            
            # Kitchen Tools Products
            Product(
                name='Digital Kitchen Scale',
                description='Precision digital scale with tare function',
                price=34.99,
                original_price=44.99,
                sku='DKS-001',
                stock=50,
                rating=4.7,
                review_count=167,
                is_new=True,
                is_sale=False,
                category=categories[3],
                brand=brands[1]
            ),
            Product(
                name='Multi-Purpose Kitchen Tool Set',
                description='Set of 12 essential kitchen tools with storage rack',
                price=39.99,
                original_price=59.99,
                sku='MPT-002',
                stock=70,
                rating=4.8,
                review_count=198,
                is_new=False,
                is_sale=True,
                category=categories[3],
                brand=brands[0]
            )
        ]
        
        # Add products to database
        for product in products:
            db.session.add(product)
        db.session.commit()
        
        # Add images for each product
        for product in products:
            # Map products to images based on category
            image_mapping = {
                'Cookware Sets': 'kitchenware1.jpeg',
                'Bakeware': 'homeessentials1.jpeg',
                'Cutlery': 'homeessentials2.jpeg',
                'Kitchen Tools': 'homeessentials3.jpeg'
            }
            
            # Primary image
            primary_image = ProductImage(
                product=product,
                image_url=f'/static/images/products/{image_mapping[product.category.name]}',
                is_primary=True,
                display_order=1
            )
            # Additional images
            secondary_image = ProductImage(
                product=product,
                image_url=f'/static/images/products/{image_mapping[product.category.name]}',
                is_primary=False,
                display_order=2
            )
            db.session.add(primary_image)
            db.session.add(secondary_image)
        
        # Add specifications for each product
        for product in products:
            specs = [
                ProductSpecification(
                    product=product,
                    name='Material',
                    value='Premium materials',
                    display_order=1
                ),
                ProductSpecification(
                    product=product,
                    name='Dimensions',
                    value='Various sizes',
                    display_order=2
                ),
                ProductSpecification(
                    product=product,
                    name='Warranty',
                    value='2 years',
                    display_order=3
                )
            ]
            for spec in specs:
                db.session.add(spec)
        
        # Add features for each product
        for product in products:
            features = [
                ProductFeature(
                    product=product,
                    feature='High-quality construction',
                    display_order=1
                ),
                ProductFeature(
                    product=product,
                    feature='Easy to clean',
                    display_order=2
                ),
                ProductFeature(
                    product=product,
                    feature='Durable design',
                    display_order=3
                )
            ]
            for feature in features:
                db.session.add(feature)
        
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database() 