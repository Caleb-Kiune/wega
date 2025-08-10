from flask import Blueprint, request, jsonify, current_app
from models import db, CustomerUser
from utils.auth import (
    generate_tokens, verify_token, require_customer_auth, update_last_login, 
    validate_password, validate_email, check_rate_limit,
    generate_csrf_token, require_csrf
)
from datetime import datetime
import re

customer_auth_bp = Blueprint('customer_auth', __name__, url_prefix='/api/customer/auth')

@customer_auth_bp.route('/csrf-token', methods=['GET'])
def get_csrf_token():
    """Get CSRF token for form submission"""
    return jsonify({
        'csrf_token': generate_csrf_token()
    }), 200

@customer_auth_bp.route('/register', methods=['POST'])
def register():
    """Customer registration endpoint"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    
    # Field validation
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    if not password:
        return jsonify({'error': 'Password is required'}), 400
    
    if not first_name:
        return jsonify({'error': 'First name is required'}), 400
    
    if not last_name:
        return jsonify({'error': 'Last name is required'}), 400
    
    # Validate email format
    is_valid_email, error_message = validate_email(email)
    if not is_valid_email:
        return jsonify({'error': error_message}), 400
    
    # Validate password strength
    is_valid_password, error_message = validate_password(password)
    if not is_valid_password:
        return jsonify({'error': error_message}), 400
    
    try:
        # Check if user already exists
        existing_user = CustomerUser.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 409
        
        # Create new user
        new_user = CustomerUser(
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        new_user.set_password(password)
        
        # Save to database
        db.session.add(new_user)
        db.session.commit()
        
        # Generate tokens
        tokens = generate_tokens(new_user.id, new_user.email, 'customer', False)
        
        return jsonify({
            'message': 'Registration successful',
            'user': new_user.to_dict_public(),
            'tokens': tokens
        }), 201
        
    except Exception as e:
        current_app.logger.error(f"Registration error: {e}")
        db.session.rollback()
        return jsonify({
            'error': 'Registration failed',
            'message': 'Please try again later.'
        }), 500

@customer_auth_bp.route('/login', methods=['POST'])
def login():
    """Customer login endpoint"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    remember_me = data.get('remember_me', False)
    
    # Field validation
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    if not password:
        return jsonify({'error': 'Password is required'}), 400
    
    try:
        # Find user by email
        user = CustomerUser.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Check if account is locked
        if user.is_locked():
            remaining = user.get_lockout_remaining()
            return jsonify({
                'error': f'Account locked due to too many failed attempts. Please try again in {remaining} seconds.'
            }), 429
        
        # Check rate limiting
        is_allowed, error_message = check_rate_limit(user)
        if not is_allowed:
            return jsonify({'error': error_message}), 429
        
        # Verify password
        if not user.check_password(password):
            # Increment failed attempts
            user.increment_failed_attempts()
            
            # Check if account is now locked
            if user.is_locked():
                remaining = user.get_lockout_remaining()
                return jsonify({
                    'error': f'Account locked due to too many failed attempts. Please try again in {remaining} seconds.'
                }), 429
            
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Successful login - reset failed attempts
        user.reset_failed_attempts()
        
        # Generate tokens
        tokens = generate_tokens(user.id, user.email, 'customer', remember_me)
        
        # Update last login
        update_last_login(user.id)
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict_public(),
            'tokens': tokens
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Login error: {e}")
        return jsonify({
            'error': 'Login failed',
            'message': 'Please try again later.'
        }), 500

@customer_auth_bp.route('/logout', methods=['POST'])
@require_customer_auth
def logout():
    """Customer logout endpoint"""
    try:
        # In a real implementation, you might want to blacklist the token
        # For now, we'll just return success
        return jsonify({
            'message': 'Logout successful'
        }), 200
    except Exception as e:
        current_app.logger.error(f"Logout error: {e}")
        return jsonify({
            'error': 'Logout failed'
        }), 500

@customer_auth_bp.route('/profile', methods=['GET'])
@require_customer_auth
def get_profile():
    """Get customer profile"""
    try:
        user_id = request.user_id
        user = CustomerUser.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': user.to_dict_public()
        }), 200
    except Exception as e:
        current_app.logger.error(f"Get profile error: {e}")
        return jsonify({
            'error': 'Failed to get profile'
        }), 500

@customer_auth_bp.route('/profile', methods=['PUT'])
@require_customer_auth
@require_csrf
def update_profile():
    """Update customer profile"""
    try:
        user_id = request.user_id
        user = CustomerUser.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update allowed fields
        if 'first_name' in data and data['first_name'].strip():
            user.first_name = data['first_name'].strip()
        
        if 'last_name' in data and data['last_name'].strip():
            user.last_name = data['last_name'].strip()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict_public()
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Update profile error: {e}")
        db.session.rollback()
        return jsonify({
            'error': 'Failed to update profile'
        }), 500

@customer_auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    """Refresh access token using refresh token"""
    try:
        data = request.get_json()
        
        if not data or 'refresh_token' not in data:
            return jsonify({'error': 'Refresh token is required'}), 400
        
        refresh_token = data['refresh_token']
        
        # Verify refresh token
        payload, error = verify_token(refresh_token, 'refresh')
        if error or not payload:
            return jsonify({'error': 'Invalid refresh token'}), 401
        
        # Check if user exists
        user = CustomerUser.query.get(payload['user_id'])
        if not user or not user.is_active:
            return jsonify({'error': 'User not found or inactive'}), 401
        
        # Generate new tokens
        tokens = generate_tokens(user.id, user.email, 'customer', False)
        
        return jsonify({
            'message': 'Token refreshed successfully',
            'tokens': tokens
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Token refresh error: {e}")
        return jsonify({
            'error': 'Token refresh failed'
        }), 500
