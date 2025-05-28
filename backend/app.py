from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import os
from models import db, Product, Category, Brand, ProductImage, ProductSpecification, ProductFeature
from sqlalchemy import or_, and_

app = Flask(__name__, static_folder='static')
CORS(app)

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

# Serve static files
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

# Helper function for pagination
def paginate(query, page=1, per_page=10):
    return query.paginate(page=page, per_page=per_page, error_out=False)

# Products Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 12, type=int)  # Changed to 12 for 4x3 grid
    categories = request.args.getlist('categories[]')  # Changed to handle multiple categories
    brands = request.args.getlist('brands[]')  # Changed to handle multiple brands
    min_price = request.args.get('minPrice', type=float)  # Changed to match frontend
    max_price = request.args.get('maxPrice', type=float)  # Changed to match frontend
    sort = request.args.get('sort', 'featured')
    search = request.args.get('search')

    # Base query with joins
    query = Product.query.join(Category).join(Brand)

    # Apply filters
    if categories:
        query = query.filter(Category.name.in_(categories))
    if brands:
        query = query.filter(Brand.name.in_(brands))
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            db.or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term),
                Category.name.ilike(search_term),
                Brand.name.ilike(search_term)
            )
        )

    # Apply sorting
    if sort == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort == 'price_desc':
        query = query.order_by(Product.price.desc())
    elif sort == 'newest':
        query = query.order_by(Product.created_at.desc())
    elif sort == 'rating':
        query = query.order_by(Product.rating.desc())
    else:  # featured
        query = query.order_by(Product.is_new.desc(), Product.is_sale.desc())

    # Get paginated results
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    products = pagination.items

    return jsonify({
        'products': [product.to_dict() for product in products],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
        'per_page': per_page
    })

@app.route('/api/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())

@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.get_json()
    
    # Create product
    product = Product(
        name=data['name'],
        description=data.get('description'),
        price=data['price'],
        original_price=data.get('original_price'),
        sku=data.get('sku'),
        stock=data.get('stock', 0),
        category_id=data.get('category_id'),
        brand_id=data.get('brand_id'),
        is_new=data.get('is_new', False),
        is_sale=data.get('is_sale', False)
    )
    
    db.session.add(product)
    db.session.flush()  # Get the product ID
    
    # Add images
    if 'images' in data:
        for image_data in data['images']:
            image = ProductImage(
                product_id=product.id,
                image_url=image_data['image_url'],
                is_primary=image_data.get('is_primary', False),
                display_order=image_data.get('display_order', 0)
            )
            db.session.add(image)
    
    # Add specifications
    if 'specifications' in data:
        for spec_data in data['specifications']:
            spec = ProductSpecification(
                product_id=product.id,
                name=spec_data['name'],
                value=spec_data['value'],
                display_order=spec_data.get('display_order', 0)
            )
            db.session.add(spec)
    
    # Add features
    if 'features' in data:
        for feature_data in data['features']:
            feature = ProductFeature(
                product_id=product.id,
                feature=feature_data['feature'],
                display_order=feature_data.get('display_order', 0)
            )
            db.session.add(feature)
    
    db.session.commit()
    return jsonify(product.to_dict()), 201

@app.route('/api/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()
    
    # Update basic product info
    for key, value in data.items():
        if key not in ['images', 'specifications', 'features']:
            setattr(product, key, value)
    
    # Update images
    if 'images' in data:
        # Delete existing images
        ProductImage.query.filter_by(product_id=id).delete()
        # Add new images
        for image_data in data['images']:
            image = ProductImage(
                product_id=id,
                image_url=image_data['image_url'],
                is_primary=image_data.get('is_primary', False),
                display_order=image_data.get('display_order', 0)
            )
            db.session.add(image)
    
    # Update specifications
    if 'specifications' in data:
        ProductSpecification.query.filter_by(product_id=id).delete()
        for spec_data in data['specifications']:
            spec = ProductSpecification(
                product_id=id,
                name=spec_data['name'],
                value=spec_data['value'],
                display_order=spec_data.get('display_order', 0)
            )
            db.session.add(spec)
    
    # Update features
    if 'features' in data:
        ProductFeature.query.filter_by(product_id=id).delete()
        for feature_data in data['features']:
            feature = ProductFeature(
                product_id=id,
                feature=feature_data['feature'],
                display_order=feature_data.get('display_order', 0)
            )
            db.session.add(feature)
    
    db.session.commit()
    return jsonify(product.to_dict())

@app.route('/api/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return '', 204

# Categories Routes
@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([category.to_dict() for category in categories])

@app.route('/api/categories/<int:id>', methods=['GET'])
def get_category(id):
    category = Category.query.get_or_404(id)
    return jsonify(category.to_dict())

@app.route('/api/categories/<int:id>/products', methods=['GET'])
def get_category_products(id):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)
    
    query = Product.query.filter_by(category_id=id)
    paginated_products = paginate(query, page, per_page)
    
    return jsonify({
        'products': [product.to_dict() for product in paginated_products.items],
        'total': paginated_products.total,
        'pages': paginated_products.pages,
        'current_page': page
    })

# Brands Routes
@app.route('/api/brands', methods=['GET'])
def get_brands():
    brands = Brand.query.all()
    return jsonify([brand.to_dict() for brand in brands])

@app.route('/api/brands/<int:id>', methods=['GET'])
def get_brand(id):
    brand = Brand.query.get_or_404(id)
    return jsonify(brand.to_dict())

@app.route('/api/brands/<int:id>/products', methods=['GET'])
def get_brand_products(id):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)
    
    query = Product.query.filter_by(brand_id=id)
    paginated_products = paginate(query, page, per_page)
    
    return jsonify({
        'products': [product.to_dict() for product in paginated_products.items],
        'total': paginated_products.total,
        'pages': paginated_products.pages,
        'current_page': page
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True) 