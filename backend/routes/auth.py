from flask import Blueprint, request, jsonify
from models import db, AdminUser
from utils.auth import generate_tokens, verify_token, require_auth, update_last_login, validate_password
from datetime import datetime
import re

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    """Admin login endpoint"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    try:
        # Find user by username or email
        user = AdminUser.query.filter(
            (AdminUser.username == username) | (AdminUser.email == username)
        ).first()
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        if not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Generate tokens
        tokens = generate_tokens(user.id, user.username, user.role)
        
        # Update last login
        update_last_login(user.id)
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict_public(),
            'tokens': tokens
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed', 'message': str(e)}), 500

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
        
        # Generate new tokens
        tokens = generate_tokens(user.id, user.username, user.role)
        
        return jsonify({
            'message': 'Token refreshed successfully',
            'tokens': tokens
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Token refresh failed', 'message': str(e)}), 500

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
def update_profile():
    """Update current user profile"""
    from utils.auth import get_current_user
    user = get_current_user()
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        # Update allowed fields
        if 'email' in data:
            # Check if email is valid
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, data['email']):
                return jsonify({'error': 'Invalid email format'}), 400
            
            # Check if email is already taken by another user
            existing_user = AdminUser.query.filter(
                AdminUser.email == data['email'],
                AdminUser.id != user.id
            ).first()
            if existing_user:
                return jsonify({'error': 'Email already in use'}), 400
            
            user.email = data['email']
        
        if 'username' in data:
            # Check if username is already taken by another user
            existing_user = AdminUser.query.filter(
                AdminUser.username == data['username'],
                AdminUser.id != user.id
            ).first()
            if existing_user:
                return jsonify({'error': 'Username already in use'}), 400
            
            user.username = data['username']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict_public()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Profile update failed', 'message': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@require_auth
def change_password():
    """Change current user password"""
    from utils.auth import get_current_user
    user = get_current_user()
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    
    if not current_password or not new_password:
        return jsonify({'error': 'Current password and new password are required'}), 400
    
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
        return jsonify({'error': 'Password change failed', 'message': str(e)}), 500

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
        return jsonify({'error': 'Failed to fetch users', 'message': str(e)}), 500

@auth_bp.route('/users', methods=['POST'])
@require_auth
def create_user():
    """Create new admin user (super admin only)"""
    from utils.auth import get_current_user
    user = get_current_user()
    
    if user.role != 'super_admin':
        return jsonify({'error': 'Forbidden', 'message': 'Super admin access required'}), 403
    
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'admin')
    
    if not username or not email or not password:
        return jsonify({'error': 'Username, email, and password are required'}), 400
    
    # Validate email format
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Validate password
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
        return jsonify({'error': 'User creation failed', 'message': str(e)}), 500 