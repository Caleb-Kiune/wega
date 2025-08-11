from flask import Blueprint, jsonify, request
from models import db, Order, OrderItem, Cart, CartItem, DeliveryLocation, Product
from decimal import Decimal
import uuid
from datetime import datetime

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/api/orders', methods=['POST'])
def create_order():
    """Create a new order"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['session_id', 'first_name', 'last_name', 'email', 'phone', 
                      'address', 'city', 'state']
    
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field.replace("_", " ").title()} is required'}), 400
    
    # Handle delivery location (can be null for pickup)
    delivery_location = None
    if data.get('delivery_location_id'):
        delivery_location = DeliveryLocation.query.get(data['delivery_location_id'])
        if not delivery_location:
            return jsonify({'error': 'Invalid delivery location'}), 400
    
    # Get cart items - either from database cart or from request body
    cart_items = []
    
    if data.get('cart_items'):
        # Use cart items from request body (for localStorage carts)
        cart_items = data['cart_items']
        if not cart_items:
            return jsonify({'error': 'Cart is empty'}), 400
    else:
        # Try to get cart from database
        cart = Cart.query.filter_by(session_id=data['session_id']).first()
        if not cart or not cart.items:
            return jsonify({'error': 'Cart is empty'}), 400
        cart_items = cart.items
    
    try:
        # Calculate totals
        subtotal = 0
        if data.get('cart_items'):
            # Calculate from cart items in request
            for item in cart_items:
                product = Product.query.get(item['product_id'])
                if not product:
                    return jsonify({'error': f'Product with ID {item["product_id"]} not found'}), 400
                # Convert to float for consistent arithmetic
                product_price = float(product.price) if product.price else 0.0
                item_quantity = int(item['quantity']) if item['quantity'] else 0
                subtotal += product_price * item_quantity
        else:
            # Calculate from database cart
            subtotal = sum(float(item.product.price) * item.quantity for item in cart_items)
        
        # Calculate shipping cost (0 for pickup, actual cost for delivery)
        shipping_cost = 0.0
        if delivery_location and delivery_location.shipping_price:
            shipping_cost = float(delivery_location.shipping_price)
        total_amount = subtotal + shipping_cost
        
        # Determine payment status based on payment method
        payment_method = data.get('payment_method', 'cod')
        payment_status = 'paid' if payment_method == 'cod' else 'pending'
        
        # Generate order number
        order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
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
            postal_code=data.get('postal_code', ''),  # Make postal_code optional with default empty string
            total_amount=total_amount,
            shipping_cost=shipping_cost,
            notes=data.get('notes'),
            payment_method=payment_method,
            status='pending',
            payment_status=payment_status,
            guest_session_id=data.get('session_id')  # Map session_id to guest_session_id
        )
        
        db.session.add(order)
        db.session.flush()  # Get the order ID
        
        # Create order items
        if data.get('cart_items'):
            # Create from cart items in request
            for item in cart_items:
                product = Product.query.get(item['product_id'])
                if not product:
                    return jsonify({'error': f'Product with ID {item["product_id"]} not found'}), 400
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=item['product_id'],
                    quantity=int(item['quantity']),
                    price=float(product.price) if product.price else 0.0
                )
                db.session.add(order_item)
        else:
            # Create from database cart
            for cart_item in cart_items:
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=cart_item.product_id,
                    quantity=cart_item.quantity,
                    price=float(cart_item.product.price) if cart_item.product.price else 0.0
                )
                db.session.add(order_item)
        
        # Clear the cart if it exists in database
        if not data.get('cart_items') and cart:
            db.session.delete(cart)
        
        db.session.commit()
        
        return jsonify(order.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/api/orders', methods=['GET'])
def get_orders():
    """Get all orders with optional filtering"""
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    email = request.args.get('email', '')
    status = request.args.get('status', '')
    payment_status = request.args.get('payment_status', '')
    payment_method = request.args.get('payment_method', '')
    search = request.args.get('search', '')
    sort_by = request.args.get('sort_by', 'created_at')
    sort_order = request.args.get('sort_order', 'desc')
    
    # Build query
    query = Order.query
    
    # Apply filters
    if email:
        query = query.filter(Order.email.ilike(f"%{email}%"))
    
    if status:
        query = query.filter(Order.status == status)
    
    if payment_status:
        query = query.filter(Order.payment_status == payment_status)
    
    if payment_method:
        query = query.filter(Order.payment_method == payment_method)
    
    if search:
        # Search in order number, customer name, and email
        search_filter = f"%{search}%"
        query = query.filter(
            db.or_(
                Order.order_number.ilike(search_filter),
                Order.first_name.ilike(search_filter),
                Order.last_name.ilike(search_filter),
                Order.email.ilike(search_filter)
            )
        )
    
    # Apply sorting
    if sort_by == 'created_at':
        if sort_order == 'asc':
            query = query.order_by(Order.created_at.asc())
        else:
            query = query.order_by(Order.created_at.desc())
    elif sort_by == 'total_amount':
        if sort_order == 'asc':
            query = query.order_by(Order.total_amount.asc())
        else:
            query = query.order_by(Order.total_amount.desc())
    elif sort_by == 'status':
        if sort_order == 'asc':
            query = query.order_by(Order.status.asc())
        else:
            query = query.order_by(Order.status.desc())
    else:
        # Default sorting by creation date (newest first)
        query = query.order_by(Order.created_at.desc())
    
    # Paginate results
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'orders': [order.to_dict() for order in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
        'per_page': per_page
    })

@orders_bp.route('/api/orders/<int:id>', methods=['GET'])
def get_order(id):
    """Get a specific order by ID"""
    order = Order.query.get_or_404(id)
    return jsonify(order.to_dict())

@orders_bp.route('/api/orders/<int:id>/status', methods=['PATCH', 'POST'])
def update_order_status(id):
    """Update order status"""
    order = Order.query.get_or_404(id)
    data = request.get_json()
    
    if not data.get('status'):
        return jsonify({'error': 'Status is required'}), 400
    
    valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if data['status'] not in valid_statuses:
        return jsonify({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400
    
    try:
        order.status = data['status']
        db.session.commit()
        
        return jsonify(order.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/api/orders/<int:id>/payment-status', methods=['PATCH'])
def update_payment_status(id):
    """Update payment status"""
    order = Order.query.get_or_404(id)
    data = request.get_json()
    
    if not data.get('payment_status'):
        return jsonify({'error': 'Payment status is required'}), 400
    
    valid_payment_statuses = ['pending', 'paid', 'failed', 'refunded']
    if data['payment_status'] not in valid_payment_statuses:
        return jsonify({'error': f'Invalid payment status. Must be one of: {", ".join(valid_payment_statuses)}'}), 400
    
    try:
        order.payment_status = data['payment_status']
        db.session.commit()
        
        return jsonify(order.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500



@orders_bp.route('/api/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    """Delete an order"""
    order = Order.query.get_or_404(id)
    
    try:
        db.session.delete(order)
        db.session.commit()
        
        return jsonify({'message': 'Order deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/api/create-tables', methods=['POST'])
def create_tables():
    """Create all database tables (one-time use)"""
    try:
        from models import db
        
        # Create all tables
        db.create_all()
        
        return jsonify({
            'message': 'Database tables created successfully!',
            'details': 'All required tables are now available'
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to create tables',
            'details': str(e)
        }), 500

@orders_bp.route('/api/seed-database', methods=['POST'])
def seed_database():
    """Seed the database with initial data (one-time use)"""
    try:
        # Import seeding functions
        import sys
        import os
        sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'scripts'))
        
        from seed import seed_database as seed_func
        
        # Run the seeding function
        seed_func()
        
        return jsonify({
            'message': 'Database seeded successfully!',
            'details': 'Added categories, brands, products, delivery locations, and sample data'
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to seed database',
            'details': str(e)
        }), 500 