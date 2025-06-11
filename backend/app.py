from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import os
from models import db, Product, Category, Brand, ProductImage, ProductSpecification, ProductFeature, Review, Cart, CartItem, DeliveryLocation, Order, OrderItem
from sqlalchemy import or_, and_
from decimal import Decimal
import datetime

app = Flask(__name__, static_folder='static')

# Configure CORS - More permissive for development
CORS(app, 
     resources={r"/*": {
         "origins": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3002"],
         "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
         "expose_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True,
         "max_age": 3600,
         "send_wildcard": False,
         "vary_header": True
     }},
     supports_credentials=True)

# Add request logging
@app.before_request
def log_request_info():
    print('Headers:', dict(request.headers))
    print('Body:', request.get_data())
    print('Args:', request.args)
    print('Method:', request.method)
    print('URL:', request.url)

@app.after_request
def after_request(response):
    print('Response:', response.status, response.headers)
    return response

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

# Helper functions
def validate_product_data(data):
    if not data.get('name'):
        return False, "Product name is required"
    if not data.get('price'):
        return False, "Product price is required"
    try:
        price = Decimal(str(data['price']))
        if price < 0:
            return False, "Price cannot be negative"
    except (ValueError, TypeError):
        return False, "Invalid price format"
    return True, None

def validate_review_data(data):
    if not data.get('user'):
        return False, "User name is required"
    if not data.get('title'):
        return False, "Review title is required"
    if not data.get('comment'):
        return False, "Review comment is required"
    if not data.get('rating'):
        return False, "Rating is required"
    try:
        rating = int(data['rating'])
        if rating < 1 or rating > 5:
            return False, "Rating must be between 1 and 5"
    except (ValueError, TypeError):
        return False, "Invalid rating format"
    return True, None

def validate_image_data(data):
    if not data.get('image_url'):
        return False, "Image URL is required"
    return True, None

def validate_specification_data(data):
    if not data.get('name'):
        return False, "Specification name is required"
    if not data.get('value'):
        return False, "Specification value is required"
    return True, None

def validate_feature_data(data):
    if not data.get('feature'):
        return False, "Feature description is required"
    return True, None

# Root route
@app.route('/')
def index():
    return jsonify({
        'message': 'Welcome to Wega Kitchenware API',
        'endpoints': {
            'products': '/api/products',
            'categories': '/api/categories',
            'brands': '/api/brands'
        }
    })

# Serve static files
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

# Serve images from the products directory
@app.route('/images/products/<path:filename>')
def serve_product_image(filename):
    return send_from_directory(os.path.join(app.static_folder, 'images', 'products'), filename)

# Serve images from the root images directory
@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(os.path.join(app.static_folder, 'images'), filename)

# Helper function for pagination
def paginate(query, page=1, per_page=10):
    return query.paginate(page=page, per_page=per_page, error_out=False)

# Products Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 12, type=int)
    categories = request.args.getlist('categories[]')
    brands = request.args.getlist('brands[]')
    min_price = request.args.get('minPrice', type=float)
    max_price = request.args.get('maxPrice', type=float)
    sort = request.args.get('sort', 'featured')
    search = request.args.get('search')
    is_featured = request.args.get('is_featured', type=bool)
    is_new = request.args.get('is_new', type=bool)
    is_sale = request.args.get('is_sale', type=bool)

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
            or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term),
                Category.name.ilike(search_term),
                Brand.name.ilike(search_term)
            )
        )

    # Apply sorting and filtering
    if sort == 'featured':
        query = query.filter(Product.is_featured == True)
    elif sort == 'newest':
        query = query.filter(Product.is_new == True)
    elif sort == 'offers':
        query = query.filter(Product.is_sale == True)
    elif sort == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort == 'price_desc':
        query = query.order_by(Product.price.desc())

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
    product = db.session.get(Product, id)
    if product is None:
        return jsonify({'error': 'Product not found'}), 404
    return jsonify(product.to_dict())

