#!/usr/bin/env python3
"""
Cloudinary Seed Script for 56 Products - Wega Kitchenware
This script seeds the database with 56 products using Cloudinary URLs.
Each product gets exactly one badge (or none) for clean presentation.

PRODUCTION READY - Safe for deployment
"""

import sys
import os
import random
import requests
from datetime import datetime, timedelta

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app_factory import create_app
from models import db, Category, Brand, Product, ProductImage, ProductFeature, ProductSpecification, Review
from scripts.wega_cloudinary_mapping import get_cloudinary_url, get_product_images

def validate_cloudinary_urls():
    """Validate that all Cloudinary URLs are accessible"""
    print("🔍 Validating Cloudinary URLs...")
    from wega_cloudinary_mapping import LOCAL_TO_CLOUDINARY_MAPPING
    
    failed_urls = []
    total_urls = len(LOCAL_TO_CLOUDINARY_MAPPING)
    
    for local_name, cloudinary_url in LOCAL_TO_CLOUDINARY_MAPPING.items():
        try:
            response = requests.head(cloudinary_url, timeout=10)
            if response.status_code != 200:
                failed_urls.append((local_name, cloudinary_url, response.status_code))
                print(f"❌ Failed: {local_name} -> {response.status_code}")
            else:
                print(f"✅ Valid: {local_name}")
        except Exception as e:
            failed_urls.append((local_name, cloudinary_url, f"Error: {str(e)}"))
            print(f"❌ Error: {local_name} -> {str(e)}")
    
    if failed_urls:
        print(f"\n⚠️  WARNING: {len(failed_urls)} URLs failed validation:")
        for local_name, url, error in failed_urls:
            print(f"   - {local_name}: {error}")
        return False
    else:
        print(f"✅ All {total_urls} Cloudinary URLs are valid!")
        return True

def clear_database():
    """Clear existing data from database"""
    print("🗑️  Clearing existing data...")
    try:
        # Clear in correct order to avoid foreign key constraints
        ProductImage.query.delete()
        ProductFeature.query.delete()
        ProductSpecification.query.delete()
        Review.query.delete()
        Product.query.delete()
        Category.query.delete()
        Brand.query.delete()
        db.session.commit()
        print("✅ Database cleared successfully!")
    except Exception as e:
        print(f"⚠️  Error clearing database: {e}")
        db.session.rollback()
        raise

def create_categories():
    """Create product categories"""
    categories_data = [
        {"name": "Cookware", "slug": "cookware", "description": "Pots, pans, and cooking vessels for stovetop and oven use"},
        {"name": "Bakeware", "slug": "bakeware", "description": "Baking pans, molds, and accessories for oven baking"},
        {"name": "Cutlery", "slug": "cutlery", "description": "Knives, scissors, and cutting tools for food preparation"},
        {"name": "Storage", "slug": "storage", "description": "Food storage containers and organization solutions"},
        {"name": "Appliances", "slug": "appliances", "description": "Electric kitchen appliances and gadgets"},
        {"name": "Utensils", "slug": "utensils", "description": "Cooking and serving utensils for daily use"},
        {"name": "Serveware", "slug": "serveware", "description": "Plates, bowls, and serving dishes for presentation"},
        {"name": "Coffee & Tea", "slug": "coffee-tea", "description": "Coffee makers, tea kettles, and accessories"}
    ]
    
    categories = {}
    for cat_data in categories_data:
        category = Category(**cat_data)
        db.session.add(category)
        categories[cat_data["name"]] = category
    
    db.session.commit()
    print(f"✅ Created {len(categories)} categories")
    return categories

def create_brands():
    """Create product brands"""
    brands_data = [
        {"name": "Wega Premium", "slug": "wega-premium", "description": "Premium quality kitchenware for discerning chefs"},
        {"name": "KitchenAid", "slug": "kitchenaid", "description": "Professional kitchen equipment and appliances"},
        {"name": "Cuisinart", "slug": "cuisinart", "description": "Innovative kitchen solutions and appliances"},
        {"name": "Pyrex", "slug": "pyrex", "description": "Trusted glassware and storage solutions"},
        {"name": "Tefal", "slug": "tefal", "description": "Quality cookware and non-stick solutions"}
    ]
    
    brands = {}
    for brand_data in brands_data:
        brand = Brand(**brand_data)
        db.session.add(brand)
        brands[brand_data["name"]] = brand
    
    db.session.commit()
    print(f"✅ Created {len(brands)} brands")
    return brands

