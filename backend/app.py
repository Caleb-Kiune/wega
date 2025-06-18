from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import os
from models import db, Product, Category, Brand, ProductImage, ProductSpecification, ProductFeature, Review, Cart, CartItem, DeliveryLocation, Order, OrderItem
from sqlalchemy import or_, and_
from decimal import Decimal
import datetime
from dotenv import load_dotenv

app = Flask(__name__, static_folder='static')

# Configure CORS with specific settings
CORS(app, 
     resources={r"/*": {
         "origins": ["http://localhost:3000"],
         "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True
     }})

# Add request logging
@app.before_request
def log_request_info():
    print('Headers:', dict(request.headers))
    print('Body:', request.get_data())
    print('Args:', request.args)
    print('Method:', request.method)
    print('URL:', request.url)

# Add error handling
@app.errorhandler(Exception)
def handle_error(error):
    response = {
        "error": str(error),
        "message": "An error occurred while processing your request"
    }
    return jsonify(response), getattr(error, 'code', 500)

# Database configuration
load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))
db_url = os.getenv('DATABASE_URL')
if db_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
else:
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
    per_page = request.args.get('limit', 36, type=int)  # Default to 36 products per page
    
    # Enforce maximum limit for performance
    if per_page > 48:
        per_page = 48
    
    # Get multiple categories and brands
    categories = request.args.getlist('categories[]')
    brands = request.args.getlist('brands[]')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    
    # Parse boolean parameters
    is_featured = request.args.get('is_featured')
    is_new = request.args.get('is_new')
    is_sale = request.args.get('is_sale')
    
    # Convert string boolean values to actual booleans
    is_featured = is_featured.lower() == 'true' if is_featured is not None else False
    is_new = is_new.lower() == 'true' if is_new is not None else False
    is_sale = is_sale.lower() == 'true' if is_sale is not None else False

    # Log filter parameters
    print("\n=== API Request Details ===")
    print("Filter Parameters:")
    print(f"  is_featured: {is_featured} (type: {type(is_featured)})")
    print(f"  is_new: {is_new} (type: {type(is_new)})")
    print(f"  is_sale: {is_sale} (type: {type(is_sale)})")
    print(f"  categories: {categories}")
    print(f"  brands: {brands}")
    print(f"  page: {page}")
    print(f"  per_page: {per_page}")

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
    
    # Apply boolean filters - only filter if explicitly set to True
    if is_featured:
        query = query.filter(Product.is_featured == True)
    if is_new:
        query = query.filter(Product.is_new == True)
    if is_sale:
        query = query.filter(Product.is_sale == True)

    # Default sorting by creation date (newest first)
    query = query.order_by(Product.created_at.desc())

    # Get paginated results
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    products = pagination.items

    # Log the product data
    print("\nProduct Data:")
    for product in products:
        print(f"\nProduct {product.id} - {product.name}:")
        print(f"  is_featured: {product.is_featured} (type: {type(product.is_featured)})")
        print(f"  is_new: {product.is_new} (type: {type(product.is_new)})")
        print(f"  is_sale: {product.is_sale} (type: {type(product.is_sale)})")
        print(f"  created_at: {product.created_at}")
        print(f"  category: {product.category.name if product.category else 'None'}")
        print(f"  brand: {product.brand.name if product.brand else 'None'}")

    # Additional validation for featured products
    if is_featured:
        non_featured = [p for p in products if not p.is_featured]
        if non_featured:
            print("\nWARNING: Non-featured products found in featured products response:")
            for p in non_featured:
                print(f"  - {p.id}: {p.name} (is_featured: {p.is_featured})")

    print("\n=== End API Request Details ===\n")

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
    try:
        print("\n=== Creating New Product ===")
        data = request.get_json()
        print(f"Received data: {data}")
        
        # Validate product data
        is_valid, error_message = validate_product_data(data)
        if not is_valid:
            print(f"Validation failed: {error_message}")
            return jsonify({'error': error_message}), 400
        
        print("Creating product with data:", data)
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
            is_sale=data.get('is_sale', False),
            is_featured=data.get('is_featured', False)
        )
        
        print("Adding product to session")
        db.session.add(product)
        print("Flushing session to get product ID")
        db.session.flush()  # Get the product ID
        
        # Add images
        if 'images' in data:
            print("Processing images")
            for image_data in data['images']:
                is_valid, error_message = validate_image_data(image_data)
                if not is_valid:
                    print(f"Image validation failed: {error_message}")
                    db.session.rollback()
                    return jsonify({'error': error_message}), 400
                image = ProductImage(
                    product_id=product.id,
                    image_url=image_data['image_url'],
                    is_primary=image_data.get('is_primary', False),
                    display_order=image_data.get('display_order', 0)
                )
                db.session.add(image)
        
        print("Committing to database")
        db.session.commit()
        print("Product created successfully")
        return jsonify(product.to_dict()), 201
    except Exception as e:
        print(f"Error creating product: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<int:id>', methods=['PUT'])
def update_product(id):
    try:
        product = Product.query.get_or_404(id)
        data = request.get_json()

        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'Product name is required'}), 400
        if not data.get('price') or float(data['price']) < 0:
            return jsonify({'error': 'Valid price is required'}), 400
        if not data.get('stock') or int(data['stock']) < 0:
            return jsonify({'error': 'Valid stock quantity is required'}), 400

        # Update basic fields
        product.name = data.get('name', product.name)
        product.description = data.get('description', product.description)
        product.price = float(data.get('price', product.price))
        product.original_price = float(data['original_price']) if data.get('original_price') else None
        product.sku = data.get('sku', product.sku)
        product.stock = int(data.get('stock', product.stock))
        product.is_new = bool(data.get('is_new', product.is_new))
        product.is_sale = bool(data.get('is_sale', product.is_sale))
        product.is_featured = bool(data.get('is_featured', product.is_featured))
        
        # Update brand and category if provided
        if 'brand_id' in data:
            brand = Brand.query.get(data['brand_id'])
            if not brand:
                return jsonify({'error': 'Invalid brand ID'}), 400
            product.brand_id = data['brand_id']
            
        if 'category_id' in data:
            category = Category.query.get(data['category_id'])
            if not category:
                return jsonify({'error': 'Invalid category ID'}), 400
            product.category_id = data['category_id']

        # Update related data
        if 'images' in data:
            # Validate images data
            for img_data in data['images']:
                if not img_data.get('image_url'):
                    return jsonify({'error': 'Image URL is required for all images'}), 400

            # Clear existing images
            ProductImage.query.filter_by(product_id=id).delete()
            # Add new images
            for img_data in data['images']:
                new_image = ProductImage(
                    product_id=id,
                    image_url=img_data['image_url'],
                    is_primary=bool(img_data.get('is_primary', False)),
                    display_order=int(img_data.get('display_order', 0))
                )
                db.session.add(new_image)

        if 'specifications' in data:
            # Validate specifications data
            for spec_data in data['specifications']:
                if not spec_data.get('name') or not spec_data.get('value'):
                    return jsonify({'error': 'Name and value are required for all specifications'}), 400

            # Clear existing specifications
            ProductSpecification.query.filter_by(product_id=id).delete()
            # Add new specifications
            for spec_data in data['specifications']:
                new_spec = ProductSpecification(
                    product_id=id,
                    name=spec_data['name'],
                    value=spec_data['value'],
                    display_order=int(spec_data.get('display_order', 0))
                )
                db.session.add(new_spec)

        if 'features' in data:
            # Validate features data
            for feature_data in data['features']:
                if not feature_data.get('feature'):
                    return jsonify({'error': 'Feature text is required for all features'}), 400

            # Clear existing features
            ProductFeature.query.filter_by(product_id=id).delete()
            # Add new features
            for feature_data in data['features']:
                new_feature = ProductFeature(
                    product_id=id,
                    feature=feature_data['feature'],
                    display_order=int(feature_data.get('display_order', 0))
                )
                db.session.add(new_feature)

        db.session.commit()
        return jsonify(product.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = db.session.get(Product, id)
    if product is None:
        return jsonify({'error': 'Product not found'}), 404
    
    # Check if product has associated orders
    order_items = OrderItem.query.filter_by(product_id=id).first()
    if order_items:
        return jsonify({
            'error': 'Cannot delete product because it has associated orders. Please archive the product instead.'
        }), 400
    
    try:
        db.session.delete(product)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

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
    search = request.args.get('search')

    query = Order.query

    if status and status != 'all':
        query = query.filter(Order.status == status)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            db.or_(
                Order.order_number.ilike(search_term),
                Order.first_name.ilike(search_term),
                Order.last_name.ilike(search_term),
                Order.email.ilike(search_term)
            )
        )

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

@app.route('/api/orders/<int:id>/status', methods=['PATCH', 'POST'])
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

@app.route('/api/orders/track', methods=['POST'])
def track_order():
    data = request.get_json()
    order_number = data.get('order_number')
    email = data.get('email')

    if not order_number or not email:
        return jsonify({'error': 'Order number and email are required'}), 400

    order = Order.query.filter_by(
        order_number=order_number,
        email=email
    ).first()

    if not order:
        return jsonify({'error': 'Order not found'}), 404

    return jsonify(order.to_dict())

@app.route('/api/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    try:
        order = Order.query.get(id)
        if order is None:
            return jsonify({'error': 'Order not found'}), 404
            
        # Delete associated order items first
        OrderItem.query.filter_by(order_id=id).delete()
        
        # Delete the order
        db.session.delete(order)
        db.session.commit()
        
        return jsonify({'message': 'Order deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True) 