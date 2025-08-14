from flask import Blueprint, jsonify, request, current_app
from sqlalchemy import or_, and_, case, func, literal
from decimal import Decimal
from models import db, Product, Category, Brand, ProductImage, ProductSpecification, ProductFeature, Review
from utils.helpers import validate_product_data, validate_review_data, validate_image_data, validate_specification_data, validate_feature_data, paginate, format_image_url
from sqlalchemy.orm import joinedload

products_bp = Blueprint('products', __name__)

@products_bp.route('/api/products/price-stats', methods=['GET'])
def get_price_stats():
    """Get price statistics for filtering"""
    try:
        # Get price statistics
        stats = db.session.query(
            func.min(Product.price).label('min_price'),
            func.max(Product.price).label('max_price'),
            func.avg(Product.price).label('avg_price'),
            func.count(Product.id).label('total_products')
        ).filter(Product.price.isnot(None)).first()
        
        if not stats or not stats.min_price:
            return jsonify({
                'min_price': 0,
                'max_price': 50000,
                'avg_price': 0,
                'total_products': 0
            })
        
        # Get price distribution
        price_ranges = [
            (0, 1000, 'Under KES 1,000'),
            (1000, 5000, 'KES 1,000 - 5,000'),
            (5000, 15000, 'KES 5,000 - 15,000'),
            (15000, 30000, 'KES 15,000 - 30,000'),
            (30000, 50000, 'Over KES 30,000')
        ]
        
        distribution = []
        for min_price, max_price, label in price_ranges:
            count = db.session.query(Product).filter(
                Product.price >= min_price,
                Product.price < max_price if max_price < 50000 else Product.price >= max_price
            ).count()
            distribution.append({
                'range': label,
                'count': count,
                'min_price': min_price,
                'max_price': max_price
            })
        
        return jsonify({
            'min_price': float(stats.min_price),
            'max_price': float(stats.max_price),
            'avg_price': float(stats.avg_price) if stats.avg_price else 0,
            'total_products': stats.total_products,
            'distribution': distribution
        })
    except Exception as e:
        current_app.logger.error(f"Error getting price stats: {str(e)}")
        return jsonify({'error': 'Failed to get price statistics'}), 500

@products_bp.route('/api/products/search-suggestions', methods=['GET'])
def get_search_suggestions():
    """Get search suggestions for autocomplete"""
    try:
        query = request.args.get('q', '').strip()
        limit = min(int(request.args.get('limit', 10)), 20)  # Max 20 suggestions
        
        current_app.logger.info(f"Search suggestions called with query: '{query}', limit: {limit}")
        
        if not query or len(query) < 2:
            return jsonify({
                'suggestions': [],
                'detailed_suggestions': [],
                'type': 'error',
                'message': 'Query must be at least 2 characters'
            })
        
        # Search in product names only for now (simplified)
        suggestions = []
        
        # Product name suggestions
        current_app.logger.info("Querying product names...")
        try:
            product_suggestions = db.session.query(Product.name).filter(
                Product.name.ilike(f'%{query}%')
            ).limit(limit).all()
            current_app.logger.info(f"Found {len(product_suggestions)} product suggestions")
            
            for suggestion in product_suggestions:
                suggestions.append({
                    'text': suggestion.name,
                    'type': 'product',
                    'count': 1,
                    'priority': 1
                })
        except Exception as e:
            current_app.logger.error(f"Error in product suggestions: {str(e)}")
            # Don't raise, just continue with empty suggestions
        
        current_app.logger.info(f"Total suggestions found: {len(suggestions)}")
        
        # Create simple suggestions list for backward compatibility
        simple_suggestions = [s['text'] for s in suggestions]
        
        return jsonify({
            'suggestions': simple_suggestions,
            'detailed_suggestions': suggestions,
            'type': 'success',
            'query': query,
            'total': len(suggestions)
        })
        
    except Exception as e:
        current_app.logger.error(f"Error getting search suggestions: {str(e)}")
        return jsonify({
            'suggestions': [],
            'detailed_suggestions': [],
            'type': 'error',
            'message': 'Failed to get search suggestions'
        }), 500

