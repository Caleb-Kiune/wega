from flask import Blueprint, request, jsonify
from models import db, Category, Brand, Product, ProductFeature, ProductSpecification
from utils.auth import require_auth, require_role
import re
import os

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def slugify(name):
    """Convert name to URL-friendly slug"""
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

@admin_bp.route('/load-sample-data', methods=['POST'])
@require_auth
@require_role('admin')
def load_sample_data():
    """Protected endpoint to load sample data"""
    
    try:
        # Create database tables if they don't exist
        db.create_all()
        
        # Add Categories
        categories_data = [
            {"name": "Cookware", "description": "Pots, pans, and cooking utensils"},
            {"name": "Bakeware", "description": "Baking pans, molds, and accessories"},
            {"name": "Cutlery", "description": "Knives, forks, spoons, and kitchen tools"},
            {"name": "Storage", "description": "Food storage containers and organizers"},
            {"name": "Appliances", "description": "Kitchen appliances and gadgets"}
        ]
        
        categories = {}
        for cat_data in categories_data:
            if 'slug' not in cat_data:
                cat_data['slug'] = slugify(cat_data['name'])
            category = Category.query.filter_by(name=cat_data["name"]).first()
            if not category:
                category = Category(**cat_data)
                db.session.add(category)
            categories[cat_data["name"]] = category
        
        # Add Brands
        brands_data = [
            {"name": "Wega Premium", "description": "Premium kitchenware brand"},
            {"name": "Chef's Choice", "description": "Professional chef equipment"},
            {"name": "Home Essentials", "description": "Essential home kitchen items"},
            {"name": "Gourmet Pro", "description": "Gourmet cooking equipment"}
        ]
        
        brands = {}
        for brand_data in brands_data:
            if 'slug' not in brand_data:
                brand_data['slug'] = slugify(brand_data['name'])
            brand = Brand.query.filter_by(name=brand_data["name"]).first()
            if not brand:
                brand = Brand(**brand_data)
                db.session.add(brand)
            brands[brand_data["name"]] = brand
        
        # Add Products
        products_data = [
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
                "specifications": {
                    "Material": "Stainless Steel",
                    "Size": "12-inch",
                    "Weight": "2.5 lbs",
                    "Handle": "Stainless Steel"
                }
            },
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
                "specifications": {
                    "Material": "Ceramic",
                    "Sizes": "8x8, 9x13, 10x10 inches",
                    "Color": "White",
                    "Set": "3 pieces"
                }
            },
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
                "specifications": {
                    "Material": "High-carbon Steel",
                    "Set": "8 pieces",
                    "Block": "Bamboo",
                    "Warranty": "Lifetime"
                }
            },
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
                "specifications": {
                    "Material": "Glass",
                    "Set": "10 pieces",
                    "Sizes": "Various",
                    "Lids": "BPA-free plastic"
                }
            },
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
                "specifications": {
                    "Power": "325W",
                    "Bowl": "5-quart",
                    "Attachments": "3 included",
                    "Color": "Silver"
                }
            }
        ]
        
        added_products = 0
        for product_data in products_data:
            # Check if product already exists
            existing_product = Product.query.filter_by(name=product_data["name"]).first()
            if existing_product:
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
            
            added_products += 1
        
        # Commit all changes
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Sample data loaded successfully!',
            'data': {
                'categories_added': len(categories_data),
                'brands_added': len(brands_data),
                'products_added': added_products
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Failed to load sample data',
            'message': str(e)
        }), 500

@admin_bp.route('/stats', methods=['GET'])
@require_auth
@require_role('admin')
def get_admin_stats():
    """Get admin dashboard statistics"""
    try:
        # Get counts
        total_products = Product.query.count()
        total_categories = Category.query.count()
        total_brands = Brand.query.count()
        
        # Get recent products
        recent_products = Product.query.order_by(Product.created_at.desc()).limit(5).all()
        
        # Get featured products
        featured_products = Product.query.filter_by(is_featured=True).limit(5).all()
        
        return jsonify({
            'stats': {
                'total_products': total_products,
                'total_categories': total_categories,
                'total_brands': total_brands
            },
            'recent_products': [p.to_dict() for p in recent_products],
            'featured_products': [p.to_dict() for p in featured_products]
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to get admin stats',
            'message': str(e)
        }), 500 

@admin_bp.route('/health', methods=['GET'])
def health():
    """Admin health check"""
    return jsonify({
        'status': 'healthy',
        'message': 'Admin endpoints are working'
    })

@admin_bp.route('/create-tables', methods=['POST'])
def create_tables():
    """Create database tables"""
    try:
        print("🔄 Creating database tables via API...")
        
        # Drop all tables first (in case they exist)
        print("🔄 Dropping existing tables...")
        db.drop_all()
        
        # Create all tables
        print("🔄 Creating new tables...")
        db.create_all()
        
        print("✅ Database tables created successfully!")
        
        # List all tables
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        
        return jsonify({
            'status': 'success',
            'message': 'Database tables created successfully',
            'tables': tables
        }), 200
        
    except Exception as e:
        print(f"❌ Failed to create tables: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to create tables: {str(e)}',
            'error_type': type(e).__name__
        }), 500

@admin_bp.route('/tables', methods=['GET'])
def list_tables():
    """List all database tables"""
    try:
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        
        return jsonify({
            'status': 'success',
            'tables': tables,
            'count': len(tables)
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Failed to list tables: {str(e)}'
        }), 500 