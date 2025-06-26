from flask import Blueprint, jsonify, request
from models import db, Product, Review
from utils.helpers import validate_review_data
from datetime import datetime

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/api/products/<int:id>/reviews', methods=['GET'])
def get_product_reviews(id):
    """Get all reviews for a specific product"""
    product = Product.query.get_or_404(id)
    
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    sort_by = request.args.get('sort_by', 'date')
    sort_order = request.args.get('sort_order', 'desc')
    
    # Build query
    query = Review.query.filter_by(product_id=id)
    
    # Apply sorting
    if sort_by == 'rating':
        if sort_order == 'desc':
            query = query.order_by(Review.rating.desc())
        else:
            query = query.order_by(Review.rating.asc())
    elif sort_by == 'user':
        if sort_order == 'desc':
            query = query.order_by(Review.user.desc())
        else:
            query = query.order_by(Review.user.asc())
    else:  # default to date
        if sort_order == 'desc':
            query = query.order_by(Review.date.desc())
        else:
            query = query.order_by(Review.date.asc())
    
    # Paginate results
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'reviews': [review.to_dict() for review in pagination.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': pagination.total,
            'pages': pagination.pages,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    })

@reviews_bp.route('/api/products/<int:id>/reviews', methods=['POST'])
def create_product_review(id):
    """Create a new review for a product"""
    product = Product.query.get_or_404(id)
    data = request.get_json()
    
    # Validate review data
    is_valid, error_message = validate_review_data(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    try:
        review = Review(
            product_id=id,
            user=data['user'],
            avatar=data.get('avatar'),
            title=data['title'],
            comment=data['comment'],
            rating=data['rating'],
            date=datetime.utcnow()
        )
        
        db.session.add(review)
        db.session.commit()
        
        return jsonify(review.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/api/products/<int:id>/reviews/<int:review_id>', methods=['PUT'])
def update_product_review(id, review_id):
    """Update an existing review"""
    product = Product.query.get_or_404(id)
    review = Review.query.filter_by(id=review_id, product_id=id).first_or_404()
    data = request.get_json()
    
    # Validate review data
    is_valid, error_message = validate_review_data(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    try:
        review.user = data['user']
        review.avatar = data.get('avatar')
        review.title = data['title']
        review.comment = data['comment']
        review.rating = data['rating']
        
        db.session.commit()
        
        return jsonify(review.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/api/products/<int:id>/reviews/<int:review_id>', methods=['DELETE'])
def delete_product_review(id, review_id):
    """Delete a review"""
    product = Product.query.get_or_404(id)
    review = Review.query.filter_by(id=review_id, product_id=id).first_or_404()
    
    try:
        db.session.delete(review)
        db.session.commit()
        return jsonify({'message': 'Review deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 