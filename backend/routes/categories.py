from flask import Blueprint, jsonify, request
from models import db, Category, Product

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all categories"""
    categories = Category.query.all()
    return jsonify([category.to_dict() for category in categories])

@categories_bp.route('/api/categories/<int:id>', methods=['GET'])
def get_category(id):
    """Get a specific category by ID"""
    category = Category.query.get_or_404(id)
    return jsonify(category.to_dict())

@categories_bp.route('/api/categories', methods=['POST'])
def create_category():
    """Create a new category"""
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Category name is required'}), 400
    
    if not data.get('slug'):
        return jsonify({'error': 'Category slug is required'}), 400
    
    # Check if slug already exists
    existing_category = Category.query.filter_by(slug=data['slug']).first()
    if existing_category:
        return jsonify({'error': 'Category with this slug already exists'}), 400
    
    try:
        category = Category(
            name=data['name'],
            slug=data['slug'],
            description=data.get('description'),
            image_url=data.get('image_url')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify(category.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/api/categories/<int:id>', methods=['PUT'])
def update_category(id):
    """Update an existing category"""
    category = Category.query.get_or_404(id)
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Category name is required'}), 400
    
    if not data.get('slug'):
        return jsonify({'error': 'Category slug is required'}), 400
    
    # Check if slug already exists (excluding current category)
    existing_category = Category.query.filter_by(slug=data['slug']).first()
    if existing_category and existing_category.id != id:
        return jsonify({'error': 'Category with this slug already exists'}), 400
    
    try:
        category.name = data['name']
        category.slug = data['slug']
        category.description = data.get('description')
        category.image_url = data.get('image_url')
        
        db.session.commit()
        
        return jsonify(category.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/api/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    """Delete a category"""
    category = Category.query.get_or_404(id)
    
    # Check if category has products
    if category.products:
        return jsonify({'error': 'Cannot delete category with existing products'}), 400
    
    try:
        db.session.delete(category)
        db.session.commit()
        return jsonify({'message': 'Category deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 