@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.get_json()
    
    # Validate product data
    is_valid, error_message = validate_product_data(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
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
            is_valid, error_message = validate_image_data(image_data)
            if not is_valid:
                db.session.rollback()
                return jsonify({'error': error_message}), 400
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
            is_valid, error_message = validate_specification_data(spec_data)
            if not is_valid:
                db.session.rollback()
                return jsonify({'error': error_message}), 400
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
            is_valid, error_message = validate_feature_data(feature_data)
            if not is_valid:
                db.session.rollback()
                return jsonify({'error': error_message}), 400
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
    product = db.session.get(Product, id)
    if product is None:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    
    # Validate price if provided
    if 'price' in data:
        try:
            price = Decimal(str(data['price']))
            if price < 0:
                return jsonify({'error': 'Price cannot be negative'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid price format'}), 400
    
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
            is_valid, error_message = validate_image_data(image_data)
            if not is_valid:
                db.session.rollback()
                return jsonify({'error': error_message}), 400
            image = ProductImage(
                product_id=id,
                image_url=image_data['image_url'],
                is_primary=image_data.get('is_primary', False),
                display_order=image_data.get('display_order', 0)
            )
            db.session.add(image)
    
    # Update specifications
    if 'specifications' in data:
        # Delete existing specifications
        ProductSpecification.query.filter_by(product_id=id).delete()
        # Add new specifications
        for spec_data in data['specifications']:
            is_valid, error_message = validate_specification_data(spec_data)
            if not is_valid:
                db.session.rollback()
                return jsonify({'error': error_message}), 400
            spec = ProductSpecification(
                product_id=id,
                name=spec_data['name'],
                value=spec_data['value'],
                display_order=spec_data.get('display_order', 0)
            )
            db.session.add(spec)
    
    # Update features
    if 'features' in data:
        # Delete existing features
        ProductFeature.query.filter_by(product_id=id).delete()
        # Add new features
        for feature_data in data['features']:
            is_valid, error_message = validate_feature_data(feature_data)
            if not is_valid:
                db.session.rollback()
                return jsonify({'error': error_message}), 400
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
    product = db.session.get(Product, id)
    if product is None:
        return jsonify({'error': 'Product not found'}), 404
    
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
    category = db.session.get(Category, id)
    if category is None:
        return jsonify({'error': 'Category not found'}), 404
    return jsonify(category.to_dict())

@app.route('/api/categories', methods=['POST'])
def create_category():
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Category name is required'}), 400
    
    category = Category(
        name=data['name'],
        slug=data.get('slug', data['name'].lower().replace(' ', '-')),
        description=data.get('description'),
        image_url=data.get('image_url')
    )
    
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201

@app.route('/api/categories/<int:id>', methods=['PUT'])
def update_category(id):
    category = db.session.get(Category, id)
    if category is None:
        return jsonify({'error': 'Category not found'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        category.name = data['name']
        if 'slug' not in data:
            category.slug = data['name'].lower().replace(' ', '-')
    if 'slug' in data:
        category.slug = data['slug']
    if 'description' in data:
        category.description = data['description']
    if 'image_url' in data:
        category.image_url = data['image_url']
    
    db.session.commit()
    return jsonify(category.to_dict())

@app.route('/api/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    category = db.session.get(Category, id)
    if category is None:
        return jsonify({'error': 'Category not found'}), 404
    
    db.session.delete(category)
    db.session.commit()
    return '', 204

# Brands Routes
@app.route('/api/brands', methods=['GET'])
def get_brands():
    brands = Brand.query.all()
    return jsonify([brand.to_dict() for brand in brands])

@app.route('/api/brands/<int:id>', methods=['GET'])
def get_brand(id):
    brand = db.session.get(Brand, id)
    if brand is None:
        return jsonify({'error': 'Brand not found'}), 404
    return jsonify(brand.to_dict())

@app.route('/api/brands', methods=['POST'])
def create_brand():
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Brand name is required'}), 400
    
    brand = Brand(
        name=data['name'],
        slug=data.get('slug', data['name'].lower().replace(' ', '-')),
        description=data.get('description'),
        logo_url=data.get('logo_url')
    )
    
    db.session.add(brand)
    db.session.commit()
    return jsonify(brand.to_dict()), 201

@app.route('/api/brands/<int:id>', methods=['PUT'])
def update_brand(id):
    brand = db.session.get(Brand, id)
    if brand is None:
        return jsonify({'error': 'Brand not found'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        brand.name = data['name']
        if 'slug' not in data:
            brand.slug = data['name'].lower().replace(' ', '-')
    if 'slug' in data:
        brand.slug = data['slug']
    if 'description' in data:
        brand.description = data['description']
    if 'logo_url' in data:
        brand.logo_url = data['logo_url']
    
    db.session.commit()
    return jsonify(brand.to_dict())

@app.route('/api/brands/<int:id>', methods=['DELETE'])
def delete_brand(id):
    brand = db.session.get(Brand, id)
    if brand is None:
        return jsonify({'error': 'Brand not found'}), 404
    
    db.session.delete(brand)
    db.session.commit()
    return '', 204

# Reviews Routes
@app.route('/api/products/<int:id>/reviews', methods=['GET'])
def get_product_reviews(id):
    product = db.session.get(Product, id)
    if product is None:
        return jsonify({'error': 'Product not found'}), 404
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)
    
    query = Review.query.filter_by(product_id=id)
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    reviews = pagination.items
    
    return jsonify({
        'reviews': [review.to_dict() for review in reviews],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
        'per_page': per_page
    })

@app.route('/api/products/<int:id>/reviews', methods=['POST'])
def create_product_review(id):
    product = db.session.get(Product, id)
    if product is None:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    
    # Validate review data
    is_valid, error_message = validate_review_data(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    review = Review(
        product_id=id,
        user=data['user'],
        avatar=data.get('avatar'),
        title=data['title'],
        comment=data['comment'],
        rating=data['rating']
    )
    
    db.session.add(review)
    
    # Update product rating
    product.review_count = Review.query.filter_by(product_id=id).count() + 1
    avg_rating = db.session.query(db.func.avg(Review.rating)).filter_by(product_id=id).scalar()
    product.rating = avg_rating if avg_rating else data['rating']
    
    db.session.commit()
    return jsonify(review.to_dict()), 201

@app.route('/api/products/<int:id>/reviews/<int:review_id>', methods=['PUT'])
def update_product_review(id, review_id):
    review = Review.query.filter_by(id=review_id, product_id=id).first()
    if review is None:
        return jsonify({'error': 'Review not found'}), 404
    
    data = request.get_json()
    
    # Validate rating if provided
    if 'rating' in data:
        try:
            rating = int(data['rating'])
            if rating < 1 or rating > 5:
                return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid rating format'}), 400
    
    # Update review
    for key, value in data.items():
        setattr(review, key, value)
    
    # Update product rating
    avg_rating = db.session.query(db.func.avg(Review.rating)).filter_by(product_id=id).scalar()
    product = db.session.get(Product, id)
    if product:
        product.rating = avg_rating if avg_rating else None
    
    db.session.commit()
    return jsonify(review.to_dict())

@app.route('/api/products/<int:id>/reviews/<int:review_id>', methods=['DELETE'])
def delete_product_review(id, review_id):
    review = Review.query.filter_by(id=review_id, product_id=id).first()
    if review is None:
        return jsonify({'error': 'Review not found'}), 404
    
    db.session.delete(review)
    
    # Update product rating
    product = db.session.get(Product, id)
    if product:
        product.review_count = Review.query.filter_by(product_id=id).count() - 1
        avg_rating = db.session.query(db.func.avg(Review.rating)).filter_by(product_id=id).scalar()
        product.rating = avg_rating if avg_rating else None
    
    db.session.commit()
    return '', 204

# ProductImage Routes
@app.route('/api/products/<int:product_id>/images', methods=['GET'])
def get_product_images(product_id):
    images = ProductImage.query.filter_by(product_id=product_id).order_by(ProductImage.display_order).all()
    return jsonify([image.to_dict() for image in images])

@app.route('/api/products/<int:product_id>/images', methods=['POST'])
def create_product_image(product_id):
    product = db.session.get(Product, product_id)
    if product is None:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    
    # Validate image data
    is_valid, error_message = validate_image_data(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    image = ProductImage(
        product_id=product_id,
        image_url=data['image_url'],
        is_primary=data.get('is_primary', False),
        display_order=data.get('display_order', 0)
    )
    
    db.session.add(image)
    db.session.commit()
    return jsonify(image.to_dict()), 201

@app.route('/api/products/<int:product_id>/images/<int:image_id>', methods=['PUT'])
def update_product_image(product_id, image_id):
    image = ProductImage.query.filter_by(id=image_id, product_id=product_id).first()
    if image is None:
        return jsonify({'error': 'Image not found'}), 404
    
    data = request.get_json()
    
    # Validate image data
    is_valid, error_message = validate_image_data(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    # Update image
    for key, value in data.items():
        setattr(image, key, value)
    
    db.session.commit()
    return jsonify(image.to_dict())

@app.route('/api/products/<int:product_id>/images/<int:image_id>', methods=['DELETE'])
def delete_product_image(product_id, image_id):
    image = ProductImage.query.filter_by(id=image_id, product_id=product_id).first()
    if image is None:
        return jsonify({'error': 'Image not found'}), 404
    
    db.session.delete(image)
    db.session.commit()
    return '', 204

# ProductSpecification Routes
@app.route('/api/products/<int:product_id>/specifications', methods=['GET'])
def get_product_specifications(product_id):
    specifications = ProductSpecification.query.filter_by(product_id=product_id).order_by(ProductSpecification.display_order).all()
    return jsonify([spec.to_dict() for spec in specifications])

@app.route('/api/products/<int:product_id>/specifications', methods=['POST'])
def create_product_specification(product_id):
    product = db.session.get(Product, product_id)
    if product is None:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    
    # Validate specification data
    is_valid, error_message = validate_specification_data(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    specification = ProductSpecification(
        product_id=product_id,
        name=data['name'],
        value=data['value'],
        display_order=data.get('display_order', 0)
    )
    
    db.session.add(specification)
    db.session.commit()
    return jsonify(specification.to_dict()), 201

@app.route('/api/products/<int:product_id>/specifications/<int:spec_id>', methods=['PUT'])
def update_product_specification(product_id, spec_id):
    specification = ProductSpecification.query.filter_by(id=spec_id, product_id=product_id).first()
    if specification is None:
        return jsonify({'error': 'Specification not found'}), 404
    
    data = request.get_json()
    
    # Validate specification data
    is_valid, error_message = validate_specification_data(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    # Update specification
    for key, value in data.items():
        setattr(specification, key, value)
    
    db.session.commit()
    return jsonify(specification.to_dict())

@app.route('/api/products/<int:product_id>/specifications/<int:spec_id>', methods=['DELETE'])
def delete_product_specification(product_id, spec_id):
    specification = ProductSpecification.query.filter_by(id=spec_id, product_id=product_id).first()
    if specification is None:
        return jsonify({'error': 'Specification not found'}), 404
    
    db.session.delete(specification)
    db.session.commit()
    return '', 204

# ProductFeature Routes
@app.route('/api/products/<int:product_id>/features', methods=['GET'])
def get_product_features(product_id):
    features = ProductFeature.query.filter_by(product_id=product_id).order_by(ProductFeature.display_order).all()
    return jsonify([feature.to_dict() for feature in features])

@app.route('/api/products/<int:product_id>/features', methods=['POST'])
def create_product_feature(product_id):
    product = db.session.get(Product, product_id)
    if product is None:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    
    # Validate feature data
    is_valid, error_message = validate_feature_data(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    feature = ProductFeature(
        product_id=product_id,
        feature=data['feature'],
        display_order=data.get('display_order', 0)
    )
    
    db.session.add(feature)
    db.session.commit()
    return jsonify(feature.to_dict()), 201

@app.route('/api/products/<int:product_id>/features/<int:feature_id>', methods=['PUT'])
def update_product_feature(product_id, feature_id):
    feature = ProductFeature.query.filter_by(id=feature_id, product_id=product_id).first()
    if feature is None:
        return jsonify({'error': 'Feature not found'}), 404
    
    data = request.get_json()
    
    # Validate feature data
    is_valid, error_message = validate_feature_data(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    # Update feature
    for key, value in data.items():
        setattr(feature, key, value)
    
    db.session.commit()
    return jsonify(feature.to_dict())

@app.route('/api/products/<int:product_id>/features/<int:feature_id>', methods=['DELETE'])
def delete_product_feature(product_id, feature_id):
    feature = ProductFeature.query.filter_by(id=feature_id, product_id=product_id).first()
    if feature is None:
        return jsonify({'error': 'Feature not found'}), 404
    
    db.session.delete(feature)
    db.session.commit()
    return '', 204

# Cart Routes
@app.route('/api/cart', methods=['GET'])
def get_cart():
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({'error': 'Session ID is required'}), 400
    
    cart = Cart.query.filter_by(session_id=session_id).first()
    if not cart:
        cart = Cart(session_id=session_id)
        db.session.add(cart)
        db.session.commit()
    
    return jsonify(cart.to_dict())

@app.route('/api/cart/items', methods=['POST'])
def add_to_cart():
    print("Received add_to_cart request")
    session_id = request.args.get('session_id')
    print(f"Session ID: {session_id}")
    
    if not session_id:
        return jsonify({'error': 'Session ID is required'}), 400
    
    data = request.get_json()
    print(f"Request data: {data}")
    
    if not data or 'product_id' not in data or 'quantity' not in data:
        return jsonify({'error': 'Product ID and quantity are required'}), 400
    
    cart = Cart.query.filter_by(session_id=session_id).first()
    print(f"Existing cart: {cart}")
    
    if not cart:
        print("Creating new cart")
        cart = Cart(session_id=session_id)
        db.session.add(cart)
        db.session.commit()
        print(f"New cart created with ID: {cart.id}")
    
    # Check if product exists
    product = Product.query.get(data['product_id'])
    print(f"Product found: {product}")
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    # Check if item already in cart
    cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=data['product_id']).first()
    print(f"Existing cart item: {cart_item}")
    
    if cart_item:
        print(f"Updating quantity from {cart_item.quantity} to {cart_item.quantity + data['quantity']}")
        cart_item.quantity += data['quantity']
    else:
        print("Creating new cart item")
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=data['product_id'],
            quantity=data['quantity']
        )
        db.session.add(cart_item)
    
    try:
        db.session.commit()
        print("Successfully committed changes to database")
    except Exception as e:
        print(f"Error committing to database: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to update cart'}), 500
    
    return jsonify(cart.to_dict())

@app.route('/api/cart/items/<int:item_id>', methods=['PUT'])
def update_cart_item(item_id):
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({'error': 'Session ID is required'}), 400
    
    data = request.get_json()
    if not data or 'quantity' not in data:
        return jsonify({'error': 'Quantity is required'}), 400
    
    cart = Cart.query.filter_by(session_id=session_id).first()
    if not cart:
        return jsonify({'error': 'Cart not found'}), 404
    
    cart_item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first()
    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404
    
    cart_item.quantity = data['quantity']
    db.session.commit()
    return jsonify(cart.to_dict())

@app.route('/api/cart/items/<int:item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({'error': 'Session ID is required'}), 400
    
    cart = Cart.query.filter_by(session_id=session_id).first()
    if not cart:
        return jsonify({'error': 'Cart not found'}), 404
    
    cart_item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first()
    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404
    
    db.session.delete(cart_item)
    db.session.commit()
    return jsonify(cart.to_dict())

@app.route('/api/cart', methods=['DELETE'])
def clear_cart():
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({'error': 'Session ID is required'}), 400
    
    cart = Cart.query.filter_by(session_id=session_id).first()
    if not cart:
        return jsonify({'error': 'Cart not found'}), 404
    
    CartItem.query.filter_by(cart_id=cart.id).delete()
    db.session.commit()
    return jsonify(cart.to_dict())

# Delivery Locations Routes
@app.route('/api/delivery-locations', methods=['GET'])
def get_delivery_locations():
    locations = DeliveryLocation.query.filter_by(is_active=True).order_by(DeliveryLocation.city, DeliveryLocation.name).all()
    return jsonify([location.to_dict() for location in locations])

@app.route('/api/delivery-locations/<int:id>', methods=['GET'])
def get_delivery_location(id):
    location = DeliveryLocation.query.get(id)
    if not location:
        return jsonify({'error': 'Delivery location not found'}), 404
    return jsonify(location.to_dict())

# Order Routes
@app.route('/api/orders', methods=['POST'])
def create_order():
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({'error': 'Session ID is required'}), 400

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Order data is required'}), 400

    print("Received order data:", data)

    # Get cart items
    cart = Cart.query.filter_by(session_id=session_id).first()
    if not cart or not cart.items:
        return jsonify({'error': 'Cart is empty'}), 400

    # Calculate totals
    subtotal = sum(item.product.price * item.quantity for item in cart.items)
    
    # Validate delivery location
    delivery_location_id = data.get('delivery_location_id')
    if not delivery_location_id:
        return jsonify({'error': 'Delivery location is required'}), 400
        
    delivery_location = DeliveryLocation.query.get(delivery_location_id)
    if not delivery_location:
        print(f"Delivery location not found for ID: {delivery_location_id}")
        return jsonify({'error': 'Invalid delivery location'}), 400
    
    shipping_cost = delivery_location.shipping_price
    total_amount = subtotal + shipping_cost

    # Generate order number
    order_number = f"ORD-{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}-{cart.id}"

    try:
        # Create order
        order = Order(
            order_number=order_number,
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone=data['phone'],
            address=data['address'],
            city=data['city'],
            state=data['state'],
            postal_code=data['postal_code'],
            total_amount=total_amount,
            shipping_cost=shipping_cost,
            status='pending',
            payment_status='pending',
            notes=data.get('notes')
        )

        # Create order items
        for cart_item in cart.items:
            order_item = OrderItem(
                order=order,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
            db.session.add(order_item)

        db.session.add(order)
        db.session.commit()

        # Clear the cart after successful order creation
        CartItem.query.filter_by(cart_id=cart.id).delete()
        db.session.commit()

        return jsonify(order.to_dict()), 201
    except Exception as e:
        print(f"Error creating order: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders', methods=['GET'])
def get_orders():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status = request.args.get('status')

    query = Order.query

    if status and status != 'all':
        query = query.filter(Order.status == status)

    query = query.order_by(Order.created_at.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'orders': [order.to_dict() for order in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
        'per_page': per_page
    })

@app.route('/api/orders/<int:id>', methods=['GET'])
def get_order(id):
    order = Order.query.get_or_404(id)
    return jsonify(order.to_dict())

@app.route('/api/orders/<int:id>/status', methods=['PATCH'])
def update_order_status(id):
    order = Order.query.get_or_404(id)
    data = request.get_json()
    
    if 'status' not in data:
        return jsonify({'error': 'Status is required'}), 400
        
    valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if data['status'] not in valid_statuses:
        return jsonify({'error': 'Invalid status'}), 400
        
    order.status = data['status']
    db.session.commit()
    
    return jsonify(order.to_dict())

@app.route('/api/orders/<int:id>/payment-status', methods=['PATCH'])
def update_payment_status(id):
    order = Order.query.get_or_404(id)
    data = request.get_json()
    
    if 'payment_status' not in data:
        return jsonify({'error': 'Payment status is required'}), 400
        
    valid_statuses = ['pending', 'paid', 'failed']
    if data['payment_status'] not in valid_statuses:
        return jsonify({'error': 'Invalid payment status'}), 400
        
    order.payment_status = data['payment_status']
    db.session.commit()
    
    return jsonify(order.to_dict())

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True) 