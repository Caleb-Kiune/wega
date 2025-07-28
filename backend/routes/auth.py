from flask import Blueprint, request, jsonify, session, current_app
from models import db, AdminUser
from utils.auth import (
    generate_tokens, verify_token, require_auth, update_last_login, 
    validate_password, validate_username, validate_email, check_rate_limit,
    generate_csrf_token, require_csrf
)
from datetime import datetime
import re

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/csrf-token', methods=['GET'])
def get_csrf_token():
    """Get CSRF token for form submission"""
    return jsonify({
        'csrf_token': generate_csrf_token()
    }), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    """Admin login endpoint with enhanced security"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    username = data.get('username', '').strip()
    password = data.get('password', '')
    remember_me = data.get('remember_me', False)
    
    # Field validation
    if not username:
        return jsonify({'error': 'Username is required'}), 400
    
    if not password:
        return jsonify({'error': 'Password is required'}), 400
    
    # Validate username format (if it's not an email)
    if '@' not in username:
        is_valid, error_message = validate_username(username)
        if not is_valid:
            return jsonify({'error': error_message}), 400
    
    try:
        # Find user by username or email
        user = AdminUser.query.filter(
            (AdminUser.username == username) | (AdminUser.email == username)
        ).first()
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
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
        
        # Generate tokens with remember_me option
        tokens = generate_tokens(user.id, user.username, user.role, remember_me)
        
        # Update last login
        update_last_login(user.id)
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict_public(),
            'tokens': tokens
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Login error: {e}")
        return jsonify({'error': 'Login failed', 'message': 'Internal server error'}), 500

@auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    """Refresh access token using refresh token"""
    data = request.get_json()
    
    if not data or not data.get('refresh_token'):
        return jsonify({'error': 'Refresh token is required'}), 400
    
    refresh_token = data['refresh_token']
    payload, error = verify_token(refresh_token, 'refresh')
    
    if error:
        return jsonify({'error': 'Invalid refresh token', 'message': error}), 401
    
    try:
        user = AdminUser.query.get(payload['user_id'])
        if not user or not user.is_active:
            return jsonify({'error': 'User not found or inactive'}), 401
        
        # Check rate limiting
        is_allowed, error_message = check_rate_limit(user)
        if not is_allowed:
            return jsonify({'error': error_message}), 429
        
        # Generate new tokens with same remember_me setting
        remember_me = payload.get('remember_me', False)
        tokens = generate_tokens(user.id, user.username, user.role, remember_me)
        
        return jsonify({
            'message': 'Token refreshed successfully',
            'tokens': tokens
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Token refresh error: {e}")
        return jsonify({'error': 'Token refresh failed', 'message': 'Internal server error'}), 500

@auth_bp.route('/logout', methods=['POST'])
@require_auth
def logout():
    """Logout endpoint (optional token blacklisting)"""
    # In a production environment, you might want to blacklist the token
    # For now, we'll just return success - the client should discard the tokens
    
    return jsonify({
        'message': 'Logout successful'
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@require_auth
def get_profile():
    """Get current user profile"""
    from utils.auth import get_current_user
    user = get_current_user()
    
    return jsonify({
        'user': user.to_dict_public()
    }), 200

@auth_bp.route('/profile', methods=['PUT'])
@require_auth
@require_csrf
def update_profile():
    """Update current user profile with CSRF protection"""
    from utils.auth import get_current_user
    user = get_current_user()
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        # Update allowed fields
        if 'email' in data:
            email = data['email'].strip()
            is_valid, error_message = validate_email(email)
            if not is_valid:
                return jsonify({'error': error_message}), 400
            
            # Check if email is already taken by another user
            existing_user = AdminUser.query.filter(
                AdminUser.email == email,
                AdminUser.id != user.id
            ).first()
            if existing_user:
                return jsonify({'error': 'Email already in use'}), 400
            
            user.email = email
        
        if 'username' in data:
            username = data['username'].strip()
            is_valid, error_message = validate_username(username)
            if not is_valid:
                return jsonify({'error': error_message}), 400
            
            # Check if username is already taken by another user
            existing_user = AdminUser.query.filter(
                AdminUser.username == username,
                AdminUser.id != user.id
            ).first()
            if existing_user:
                return jsonify({'error': 'Username already in use'}), 400
            
            user.username = username
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict_public()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Profile update error: {e}")
        return jsonify({'error': 'Profile update failed', 'message': 'Internal server error'}), 500

@auth_bp.route('/change-password', methods=['POST'])
@require_auth
@require_csrf
def change_password():
    """Change current user password with CSRF protection"""
    from utils.auth import get_current_user
    user = get_current_user()
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')
    
    if not current_password:
        return jsonify({'error': 'Current password is required'}), 400
    
    if not new_password:
        return jsonify({'error': 'New password is required'}), 400
    
    # Verify current password
    if not user.check_password(current_password):
        return jsonify({'error': 'Current password is incorrect'}), 400
    
    # Validate new password
    is_valid, error_message = validate_password(new_password)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    try:
        user.set_password(new_password)
        db.session.commit()
        
        return jsonify({
            'message': 'Password changed successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Password change error: {e}")
        return jsonify({'error': 'Password change failed', 'message': 'Internal server error'}), 500

@auth_bp.route('/users', methods=['GET'])
@require_auth
def get_users():
    """Get all admin users (super admin only)"""
    from utils.auth import get_current_user
    user = get_current_user()
    
    if user.role != 'super_admin':
        return jsonify({'error': 'Forbidden', 'message': 'Super admin access required'}), 403
    
    try:
        users = AdminUser.query.all()
        return jsonify({
            'users': [u.to_dict_public() for u in users]
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get users error: {e}")
        return jsonify({'error': 'Failed to fetch users', 'message': 'Internal server error'}), 500

@auth_bp.route('/users', methods=['POST'])
@require_auth
@require_csrf
def create_user():
    """Create new admin user (super admin only) with CSRF protection"""
    from utils.auth import get_current_user
    user = get_current_user()
    
    if user.role != 'super_admin':
        return jsonify({'error': 'Forbidden', 'message': 'Super admin access required'}), 403
    
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    role = data.get('role', 'admin')
    
    if not username:
        return jsonify({'error': 'Username is required'}), 400
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    if not password:
        return jsonify({'error': 'Password is required'}), 400
    
    # Validate input fields
    is_valid, error_message = validate_username(username)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    is_valid, error_message = validate_email(email)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    is_valid, error_message = validate_password(password)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    # Check if username or email already exists
    existing_user = AdminUser.query.filter(
        (AdminUser.username == username) | (AdminUser.email == email)
    ).first()
    if existing_user:
        return jsonify({'error': 'Username or email already exists'}), 400
    
    try:
        new_user = AdminUser(
            username=username,
            email=email,
            role=role
        )
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user': new_user.to_dict_public()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"User creation error: {e}")
        return jsonify({'error': 'User creation failed', 'message': 'Internal server error'}), 500 