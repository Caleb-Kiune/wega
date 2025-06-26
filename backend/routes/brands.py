from flask import Blueprint, jsonify, request
from models import db, Brand, Product

brands_bp = Blueprint('brands', __name__)

@brands_bp.route('/api/brands', methods=['GET'])
def get_brands():
    """Get all brands"""
    brands = Brand.query.all()
    return jsonify([brand.to_dict() for brand in brands])

@brands_bp.route('/api/brands/<int:id>', methods=['GET'])
def get_brand(id):
    """Get a specific brand by ID"""
    brand = Brand.query.get_or_404(id)
    return jsonify(brand.to_dict())

@brands_bp.route('/api/brands', methods=['POST'])
def create_brand():
    """Create a new brand"""
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Brand name is required'}), 400
    
    if not data.get('slug'):
        return jsonify({'error': 'Brand slug is required'}), 400
    
    # Check if slug already exists
    existing_brand = Brand.query.filter_by(slug=data['slug']).first()
    if existing_brand:
        return jsonify({'error': 'Brand with this slug already exists'}), 400
    
    try:
        brand = Brand(
            name=data['name'],
            slug=data['slug'],
            description=data.get('description'),
            logo_url=data.get('logo_url')
        )
        
        db.session.add(brand)
        db.session.commit()
        
        return jsonify(brand.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@brands_bp.route('/api/brands/<int:id>', methods=['PUT'])
def update_brand(id):
    """Update an existing brand"""
    brand = Brand.query.get_or_404(id)
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Brand name is required'}), 400
    
    if not data.get('slug'):
        return jsonify({'error': 'Brand slug is required'}), 400
    
    # Check if slug already exists (excluding current brand)
    existing_brand = Brand.query.filter_by(slug=data['slug']).first()
    if existing_brand and existing_brand.id != id:
        return jsonify({'error': 'Brand with this slug already exists'}), 400
    
    try:
        brand.name = data['name']
        brand.slug = data['slug']
        brand.description = data.get('description')
        brand.logo_url = data.get('logo_url')
        
        db.session.commit()
        
        return jsonify(brand.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@brands_bp.route('/api/brands/<int:id>', methods=['DELETE'])
def delete_brand(id):
    """Delete a brand"""
    brand = Brand.query.get_or_404(id)
    
    # Check if brand has products
    if brand.products:
        return jsonify({'error': 'Cannot delete brand with existing products'}), 400
    
    try:
        db.session.delete(brand)
        db.session.commit()
        return jsonify({'message': 'Brand deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 