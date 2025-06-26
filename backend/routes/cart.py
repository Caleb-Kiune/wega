from flask import Blueprint, jsonify, request
from models import db, Cart, CartItem, Product
from decimal import Decimal

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/api/cart', methods=['GET'])
def get_cart():
    """Get cart contents"""
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({'error': 'Session ID is required'}), 400
    
    cart = Cart.query.filter_by(session_id=session_id).first()
    if not cart:
        return jsonify({'cart': None, 'items': [], 'total': 0})
    
    return jsonify(cart.to_dict())

@cart_bp.route('/api/cart/items', methods=['POST'])
def add_to_cart():
    """Add item to cart"""
    data = request.get_json()
    session_id = data.get('session_id')
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    if not session_id:
        return jsonify({'error': 'Session ID is required'}), 400
    
    if not product_id:
        return jsonify({'error': 'Product ID is required'}), 400
    
    # Validate product exists
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    # Validate quantity
    if quantity <= 0:
        return jsonify({'error': 'Quantity must be greater than 0'}), 400
    
    try:
        # Get or create cart
        cart = Cart.query.filter_by(session_id=session_id).first()
        if not cart:
            cart = Cart(session_id=session_id)
            db.session.add(cart)
            db.session.flush()
        
        # Check if item already exists in cart
        existing_item = CartItem.query.filter_by(
            cart_id=cart.id, 
            product_id=product_id
        ).first()
        
        if existing_item:
            # Update quantity
            existing_item.quantity += quantity
        else:
            # Create new cart item
            cart_item = CartItem(
                cart_id=cart.id,
                product_id=product_id,
                quantity=quantity
            )
            db.session.add(cart_item)
        
        db.session.commit()
        
        return jsonify(cart.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/api/cart/items/<int:item_id>', methods=['PUT'])
def update_cart_item(item_id):
    """Update cart item quantity"""
    data = request.get_json()
    quantity = data.get('quantity')
    
    if quantity is None:
        return jsonify({'error': 'Quantity is required'}), 400
    
    if quantity <= 0:
        return jsonify({'error': 'Quantity must be greater than 0'}), 400
    
    cart_item = CartItem.query.get_or_404(item_id)
    
    try:
        cart_item.quantity = quantity
        db.session.commit()
        
        return jsonify(cart_item.cart.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/api/cart/items/<int:item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    """Remove item from cart"""
    cart_item = CartItem.query.get_or_404(item_id)
    
    try:
        db.session.delete(cart_item)
        db.session.commit()
        
        return jsonify({'message': 'Item removed from cart'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/api/cart', methods=['DELETE'])
def clear_cart():
    """Clear entire cart"""
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({'error': 'Session ID is required'}), 400
    
    cart = Cart.query.filter_by(session_id=session_id).first()
    if not cart:
        return jsonify({'message': 'Cart is already empty'})
    
    try:
        db.session.delete(cart)
        db.session.commit()
        
        return jsonify({'message': 'Cart cleared successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 