def get_product_data():
    """Get comprehensive product data for 25 products"""
    return [
        # FEATURED PRODUCTS (6 products)
        {
            "name": "Enameled Dutch Oven",
            "description": "Professional 6-quart cast iron Dutch oven with enamel coating. Perfect for slow cooking, braising, and baking. The heavy-duty construction ensures even heat distribution and excellent heat retention.",
            "price": 8999,
            "original_price": None,
            "sku": "WG-DO-6QT-BLK",
            "stock": 15,
            "category": "Cookware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.8,
            "review_count": 23,
            "images": ["dutch oven.jpg", "dutch oven.jpg", "dutch oven.jpg"],
            "features": [
                "Cast iron construction",
                "Enamel coating for easy cleaning",
                "6-quart capacity",
                "Oven safe up to 500°F",
                "Dishwasher safe",
                "Lifetime warranty"
            ],
            "specifications": {
                "Material": "Cast Iron with Enamel Coating",
                "Capacity": "6 quarts",
                "Weight": "9.5 lbs",
                "Dimensions": "12 x 10 x 8 inches",
                "Heat Source": "Gas, Electric, Induction",
                "Warranty": "Lifetime"
            }
        },
        {
            "name": "Programmable Coffee Maker",
            "description": "Premium electric coffee maker with programmable settings and thermal carafe. Brews perfect coffee every time with 12-cup capacity and auto-shutoff feature.",
            "price": 3499,
            "original_price": None,
            "sku": "CU-CM-12-BLK",
            "stock": 20,
            "category": "Appliances",
            "brand": "Cuisinart",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.6,
            "review_count": 18,
            "images": ["coffee maker electric.jpg", "coffee maker electric.jpg", "coffee maker electric.jpg"],
            "features": [
                "Programmable brewing",
                "12-cup thermal carafe",
                "Auto-shutoff feature",
                "Pause and serve function",
                "Removable water reservoir",
                "Charcoal water filter"
            ],
            "specifications": {
                "Capacity": "12 cups",
                "Power": "1200W",
                "Material": "Stainless steel and plastic",
                "Dimensions": "14 x 8 x 10 inches",
                "Warranty": "2 years",
                "Color": "Black"
            }
        },
        {
            "name": "Commercial Stock Pot",
            "description": "Professional 8-quart stainless steel stock pot with copper bottom. Perfect for soups, stews, and large batch cooking. Even heat distribution and durable construction.",
            "price": 6499,
            "original_price": None,
            "sku": "WG-SP-8QT-SS",
            "stock": 12,
            "category": "Cookware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.4,
            "review_count": 31,
            "images": ["stock pot.jpg", "stock pot.jpg", "stock pot.jpg"],
            "features": [
                "Copper bottom for even heat",
                "Stainless steel construction",
                "8-quart capacity",
                "Oven safe up to 500°F",
                "Dishwasher safe",
                "Professional grade"
            ],
            "specifications": {
                "Material": "Stainless Steel with Copper Bottom",
                "Capacity": "8 quarts",
                "Weight": "4.2 lbs",
                "Dimensions": "12 x 12 x 8 inches",
                "Heat Source": "Gas, Electric, Induction",
                "Warranty": "Lifetime"
            }
        },
        {
            "name": "Artisan Dinner Plates",
            "description": "Elegant ceramic dinner plates set perfect for everyday use and special occasions. Microwave and dishwasher safe with chip-resistant design.",
            "price": 1899,
            "original_price": None,
            "sku": "WG-CP-4-SET",
            "stock": 18,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.3,
            "review_count": 27,
            "images": ["ceramic plates.jpg", "ceramic plates.jpg", "ceramic plates.jpg"],
            "features": [
                "Set of 4 dinner plates",
                "Premium ceramic construction",
                "Microwave and dishwasher safe",
                "Chip-resistant design",
                "Elegant pattern",
                "Stackable for easy storage"
            ],
            "specifications": {
                "Material": "Premium ceramic",
                "Set Includes": "4 dinner plates",
                "Diameter": "10.5 inches",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Professional Cookware Set",
            "description": "Professional 5-piece cooking set with non-stick coating. Includes frying pan, saucepan, and lids. Perfect for everyday cooking needs.",
            "price": 12999,
            "original_price": None,
            "sku": "WG-CS-5-SET",
            "stock": 10,
            "category": "Cookware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.7,
            "review_count": 42,
            "images": ["5 piece cooking set.jpg", "5 piece cooking set.jpg", "5 piece cooking set.jpg"],
            "features": [
                "5-piece set",
                "Non-stick coating",
                "Even heat distribution",
                "Oven safe up to 400°F",
                "Dishwasher safe",
                "Professional grade"
            ],
            "specifications": {
                "Material": "Aluminum with non-stick coating",
                "Set Pieces": "5 pieces",
                "Heat Source": "Gas, Electric, Induction",
                "Oven Safe": "Up to 400°F",
                "Warranty": "2 years"
            }
        },
        {
            "name": "Rapid-Boil Kettle",
            "description": "Stainless steel electric kettle with rapid boiling technology. Perfect for tea, coffee, and hot beverages. Auto-shutoff and boil-dry protection.",
            "price": 2499,
            "original_price": None,
            "sku": "CU-EK-1.7L-SS",
            "stock": 25,
            "category": "Appliances",
            "brand": "Cuisinart",
            "is_new": False,
            "is_sale": False,
            "is_featured": True,  # ONLY FEATURED
            "rating": 4.5,
            "review_count": 38,
            "images": ["electric kettle.jpg", "electric kettle.jpg", "electric kettle.jpg"],
            "features": [
                "1.7L capacity",
                "Stainless steel construction",
                "Rapid boiling technology",
                "Auto-shutoff feature",
                "Boil-dry protection",
                "Cordless design"
            ],
            "specifications": {
                "Capacity": "1.7 liters",
                "Power": "1500W",
                "Material": "Stainless steel",
                "Dimensions": "8 x 6 x 10 inches",
                "Warranty": "2 years"
            }
        },
        
        # NEW PRODUCTS (7 products)
        {
            "name": "Oval Roasting Pan",
            "description": "Professional oval baking pan perfect for roasts, casseroles, and sheet pan dinners. Heavy-duty construction with non-stick coating for easy release and cleanup.",
            "price": 1899,
            "original_price": None,
            "sku": "WG-BP-OVAL-13",
            "stock": 25,
            "category": "Bakeware",
            "brand": "Wega Premium",
            "is_new": True,  # ONLY NEW
            "is_sale": False,
            "is_featured": False,
            "rating": 4.7,
            "review_count": 8,
            "images": ["oval baking pan.jpg", "oval baking pan.jpg", "oval baking pan.jpg"],
            "features": [
                "Oval shape for roasts and casseroles",
                "Non-stick coating",
                "Heavy-duty construction",
                "Oven safe up to 450°F",
                "Dishwasher safe",
                "Easy cleanup"
            ],
            "specifications": {
                "Material": "Aluminum with non-stick coating",
                "Dimensions": "13 x 9 inches",
                "Depth": "2 inches",
                "Weight": "1.2 lbs",
                "Oven Safe": "Up to 450°F",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Airtight Storage Set",
            "description": "Premium food storage containers with airtight seals. Perfect for meal prep, leftovers, and pantry organization. Stackable design for easy storage.",
            "price": 2499,
            "original_price": None,
            "sku": "PY-FC-5-SET",
            "stock": 30,
            "category": "Storage",
            "brand": "Pyrex",
            "is_new": True,  # ONLY NEW
            "is_sale": False,
            "is_featured": False,
            "rating": 4.5,
            "review_count": 12,
            "images": ["food container set.jpg", "food container set.jpg", "food container set.jpg"],
            "features": [
                "Set of 5 containers with lids",
                "Airtight seal technology",
                "Microwave and dishwasher safe",
                "Stackable design",
                "BPA-free materials",
                "Transparent lids for easy identification"
            ],
            "specifications": {
                "Material": "Glass and BPA-free plastic",
                "Set Includes": "5 containers with lids",
                "Sizes": "0.5L, 1L, 1.5L, 2L, 2.5L",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Serrated Steak Knives",
            "description": "Professional steak knife set with razor-sharp blades. Perfect for cutting through meat, poultry, and fish with precision and ease.",
            "price": 1899,
            "original_price": None,
            "sku": "WG-SK-4-SET",
            "stock": 20,
            "category": "Cutlery",
            "brand": "Wega Premium",
            "is_new": True,  # ONLY NEW
            "is_sale": False,
            "is_featured": False,
            "rating": 4.6,
            "review_count": 15,
            "images": ["steak knife set.jpg", "steak knife set.jpg", "steak knife set.jpg"],
            "features": [
                "Set of 4 steak knives",
                "Razor-sharp blades",
                "Stainless steel construction",
                "Ergonomic handles",
                "Serrated edge design",
                "Professional grade"
            ],
            "specifications": {
                "Material": "Stainless Steel",
                "Set Includes": "4 steak knives",
                "Blade Length": "5 inches each",
                "Handle Material": "Ergonomic plastic",
                "Care": "Hand wash only",
                "Warranty": "Lifetime"
            }
        },
        {
            "name": "Smart Toaster",
            "description": "2-slice toaster with multiple settings and automatic pop-up. Perfect for breakfast and quick meals. Compact design for any kitchen.",
            "price": 1999,
            "original_price": None,
            "sku": "CU-TO-2SL-BLK",
            "stock": 35,
            "category": "Appliances",
            "brand": "Cuisinart",
            "is_new": True,  # ONLY NEW
            "is_sale": False,
            "is_featured": False,
            "rating": 4.3,
            "review_count": 22,
            "images": ["toaster.jpg", "toaster.jpg", "toaster.jpg"],
            "features": [
                "2-slice capacity",
                "Multiple browning settings",
                "Automatic pop-up",
                "Removable crumb tray",
                "Compact design",
                "Easy cleanup"
            ],
            "specifications": {
                "Capacity": "2 slices",
                "Power": "800W",
                "Material": "Stainless steel and plastic",
                "Dimensions": "8 x 6 x 7 inches",
                "Warranty": "2 years",
                "Color": "Black"
            }
        },
        {
            "name": "Countertop Microwave",
            "description": "Countertop microwave with multiple cooking modes and sensor technology. Perfect for quick heating, defrosting, and cooking.",
            "price": 8999,
            "original_price": None,
            "sku": "CU-MW-1.2CU-BLK",
            "stock": 15,
            "category": "Appliances",
            "brand": "Cuisinart",
            "is_new": True,  # ONLY NEW
            "is_sale": False,
            "is_featured": False,
            "rating": 4.4,
            "review_count": 28,
            "images": ["microwave.jpg", "microwave.jpg", "microwave.jpg"],
            "features": [
                "1.2 cubic feet capacity",
                "Sensor cooking technology",
                "Multiple cooking modes",
                "Defrost function",
                "Child safety lock",
                "Easy-to-use controls"
            ],
            "specifications": {
                "Capacity": "1.2 cubic feet",
                "Power": "1100W",
                "Material": "Stainless steel",
                "Dimensions": "20 x 16 x 12 inches",
                "Warranty": "2 years",
                "Color": "Black"
            }
        },
        {
            "name": "Black Tea Kettle",
            "description": "Sleek black electric kettle with rapid boiling and auto-shutoff. Perfect for tea, coffee, and hot beverages. Modern design.",
            "price": 2299,
            "original_price": None,
            "sku": "CU-EK-1.5L-BLK",
            "stock": 25,
            "category": "Appliances",
            "brand": "Cuisinart",
            "is_new": True,  # ONLY NEW
            "is_sale": False,
            "is_featured": False,
            "rating": 4.2,
            "review_count": 19,
            "images": ["black electric kettle.jpg", "black electric kettle.jpg", "black electric kettle.jpg"],
            "features": [
                "1.5L capacity",
                "Rapid boiling technology",
                "Auto-shutoff feature",
                "Boil-dry protection",
                "Cordless design",
                "Modern black finish"
            ],
            "specifications": {
                "Capacity": "1.5 liters",
                "Power": "1500W",
                "Material": "Stainless steel",
                "Dimensions": "8 x 6 x 10 inches",
                "Warranty": "2 years",
                "Color": "Black"
            }
        },
        {
            "name": "Steam Iron",
            "description": "Steam iron with multiple steam settings and auto-shutoff. Perfect for all fabric types with professional results.",
            "price": 3999,
            "original_price": None,
            "sku": "CU-IR-1700W-BLK",
            "stock": 18,
            "category": "Appliances",
            "brand": "Cuisinart",
            "is_new": True,  # ONLY NEW
            "is_sale": False,
            "is_featured": False,
            "rating": 4.1,
            "review_count": 31,
            "images": ["clothes iron.jpeg", "clothes iron.jpeg", "clothes iron.jpeg"],
            "features": [
                "1700W power",
                "Multiple steam settings",
                "Auto-shutoff feature",
                "Anti-drip system",
                "Self-cleaning function",
                "Professional results"
            ],
            "specifications": {
                "Power": "1700W",
                "Material": "Stainless steel soleplate",
                "Steam Settings": "Multiple levels",
                "Auto-shutoff": "Yes",
                "Warranty": "2 years",
                "Color": "Black"
            }
        },
        
        # SALE PRODUCTS (8 products)
        {
            "name": "Ceramic Casserole",
            "description": "Ceramic casserole dish perfect for baking and serving. Microwave and dishwasher safe with elegant design.",
            "price": 1499,
            "original_price": 2499,  # SALE PRICE
            "sku": "WG-CD-2QT-CER",
            "stock": 22,
            "category": "Cookware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": True,  # ONLY SALE
            "is_featured": False,
            "rating": 4.3,
            "review_count": 16,
            "images": ["casserole.jpg", "casserole.jpg", "casserole.jpg"],
            "features": [
                "2-quart capacity",
                "Ceramic construction",
                "Microwave and dishwasher safe",
                "Oven safe up to 450°F",
                "Elegant design",
                "Perfect for baking and serving"
            ],
            "specifications": {
                "Material": "Ceramic",
                "Capacity": "2 quarts",
                "Dimensions": "10 x 8 x 3 inches",
                "Oven Safe": "Up to 450°F",
                "Microwave Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "White Dinner Plates",
            "description": "White plate set perfect for everyday dining. Microwave and dishwasher safe with classic design.",
            "price": 1499,
            "original_price": 1999,  # SALE PRICE
            "sku": "WG-PS-4-SET",
            "stock": 30,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": True,  # ONLY SALE
            "is_featured": False,
            "rating": 4.2,
            "review_count": 24,
            "images": ["plate set.jpg", "plate set.jpg", "plate set.jpg"],
            "features": [
                "Set of 4 dinner plates",
                "White ceramic construction",
                "Microwave and dishwasher safe",
                "Classic design",
                "Stackable for storage",
                "Perfect for everyday use"
            ],
            "specifications": {
                "Material": "Ceramic",
                "Set Includes": "4 dinner plates",
                "Diameter": "10 inches each",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Dining Service Set",
            "description": "Complete dining set with plates and cups. Perfect for family meals and entertaining guests.",
            "price": 2499,
            "original_price": 3499,  # SALE PRICE
            "sku": "WG-PCS-8-SET",
            "stock": 15,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": True,  # ONLY SALE
            "is_featured": False,
            "rating": 4.4,
            "review_count": 18,
            "images": ["plates and cups set.jpg", "plates and cups set.jpg", "plates and cups set.jpg"],
            "features": [
                "Complete dining set",
                "Plates and cups included",
                "Microwave and dishwasher safe",
                "Elegant design",
                "Perfect for entertaining",
                "Family-friendly"
            ],
            "specifications": {
                "Material": "Ceramic",
                "Set Includes": "4 plates, 4 cups",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Outdoor Dining Set",
            "description": "Durable plastic dishes set perfect for outdoor dining and children. Lightweight and unbreakable design.",
            "price": 899,
            "original_price": 1299,  # SALE PRICE
            "sku": "WG-PDS-6-SET",
            "stock": 40,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": True,  # ONLY SALE
            "is_featured": False,
            "rating": 4.0,
            "review_count": 35,
            "images": ["plastic dishes.jpg", "plastic dishes.jpg", "plastic dishes.jpg"],
            "features": [
                "Set of 6 plastic dishes",
                "Unbreakable design",
                "Lightweight construction",
                "Perfect for outdoor use",
                "Child-safe",
                "Easy to clean"
            ],
            "specifications": {
                "Material": "BPA-free plastic",
                "Set Includes": "6 dishes",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Crystal Glass Cups",
            "description": "Glass cups set perfect for beverages. Crystal-clear design with elegant appearance.",
            "price": 1299,
            "original_price": 1799,  # SALE PRICE
            "sku": "WG-CS-6-SET",
            "stock": 25,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": True,  # ONLY SALE
            "is_featured": False,
            "rating": 4.1,
            "review_count": 21,
            "images": ["cups.jpg", "cups.jpg", "cups.jpg"],
            "features": [
                "Set of 6 glass cups",
                "Crystal-clear design",
                "Dishwasher safe",
                "Elegant appearance",
                "Perfect for beverages",
                "Stackable design"
            ],
            "specifications": {
                "Material": "Glass",
                "Set Includes": "6 cups",
                "Capacity": "12 oz each",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Ceramic Tea Cups",
            "description": "Ceramic cup set perfect for coffee and tea. Comfortable handles and elegant design.",
            "price": 1599,
            "original_price": 2199,  # SALE PRICE
            "sku": "WG-CS-4-SET",
            "stock": 20,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": True,  # ONLY SALE
            "is_featured": False,
            "rating": 4.3,
            "review_count": 26,
            "images": ["cup set.jpg", "cup set.jpg", "cup set.jpg"],
            "features": [
                "Set of 4 ceramic cups",
                "Comfortable handles",
                "Microwave and dishwasher safe",
                "Elegant design",
                "Perfect for hot beverages",
                "Stackable for storage"
            ],
            "specifications": {
                "Material": "Ceramic",
                "Set Includes": "4 cups",
                "Capacity": "12 oz each",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Crystal Water Glasses",
            "description": "Crystal water glasses perfect for formal dining. Elegant design with thin rim for optimal drinking experience.",
            "price": 999,
            "original_price": 1499,  # SALE PRICE
            "sku": "WG-WG-6-SET",
            "stock": 18,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": True,  # ONLY SALE
            "is_featured": False,
            "rating": 4.2,
            "review_count": 19,
            "images": ["water glass.jpeg", "water glass.jpeg", "water glass.jpeg"],
            "features": [
                "Set of 6 water glasses",
                "Crystal-clear design",
                "Thin rim for optimal drinking",
                "Dishwasher safe",
                "Elegant appearance",
                "Perfect for formal dining"
            ],
            "specifications": {
                "Material": "Crystal glass",
                "Set Includes": "6 water glasses",
                "Capacity": "10 oz each",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Crystal Wine Glasses",
            "description": "Elegant wine glasses set perfect for entertaining. Crystal-clear glass with thin rim for optimal wine tasting experience.",
            "price": 1899,
            "original_price": 2499,  # SALE PRICE
            "sku": "WG-WG-WINE-6-SET",
            "stock": 15,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": True,  # ONLY SALE
            "is_featured": False,
            "rating": 4.4,
            "review_count": 29,
            "images": ["wine glasses.jpg", "wine glasses.jpg", "wine glasses.jpg"],
            "features": [
                "Set of 6 wine glasses",
                "Crystal-clear glass",
                "Thin rim design",
                "Dishwasher safe",
                "Elegant stemware",
                "Perfect for entertaining"
            ],
            "specifications": {
                "Material": "Crystal glass",
                "Set Includes": "6 wine glasses",
                "Capacity": "12 oz each",
                "Height": "9 inches",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        
        # REGULAR PRODUCTS (4 products) - NO BADGES
        {
            "name": "Cotton Kitchen Towels",
            "description": "High-quality cotton kitchen towels for everyday use. Absorbent and durable, perfect for drying dishes, cleaning surfaces, and handling hot items.",
            "price": 699,
            "original_price": None,
            "sku": "WG-KT-4-SET",
            "stock": 50,
            "category": "Utensils",
            "brand": "Wega Premium",
            "is_new": False,  # NO BADGES
            "is_sale": False,
            "is_featured": False,
            "rating": 4.2,
            "review_count": 45,
            "images": ["kitchen towels.jpeg", "kitchen towels.jpeg", "kitchen towels.jpeg"],
            "features": [
                "Set of 4 towels",
                "100% cotton material",
                "Highly absorbent",
                "Machine washable",
                "Durable construction",
                "Versatile use"
            ],
            "specifications": {
                "Material": "100% Cotton",
                "Set Includes": "4 towels",
                "Size": "16 x 24 inches each",
                "Weight": "200 GSM",
                "Care": "Machine washable",
                "Warranty": "None"
            }
        },
        {
            "name": "Ceramic Coffee Mug",
            "description": "Premium ceramic mug perfect for coffee, tea, and hot beverages. Microwave and dishwasher safe with comfortable handle design.",
            "price": 599,
            "original_price": None,
            "sku": "WG-CM-12OZ",
            "stock": 40,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,  # NO BADGES
            "is_sale": False,
            "is_featured": False,
            "rating": 4.3,
            "review_count": 67,
            "images": ["ceramic mug.jpeg", "ceramic mug.jpeg", "ceramic mug.jpeg"],
            "features": [
                "12-ounce capacity",
                "Premium ceramic construction",
                "Microwave and dishwasher safe",
                "Comfortable handle",
                "Chip-resistant design",
                "Perfect for hot beverages"
            ],
            "specifications": {
                "Material": "Premium ceramic",
                "Capacity": "12 ounces",
                "Height": "4.5 inches",
                "Diameter": "3.5 inches",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes"
            }
        },
        {
            "name": "Chef's Knife",
            "description": "Professional stainless steel chef knife with ergonomic handle. Perfect for chopping, slicing, and dicing. Razor-sharp blade with excellent edge retention.",
            "price": 1499,
            "original_price": None,
            "sku": "WG-SK-8IN-SS",
            "stock": 20,
            "category": "Cutlery",
            "brand": "Wega Premium",
            "is_new": False,  # NO BADGES
            "is_sale": False,
            "is_featured": False,
            "rating": 4.6,
            "review_count": 34,
            "images": ["stainless steel knife.jpg", "stainless steel knife.jpg", "stainless steel knife.jpg"],
            "features": [
                "8-inch blade",
                "Stainless steel construction",
                "Ergonomic handle",
                "Razor-sharp edge",
                "Excellent edge retention",
                "Professional grade"
            ],
            "specifications": {
                "Material": "Stainless Steel",
                "Blade Length": "8 inches",
                "Handle Material": "Ergonomic plastic",
                "Weight": "0.5 lbs",
                "Care": "Hand wash only",
                "Warranty": "Lifetime"
            }
        },
        {
            "name": "Bamboo Utensils",
            "description": "Eco-friendly bamboo spatulas perfect for cooking and serving. Natural material, heat resistant, and gentle on non-stick surfaces.",
            "price": 899,
            "original_price": None,
            "sku": "WG-BS-3-SET",
            "stock": 30,
            "category": "Utensils",
            "brand": "Wega Premium",
            "is_new": False,  # NO BADGES
            "is_sale": False,
            "is_featured": False,
            "rating": 4.1,
            "review_count": 28,
            "images": ["bamboo spatulas.jpg", "bamboo spatulas.jpg", "bamboo spatulas.jpg"],
            "features": [
                "Set of 3 spatulas",
                "Bamboo construction",
                "Heat resistant",
                "Gentle on non-stick surfaces",
                "Eco-friendly material",
                "Natural finish"
            ],
            "specifications": {
                "Material": "Bamboo",
                "Set Includes": "3 spatulas",
                "Length": "12 inches each",
                "Heat Resistant": "Up to 400°F",
                "Care": "Hand wash",
                "Warranty": "1 year"
            }
        },
        
        # ADDITIONAL PRODUCTS (31 more products)
        {
            "name": "Mixing Bowl Duo",
            "description": "Versatile 2-bowl set perfect for mixing, serving, and food preparation. Microwave and dishwasher safe with durable construction.",
            "price": 799,
            "original_price": None,
            "sku": "WG-BS-2-SET",
            "stock": 35,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.2,
            "review_count": 18,
            "images": ["2 bowl set.jpg", "2 bowl set.jpg", "2 bowl set.jpg"],
            "features": [
                "Set of 2 bowls",
                "Versatile sizes",
                "Microwave and dishwasher safe",
                "Durable construction",
                "Perfect for mixing and serving",
                "Stackable design"
            ],
            "specifications": {
                "Material": "Stainless steel",
                "Set Includes": "2 bowls",
                "Sizes": "Small and large",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Kitchen Knife Trio",
            "description": "Professional 3-knife set with razor-sharp blades. Perfect for everyday cutting tasks with ergonomic handles.",
            "price": 1299,
            "original_price": None,
            "sku": "WG-KS-3-SET",
            "stock": 25,
            "category": "Cutlery",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.4,
            "review_count": 22,
            "images": ["3 knife set.jpg", "3 knife set.jpg", "3 knife set.jpg"],
            "features": [
                "Set of 3 knives",
                "Razor-sharp blades",
                "Stainless steel construction",
                "Ergonomic handles",
                "Professional grade",
                "Perfect for everyday use"
            ],
            "specifications": {
                "Material": "Stainless Steel",
                "Set Includes": "3 knives",
                "Care": "Hand wash only",
                "Warranty": "Lifetime"
            }
        },
        {
            "name": "Nesting Bowl Set",
            "description": "Space-saving 4-bowl nesting set perfect for food preparation and storage. Microwave and dishwasher safe.",
            "price": 1599,
            "original_price": None,
            "sku": "WG-NBS-4-SET",
            "stock": 20,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.3,
            "review_count": 15,
            "images": ["4 nesting bowl set.jpg", "4 nesting bowl set.jpg", "4 nesting bowl set.jpg"],
            "features": [
                "Set of 4 nesting bowls",
                "Space-saving design",
                "Microwave and dishwasher safe",
                "Perfect for food prep",
                "Stackable storage",
                "Versatile sizes"
            ],
            "specifications": {
                "Material": "Stainless steel",
                "Set Includes": "4 nesting bowls",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Premium Cookware Set",
            "description": "Premium 5-piece cooking set with enhanced non-stick coating. Includes multiple pans and lids for versatile cooking.",
            "price": 14999,
            "original_price": None,
            "sku": "WG-CS-5-SET-2",
            "stock": 8,
            "category": "Cookware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.6,
            "review_count": 12,
            "images": ["5 piece cooking set 2.jpg", "5 piece cooking set 2.jpg", "5 piece cooking set 2.jpg"],
            "features": [
                "5-piece premium set",
                "Enhanced non-stick coating",
                "Multiple pan sizes",
                "Oven safe up to 450°F",
                "Dishwasher safe",
                "Professional grade"
            ],
            "specifications": {
                "Material": "Aluminum with non-stick coating",
                "Set Pieces": "5 pieces",
                "Heat Source": "Gas, Electric, Induction",
                "Oven Safe": "Up to 450°F",
                "Warranty": "2 years"
            }
        },
        {
            "name": "Family Bowl Set",
            "description": "Comprehensive 6-bowl set perfect for large families and entertaining. Microwave and dishwasher safe.",
            "price": 2199,
            "original_price": None,
            "sku": "WG-BS-6-SET",
            "stock": 15,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.1,
            "review_count": 19,
            "images": ["6 bowl set.jpg", "6 bowl set.jpg", "6 bowl set.jpg"],
            "features": [
                "Set of 6 bowls",
                "Multiple sizes",
                "Microwave and dishwasher safe",
                "Perfect for large families",
                "Stackable design",
                "Versatile use"
            ],
            "specifications": {
                "Material": "Stainless steel",
                "Set Includes": "6 bowls",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Appetizer Plates",
            "description": "Elegant 7-piece small plate set perfect for appetizers and desserts. Microwave and dishwasher safe.",
            "price": 1299,
            "original_price": None,
            "sku": "WG-SPS-7-SET",
            "stock": 30,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.2,
            "review_count": 16,
            "images": ["7 small plate set.jpg", "7 small plate set.jpg", "7 small plate set.jpg"],
            "features": [
                "Set of 7 small plates",
                "Perfect for appetizers",
                "Microwave and dishwasher safe",
                "Elegant design",
                "Stackable storage",
                "Versatile use"
            ],
            "specifications": {
                "Material": "Ceramic",
                "Set Includes": "7 small plates",
                "Diameter": "6 inches each",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Kitchen Diffuser",
            "description": "Modern aromatic scent dispenser for kitchen freshness. Perfect for eliminating cooking odors and creating pleasant atmosphere.",
            "price": 2999,
            "original_price": None,
            "sku": "WG-ASD-1",
            "stock": 12,
            "category": "Appliances",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.0,
            "review_count": 8,
            "images": ["aromatic scent dispenser.jpeg", "aromatic scent dispenser.jpeg", "aromatic scent dispenser.jpeg"],
            "features": [
                "Aromatic scent dispensing",
                "Kitchen odor elimination",
                "Modern design",
                "Easy to use",
                "Long-lasting fragrance",
                "Battery operated"
            ],
            "specifications": {
                "Material": "Plastic and metal",
                "Power": "Battery operated",
                "Dimensions": "6 x 4 x 8 inches",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Cast Iron Kettle",
            "description": "Traditional iron kettle perfect for stovetop boiling. Durable construction with excellent heat retention.",
            "price": 3499,
            "original_price": None,
            "sku": "WG-IK-2QT",
            "stock": 18,
            "category": "Coffee & Tea",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.3,
            "review_count": 14,
            "images": ["iron kettle.jpg", "iron kettle.jpg", "iron kettle.jpg"],
            "features": [
                "Traditional iron construction",
                "2-quart capacity",
                "Excellent heat retention",
                "Stovetop safe",
                "Durable design",
                "Perfect for tea brewing"
            ],
            "specifications": {
                "Material": "Cast iron",
                "Capacity": "2 quarts",
                "Heat Source": "Gas, Electric",
                "Weight": "3.2 lbs",
                "Warranty": "Lifetime"
            }
        },
        {
            "name": "Table Service Set",
            "description": "Complete dining set with plates, cups, and spoons. Perfect for family meals and entertaining.",
            "price": 3999,
            "original_price": None,
            "sku": "WG-PCS-COMPLETE",
            "stock": 10,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.5,
            "review_count": 11,
            "images": ["plate cup and spoon set.jpg", "plate cup and spoon set.jpg", "plate cup and spoon set.jpg"],
            "features": [
                "Complete dining set",
                "Plates, cups, and spoons",
                "Microwave and dishwasher safe",
                "Perfect for entertaining",
                "Family-friendly design",
                "Comprehensive set"
            ],
            "specifications": {
                "Material": "Ceramic and stainless steel",
                "Set Includes": "4 plates, 4 cups, 4 spoons",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Contemporary Plates",
            "description": "Alternative plate set design perfect for everyday dining. Microwave and dishwasher safe with elegant pattern.",
            "price": 1799,
            "original_price": None,
            "sku": "WG-PS-4-SET-2",
            "stock": 25,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.1,
            "review_count": 20,
            "images": ["plate set 2.jpg", "plate set 2.jpg", "plate set 2.jpg"],
            "features": [
                "Set of 4 dinner plates",
                "Alternative design",
                "Microwave and dishwasher safe",
                "Elegant pattern",
                "Stackable storage",
                "Perfect for everyday use"
            ],
            "specifications": {
                "Material": "Ceramic",
                "Set Includes": "4 dinner plates",
                "Diameter": "10 inches each",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Elegant Flatware",
            "description": "Premium quality spoon and fork set with elegant design. Perfect for formal dining and special occasions.",
            "price": 899,
            "original_price": None,
            "sku": "WG-PSF-2-SET",
            "stock": 40,
            "category": "Utensils",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.3,
            "review_count": 25,
            "images": ["premium spoon and fork.jpg", "premium spoon and fork.jpg", "premium spoon and fork.jpg"],
            "features": [
                "Premium quality construction",
                "Elegant design",
                "Perfect for formal dining",
                "Stainless steel material",
                "Professional finish",
                "Dishwasher safe"
            ],
            "specifications": {
                "Material": "Stainless steel",
                "Set Includes": "1 spoon, 1 fork",
                "Care": "Dishwasher safe",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Kitchen Shears",
            "description": "Professional kitchen scissors perfect for cutting herbs, meat, and packaging. Sharp blades with comfortable handles.",
            "price": 699,
            "original_price": None,
            "sku": "WG-KS-1",
            "stock": 35,
            "category": "Cutlery",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.2,
            "review_count": 30,
            "images": ["scissors.jpg", "scissors.jpg", "scissors.jpg"],
            "features": [
                "Professional kitchen scissors",
                "Sharp blades",
                "Comfortable handles",
                "Perfect for herbs and meat",
                "Easy to clean",
                "Durable construction"
            ],
            "specifications": {
                "Material": "Stainless steel",
                "Length": "8 inches",
                "Care": "Hand wash",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Bamboo Kitchen Stool",
            "description": "Eco-friendly small bamboo chair perfect for kitchen seating. Natural material with comfortable design.",
            "price": 2499,
            "original_price": None,
            "sku": "WG-SBC-1",
            "stock": 8,
            "category": "Utensils",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.0,
            "review_count": 5,
            "images": ["small bamboo chair.jpeg", "small bamboo chair.jpeg", "small bamboo chair.jpeg"],
            "features": [
                "Eco-friendly bamboo construction",
                "Small size perfect for kitchen",
                "Comfortable seating",
                "Natural material",
                "Lightweight design",
                "Easy to move"
            ],
            "specifications": {
                "Material": "Bamboo",
                "Weight Capacity": "200 lbs",
                "Height": "18 inches",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Spice Storage Set",
            "description": "Premium spice jars perfect for organizing kitchen spices. Airtight seals with clear labeling.",
            "price": 1299,
            "original_price": None,
            "sku": "WG-SJ-6-SET",
            "stock": 45,
            "category": "Storage",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.4,
            "review_count": 33,
            "images": ["spice jars.jpg", "spice jars.jpg", "spice jars.jpg"],
            "features": [
                "Set of 6 spice jars",
                "Airtight seals",
                "Clear labeling",
                "Perfect for organization",
                "Stackable design",
                "Easy to use"
            ],
            "specifications": {
                "Material": "Glass and plastic",
                "Set Includes": "6 spice jars",
                "Capacity": "4 oz each",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Premium Spice Jars",
            "description": "Alternative spice jar design with enhanced features. Perfect for spice organization and storage.",
            "price": 1499,
            "original_price": None,
            "sku": "WG-SJ-6-SET-2",
            "stock": 30,
            "category": "Storage",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.2,
            "review_count": 18,
            "images": ["spice jars 2.jpg", "spice jars 2.jpg", "spice jars 2.jpg"],
            "features": [
                "Enhanced spice jar design",
                "Set of 6 jars",
                "Airtight seals",
                "Clear visibility",
                "Perfect organization",
                "Easy access"
            ],
            "specifications": {
                "Material": "Glass and plastic",
                "Set Includes": "6 spice jars",
                "Capacity": "4 oz each",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Classic Flatware",
            "description": "Classic spoons and forks set perfect for everyday dining. Stainless steel construction with comfortable handles.",
            "price": 799,
            "original_price": None,
            "sku": "WG-SF-4-SET",
            "stock": 50,
            "category": "Utensils",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.1,
            "review_count": 42,
            "images": ["spoons and forks.jpg", "spoons and forks.jpg", "spoons and forks.jpg"],
            "features": [
                "Set of 4 pieces",
                "Stainless steel construction",
                "Comfortable handles",
                "Perfect for everyday use",
                "Dishwasher safe",
                "Classic design"
            ],
            "specifications": {
                "Material": "Stainless steel",
                "Set Includes": "2 spoons, 2 forks",
                "Care": "Dishwasher safe",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Complete Flatware Set",
            "description": "Complete flatware set with spoons, knives, and forks. Perfect for family dining and entertaining.",
            "price": 1899,
            "original_price": None,
            "sku": "WG-SKF-6-SET",
            "stock": 20,
            "category": "Utensils",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.3,
            "review_count": 28,
            "images": ["spoons kives forks.jpg", "spoons kives forks.jpg", "spoons kives forks.jpg"],
            "features": [
                "Complete flatware set",
                "Spoons, knives, and forks",
                "Stainless steel construction",
                "Perfect for family dining",
                "Dishwasher safe",
                "Professional finish"
            ],
            "specifications": {
                "Material": "Stainless steel",
                "Set Includes": "2 spoons, 2 knives, 2 forks",
                "Care": "Dishwasher safe",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Premium Flatware",
            "description": "Professional stainless steel fork and knife set. Perfect for formal dining and special occasions.",
            "price": 999,
            "original_price": None,
            "sku": "WG-SSFK-2-SET",
            "stock": 35,
            "category": "Utensils",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.4,
            "review_count": 31,
            "images": ["stainless steel fork and knife.jpg", "stainless steel fork and knife.jpg", "stainless steel fork and knife.jpg"],
            "features": [
                "Professional quality",
                "Stainless steel construction",
                "Perfect for formal dining",
                "Elegant design",
                "Dishwasher safe",
                "Comfortable handles"
            ],
            "specifications": {
                "Material": "Stainless steel",
                "Set Includes": "1 fork, 1 knife",
                "Care": "Dishwasher safe",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Multicultural Set",
            "description": "Versatile dining set with chopsticks, fork, and knife. Perfect for multicultural dining experiences.",
            "price": 1199,
            "original_price": None,
            "sku": "WG-CFK-3-SET",
            "stock": 25,
            "category": "Utensils",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.2,
            "review_count": 19,
            "images": ["chopstick and fork and knife.jpg", "chopstick and fork and knife.jpg", "chopstick and fork and knife.jpg"],
            "features": [
                "Versatile dining set",
                "Chopsticks, fork, and knife",
                "Multicultural dining",
                "Stainless steel construction",
                "Dishwasher safe",
                "Perfect for variety"
            ],
            "specifications": {
                "Material": "Stainless steel and bamboo",
                "Set Includes": "1 pair chopsticks, 1 fork, 1 knife",
                "Care": "Hand wash",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Asian Dining Set",
            "description": "Complete Asian dining set with chopsticks, plate, and spoon. Perfect for traditional and modern dining.",
            "price": 1599,
            "original_price": None,
            "sku": "WG-CPS-3-SET",
            "stock": 18,
            "category": "Serveware",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.1,
            "review_count": 14,
            "images": ["chopsticks and plate and spoon.jpg", "chopsticks and plate and spoon.jpg", "chopsticks and plate and spoon.jpg"],
            "features": [
                "Complete Asian dining set",
                "Chopsticks, plate, and spoon",
                "Traditional design",
                "Microwave and dishwasher safe",
                "Perfect for Asian cuisine",
                "Versatile use"
            ],
            "specifications": {
                "Material": "Ceramic and bamboo",
                "Set Includes": "1 pair chopsticks, 1 plate, 1 spoon",
                "Microwave Safe": "Yes",
                "Dishwasher Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Asian Utensils",
            "description": "Traditional chopsticks and soup spoon set. Perfect for Asian soups and noodle dishes.",
            "price": 899,
            "original_price": None,
            "sku": "WG-CSS-2-SET",
            "stock": 30,
            "category": "Utensils",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.0,
            "review_count": 22,
            "images": ["chopsticks and soup spoon.jpg", "chopsticks and soup spoon.jpg", "chopsticks and soup spoon.jpg"],
            "features": [
                "Traditional design",
                "Chopsticks and soup spoon",
                "Perfect for Asian soups",
                "Bamboo construction",
                "Lightweight and durable",
                "Easy to use"
            ],
            "specifications": {
                "Material": "Bamboo",
                "Set Includes": "1 pair chopsticks, 1 soup spoon",
                "Care": "Hand wash",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Coffee Brewing Set",
            "description": "Complete coffee maker set with accessories. Perfect for coffee enthusiasts and daily brewing.",
            "price": 4499,
            "original_price": None,
            "sku": "CU-CMS-COMPLETE",
            "stock": 12,
            "category": "Coffee & Tea",
            "brand": "Cuisinart",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.5,
            "review_count": 16,
            "images": ["coffee maker set.jpg", "coffee maker set.jpg", "coffee maker set.jpg"],
            "features": [
                "Complete coffee maker set",
                "Multiple accessories",
                "Professional brewing",
                "Easy to use",
                "Perfect for enthusiasts",
                "Quality construction"
            ],
            "specifications": {
                "Material": "Stainless steel and plastic",
                "Set Includes": "Coffee maker and accessories",
                "Power": "1200W",
                "Warranty": "2 years"
            }
        },
        {
            "name": "Modern Tea Kettle",
            "description": "Alternative electric kettle design with modern features. Perfect for tea and coffee brewing.",
            "price": 2799,
            "original_price": None,
            "sku": "CU-EK-ALT-1.8L",
            "stock": 15,
            "category": "Coffee & Tea",
            "brand": "Cuisinart",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.3,
            "review_count": 21,
            "images": ["electric kettle.jpeg", "electric kettle.jpeg", "electric kettle.jpeg"],
            "features": [
                "Alternative design",
                "1.8L capacity",
                "Rapid boiling technology",
                "Auto-shutoff feature",
                "Modern styling",
                "Cordless design"
            ],
            "specifications": {
                "Capacity": "1.8 liters",
                "Power": "1500W",
                "Material": "Stainless steel",
                "Dimensions": "8 x 6 x 10 inches",
                "Warranty": "2 years"
            }
        },
        {
            "name": "Ceramic Tea Pot",
            "description": "Traditional tea pot perfect for brewing and serving tea. Elegant design with excellent heat retention.",
            "price": 1899,
            "original_price": None,
            "sku": "WG-TP-1QT",
            "stock": 22,
            "category": "Coffee & Tea",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.2,
            "review_count": 17,
            "images": ["tea pot.jpg", "tea pot.jpg", "tea pot.jpg"],
            "features": [
                "Traditional tea pot",
                "1-quart capacity",
                "Excellent heat retention",
                "Elegant design",
                "Perfect for tea brewing",
                "Microwave safe"
            ],
            "specifications": {
                "Material": "Ceramic",
                "Capacity": "1 quart",
                "Microwave Safe": "Yes",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Countertop Oven",
            "description": "Compact table oven perfect for small kitchens and apartments. Multiple cooking modes with easy controls.",
            "price": 12999,
            "original_price": None,
            "sku": "CU-TO-COMPACT",
            "stock": 8,
            "category": "Appliances",
            "brand": "Cuisinart",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.4,
            "review_count": 13,
            "images": ["table oven.jpg", "table oven.jpg", "table oven.jpg"],
            "features": [
                "Compact table oven",
                "Multiple cooking modes",
                "Easy controls",
                "Perfect for small spaces",
                "Energy efficient",
                "Versatile cooking"
            ],
            "specifications": {
                "Capacity": "0.8 cubic feet",
                "Power": "1500W",
                "Material": "Stainless steel",
                "Dimensions": "18 x 14 x 10 inches",
                "Warranty": "2 years"
            }
        },
        {
            "name": "Wooden Utensils",
            "description": "Natural wood spatulas perfect for cooking and serving. Gentle on non-stick surfaces with traditional design.",
            "price": 799,
            "original_price": None,
            "sku": "WG-WS-3-SET",
            "stock": 35,
            "category": "Utensils",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.1,
            "review_count": 29,
            "images": ["wood spatulas.jpg", "wood spatulas.jpg", "wood spatulas.jpg"],
            "features": [
                "Set of 3 wood spatulas",
                "Natural wood construction",
                "Gentle on non-stick surfaces",
                "Traditional design",
                "Heat resistant",
                "Eco-friendly material"
            ],
            "specifications": {
                "Material": "Natural wood",
                "Set Includes": "3 spatulas",
                "Length": "12 inches each",
                "Heat Resistant": "Up to 400°F",
                "Care": "Hand wash",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Wooden Planter",
            "description": "Decorative wooden flower pot perfect for kitchen herbs and small plants. Natural material with elegant design.",
            "price": 899,
            "original_price": None,
            "sku": "WG-WFP-5",
            "stock": 20,
            "category": "Utensils",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.0,
            "review_count": 11,
            "images": ["wooden flower pot 5.jpg", "wooden flower pot 5.jpg", "wooden flower pot 5.jpg"],
            "features": [
                "Decorative wooden pot",
                "Perfect for kitchen herbs",
                "Natural material",
                "Elegant design",
                "Small size",
                "Easy to maintain"
            ],
            "specifications": {
                "Material": "Natural wood",
                "Size": "5 inches diameter",
                "Height": "6 inches",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Storage Basket",
            "description": "Traditional woven basket perfect for storage and organization. Natural material with durable construction.",
            "price": 599,
            "original_price": None,
            "sku": "WG-WB-1",
            "stock": 25,
            "category": "Storage",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.2,
            "review_count": 16,
            "images": ["woven basket.jpeg", "woven basket.jpeg", "woven basket.jpeg"],
            "features": [
                "Traditional woven design",
                "Natural material",
                "Perfect for storage",
                "Durable construction",
                "Versatile use",
                "Eco-friendly"
            ],
            "specifications": {
                "Material": "Natural woven material",
                "Dimensions": "12 x 8 x 6 inches",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Black Ceramic Pot",
            "description": "Elegant ceramic black flower pot perfect for kitchen decoration and plant display. Modern design with durable construction.",
            "price": 699,
            "original_price": None,
            "sku": "WG-CBFP-1",
            "stock": 30,
            "category": "Utensils",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.1,
            "review_count": 19,
            "images": ["ceramic black flower pot.jpg", "ceramic black flower pot.jpg", "ceramic black flower pot.jpg"],
            "features": [
                "Elegant ceramic design",
                "Black finish",
                "Perfect for decoration",
                "Durable construction",
                "Modern styling",
                "Easy to clean"
            ],
            "specifications": {
                "Material": "Ceramic",
                "Color": "Black",
                "Dimensions": "6 x 6 x 8 inches",
                "Warranty": "1 year"
            }
        },
        {
            "name": "Black-Handled Knives",
            "description": "Professional black handle knife set with razor-sharp blades. Perfect for precision cutting and professional use.",
            "price": 2499,
            "original_price": None,
            "sku": "WG-BHKS-4-SET",
            "stock": 15,
            "category": "Cutlery",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.5,
            "review_count": 23,
            "images": ["black handle knive set.jpg", "black handle knive set.jpg", "black handle knive set.jpg"],
            "features": [
                "Professional knife set",
                "Black handle design",
                "Razor-sharp blades",
                "Stainless steel construction",
                "Perfect for precision cutting",
                "Professional grade"
            ],
            "specifications": {
                "Material": "Stainless steel",
                "Set Includes": "4 knives",
                "Handle Material": "Black plastic",
                "Care": "Hand wash only",
                "Warranty": "Lifetime"
            }
        },
        {
            "name": "Butcher Knife Set",
            "description": "Professional butcher knife set perfect for meat cutting and preparation. Heavy-duty construction with sharp blades.",
            "price": 1899,
            "original_price": None,
            "sku": "WG-BKS-3-SET",
            "stock": 12,
            "category": "Cutlery",
            "brand": "Wega Premium",
            "is_new": False,
            "is_sale": False,
            "is_featured": False,
            "rating": 4.3,
            "review_count": 18,
            "images": ["butcher knife set.jpg", "butcher knife set.jpg", "butcher knife set.jpg"],
            "features": [
                "Professional butcher knives",
                "Heavy-duty construction",
                "Sharp blades",
                "Perfect for meat cutting",
                "Stainless steel material",
                "Professional grade"
            ],
            "specifications": {
                "Material": "Stainless steel",
                "Set Includes": "3 butcher knives",
                "Care": "Hand wash only",
                "Warranty": "Lifetime"
            }
        }
    ]

def seed_database(validate_urls=True, production_mode=False):
    """Main seeding function"""
    app = create_app('development')
    
    with app.app_context():
        print("🌱 Starting Cloudinary database seeding...")
        
        # Validate Cloudinary URLs if requested
        if validate_urls:
            if not validate_cloudinary_urls():
                if production_mode:
                    print("❌ Production mode: Aborting due to URL validation failures")
                    return False
                else:
                    print("⚠️  Development mode: Continuing despite URL validation failures")
        
        # Clear existing data
        clear_database()
        
        # Create categories and brands
        categories = create_categories()
        brands = create_brands()
        
        # Get product data
        products_data = get_product_data()
        
        print(f"🛍️  Creating {len(products_data)} products...")
        
        successful_products = 0
        failed_products = 0
        
        for i, product_data in enumerate(products_data, 1):
            try:
                # Create product
                product = Product(
                    name=product_data['name'],
                    description=product_data['description'],
                    price=product_data['price'],
                    original_price=product_data['original_price'],
                    sku=product_data['sku'],
                    stock=product_data['stock'],
                    category_id=categories[product_data['category']].id,
                    brand_id=brands[product_data['brand']].id,
                    is_new=product_data['is_new'],
                    is_sale=product_data['is_sale'],
                    is_featured=product_data['is_featured'],
                    rating=product_data['rating'],
                    review_count=product_data['review_count']
                )
                db.session.add(product)
                db.session.flush()
                
                # Add features
                for j, feature in enumerate(product_data['features']):
                    product_feature = ProductFeature(
                        product_id=product.id,
                        feature=feature,
                        display_order=j
                    )
                    db.session.add(product_feature)
                
                # Add specifications
                for j, (name, value) in enumerate(product_data['specifications'].items()):
                    product_spec = ProductSpecification(
                        product_id=product.id,
                        name=name,
                        value=str(value),
                        display_order=j
                    )
                    db.session.add(product_spec)
                
                # Add images (convert local filenames to Cloudinary URLs)
                cloudinary_images = get_product_images(product_data['name'], product_data['images'])
                for j, cloudinary_url in enumerate(cloudinary_images):
                    product_image = ProductImage(
                        product_id=product.id,
                        image_url=cloudinary_url,
                        is_primary=(j == 0),
                        display_order=j
                    )
                    db.session.add(product_image)
                
                successful_products += 1
                print(f"✅ Created product {i}: {product.name}")
                
            except Exception as e:
                failed_products += 1
                print(f"❌ Error creating product {product_data['name']}: {e}")
                if production_mode:
                    db.session.rollback()
                    print(f"❌ Production mode: Aborting due to product creation failure")
                    return False
                continue
        
        db.session.commit()
        print(f"🎉 Successfully seeded database with {successful_products} products using Cloudinary URLs!")
        
        if failed_products > 0:
            print(f"⚠️  {failed_products} products failed to create")
        
        # Print summary
        print("\n📊 Seeding Summary:")
        print(f"   Categories: {len(categories)}")
        print(f"   Brands: {len(brands)}")
        print(f"   Products: {successful_products}/{len(products_data)}")
        print(f"   Featured Products: {sum(1 for p in products_data if p['is_featured'])}")
        print(f"   New Products: {sum(1 for p in products_data if p['is_new'])}")
        print(f"   Sale Products: {sum(1 for p in products_data if p['is_sale'])}")
        print(f"   Regular Products: {sum(1 for p in products_data if not any([p['is_featured'], p['is_new'], p['is_sale']]))}")
        print(f"   Image Source: Cloudinary URLs")
        print(f"   Production Mode: {production_mode}")
        
        return True

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Seed database with 56 products using Cloudinary URLs')
    parser.add_argument('--production', action='store_true', help='Run in production mode with strict validation')
    parser.add_argument('--no-validate', action='store_true', help='Skip URL validation')
    
    args = parser.parse_args()
    
    success = seed_database(
        validate_urls=not args.no_validate,
        production_mode=args.production
    )
    
    if success:
        print("\n🚀 Seeding completed successfully!")
        if args.production:
            print("✅ Production deployment ready!")
    else:
        print("\n❌ Seeding failed!")
        sys.exit(1)
