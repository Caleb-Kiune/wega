#!/usr/bin/env python3
"""
Script to add sample data to the Wega Kitchenware database
Run this script to populate the database with sample products, categories, and brands
"""

import os
import sys
from datetime import datetime
import re
import random
import glob

# Set environment variables for production
os.environ['FLASK_ENV'] = 'production'
os.environ['DATABASE_URL'] = 'sqlite:///app.db'

from app_factory import create_app
from models import db, Category, Brand, Product, ProductImage, ProductFeature, ProductSpecification

def slugify(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

def get_random_images(uploads_dir, min_count=1, max_count=3):
    image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.gif']
    image_files = []
    for ext in image_extensions:
        image_files.extend(glob.glob(os.path.join(uploads_dir, ext)))
        image_files.extend(glob.glob(os.path.join(uploads_dir, ext.upper())))
    image_files = [os.path.basename(f) for f in image_files if not f.endswith('.gitkeep')]
    if not image_files:
        return []
    count = random.randint(min_count, min(max_count, len(image_files)))
    return random.sample(image_files, count)

def add_sample_data():
    """Add sample data to the database"""
    app = create_app('production')
    
    with app.app_context():
        # Create database tables if they don't exist
        db.create_all()
        
        print("🗄️  Adding sample data to the database...")
        
        # Add Categories
        categories_data = [
            {"name": "Cookware", "description": "Pots, pans, and cooking utensils"},
            {"name": "Bakeware", "description": "Baking pans, molds, and accessories"},
            {"name": "Cutlery", "description": "Knives, forks, spoons, and kitchen tools"},
            {"name": "Storage", "description": "Food storage containers and organizers"},
            {"name": "Appliances", "description": "Kitchen appliances and gadgets"},
            {"name": "Utensils", "description": "Cooking utensils and tools"},
            {"name": "Serveware", "description": "Serving dishes and presentation items"},
            {"name": "Coffee & Tea", "description": "Coffee makers, tea kettles, and accessories"}
        ]
        
        categories = {}
        for cat_data in categories_data:
            if 'slug' not in cat_data:
                cat_data['slug'] = slugify(cat_data['name'])
            category = Category.query.filter_by(name=cat_data["name"]).first()
            if not category:
                category = Category(**cat_data)
                db.session.add(category)
                print(f"✅ Added category: {cat_data['name']}")
            categories[cat_data["name"]] = category
        
        # Add Brands
        brands_data = [
            {"name": "Wega Premium", "description": "Premium kitchenware brand"},
            {"name": "Chef's Choice", "description": "Professional chef equipment"},
            {"name": "Home Essentials", "description": "Essential home kitchen items"},
            {"name": "Gourmet Pro", "description": "Gourmet cooking equipment"},
            {"name": "Kitchen Master", "description": "Professional kitchen tools"},
            {"name": "Culinary Craft", "description": "Artisan kitchen equipment"},
            {"name": "Smart Cook", "description": "Innovative cooking solutions"},
            {"name": "Elite Kitchen", "description": "Elite kitchenware collection"}
        ]
        
        brands = {}
        for brand_data in brands_data:
            if 'slug' not in brand_data:
                brand_data['slug'] = slugify(brand_data['name'])
            brand = Brand.query.filter_by(name=brand_data["name"]).first()
            if not brand:
                brand = Brand(**brand_data)
                db.session.add(brand)
                print(f"✅ Added brand: {brand_data['name']}")
            brands[brand_data["name"]] = brand
        
        # Add Products - 50 diverse kitchenware products
        products_data = [
            # Cookware (15 products)
            {
                "name": "Stainless Steel Frying Pan",
                "description": "Professional-grade stainless steel frying pan with non-stick coating",
                "price": 89.99,
                "category": categories["Cookware"],
                "brand": brands["Wega Premium"],
                "is_featured": True,
                "is_new": True,
                "is_sale": False,
                "features": ["Non-stick coating", "Heat resistant", "Dishwasher safe"],
                "specifications": {"Material": "Stainless Steel", "Size": "12-inch", "Weight": "2.5 lbs"}
            },
            {
                "name": "Cast Iron Dutch Oven",
                "description": "Heavy-duty cast iron dutch oven perfect for slow cooking",
                "price": 149.99,
                "category": categories["Cookware"],
                "brand": brands["Chef's Choice"],
                "is_featured": True,
                "is_new": False,
                "is_sale": True,
                "features": ["Pre-seasoned", "Oven safe", "Retains heat"],
                "specifications": {"Material": "Cast Iron", "Capacity": "6 quarts", "Weight": "8.5 lbs"}
            },
            {
                "name": "Non-Stick Saucepan Set",
                "description": "Set of 3 non-stick saucepans with glass lids",
                "price": 79.99,
                "category": categories["Cookware"],
                "brand": brands["Home Essentials"],
                "is_featured": False,
                "is_new": True,
                "is_sale": False,
                "features": ["Ceramic coating", "Glass lids", "Induction compatible"],
                "specifications": {"Material": "Aluminum", "Set": "3 pieces", "Sizes": "1.5, 2, 3 quarts"}
            },
            {
                "name": "Copper Bottom Stock Pot",
                "description": "Professional copper bottom stock pot for soups and stews",
                "price": 129.99,
                "category": categories["Cookware"],
                "brand": brands["Gourmet Pro"],
                "is_featured": True,
                "is_new": False,
                "is_sale": False,
                "features": ["Copper bottom", "Even heating", "Large capacity"],
                "specifications": {"Material": "Stainless Steel", "Capacity": "8 quarts", "Size": "12-inch"}
            },
            {
                "name": "Ceramic Skillet",
                "description": "Eco-friendly ceramic skillet with natural non-stick surface",
                "price": 65.99,
                "category": categories["Cookware"],
                "brand": brands["Smart Cook"],
                "is_featured": False,
                "is_new": True,
                "is_sale": True,
                "features": ["Ceramic coating", "PTFE-free", "Oven safe"],
                "specifications": {"Material": "Ceramic", "Size": "10-inch", "Weight": "3.2 lbs"}
            },
            {
                "name": "Wok with Lid",
                "description": "Traditional carbon steel wok perfect for stir-frying",
                "price": 45.99,
                "category": categories["Cookware"],
                "brand": brands["Kitchen Master"],
                "is_featured": False,
                "is_new": False,
                "is_sale": True,
                "features": ["Carbon steel", "Includes lid", "Wooden handle"],
                "specifications": {"Material": "Carbon Steel", "Size": "14-inch", "Weight": "2.8 lbs"}
            },
            {
                "name": "Pressure Cooker",
                "description": "Electric pressure cooker with multiple cooking modes",
                "price": 199.99,
                "category": categories["Cookware"],
                "brand": brands["Elite Kitchen"],
                "is_featured": True,
                "is_new": True,
                "is_sale": False,
                "features": ["Digital display", "10 cooking modes", "Safety features"],
                "specifications": {"Capacity": "6 quarts", "Power": "1000W", "Material": "Stainless Steel"}
            },
            {
                "name": "Steamer Basket Set",
                "description": "Stainless steel steamer basket set for healthy cooking",
                "price": 29.99,
                "category": categories["Cookware"],
                "brand": brands["Home Essentials"],
                "is_featured": False,
                "is_new": False,
                "is_sale": True,
                "features": ["Collapsible design", "Stackable", "Dishwasher safe"],
                "specifications": {"Material": "Stainless Steel", "Set": "3 pieces", "Size": "10-inch"}
            },
            {
                "name": "Grill Pan",
                "description": "Indoor grill pan with raised ridges for perfect grill marks",
                "price": 55.99,
                "category": categories["Cookware"],
                "brand": brands["Chef's Choice"],
                "is_featured": False,
                "is_new": True,
                "is_sale": False,
                "features": ["Raised ridges", "Drainage channel", "Non-stick surface"],
                "specifications": {"Material": "Cast Iron", "Size": "11-inch", "Weight": "4.1 lbs"}
            },
            {
                "name": "Double Boiler",
                "description": "Stainless steel double boiler for delicate cooking",
                "price": 39.99,
                "category": categories["Cookware"],
                "brand": brands["Gourmet Pro"],
                "is_featured": False,
                "is_new": False,
                "is_sale": True,
                "features": ["Tempered glass lid", "Pour spout", "Heat resistant handles"],
                "specifications": {"Material": "Stainless Steel", "Capacity": "2 quarts", "Size": "8-inch"}
            },
            {
                "name": "Paella Pan",
                "description": "Traditional paella pan for authentic Spanish cooking",
                "price": 89.99,
                "category": categories["Cookware"],
                "brand": brands["Wega Premium"],
                "is_featured": True,
                "is_new": False,
                "is_sale": False,
                "features": ["Carbon steel", "Traditional design", "Large capacity"],
                "specifications": {"Material": "Carbon Steel", "Size": "15-inch", "Depth": "2 inches"}
            },
            {
                "name": "Casserole Dish",
                "description": "Ceramic casserole dish perfect for baking and serving",
                "price": 75.99,
                "category": categories["Cookware"],
                "brand": brands["Elite Kitchen"],
                "is_featured": False,
                "is_new": True,
                "is_sale": True,
                "features": ["Oven safe", "Microwave safe", "Dishwasher safe"],
                "specifications": {"Material": "Ceramic", "Size": "9x13 inches", "Capacity": "3 quarts"}
            },
            {
                "name": "Sauce Pot",
                "description": "Small sauce pot ideal for sauces and small batches",
                "price": 35.99,
                "category": categories["Cookware"],
                "brand": brands["Kitchen Master"],
                "is_featured": False,
                "is_new": False,
                "is_sale": True,
                "features": ["Copper bottom", "Glass lid", "Pour spout"],
                "specifications": {"Material": "Stainless Steel", "Capacity": "1.5 quarts", "Size": "6-inch"}
            },
            {
                "name": "Roasting Pan",
                "description": "Heavy-duty roasting pan with rack for perfect roasts",
                "price": 119.99,
                "category": categories["Cookware"],
                "brand": brands["Chef's Choice"],
                "is_featured": True,
                "is_new": False,
                "is_sale": False,
                "features": ["Includes rack", "Oven safe", "Dishwasher safe"],
                "specifications": {"Material": "Stainless Steel", "Size": "16x13 inches", "Depth": "3 inches"}
            },
            {
                "name": "Fondue Pot",
                "description": "Electric fondue pot for entertaining and fun cooking",
                "price": 89.99,
                "category": categories["Cookware"],
                "brand": brands["Smart Cook"],
                "is_featured": False,
                "is_new": True,
                "is_sale": True,
                "features": ["Temperature control", "Non-stick pot", "8 forks included"],
                "specifications": {"Capacity": "1.5 quarts", "Power": "400W", "Material": "Stainless Steel"}
            },
            
            # Bakeware (10 products)
            {
                "name": "Ceramic Baking Dish Set",
                "description": "Set of 3 ceramic baking dishes in different sizes",
                "price": 45.99,
                "category": categories["Bakeware"],
                "brand": brands["Chef's Choice"],
                "is_featured": True,
                "is_new": False,
                "is_sale": True,
                "features": ["Oven safe", "Microwave safe", "Easy clean"],
                "specifications": {"Material": "Ceramic", "Sizes": "8x8, 9x13, 10x10 inches", "Set": "3 pieces"}
            },
            {
                "name": "Cupcake Pan",
                "description": "Non-stick cupcake pan with 12 cavities",
                "price": 24.99,
                "category": categories["Bakeware"],
                "brand": brands["Home Essentials"],
                "is_featured": False,
                "is_new": True,
                "is_sale": False,
                "features": ["Non-stick coating", "12 cavities", "Dishwasher safe"],
                "specifications": {"Material": "Aluminum", "Size": "12 cavities", "Depth": "1.5 inches"}
            },
            {
                "name": "Bread Loaf Pan",
                "description": "Heavy-duty bread loaf pan for perfect bread baking",
                "price": 19.99,
                "category": categories["Bakeware"],
                "brand": brands["Kitchen Master"],
                "is_featured": False,
                "is_new": False,
                "is_sale": True,
                "features": ["Non-stick surface", "Heavy gauge", "Oven safe"],
                "specifications": {"Material": "Aluminum", "Size": "9x5 inches", "Depth": "2.5 inches"}
            },
            {
                "name": "Pie Dish Set",
                "description": "Set of 2 glass pie dishes for sweet and savory pies",
                "price": 32.99,
                "category": categories["Bakeware"],
                "brand": brands["Elite Kitchen"],
                "is_featured": True,
                "is_new": True,
                "is_sale": False,
                "features": ["Glass construction", "Oven safe", "Microwave safe"],
                "specifications": {"Material": "Glass", "Sizes": "9-inch, 10-inch", "Set": "2 pieces"}
            },
            {
                "name": "Cookie Sheet Set",
                "description": "Set of 3 heavy-duty cookie sheets for perfect baking",
                "price": 28.99,
                "category": categories["Bakeware"],
                "brand": brands["Wega Premium"],
                "is_featured": False,
                "is_new": False,
                "is_sale": True,
                "features": ["Non-stick coating", "Heavy gauge", "Rimmed design"],
                "specifications": {"Material": "Aluminum", "Sizes": "13x18 inches", "Set": "3 pieces"}
            },
            {
                "name": "Muffin Tin",
                "description": "Non-stick muffin tin with 6 large cavities",
                "price": 18.99,
                "category": categories["Bakeware"],
                "brand": brands["Home Essentials"],
                "is_featured": False,
                "is_new": True,
                "is_sale": False,
                "features": ["Non-stick coating", "6 large cavities", "Dishwasher safe"],
                "specifications": {"Material": "Aluminum", "Size": "6 cavities", "Depth": "2 inches"}
            },
            {
                "name": "Springform Pan",
                "description": "9-inch springform pan for cheesecakes and tortes",
                "price": 29.99,
                "category": categories["Bakeware"],
                "brand": brands["Chef's Choice"],
                "is_featured": True,
                "is_new": False,
                "is_sale": True,
                "features": ["Removable bottom", "Non-stick coating", "Oven safe"],
                "specifications": {"Material": "Aluminum", "Size": "9-inch", "Height": "2.5 inches"}
            },
            {
                "name": "Bundt Pan",
                "description": "Classic bundt pan for beautiful cake presentations",
                "price": 34.99,
                "category": categories["Bakeware"],
                "brand": brands["Gourmet Pro"],
                "is_featured": False,
                "is_new": True,
                "is_sale": False,
                "features": ["Non-stick coating", "Classic design", "Oven safe"],
                "specifications": {"Material": "Aluminum", "Size": "10-inch", "Capacity": "12 cups"}
            },
            {
                "name": "Baking Mat Set",
                "description": "Set of 2 silicone baking mats for non-stick baking",
                "price": 22.99,
                "category": categories["Bakeware"],
                "brand": brands["Smart Cook"],
                "is_featured": False,
                "is_new": False,
                "is_sale": True,
                "features": ["Silicone material", "Non-stick surface", "Oven safe"],
                "specifications": {"Material": "Silicone", "Size": "11x16 inches", "Set": "2 pieces"}
            },
            {
                "name": "Cake Pan Set",
                "description": "Set of 3 round cake pans for layer cakes",
                "price": 39.99,
                "category": categories["Bakeware"],
                "brand": brands["Elite Kitchen"],
                "is_featured": True,
                "is_new": False,
                "is_sale": False,
                "features": ["Non-stick coating", "Heavy gauge", "Oven safe"],
                "specifications": {"Material": "Aluminum", "Sizes": "6, 8, 10-inch", "Set": "3 pieces"}
            },
            
            # Cutlery (8 products)
            {
                "name": "Professional Chef Knife Set",
                "description": "Complete set of professional chef knives with wooden block",
                "price": 199.99,
                "category": categories["Cutlery"],
                "brand": brands["Gourmet Pro"],
                "is_featured": True,
                "is_new": True,
                "is_sale": False,
                "features": ["High-carbon steel", "Ergonomic handles", "Sharpener included"],
                "specifications": {"Material": "High-carbon Steel", "Set": "8 pieces", "Block": "Bamboo"}
            },
            {
                "name": "Paring Knife Set",
                "description": "Set of 3 paring knives for precise cutting tasks",
                "price": 45.99,
                "category": categories["Cutlery"],
                "brand": brands["Kitchen Master"],
                "is_featured": False,
                "is_new": True,
                "is_sale": True,
                "features": ["Stainless steel", "Ergonomic handles", "Dishwasher safe"],
                "specifications": {"Material": "Stainless Steel", "Set": "3 pieces", "Sizes": "3, 4, 5-inch"}
            },
            {
                "name": "Bread Knife",
                "description": "Serrated bread knife for perfect bread slicing",
                "price": 35.99,
                "category": categories["Cutlery"],
                "brand": brands["Chef's Choice"],
                "is_featured": False,
                "is_new": False,
                "is_sale": True,
                "features": ["Serrated blade", "Stainless steel", "Ergonomic handle"],
                "specifications": {"Material": "Stainless Steel", "Length": "8-inch", "Handle": "Wood"}
            },
            {
                "name": "Kitchen Shears",
                "description": "Heavy-duty kitchen shears for cutting and trimming",
                "price": 28.99,
                "category": categories["Cutlery"],
                "brand": brands["Home Essentials"],
                "is_featured": False,
                "is_new": True,
                "is_sale": False,
                "features": ["Stainless steel", "Comfortable grip", "Dishwasher safe"],
                "specifications": {"Material": "Stainless Steel", "Length": "8-inch", "Weight": "0.5 lbs"}
            },
            {
                "name": "Steak Knife Set",
                "description": "Set of 4 steak knives for elegant dining",
                "price": 65.99,
                "category": categories["Cutlery"],
                "brand": brands["Wega Premium"],
                "is_featured": True,
                "is_new": False,
                "is_sale": True,
                "features": ["Serrated blades", "Stainless steel", "Wooden handles"],
                "specifications": {"Material": "Stainless Steel", "Set": "4 pieces", "Length": "5-inch"}
            },
            {
                "name": "Utility Knife",
                "description": "Versatile utility knife for various kitchen tasks",
                "price": 25.99,
                "category": categories["Cutlery"],
                "brand": brands["Gourmet Pro"],
                "is_featured": False,
                "is_new": True,
                "is_sale": False,
                "features": ["Stainless steel", "Ergonomic handle", "Sharp blade"],
                "specifications": {"Material": "Stainless Steel", "Length": "6-inch", "Handle": "Plastic"}
            },
            {
                "name": "Carving Knife",
                "description": "Professional carving knife for roasts and turkeys",
                "price": 55.99,
                "category": categories["Cutlery"],
                "brand": brands["Elite Kitchen"],
                "is_featured": True,
                "is_new": False,
                "is_sale": True,
                "features": ["Long blade", "Stainless steel", "Ergonomic handle"],
                "specifications": {"Material": "Stainless Steel", "Length": "10-inch", "Handle": "Wood"}
            },
            {
                "name": "Santoku Knife",
                "description": "Japanese-style santoku knife for precise cutting",
                "price": 75.99,
                "category": categories["Cutlery"],
                "brand": brands["Kitchen Master"],
                "is_featured": False,
                "is_new": True,
                "is_sale": False,
                "features": ["Japanese design", "Stainless steel", "Ergonomic handle"],
                "specifications": {"Material": "Stainless Steel", "Length": "7-inch", "Handle": "Wood"}
            },
            
            # Storage (5 products)
            {
                "name": "Glass Food Storage Containers",
                "description": "Set of 10 airtight glass storage containers",
                "price": 34.99,
                "category": categories["Storage"],
                "brand": brands["Home Essentials"],
                "is_featured": False,
                "is_new": False,
                "is_sale": True,
                "features": ["Airtight seal", "Microwave safe", "Stackable"],
                "specifications": {"Material": "Glass", "Set": "10 pieces", "Sizes": "Various"}
            },
            {
                "name": "Plastic Storage Bins",
                "description": "Set of 6 clear plastic storage bins for pantry organization",
                "price": 28.99,
                "category": categories["Storage"],
                "brand": brands["Smart Cook"],
                "is_featured": False,
                "is_new": True,
                "is_sale": False,
                "features": ["Clear design", "Stackable", "Airtight lids"],
                "specifications": {"Material": "Plastic", "Set": "6 pieces", "Capacity": "Various"}
            },
            {
                "name": "Spice Rack Organizer",
                "description": "Wall-mounted spice rack with 20 spice jars",
                "price": 49.99,
                "category": categories["Storage"],
                "brand": brands["Elite Kitchen"],
                "is_featured": True,
                "is_new": True,
                "is_sale": False,
                "features": ["Wall mounted", "20 jars included", "Easy access"],
                "specifications": {"Material": "Wood", "Jars": "20 pieces", "Size": "24-inch"}
            },
            {
                "name": "Pantry Storage Set",
                "description": "Complete pantry storage solution with containers and labels",
                "price": 89.99,
                "category": categories["Storage"],
                "brand": brands["Wega Premium"],
                "is_featured": True,
                "is_new": False,
                "is_sale": True,
                "features": ["Airtight containers", "Labels included", "Stackable design"],
                "specifications": {"Material": "Plastic", "Set": "15 pieces", "Sizes": "Various"}
            },
            {
                "name": "Refrigerator Organizer",
                "description": "Set of 5 refrigerator organizers for better food storage",
                "price": 22.99,
                "category": categories["Storage"],
                "brand": brands["Home Essentials"],
                "is_featured": False,
                "is_new": True,
                "is_sale": False,
                "features": ["Stackable", "Clear design", "Easy clean"],
                "specifications": {"Material": "Plastic", "Set": "5 pieces", "Sizes": "Various"}
            },
            
            # Appliances (5 products)
            {
                "name": "Stand Mixer Professional",
                "description": "Professional stand mixer with 5-quart bowl and attachments",
                "price": 299.99,
                "category": categories["Appliances"],
                "brand": brands["Wega Premium"],
                "is_featured": True,
                "is_new": True,
                "is_sale": False,
                "features": ["5-quart capacity", "10 speeds", "Planetary mixing"],
                "specifications": {"Power": "325W", "Bowl": "5-quart", "Attachments": "3 included"}
            },
            {
                "name": "Food Processor",
                "description": "10-cup food processor for chopping, slicing, and pureeing",
                "price": 159.99,
                "category": categories["Appliances"],
                "brand": brands["Chef's Choice"],
                "is_featured": True,
                "is_new": False,
                "is_sale": True,
                "features": ["10-cup capacity", "Multiple blades", "Easy clean"],
                "specifications": {"Power": "500W", "Capacity": "10 cups", "Blades": "4 included"}
            },
            {
                "name": "Blender",
                "description": "High-speed blender for smoothies and purees",
                "price": 89.99,
                "category": categories["Appliances"],
                "brand": brands["Smart Cook"],
                "is_featured": False,
                "is_new": True,
                "is_sale": False,
                "features": ["1000W motor", "6 speeds", "Glass jar"],
                "specifications": {"Power": "1000W", "Capacity": "64 oz", "Speeds": "6 settings"}
            },
            {
                "name": "Coffee Grinder",
                "description": "Electric coffee grinder for fresh ground coffee",
                "price": 45.99,
                "category": categories["Appliances"],
                "brand": brands["Elite Kitchen"],
                "is_featured": False,
                "is_new": False,
                "is_sale": True,
                "features": ["Adjustable grind", "Stainless steel", "Easy clean"],
                "specifications": {"Power": "150W", "Capacity": "4 oz", "Material": "Stainless Steel"}
            },
            {
                "name": "Toaster Oven",
                "description": "6-slice toaster oven with convection cooking",
                "price": 129.99,
                "category": categories["Appliances"],
                "brand": brands["Kitchen Master"],
                "is_featured": True,
                "is_new": True,
                "is_sale": False,
                "features": ["Convection cooking", "6-slice capacity", "Digital display"],
                "specifications": {"Power": "1800W", "Capacity": "6 slices", "Modes": "8 settings"}
            },
            
            # Utensils (3 products)
            {
                "name": "Spatula Set",
                "description": "Set of 3 silicone spatulas for cooking and baking",
                "price": 18.99,
                "category": categories["Utensils"],
                "brand": brands["Home Essentials"],
                "is_featured": False,
                "is_new": True,
                "is_sale": False,
                "features": ["Silicone heads", "Heat resistant", "Dishwasher safe"],
                "specifications": {"Material": "Silicone", "Set": "3 pieces", "Sizes": "Various"}
            },
            {
                "name": "Whisk Set",
                "description": "Set of 3 stainless steel whisks for mixing and beating",
                "price": 24.99,
                "category": categories["Utensils"],
                "brand": brands["Gourmet Pro"],
                "is_featured": True,
                "is_new": False,
                "is_sale": True,
                "features": ["Stainless steel", "Ergonomic handles", "Dishwasher safe"],
                "specifications": {"Material": "Stainless Steel", "Set": "3 pieces", "Sizes": "8, 10, 12-inch"}
            },
            {
                "name": "Tongs Set",
                "description": "Set of 2 silicone-tipped tongs for safe cooking",
                "price": 15.99,
                "category": categories["Utensils"],
                "brand": brands["Kitchen Master"],
                "is_featured": False,
                "is_new": True,
                "is_sale": False,
                "features": ["Silicone tips", "Locking mechanism", "Heat resistant"],
                "specifications": {"Material": "Stainless Steel", "Set": "2 pieces", "Length": "12-inch"}
            },
            
            # Serveware (2 products)
            {
                "name": "Serving Platter Set",
                "description": "Set of 3 ceramic serving platters for elegant dining",
                "price": 65.99,
                "category": categories["Serveware"],
                "brand": brands["Elite Kitchen"],
                "is_featured": True,
                "is_new": True,
                "is_sale": False,
                "features": ["Ceramic construction", "Oven safe", "Dishwasher safe"],
                "specifications": {"Material": "Ceramic", "Set": "3 pieces", "Sizes": "Various"}
            },
            {
                "name": "Salad Bowl Set",
                "description": "Set of 4 wooden salad bowls for rustic dining",
                "price": 42.99,
                "category": categories["Serveware"],
                "brand": brands["Wega Premium"],
                "is_featured": False,
                "is_new": False,
                "is_sale": True,
                "features": ["Natural wood", "Food safe finish", "Hand wash only"],
                "specifications": {"Material": "Bamboo", "Set": "4 pieces", "Sizes": "Various"}
            },
            
            # Coffee & Tea (2 products)
            {
                "name": "French Press",
                "description": "8-cup French press for rich, full-bodied coffee",
                "price": 35.99,
                "category": categories["Coffee & Tea"],
                "brand": brands["Smart Cook"],
                "is_featured": False,
                "is_new": True,
                "is_sale": False,
                "features": ["8-cup capacity", "Stainless steel", "Heat resistant"],
                "specifications": {"Material": "Stainless Steel", "Capacity": "8 cups", "Size": "34 oz"}
            },
            {
                "name": "Electric Kettle",
                "description": "1.7L electric kettle with temperature control",
                "price": 55.99,
                "category": categories["Coffee & Tea"],
                "brand": brands["Chef's Choice"],
                "is_featured": True,
                "is_new": False,
                "is_sale": True,
                "features": ["Temperature control", "Auto shut-off", "Stainless steel"],
                "specifications": {"Capacity": "1.7L", "Power": "1500W", "Material": "Stainless Steel"}
            }
        ]
        
        uploads_dir = os.path.join(os.path.dirname(__file__), 'static', 'uploads')
        for product_data in products_data:
            # Check if product already exists
            existing_product = Product.query.filter_by(name=product_data["name"]).first()
            if existing_product:
                print(f"⏭️  Product already exists: {product_data['name']}")
                continue
            
            # Extract features and specifications
            features = product_data.pop("features")
            specifications = product_data.pop("specifications")
            
            # Create product
            product = Product(**product_data)
            db.session.add(product)
            db.session.flush()  # Get the product ID
            
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
            
            # Add random images
            image_files = get_random_images(uploads_dir)
            for i, img in enumerate(image_files):
                db.session.add(ProductImage(
                    product_id=product.id,
                    image_url=img,  # Store just the filename
                    is_primary=(i == 0),
                    display_order=i+1
                ))
            print(f"✅ Added product: {product_data['name']} - ${product_data['price']}")
        
        # Commit all changes
        db.session.commit()
        print("🎉 Sample data added successfully!")
        print(f"📊 Added {len(categories_data)} categories, {len(brands_data)} brands, and {len(products_data)} products")

if __name__ == "__main__":
    add_sample_data() 