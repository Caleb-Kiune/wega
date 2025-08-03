from flask import Blueprint, request, jsonify
from models import db
from models.order import Order

from datetime import datetime
import re

order_tracking_bp = Blueprint('order_tracking', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@order_tracking_bp.route('/api/orders/track', methods=['POST'])
def track_order():
    """Track order by email and order number"""
    data = request.get_json()
    
    email = data.get('email', '').lower().strip()
    order_number = data.get('order_number', '').strip()
    
    if not email or not order_number:
        return jsonify({'error': 'Email and order number are required'}), 400
    
    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400
    
    try:
        # Find order by email and order number
        order = Order.query.filter_by(
            email=email,
            order_number=order_number
        ).first()
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        return jsonify({
            'order': order.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to track order'}), 500

@order_tracking_bp.route('/api/orders/by-email', methods=['POST'])
def get_orders_by_email():
    """Get all orders for an email address"""
    data = request.get_json()
    
    email = data.get('email', '').lower().strip()
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400
    
    try:
        # Find all orders for this email
        orders = Order.query.filter_by(email=email).order_by(Order.created_at.desc()).all()
        
        if not orders:
            return jsonify({'error': 'No orders found for this email'}), 404
        
        return jsonify({
            'orders': [order.to_dict() for order in orders]
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to get orders'}), 500

@order_tracking_bp.route('/api/orders/guest/<session_id>', methods=['GET'])
def get_guest_orders(session_id):
    """Get orders for a guest session"""
    try:
        orders = Order.query.filter_by(guest_session_id=session_id).order_by(Order.created_at.desc()).all()
        
        return jsonify({
            'orders': [order.to_dict() for order in orders]
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to get guest orders'}), 500

@order_tracking_bp.route('/api/orders/<int:order_id>/status', methods=['GET'])
def get_order_status(order_id):
    """Get order status"""
    try:
        order = Order.query.get_or_404(order_id)
        
        return jsonify({
            'order_id': order.id,
            'order_number': order.order_number,
            'status': order.status,
            'payment_status': order.payment_status,
            'created_at': order.created_at.isoformat() if order.created_at else None,
            'updated_at': order.updated_at.isoformat() if order.updated_at else None
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to get order status'}), 500

@order_tracking_bp.route('/api/orders/<int:order_id>/cancel', methods=['POST'])
def cancel_order(order_id):
    """Cancel an order"""
    try:
        order = Order.query.get_or_404(order_id)
        
        # Check if order can be cancelled
        if order.status in ['cancelled', 'shipped', 'delivered']:
            return jsonify({'error': 'Order cannot be cancelled'}), 400
        
        order.status = 'cancelled'
        order.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Order cancelled successfully',
            'order': order.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to cancel order'}), 500

@order_tracking_bp.route('/api/orders/<int:order_id>/reorder', methods=['POST'])
def reorder(order_id):
    """Create a new order based on an existing order"""
    try:
        original_order = Order.query.get_or_404(order_id)
        
        # Create new order with same items
        new_order = Order(
            order_number=f"RE-{original_order.order_number}",
            first_name=original_order.first_name,
            last_name=original_order.last_name,
            email=original_order.email,
            phone=original_order.phone,
            address=original_order.address,
            city=original_order.city,
            state=original_order.state,
            postal_code=original_order.postal_code,
            total_amount=original_order.total_amount,
            shipping_cost=original_order.shipping_cost,
            status='pending',
            payment_status='pending',
            payment_method=original_order.payment_method,
            notes=f"Reorder of order {original_order.order_number}",
            customer_id=original_order.customer_id,
            guest_session_id=original_order.guest_session_id
        )
        
        db.session.add(new_order)
        db.session.flush()  # Get the new order ID
        
        # Copy order items
        for item in original_order.items:
            from models.order_item import OrderItem
            new_item = OrderItem(
                order_id=new_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=item.price
            )
            db.session.add(new_item)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Reorder created successfully',
            'order': new_order.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create reorder'}), 500

@order_tracking_bp.route('/api/orders/search', methods=['POST'])
def search_orders():
    """Search orders by various criteria"""
    data = request.get_json()
    
    email = data.get('email', '').lower().strip()
    order_number = data.get('order_number', '').strip()
    status = data.get('status', '').strip()
    date_from = data.get('date_from', '').strip()
    date_to = data.get('date_to', '').strip()
    
    try:
        query = Order.query
        
        # Apply filters
        if email:
            query = query.filter(Order.email == email)
        
        if order_number:
            query = query.filter(Order.order_number.contains(order_number))
        
        if status:
            query = query.filter(Order.status == status)
        
        if date_from:
            try:
                from_date = datetime.fromisoformat(date_from.replace('Z', '+00:00'))
                query = query.filter(Order.created_at >= from_date)
            except ValueError:
                return jsonify({'error': 'Invalid date format'}), 400
        
        if date_to:
            try:
                to_date = datetime.fromisoformat(date_to.replace('Z', '+00:00'))
                query = query.filter(Order.created_at <= to_date)
            except ValueError:
                return jsonify({'error': 'Invalid date format'}), 400
        
        # Order by creation date
        orders = query.order_by(Order.created_at.desc()).all()
        
        return jsonify({
            'orders': [order.to_dict() for order in orders],
            'total': len(orders)
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to search orders'}), 500

@order_tracking_bp.route('/api/orders/<int:order_id>/update-status', methods=['PUT'])
def update_order_status(order_id):
    """Update order status (admin function)"""
    data = request.get_json()
    
    status = data.get('status', '').strip()
    payment_status = data.get('payment_status', '').strip()
    
    if not status and not payment_status:
        return jsonify({'error': 'Status or payment_status is required'}), 400
    
    try:
        order = Order.query.get_or_404(order_id)
        
        if status:
            order.status = status
        if payment_status:
            order.payment_status = payment_status
        
        order.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Order status updated successfully',
            'order': order.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update order status'}), 500

 