@products_bp.route('/api/products', methods=['GET'])
def get_products():
    """Get all products with optional filtering and pagination"""
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    limit = request.args.get('limit', type=int)
    search = request.args.get('search', '')
    
    # Handle both single and multiple category/brand parameters
    categories = request.args.getlist('categories[]') or request.args.getlist('category')
    brands = request.args.getlist('brands[]') or request.args.getlist('brand')
    
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    sort_by = request.args.get('sort_by', 'name')
    sort_order = request.args.get('sort_order', 'asc')
    
    # Get boolean filter parameters
    is_featured = request.args.get('is_featured', '').lower() == 'true'
    is_new = request.args.get('is_new', '').lower() == 'true'
    is_sale = request.args.get('is_sale', '').lower() == 'true'
    
    # Build query
    query = Product.query.options(
        joinedload(Product.category),
        joinedload(Product.brand),
        joinedload(Product.images),
        joinedload(Product.specifications),
        joinedload(Product.features),
        joinedload(Product.reviews)
    )
    
    # Apply filters with enhanced search ranking
    if search:
        search_term = f"%{search}%"
        search_lower = search.lower()
        
        # Create a more sophisticated search with proper word boundary matching
        query = query.filter(
            or_(
                # Product name contains the search term (case insensitive)
                Product.name.ilike(search_term),
                # Product name starts with search term
                Product.name.ilike(f"{search}%"),
                # Product name ends with search term
                Product.name.ilike(f"%{search}"),
                # Product name contains search term as a word (with word boundaries)
                func.lower(Product.name).contains(search_lower),
                # SKU exact match
                Product.sku.ilike(search_lower),
                # SKU contains search term
                Product.sku.ilike(search_term),
                # Description contains search term (lowest priority)
                Product.description.ilike(search_term)
            )
        )
        
        # Enhanced relevance scoring with proper word boundary matching
        query = query.order_by(
            case(
                # Exact name match (highest priority)
                (func.lower(Product.name) == search_lower, 1),
                # Name starts with search term
                (func.lower(Product.name).startswith(search_lower), 2),
                # Name ends with search term
                (func.lower(Product.name).endswith(search_lower), 3),
                # Name contains search term as a complete word
                (func.lower(Product.name).contains(f" {search_lower} "), 4),
                (func.lower(Product.name).contains(f"{search_lower} "), 5),
                (func.lower(Product.name).contains(f" {search_lower}"), 6),
                # Name contains search term anywhere
                (func.lower(Product.name).contains(search_lower), 7),
                # SKU exact match
                (func.lower(Product.sku) == search_lower, 8),
                # SKU contains search term
                (func.lower(Product.sku).contains(search_lower), 9),
                # Description contains search term (lowest priority)
                (func.lower(Product.description).contains(search_lower), 10),
                else_=11
            )
        )
    
    # Apply category filters
    if categories:
        query = query.join(Category).filter(Category.name.in_(categories))
    
    # Apply brand filters
    if brands:
        query = query.join(Brand).filter(Brand.name.in_(brands))
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    # Apply boolean filters
    if is_featured:
        query = query.filter(Product.is_featured == True)
    
    if is_new:
        query = query.filter(Product.is_new == True)
    
    if is_sale:
        query = query.filter(Product.is_sale == True)
    
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
    
    def product_list_dict(product):
        return {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': float(product.price) if product.price else None,
            'original_price': float(product.original_price) if product.original_price else None,
            'image_url': format_image_url(next((img.image_url for img in product.images if img.is_primary), 
                           product.images[0].image_url if product.images else None)),
            'images': [{
                'id': img.id,
                'product_id': img.product_id,
                'image_url': format_image_url(img.image_url),
                'is_primary': img.is_primary,
                'display_order': img.display_order
            } for img in product.images],
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
    
    # Use limit if provided, otherwise use pagination
    if limit:
        # Calculate offset based on page
        offset = (page - 1) * limit
        products = query.offset(offset).limit(limit).all()
        total = query.count()
        return jsonify({
            'products': [product_list_dict(product) for product in products],
            'total': total,
            'pages': (total + limit - 1) // limit,
            'current_page': page
        })
    else:
        # Paginate results
        pagination = paginate(query, page, per_page)
        
        return jsonify({
            'products': [product_list_dict(product) for product in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'per_page': per_page
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

@products_bp.route('/api/products/check-sku', methods=['GET'])
def check_sku():
    """Check if a SKU is unique"""
    sku = request.args.get('sku')
    if not sku:
        return jsonify({'error': 'SKU parameter is required'}), 400
    
    exclude_id = request.args.get('exclude_id')
    
    # Build query to exclude current product if editing
    query = Product.query.filter_by(sku=sku)
    if exclude_id:
        try:
            exclude_id = int(exclude_id)
            query = query.filter(Product.id != exclude_id)
        except ValueError:
            pass  # Invalid exclude_id, ignore it
    
    existing_product = query.first()
    return jsonify({
        'sku': sku,
        'is_unique': existing_product is None,
        'exists': existing_product is not None
    })

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
            # Handle SKU - set to None if empty string to avoid UNIQUE constraint issues
            sku=data.get('sku') if data.get('sku') and data.get('sku').strip() else None,
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

                image_url = image_data['image_url']
                # Enforce Cloudinary URL
                if not image_url.startswith('https://res.cloudinary.com/'):
                    return jsonify({'error': 'All product images must be uploaded to Cloudinary.'}), 400

                product_image = ProductImage(
                    product_id=product.id,
                    image_url=image_url,
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
        # Handle SKU - set to None if empty string to avoid UNIQUE constraint issues
        sku_value = data.get('sku')
        product.sku = sku_value if sku_value and sku_value.strip() else None
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
                
                image_url = image_data['image_url']
                # Enforce Cloudinary URL
                if not image_url.startswith('https://res.cloudinary.com/'):
                    return jsonify({'error': 'All product images must be uploaded to Cloudinary.'}), 400

                product_image = ProductImage(
                    product_id=product.id,
                    image_url=image_url,
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