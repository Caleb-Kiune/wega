from flask import Blueprint, jsonify, request
from models import db, DeliveryLocation
from decimal import Decimal

delivery_bp = Blueprint('delivery', __name__)

@delivery_bp.route('/api/delivery-locations', methods=['GET'])
def get_delivery_locations():
    """Get all delivery locations"""
    # Get query parameters
    active_only = request.args.get('active_only', 'false').lower() == 'true'
    
    query = DeliveryLocation.query
    
    if active_only:
        query = query.filter_by(is_active=True)
    
    locations = query.order_by(DeliveryLocation.name).all()
    return jsonify([location.to_dict() for location in locations])

@delivery_bp.route('/api/delivery-locations/<int:id>', methods=['GET'])
def get_delivery_location(id):
    """Get a specific delivery location by ID"""
    location = DeliveryLocation.query.get_or_404(id)
    return jsonify(location.to_dict())

@delivery_bp.route('/api/delivery-locations', methods=['POST'])
def create_delivery_location():
    """Create a new delivery location"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'slug', 'city', 'shipping_price']
    
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field.replace("_", " ").title()} is required'}), 400
    
    # Validate shipping price
    try:
        shipping_price = Decimal(str(data['shipping_price']))
        if shipping_price < 0:
            return jsonify({'error': 'Shipping price cannot be negative'}), 400
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid shipping price format'}), 400
    
    # Check if slug already exists
    existing_location = DeliveryLocation.query.filter_by(slug=data['slug']).first()
    if existing_location:
        return jsonify({'error': 'Delivery location with this slug already exists'}), 400
    
    try:
        location = DeliveryLocation(
            name=data['name'],
            slug=data['slug'],
            city=data['city'],
            shipping_price=shipping_price,
            is_active=data.get('is_active', True)
        )
        
        db.session.add(location)
        db.session.commit()
        
        return jsonify(location.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@delivery_bp.route('/api/delivery-locations/<int:id>', methods=['PUT'])
def update_delivery_location(id):
    """Update an existing delivery location"""
    location = DeliveryLocation.query.get_or_404(id)
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'slug', 'city', 'shipping_price']
    
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field.replace("_", " ").title()} is required'}), 400
    
    # Validate shipping price
    try:
        shipping_price = Decimal(str(data['shipping_price']))
        if shipping_price < 0:
            return jsonify({'error': 'Shipping price cannot be negative'}), 400
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid shipping price format'}), 400
    
    # Check if slug already exists (excluding current location)
    existing_location = DeliveryLocation.query.filter_by(slug=data['slug']).first()
    if existing_location and existing_location.id != id:
        return jsonify({'error': 'Delivery location with this slug already exists'}), 400
    
    try:
        location.name = data['name']
        location.slug = data['slug']
        location.city = data['city']
        location.shipping_price = shipping_price
        location.is_active = data.get('is_active', True)
        
        db.session.commit()
        
        return jsonify(location.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@delivery_bp.route('/api/delivery-locations/<int:id>', methods=['DELETE'])
def delete_delivery_location(id):
    """Delete a delivery location"""
    location = DeliveryLocation.query.get_or_404(id)
    
    try:
        db.session.delete(location)
        db.session.commit()
        
        return jsonify({'message': 'Delivery location deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 