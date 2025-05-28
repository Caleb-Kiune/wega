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
            Category(name='Cookware', slug='cookware', description='High-quality cookware for your kitchen'),
            Category(name='Bakeware', slug='bakeware', description='Essential bakeware for baking enthusiasts'),
            Category(name='Cutlery', slug='cutlery', description='Professional grade cutlery'),
            Category(name='Kitchen Tools', slug='kitchen-tools', description='Essential kitchen tools and gadgets')
        ]
        
        # Create Brands
        brands = [
            Brand(name='Wega', slug='wega', description='Premium kitchenware brand'),
            Brand(name='ChefPro', slug='chefpro', description='Professional kitchen equipment'),
            Brand(name='HomeChef', slug='homechef', description='Quality home kitchen essentials')
        ]
        
        # Add categories and brands to database
        for category in categories:
            db.session.add(category)
        for brand in brands:
            db.session.add(brand)
        db.session.commit()
        
        # Create Products
        products = [
            # Cookware Products
            Product(
                name='Stainless Steel Cookware Set',
                description='Professional 10-piece stainless steel cookware set',
                price=299.99,
                original_price=399.99,
                sku='CSS-001',
                stock=50,
                rating=4.8,
                review_count=120,
                is_new=True,
                is_sale=True,
                category=categories[0],
                brand=brands[0]
            ),
            Product(
                name='Non-Stick Frying Pan',
                description='Professional non-stick frying pan with ceramic coating',
                price=49.99,
                original_price=69.99,
                sku='NFP-001',
                stock=100,
                rating=4.5,
                review_count=85,
                is_new=False,
                is_sale=True,
                category=categories[0],
                brand=brands[1]
            ),
            
            # Bakeware Products
            Product(
                name='Baking Sheet Set',
                description='Set of 3 professional baking sheets',
                price=39.99,
                original_price=49.99,
                sku='BSS-001',
                stock=75,
                rating=4.7,
                review_count=95,
                is_new=True,
                is_sale=False,
                category=categories[1],
                brand=brands[0]
            ),
            Product(
                name='Silicone Baking Mat',
                description='Non-stick silicone baking mat',
                price=19.99,
                original_price=24.99,
                sku='SBM-001',
                stock=150,
                rating=4.6,
                review_count=110,
                is_new=False,
                is_sale=True,
                category=categories[1],
                brand=brands[2]
            ),
            
            # Cutlery Products
            Product(
                name='Chef\'s Knife Set',
                description='Professional 5-piece chef\'s knife set',
                price=199.99,
                original_price=249.99,
                sku='CKS-001',
                stock=40,
                rating=4.9,
                review_count=75,
                is_new=True,
                is_sale=False,
                category=categories[2],
                brand=brands[0]
            ),
            Product(
                name='Kitchen Shears',
                description='Professional kitchen shears with herb stripper',
                price=29.99,
                original_price=39.99,
                sku='KS-001',
                stock=200,
                rating=4.4,
                review_count=60,
                is_new=False,
                is_sale=True,
                category=categories[2],
                brand=brands[1]
            ),
            
            # Kitchen Tools Products
            Product(
                name='Digital Kitchen Scale',
                description='Precision digital kitchen scale',
                price=34.99,
                original_price=44.99,
                sku='DKS-001',
                stock=80,
                rating=4.7,
                review_count=90,
                is_new=True,
                is_sale=False,
                category=categories[3],
                brand=brands[2]
            ),
            Product(
                name='Silicone Spatula Set',
                description='Set of 3 heat-resistant silicone spatulas',
                price=24.99,
                original_price=29.99,
                sku='SSS-001',
                stock=120,
                rating=4.5,
                review_count=70,
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
                'Cookware': 'kitchenware1.jpeg',
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
                    value='Stainless Steel',
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
                    feature='Professional grade quality',
                    display_order=1
                ),
                ProductFeature(
                    product=product,
                    feature='Dishwasher safe',
                    display_order=2
                ),
                ProductFeature(
                    product=product,
                    feature='Oven safe',
                    display_order=3
                )
            ]
            for feature in features:
                db.session.add(feature)
        
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database() 