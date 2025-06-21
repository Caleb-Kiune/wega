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
from sqlalchemy.orm import joinedload
from werkzeug.utils import secure_filename
import uuid
import mimetypes

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

# Upload configuration
UPLOAD_FOLDER = os.path.join(basedir, 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# Environment-specific configuration
ENVIRONMENT = os.getenv('FLASK_ENV', 'development')
if ENVIRONMENT == 'production':
    # In production, use the actual domain from environment variable
    BASE_URL = os.getenv('BASE_URL', 'https://your-domain.com')
else:
    # In development, use request.host_url
    BASE_URL = None

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Check if the file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_image_file(file):
    """Validate image file more thoroughly"""
    # Check file extension
    if not allowed_file(file.filename):
        return False, f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
    
    # Check file size
    file.seek(0, 2)  # Seek to end
    file_size = file.tell()
    file.seek(0)  # Reset to beginning
    
    if file_size > MAX_FILE_SIZE:
        return False, f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB"
    
    if file_size == 0:
        return False, "File is empty"
    
    # Check MIME type (additional security)
    if file.content_type:
        allowed_mimes = {
            'image/jpeg', 'image/jpg', 'image/png', 
            'image/gif', 'image/webp'
        }
        if file.content_type not in allowed_mimes:
            return False, f"Invalid MIME type: {file.content_type}"
    
    return True, None

def generate_unique_filename(original_filename):
    """Generate a unique filename to prevent conflicts"""
    # Get the file extension
    ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''
    
    # Generate a unique filename with timestamp and UUID
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    unique_id = str(uuid.uuid4())[:8]
    
    if ext:
        return f"{timestamp}_{unique_id}.{ext}"
    else:
        return f"{timestamp}_{unique_id}"

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

# Serve uploaded files
@app.route('/static/uploads/<path:filename>')
def serve_upload(filename):
    """Serve uploaded files from the uploads directory"""
    return send_from_directory(UPLOAD_FOLDER, filename)

# Image upload route
@app.route('/api/upload', methods=['POST'])
def upload_image():
    """
    Handle image uploads for the admin dashboard
    Accepts multipart/form-data with a 'file' field
    Returns the public URL of the uploaded image
    """
    try:
        print("=== Image Upload Request ===")
        print(f"Request method: {request.method}")
        print(f"Content-Type: {request.content_type}")
        print(f"Files in request: {list(request.files.keys())}")
        
        # Check if file is present in request
        if 'file' not in request.files:
            print("Error: No file part in request")
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        print(f"File received: {file.filename}")
        print(f"File content type: {file.content_type}")
        
        # Check if file was actually selected
        if file.filename == '':
            print("Error: No file selected")
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file using improved validation
        is_valid, error_message = validate_image_file(file)
        if not is_valid:
            print(f"Error: {error_message}")
            return jsonify({'error': error_message}), 400
        
        # Get file size for response
        file.seek(0, 2)  # Seek to end to get file size
        file_size = file.tell()
        file.seek(0)  # Reset to beginning
        
        print(f"File size: {file_size} bytes ({file_size / (1024*1024):.2f} MB)")
        
        # Secure the filename and generate unique name
        original_filename = secure_filename(file.filename)
        unique_filename = generate_unique_filename(original_filename)
        
        print(f"Original filename: {original_filename}")
        print(f"Unique filename: {unique_filename}")
        
        # Save the file
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        print(f"Saving file to: {file_path}")
        
        file.save(file_path)
        
        # Verify file was saved
        if not os.path.exists(file_path):
            print("Error: File was not saved successfully")
            return jsonify({'error': 'Failed to save file'}), 500
        
        # Generate public URL
        # In production, this should use the actual domain
        if BASE_URL:
            public_url = f"{BASE_URL}/static/uploads/{unique_filename}"
        else:
            public_url = f"http://{request.host}/static/uploads/{unique_filename}"
        
        print(f"File uploaded successfully: {unique_filename}")
        print(f"Public URL: {public_url}")
        print("=== End Image Upload Request ===\n")
        
        return jsonify({
            'success': True,
            'url': public_url,
            'filename': unique_filename,
            'original_name': original_filename,
            'size': file_size
        }), 201
        
    except Exception as e:
        print(f"Upload error: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({'error': 'Failed to upload file'}), 500

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

    # Base query with joins and eager loading
    query = Product.query.options(
        joinedload(Product.images),
        joinedload(Product.specifications),
        joinedload(Product.features),
        joinedload(Product.reviews),
        joinedload(Product.category),
        joinedload(Product.brand)
    ).join(Category).join(Brand)

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

    # Limit related data for product list (only primary image, summary info)
    def product_list_dict(product):
        primary_image = next((img.image_url for img in product.images if img.is_primary), product.images[0].image_url if product.images else None)
        return {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': float(product.price) if product.price else None,
            'original_price': float(product.original_price) if product.original_price else None,
            'image_url': primary_image,
            'images': [img.to_dict() for img in product.images],  # Include all images for frontend
            'is_new': product.is_new,
            'is_sale': product.is_sale,
            'is_featured': product.is_featured,
            'category': product.category.name if product.category else None,
            'brand': product.brand.name if product.brand else None,
            'rating': float(product.rating) if product.rating else None,
            'review_count': product.review_count,
            'stock': product.stock,
            'sku': product.sku,
            # Only summary info for features/specs/reviews
            'features': [f.feature for f in product.features[:3]],
            'specifications': [{ 'name': s.name, 'value': s.value } for s in product.specifications[:3]],
            'reviews': [r.to_dict() for r in product.reviews[:1]]
        }

    return jsonify({
        'products': [product_list_dict(product) for product in products],
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
        
        # Add specifications
        if 'specifications' in data:
            print("Processing specifications")
            print(f"Number of specifications to process: {len(data['specifications'])}")
            
            # Validate specifications data
            for i, spec_data in enumerate(data['specifications']):
                print(f"Validating specification {i}: {spec_data}")
                if not spec_data.get('name') or not spec_data.get('value'):
                    print(f"❌ Validation failed for specification {i}: missing name or value")
                    return jsonify({'error': 'Name and value are required for all specifications'}), 400
                print(f"✅ Specification {i} validation passed")

            # Create new specifications (no existing ones during creation)
            for i, spec_data in enumerate(data['specifications']):
                print(f"🆕 Creating new specification: {spec_data['name']} = {spec_data['value']}")
                new_spec = ProductSpecification(
                    product_id=product.id,
                    name=spec_data['name'],
                    value=spec_data['value'],
                    display_order=int(spec_data.get('display_order', 0))
                )
                db.session.add(new_spec)
                print(f"✅ Created new specification: {spec_data['name']} = {spec_data['value']}")

        # Add features
        if 'features' in data:
            print(f"Processing features")
            print(f"Number of features to process: {len(data['features'])}")
            
            # Validate features data
            for i, feature_data in enumerate(data['features']):
                print(f"Validating feature {i}: {feature_data}")
                if not feature_data.get('feature'):
                    print(f"❌ Validation failed for feature {i}: missing feature text")
                    return jsonify({'error': 'Feature text is required for all features'}), 400
                print(f"✅ Feature {i} validation passed")

            # Create new features (no existing ones during creation)
            for i, feature_data in enumerate(data['features']):
                print(f"🆕 Creating new feature: {feature_data['feature']}")
                new_feature = ProductFeature(
                    product_id=product.id,
                    feature=feature_data['feature'],
                    display_order=int(feature_data.get('display_order', 0))
                )
                db.session.add(new_feature)
                print(f"✅ Created new feature: {feature_data['feature']}")

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
        print(f"\n=== Updating Product {id} ===")
        product = Product.query.get_or_404(id)
        data = request.get_json()
        print(f"Received data: {data}")

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
            print(f"Processing images: {data['images']}")
            # Validate images data
            for img_data in data['images']:
                if not img_data.get('image_url'):
                    return jsonify({'error': 'Image URL is required for all images'}), 400

            # Handle images - update existing ones and create new ones
            existing_image_ids = set()
            for img_data in data['images']:
                if img_data.get('id'):
                    # Update existing image
                    existing_image = ProductImage.query.get(img_data['id'])
                    if existing_image and existing_image.product_id == id:
                        existing_image.image_url = img_data['image_url']
                        existing_image.is_primary = bool(img_data.get('is_primary', False))
                        existing_image.display_order = int(img_data.get('display_order', 0))
                        existing_image_ids.add(existing_image.id)
                        print(f"Updated existing image {existing_image.id}: {img_data['image_url']}")
                    else:
                        return jsonify({'error': f'Invalid image ID: {img_data["id"]}'}), 400
                else:
                    # Create new image
                    new_image = ProductImage(
                        product_id=id,
                        image_url=img_data['image_url'],
                        is_primary=bool(img_data.get('is_primary', False)),
                        display_order=int(img_data.get('display_order', 0))
                    )
                    db.session.add(new_image)
                    print(f"Created new image: {img_data['image_url']}")
            
            # Only delete images if there are existing ones
            if existing_image_ids:
                ProductImage.query.filter(
                    ProductImage.product_id == id,
                    ~ProductImage.id.in_(existing_image_ids)
                ).delete(synchronize_session=False)
                print(f"Deleted images not in list. Kept: {existing_image_ids}")

        if 'specifications' in data:
            print(f"Processing specifications: {data['specifications']}")
            print(f"Number of specifications to process: {len(data['specifications'])}")
            
            # Validate specifications data
            for i, spec_data in enumerate(data['specifications']):
                print(f"Validating specification {i}: {spec_data}")
                if not spec_data.get('name') or not spec_data.get('value'):
                    print(f"❌ Validation failed for specification {i}: missing name or value")
                    return jsonify({'error': 'Name and value are required for all specifications'}), 400
                print(f"✅ Specification {i} validation passed")

            # Handle specifications - update existing ones and create new ones
            existing_spec_ids = set()
            for i, spec_data in enumerate(data['specifications']):
                print(f"Processing specification {i}: {spec_data}")
                if spec_data.get('id'):
                    # Update existing specification
                    existing_spec = ProductSpecification.query.get(spec_data['id'])
                    if existing_spec and existing_spec.product_id == id:
                        existing_spec.name = spec_data['name']
                        existing_spec.value = spec_data['value']
                        existing_spec.display_order = int(spec_data.get('display_order', 0))
                        existing_spec_ids.add(existing_spec.id)
                        print(f"✅ Updated existing specification {existing_spec.id}: {spec_data['name']} = {spec_data['value']}")
                    else:
                        print(f"❌ Invalid specification ID: {spec_data['id']}")
                        return jsonify({'error': f'Invalid specification ID: {spec_data["id"]}'}), 400
                else:
                    # Create new specification
                    print(f"🆕 Creating new specification: {spec_data['name']} = {spec_data['value']}")
                    new_spec = ProductSpecification(
                        product_id=id,
                        name=spec_data['name'],
                        value=spec_data['value'],
                        display_order=int(spec_data.get('display_order', 0))
                    )
                    db.session.add(new_spec)
                    print(f"✅ Created new specification: {spec_data['name']} = {spec_data['value']}")
            
            # Delete specifications that are no longer in the list
            # Only delete if there are existing specifications to check against
            if existing_spec_ids:
                ProductSpecification.query.filter(
                    ProductSpecification.product_id == id,
                    ~ProductSpecification.id.in_(existing_spec_ids)
                ).delete(synchronize_session=False)
                print(f"🗑️ Deleted specifications not in list. Kept: {existing_spec_ids}")
            else:
                # If no existing specifications were updated, delete all old ones
                # But only if we're not adding new ones
                if not any(not spec_data.get('id') for spec_data in data['specifications']):
                    deleted_count = ProductSpecification.query.filter_by(product_id=id).delete()
                    print(f"🗑️ Deleted {deleted_count} old specifications")

        if 'features' in data:
            print(f"Processing features: {data['features']}")
            print(f"Number of features to process: {len(data['features'])}")
            
            # Validate features data
            for i, feature_data in enumerate(data['features']):
                print(f"Validating feature {i}: {feature_data}")
                if not feature_data.get('feature'):
                    print(f"❌ Validation failed for feature {i}: missing feature text")
                    return jsonify({'error': 'Feature text is required for all features'}), 400
                print(f"✅ Feature {i} validation passed")

            # Handle features - update existing ones and create new ones
            existing_feature_ids = set()
            for i, feature_data in enumerate(data['features']):
                print(f"Processing feature {i}: {feature_data}")
                if feature_data.get('id'):
                    # Update existing feature
                    existing_feature = ProductFeature.query.get(feature_data['id'])
                    if existing_feature and existing_feature.product_id == id:
                        existing_feature.feature = feature_data['feature']
                        existing_feature.display_order = int(feature_data.get('display_order', 0))
                        existing_feature_ids.add(existing_feature.id)
                        print(f"✅ Updated existing feature {existing_feature.id}: {feature_data['feature']}")
                    else:
                        print(f"❌ Invalid feature ID: {feature_data['id']}")
                        return jsonify({'error': f'Invalid feature ID: {feature_data["id"]}'}), 400
                else:
                    # Create new feature
                    print(f"🆕 Creating new feature: {feature_data['feature']}")
                    new_feature = ProductFeature(
                        product_id=id,
                        feature=feature_data['feature'],
                        display_order=int(feature_data.get('display_order', 0))
                    )
                    db.session.add(new_feature)
                    print(f"✅ Created new feature: {feature_data['feature']}")
            
            # Delete features that are no longer in the list
            # Only delete if there are existing features to check against
            if existing_feature_ids:
                ProductFeature.query.filter(
                    ProductFeature.product_id == id,
                    ~ProductFeature.id.in_(existing_feature_ids)
                ).delete(synchronize_session=False)
                print(f"🗑️ Deleted features not in list. Kept: {existing_feature_ids}")
            else:
                # If no existing features were updated, delete all old ones
                # But only if we're not adding new ones
                if not any(not feature_data.get('id') for feature_data in data['features']):
                    deleted_count = ProductFeature.query.filter_by(product_id=id).delete()
                    print(f"🗑️ Deleted {deleted_count} old features")

        print("Committing to database...")
        db.session.commit()
        print("Database commit successful")
        
        result = product.to_dict()
        print(f"Final product data: {result}")
        print("=== End Product Update ===\n")
        
        return jsonify(result), 200
    except Exception as e:
        print(f"Error updating product: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
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