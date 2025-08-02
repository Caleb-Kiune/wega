from flask import Blueprint, request, jsonify
from models import db
from models.customer import Customer, CustomerAddress
from models.order import Order
from models.cart import Cart, CartItem
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import jwt
import uuid
import re
from functools import wraps

customer_auth_bp = Blueprint('customer_auth', __name__)

# JWT configuration
JWT_SECRET_KEY = 'your-secret-key'  # In production, use environment variable
JWT_ALGORITHM = 'HS256'

def generate_customer_token(customer_id):
    """Generate JWT token for customer"""
    payload = {
        'customer_id': customer_id,
        'exp': datetime.utcnow() + timedelta(days=7),  # 7 days expiry
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def verify_customer_token(token):
    """Verify JWT token for customer"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload['customer_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def customer_auth_required(f):
    """Decorator to require customer authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'Authentication required'}), 401
        
        token = token.split(' ')[1]
        customer_id = verify_customer_token(token)
        if not customer_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        customer = Customer.query.get(customer_id)
        if not customer or not customer.is_active:
            return jsonify({'error': 'Customer not found or inactive'}), 401
        
        request.customer = customer
        return f(*args, **kwargs)
    return decorated_function

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, "Password is valid"

@customer_auth_bp.route('/api/customer/register', methods=['POST'])
def register():
    """Customer registration"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'password', 'first_name', 'last_name']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    email = data['email'].lower().strip()
    password = data['password']
    first_name = data['first_name'].strip()
    last_name = data['last_name'].strip()
    phone = data.get('phone', '').strip()
    
    # Validate email format
    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Validate password strength
    is_valid, message = validate_password(password)
    if not is_valid:
        return jsonify({'error': message}), 400
    
    # Check if email already exists
    existing_customer = Customer.query.filter_by(email=email).first()
    if existing_customer:
        return jsonify({'error': 'Email already registered'}), 409
    
    try:
        # Create new customer
        customer = Customer(
            email=email,
            first_name=first_name,
            last_name=last_name,
            phone=phone
        )
        customer.set_password(password)
        
        db.session.add(customer)
        db.session.commit()
        
        # Generate token
        token = generate_customer_token(customer.id)
        
        return jsonify({
            'message': 'Registration successful',
            'customer': customer.to_dict(),
            'token': token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed'}), 500

@customer_auth_bp.route('/api/customer/login', methods=['POST'])
def login():
    """Customer login"""
    data = request.get_json()
    
    email = data.get('email', '').lower().strip()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    customer = Customer.query.filter_by(email=email).first()
    
    if not customer:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    if not customer.is_active:
        return jsonify({'error': 'Account is deactivated'}), 401
    
    if customer.is_locked():
        return jsonify({'error': 'Account is temporarily locked'}), 423
    
    if not customer.check_password(password):
        customer.increment_failed_login()
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Reset failed login attempts on successful login
    customer.reset_failed_login()
    customer.last_login = datetime.utcnow()
    db.session.commit()
    
    # Generate token
    token = generate_customer_token(customer.id)
    
    return jsonify({
        'message': 'Login successful',
        'customer': customer.to_dict(),
        'token': token
    })

@customer_auth_bp.route('/api/customer/profile', methods=['GET'])
@customer_auth_required
def get_profile():
    """Get customer profile"""
    return jsonify({
        'customer': request.customer.to_dict_with_addresses()
    })

@customer_auth_bp.route('/api/customer/profile', methods=['PUT'])
@customer_auth_required
def update_profile():
    """Update customer profile"""
    data = request.get_json()
    customer = request.customer
    
    # Update allowed fields
    if 'first_name' in data:
        customer.first_name = data['first_name'].strip()
    if 'last_name' in data:
        customer.last_name = data['last_name'].strip()
    if 'phone' in data:
        customer.phone = data['phone'].strip()
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Profile updated successfully',
            'customer': customer.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update profile'}), 500

@customer_auth_bp.route('/api/customer/change-password', methods=['POST'])
@customer_auth_required
def change_password():
    """Change customer password"""
    data = request.get_json()
    customer = request.customer
    
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    
    if not current_password or not new_password:
        return jsonify({'error': 'Current password and new password are required'}), 400
    
    if not customer.check_password(current_password):
        return jsonify({'error': 'Current password is incorrect'}), 401
    
    # Validate new password
    is_valid, message = validate_password(new_password)
    if not is_valid:
        return jsonify({'error': message}), 400
    
    try:
        customer.set_password(new_password)
        db.session.commit()
        return jsonify({'message': 'Password changed successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to change password'}), 500

@customer_auth_bp.route('/api/customer/orders', methods=['GET'])
@customer_auth_required
def get_customer_orders():
    """Get customer orders"""
    customer = request.customer
    orders = Order.query.filter_by(customer_id=customer.id).order_by(Order.created_at.desc()).all()
    
    return jsonify({
        'orders': [order.to_dict() for order in orders]
    })

@customer_auth_bp.route('/api/customer/migrate-guest', methods=['POST'])
@customer_auth_required
def migrate_guest_data():
    """Migrate guest session data to customer account"""
    data = request.get_json()
    customer = request.customer
    session_id = data.get('session_id')
    
    if not session_id:
        return jsonify({'error': 'Session ID is required'}), 400
    
    try:
        # Migrate orders
        orders = Order.query.filter_by(guest_session_id=session_id).all()
        for order in orders:
            order.customer_id = customer.id
            order.guest_session_id = None
        
        # Migrate cart items (if any)
        cart = Cart.query.filter_by(session_id=session_id).first()
        if cart:
            # Clear the guest cart since customer now has their own cart
            CartItem.query.filter_by(cart_id=cart.id).delete()
            db.session.delete(cart)
        
        # Update customer migration info
        customer.migrated_from_session = session_id
        customer.migration_date = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Guest data migrated successfully',
            'migrated_orders': len(orders)
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to migrate guest data'}), 500

@customer_auth_bp.route('/api/customer/addresses', methods=['GET'])
@customer_auth_required
def get_addresses():
    """Get customer addresses"""
    customer = request.customer
    addresses = CustomerAddress.query.filter_by(customer_id=customer.id).all()
    
    return jsonify({
        'addresses': [address.to_dict() for address in addresses]
    })

@customer_auth_bp.route('/api/customer/addresses', methods=['POST'])
@customer_auth_required
def add_address():
    """Add customer address"""
    data = request.get_json()
    customer = request.customer
    
    required_fields = ['address_line_1', 'city']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    try:
        address = CustomerAddress(
            customer_id=customer.id,
            address_line_1=data['address_line_1'].strip(),
            address_line_2=data.get('address_line_2', '').strip(),
            city=data['city'].strip(),
            state=data.get('state', '').strip(),
            postal_code=data.get('postal_code', '').strip(),
            country=data.get('country', 'Kenya').strip(),
            address_type=data.get('address_type', 'shipping'),
            is_default_shipping=data.get('is_default_shipping', False),
            is_default_billing=data.get('is_default_billing', False)
        )
        
        # If this is set as default, unset others
        if address.is_default_shipping:
            CustomerAddress.query.filter_by(
                customer_id=customer.id, 
                is_default_shipping=True
            ).update({'is_default_shipping': False})
        
        if address.is_default_billing:
            CustomerAddress.query.filter_by(
                customer_id=customer.id, 
                is_default_billing=True
            ).update({'is_default_billing': False})
        
        db.session.add(address)
        db.session.commit()
        
        return jsonify({
            'message': 'Address added successfully',
            'address': address.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add address'}), 500

@customer_auth_bp.route('/api/customer/addresses/<int:address_id>', methods=['PUT'])
@customer_auth_required
def update_address(address_id):
    """Update customer address"""
    data = request.get_json()
    customer = request.customer
    
    address = CustomerAddress.query.filter_by(
        id=address_id, 
        customer_id=customer.id
    ).first()
    
    if not address:
        return jsonify({'error': 'Address not found'}), 404
    
    try:
        # Update fields
        if 'address_line_1' in data:
            address.address_line_1 = data['address_line_1'].strip()
        if 'address_line_2' in data:
            address.address_line_2 = data['address_line_2'].strip()
        if 'city' in data:
            address.city = data['city'].strip()
        if 'state' in data:
            address.state = data['state'].strip()
        if 'postal_code' in data:
            address.postal_code = data['postal_code'].strip()
        if 'country' in data:
            address.country = data['country'].strip()
        if 'address_type' in data:
            address.address_type = data['address_type']
        
        # Handle default flags
        if data.get('is_default_shipping'):
            CustomerAddress.query.filter_by(
                customer_id=customer.id, 
                is_default_shipping=True
            ).update({'is_default_shipping': False})
            address.is_default_shipping = True
        
        if data.get('is_default_billing'):
            CustomerAddress.query.filter_by(
                customer_id=customer.id, 
                is_default_billing=True
            ).update({'is_default_billing': False})
            address.is_default_billing = True
        
        db.session.commit()
        
        return jsonify({
            'message': 'Address updated successfully',
            'address': address.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update address'}), 500

@customer_auth_bp.route('/api/customer/addresses/<int:address_id>', methods=['DELETE'])
@customer_auth_required
def delete_address(address_id):
    """Delete customer address"""
    customer = request.customer
    
    address = CustomerAddress.query.filter_by(
        id=address_id, 
        customer_id=customer.id
    ).first()
    
    if not address:
        return jsonify({'error': 'Address not found'}), 404
    
    try:
        db.session.delete(address)
        db.session.commit()
        
        return jsonify({'message': 'Address deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete address'}), 500 