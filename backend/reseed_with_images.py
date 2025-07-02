#!/usr/bin/env python3
"""
Script to reseed the Wega Kitchenware database with 50 new products
Uses actual images from the uploads folder, randomly assigned
"""

import os
import re
import random
from faker import Faker

# Set environment variables
os.environ['FLASK_ENV'] = 'development'

from app_factory import create_app
from models import db, Category, Brand, Product, ProductImage, ProductFeature, ProductSpecification

fake = Faker()

def slugify(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

def get_upload_images():
    """Get list of available images from uploads folder"""
    upload_dir = os.path.join(os.path.dirname(__file__), 'static', 'uploads')
    images = []
    if os.path.exists(upload_dir):
        for filename in os.listdir(upload_dir):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
                images.append(filename)
    return sorted(images)

def clear_database(app):
    """Clear existing data from database"""
    with app.app_context():
        print("🗑️  Clearing existing data...")
        ProductImage.query.delete()
        ProductFeature.query.delete()
        ProductSpecification.query.delete()
        Product.query.delete()
        Category.query.delete()
        Brand.query.delete()
        db.session.commit()
        print("✅ Database cleared successfully!")

def reseed_database():
    """Reseed the database with 50 new products using random images"""
    app = create_app('development')
    with app.app_context():
        db.create_all()
        print("🌱 Reseeding database with 50 new products...")
        clear_database(app)
        images = get_upload_images()
        print(f"📸 Found {len(images)} images in uploads folder")
        if not images:
            print("❌ No images found in uploads folder!")
            return
        # Add Categories
        categories_data = [
            {"name": "Cookware", "description": "Pots, pans, and cooking utensils"},
            {"name": "Bakeware", "description": "Baking pans, molds, and accessories"},
            {"name": "Cutlery", "description": "Knives, forks, spoons, and kitchen tools"},
            {"name": "Storage", "description": "Food storage containers and organizers"},
            {"name": "Appliances", "description": "Kitchen appliances and gadgets"},
            {"name": "Utensils", "description": "Cooking and serving utensils"},
            {"name": "Dinnerware", "description": "Plates, bowls, and serving dishes"}
        ]
        categories = {}
        for cat_data in categories_data:
            if 'slug' not in cat_data:
                cat_data['slug'] = slugify(cat_data['name'])
            category = Category(**cat_data)
            db.session.add(category)
            categories[cat_data["name"]] = category
        # Add Brands
        brands_data = [
            {"name": "Wega Premium", "description": "Premium kitchenware brand"},
            {"name": "Chef's Choice", "description": "Professional chef equipment"},
            {"name": "Home Essentials", "description": "Essential home kitchen items"},
            {"name": "Gourmet Pro", "description": "Gourmet cooking equipment"},
            {"name": "Kitchen Master", "description": "Master quality kitchen tools"},
            {"name": "Culinary Craft", "description": "Crafted culinary excellence"}
        ]
        brands = {}
        for brand_data in brands_data:
            if 'slug' not in brand_data:
                brand_data['slug'] = slugify(brand_data['name'])
            brand = Brand(**brand_data)
            db.session.add(brand)
            brands[brand_data["name"]] = brand
        db.session.flush()
        # Generate 50 products
        product_types = list(categories.keys())
        brand_names = list(brands.keys())
        for i in range(50):
            category = categories[random.choice(product_types)]
            brand = brands[random.choice(brand_names)]
            name = fake.unique.catch_phrase()[:40] + f" {i+1}"
            description = fake.sentence(nb_words=16)
            price = round(random.uniform(10, 500), 2)
            is_featured = random.choice([True, False])
            is_new = random.choice([True, False])
            is_sale = random.choice([True, False])
            features = [fake.word().capitalize() for _ in range(random.randint(2, 4))]
            specifications = {
                "Material": random.choice(["Stainless Steel", "Ceramic", "Glass", "Plastic", "Bamboo", "Porcelain", "Cast Iron"]),
                "Size": random.choice(["Small", "Medium", "Large", "12-inch", "6-quart", "5-quart"]),
                "Color": fake.color_name(),
                "Weight": f"{round(random.uniform(0.5, 5.0), 2)} kg"
            }
            product = Product(
                name=name,
                description=description,
                price=price,
                category=category,
                brand=brand,
                is_featured=is_featured,
                is_new=is_new,
                is_sale=is_sale
            )
            db.session.add(product)
            db.session.flush()
            # Add features
            for feature_name in features:
                feature = ProductFeature(product_id=product.id, feature=feature_name)
                db.session.add(feature)
            # Add specifications
            for spec_name, spec_value in specifications.items():
                spec = ProductSpecification(
                    product_id=product.id,
                    name=spec_name,
                    value=str(spec_value)
                )
                db.session.add(spec)
            # Randomly assign 1-3 images
            num_images = random.randint(1, min(3, len(images)))
            chosen_images = random.sample(images, num_images)
            for j, image_filename in enumerate(chosen_images):
                image_url = f"/static/uploads/{image_filename}"
                product_image = ProductImage(
                    product_id=product.id,
                    image_url=image_url,
                    is_primary=(j == 0),
                    display_order=j
                )
                db.session.add(product_image)
            print(f"✅ Added product: {name} (${price}) with {num_images} images")
        db.session.commit()
        print("🎉 Database reseeded successfully!")
        print(f"📊 Added {len(categories)} categories, {len(brands)} brands, and 50 products")
        print(f"🖼️  Used {len(images)} images from uploads folder")

if __name__ == "__main__":
    reseed_database() 