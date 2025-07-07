from app_factory import create_app
from models import db, Product, ProductImage, Category, Brand
from datetime import datetime
import random

def seed_products():
    app = create_app('development')
    with app.app_context():
        # Clear existing data
        ProductImage.query.delete()
        Product.query.delete()
        Category.query.delete()
        Brand.query.delete()
        
        # Create categories
        categories = [
            Category(name='Kitchen Appliances', slug='kitchen-appliances'),
            Category(name='Cookware', slug='cookware'),
            Category(name='Bakeware', slug='bakeware'),
            Category(name='Cutlery', slug='cutlery'),
            Category(name='Storage', slug='storage')
        ]
        db.session.add_all(categories)
        
        # Create brands
        brands = [
            Brand(name='Wega', slug='wega'),
            Brand(name='KitchenPro', slug='kitchenpro'),
            Brand(name='ChefMaster', slug='chefmaster'),
            Brand(name='HomeStyle', slug='homestyle'),
            Brand(name='Culinary', slug='culinary')
        ]
        db.session.add_all(brands)
        
        # Commit to get IDs
        db.session.commit()
        
        # Product names and descriptions
        product_names = [
            "Professional Blender", "Smart Food Processor", "Digital Air Fryer",
            "Multi-Cooker", "Stand Mixer", "Coffee Maker", "Toaster Oven",
            "Electric Kettle", "Slow Cooker", "Immersion Blender",
            "Rice Cooker", "Electric Griddle", "Waffle Maker", "Juicer",
            "Food Dehydrator", "Electric Pressure Cooker", "Bread Maker",
            "Ice Cream Maker", "Electric Grill", "Electric Skillet"
        ]
        
        descriptions = [
            "Professional-grade kitchen appliance for perfect results every time.",
            "Smart technology for effortless cooking and preparation.",
            "Digital controls for precise temperature and timing.",
            "Versatile appliance for all your cooking needs.",
            "Powerful motor for heavy-duty mixing tasks."
        ]
        
        # Create 50 products
        products = []
        for i in range(50):
            category = random.choice(categories)
            brand = random.choice(brands)
            name = f"{random.choice(product_names)} {i+1}"
            price = round(random.uniform(29.99, 299.99), 2)
            original_price = round(price * random.uniform(1.1, 1.5), 2) if random.random() > 0.5 else None
            
            product = Product(
                name=name,
                description=random.choice(descriptions),
                price=price,
                original_price=original_price,
                sku=f"SKU{i+1:04d}",
                stock=random.randint(0, 100),
                is_new=random.random() > 0.7,
                is_sale=random.random() > 0.7,
                is_featured=random.random() > 0.8,
                category_id=category.id,
                brand_id=brand.id,
                rating=round(random.uniform(3.5, 5.0), 1),
                review_count=random.randint(0, 100)
            )
            products.append(product)
        
        db.session.add_all(products)
        db.session.commit()
        
        # Add images to all products
        for product in products:
            image = ProductImage(
                product_id=product.id,
                image_url='appliances1.jpeg',
                is_primary=True,
                display_order=0
            )
            db.session.add(image)
        
        db.session.commit()
        print("Successfully seeded database with 50 products")

if __name__ == '__main__':
    seed_products() 