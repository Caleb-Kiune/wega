from flask import Blueprint, jsonify, request, current_app
from sqlalchemy import or_, and_
from decimal import Decimal
from models import db, Product, Category, Brand, ProductImage, ProductSpecification, ProductFeature, Review
from utils.helpers import validate_product_data, validate_review_data, validate_image_data, validate_specification_data, validate_feature_data, paginate, format_image_url
from sqlalchemy.orm import joinedload

products_bp = Blueprint('products', __name__)

@products_bp.route('/api/products', methods=['GET'])
def get_products():
    """Get all products with optional filtering and pagination"""
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    brand = request.args.get('brand', '')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    sort_by = request.args.get('sort_by', 'name')
    sort_order = request.args.get('sort_order', 'asc')
    
    # Build query
    query = Product.query.options(
        joinedload(Product.category),
        joinedload(Product.brand),
        joinedload(Product.images),
        joinedload(Product.specifications),
        joinedload(Product.features),
        joinedload(Product.reviews)
    )
    
    # Apply filters
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term),
                Product.sku.ilike(search_term)
            )
        )
    
    if category:
        query = query.join(Category).filter(Category.slug == category)
    
    if brand:
        query = query.join(Brand).filter(Brand.slug == brand)
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    # Apply sorting
    if sort_by == 'price':
        if sort_order == 'desc':
            query = query.order_by(Product.price.desc())
        else:
            query = query.order_by(Product.price.asc())
    elif sort_by == 'rating':
        if sort_order == 'desc':
            query = query.order_by(Product.rating.desc())
        else:
            query = query.order_by(Product.rating.asc())
    elif sort_by == 'created_at':
        if sort_order == 'desc':
            query = query.order_by(Product.created_at.desc())
        else:
            query = query.order_by(Product.created_at.asc())
    else:  # default to name
        if sort_order == 'desc':
            query = query.order_by(Product.name.desc())
        else:
            query = query.order_by(Product.name.asc())
    
    # Paginate results
    pagination = paginate(query, page, per_page)
    
    def product_list_dict(product):
        # Get the primary image URL
        primary_image = next((img.image_url for img in product.images if img.is_primary), 
                           product.images[0].image_url if product.images else None)
        
        # Format image URL
        if primary_image:
            primary_image = format_image_url(primary_image)
        
        return {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': float(product.price) if product.price else None,
            'original_price': float(product.original_price) if product.original_price else None,
            'image_url': primary_image,
            'is_new': product.is_new,
            'is_sale': product.is_sale,
            'is_featured': product.is_featured,
            'category': product.category.name if product.category else None,
            'brand': product.brand.name if product.brand else None,
            'rating': float(product.rating) if product.rating else None,
            'review_count': product.review_count,
            'stock': product.stock,
            'sku': product.sku
        }
    
    return jsonify({
        'products': [product_list_dict(product) for product in pagination.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': pagination.total,
            'pages': pagination.pages,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    })

@products_bp.route('/api/products/<int:id>', methods=['GET'])
def get_product(id):
    """Get a specific product by ID"""
    product = Product.query.options(
        joinedload(Product.category),
        joinedload(Product.brand),
        joinedload(Product.images),
        joinedload(Product.specifications),
        joinedload(Product.features),
        joinedload(Product.reviews)
    ).get_or_404(id)
    
    return jsonify(product.to_dict())

@products_bp.route('/api/products', methods=['POST'])
def create_product():
    """Create a new product"""
    data = request.get_json()
    
    # Validate product data
    is_valid, error_message = validate_product_data(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    try:
        # Create new product
        product = Product(
            name=data['name'],
            description=data.get('description'),
            price=Decimal(str(data['price'])),
            original_price=Decimal(str(data['original_price'])) if data.get('original_price') else None,
            sku=data.get('sku'),
            stock=data.get('stock'),
            is_new=data.get('is_new', False),
            is_sale=data.get('is_sale', False),
            is_featured=data.get('is_featured', False),
            category_id=data.get('category_id'),
            brand_id=data.get('brand_id')
        )
        
        db.session.add(product)
        db.session.flush()  # Get the product ID
        
        # Handle images
        if 'images' in data and isinstance(data['images'], list):
            for i, image_data in enumerate(data['images']):
                is_valid, error_message = validate_image_data(image_data)
                if not is_valid:
                    return jsonify({'error': error_message}), 400
                
                product_image = ProductImage(
                    product_id=product.id,
                    image_url=image_data['image_url'],
                    is_primary=image_data.get('is_primary', i == 0),  # First image is primary by default
                    display_order=image_data.get('display_order', i)
                )
                db.session.add(product_image)
        
        # Handle specifications
        if 'specifications' in data and isinstance(data['specifications'], list):
            for i, spec_data in enumerate(data['specifications']):
                is_valid, error_message = validate_specification_data(spec_data)
                if not is_valid:
                    return jsonify({'error': error_message}), 400
                
                product_spec = ProductSpecification(
                    product_id=product.id,
                    name=spec_data['name'],
                    value=spec_data['value'],
                    display_order=spec_data.get('display_order', i)
                )
                db.session.add(product_spec)
        
        # Handle features
        if 'features' in data and isinstance(data['features'], list):
            for i, feature_data in enumerate(data['features']):
                is_valid, error_message = validate_feature_data(feature_data)
                if not is_valid:
                    return jsonify({'error': error_message}), 400
                
                product_feature = ProductFeature(
                    product_id=product.id,
                    feature=feature_data['feature'],
                    display_order=feature_data.get('display_order', i)
                )
                db.session.add(product_feature)
        
        db.session.commit()
        
        return jsonify(product.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@products_bp.route('/api/products/<int:id>', methods=['PUT'])
def update_product(id):
    """Update an existing product"""
    product = Product.query.get_or_404(id)
    data = request.get_json()
    
    # Validate product data
    is_valid, error_message = validate_product_data(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    try:
        # Update product fields
        product.name = data['name']
        product.description = data.get('description')
        product.price = Decimal(str(data['price']))
        product.original_price = Decimal(str(data['original_price'])) if data.get('original_price') else None
        product.sku = data.get('sku')
        product.stock = data.get('stock')
        product.is_new = data.get('is_new', False)
        product.is_sale = data.get('is_sale', False)
        product.is_featured = data.get('is_featured', False)
        product.category_id = data.get('category_id')
        product.brand_id = data.get('brand_id')
        
        # Handle images
        if 'images' in data and isinstance(data['images'], list):
            # Remove existing images
            ProductImage.query.filter_by(product_id=product.id).delete()
            
            # Add new images
            for i, image_data in enumerate(data['images']):
                is_valid, error_message = validate_image_data(image_data)
                if not is_valid:
                    return jsonify({'error': error_message}), 400
                
                product_image = ProductImage(
                    product_id=product.id,
                    image_url=image_data['image_url'],
                    is_primary=image_data.get('is_primary', i == 0),
                    display_order=image_data.get('display_order', i)
                )
                db.session.add(product_image)
        
        # Handle specifications
        if 'specifications' in data and isinstance(data['specifications'], list):
            # Remove existing specifications
            ProductSpecification.query.filter_by(product_id=product.id).delete()
            
            # Add new specifications
            for i, spec_data in enumerate(data['specifications']):
                is_valid, error_message = validate_specification_data(spec_data)
                if not is_valid:
                    return jsonify({'error': error_message}), 400
                
                product_spec = ProductSpecification(
                    product_id=product.id,
                    name=spec_data['name'],
                    value=spec_data['value'],
                    display_order=spec_data.get('display_order', i)
                )
                db.session.add(product_spec)
        
        # Handle features
        if 'features' in data and isinstance(data['features'], list):
            # Remove existing features
            ProductFeature.query.filter_by(product_id=product.id).delete()
            
            # Add new features
            for i, feature_data in enumerate(data['features']):
                is_valid, error_message = validate_feature_data(feature_data)
                if not is_valid:
                    return jsonify({'error': error_message}), 400
                
                product_feature = ProductFeature(
                    product_id=product.id,
                    feature=feature_data['feature'],
                    display_order=feature_data.get('display_order', i)
                )
                db.session.add(product_feature)
        
        db.session.commit()
        
        return jsonify(product.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@products_bp.route('/api/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    """Delete a product"""
    product = Product.query.get_or_404(id)
    
    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 