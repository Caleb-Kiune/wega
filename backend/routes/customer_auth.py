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
            # Check if this email might belong to a deleted account
            # We can't directly look it up since we anonymize emails, but we can provide a helpful message
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check if account is deleted
        if user.deleted_at is not None:
            return jsonify({
                'error': 'Account deleted',
                'message': 'This account has been deleted and cannot be accessed.'
            }), 401
        
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

@customer_auth_bp.route('/change-password', methods=['POST'])
@require_customer_auth
def change_password():
    """Change customer password"""
    try:
        user_id = request.user_id
        user = CustomerUser.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
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
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Validate new password
        is_valid_password, error_message = validate_password(new_password)
        if not is_valid_password:
            return jsonify({'error': error_message}), 400
        
        # Update password
        user.set_password(new_password)
        db.session.commit()
        
        return jsonify({
            'message': 'Password changed successfully'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Change password error: {e}")
        db.session.rollback()
        return jsonify({
            'error': 'Failed to change password'
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

@customer_auth_bp.route('/delete-account', methods=['POST'])
@require_customer_auth
def delete_account():
    """Delete customer account - simplified version without password requirement"""
    try:
        current_app.logger.info("Delete account endpoint called")
        
        user_id = request.user_id
        current_app.logger.info(f"User ID from request: {user_id}")
        
        user = CustomerUser.query.get(user_id)
        current_app.logger.info(f"User found: {user is not None}")
        
        if not user:
            current_app.logger.warning(f"User not found for ID: {user_id}")
            return jsonify({'error': 'User not found'}), 404
        
        # Check if user is already deleted
        if user.deleted_at is not None:
            current_app.logger.info(f"User {user_id} is already deleted at {user.deleted_at}")
            return jsonify({
                'error': 'Account already deleted',
                'message': 'Your account has already been deleted and will be permanently removed after 30 days.'
            }), 400
        
        # Log the deletion request for audit purposes
        current_app.logger.info(f"Account deletion requested for user {user_id} ({user.email})")
        
        # Soft delete - mark as deleted but retain for legal compliance
        user.is_active = False
        user.deleted_at = datetime.utcnow()
        user.deletion_reason = 'User requested deletion'
        
        # Anonymize sensitive data (GDPR compliance)
        user.first_name = f"Deleted_{user_id}"
        user.last_name = "User"
        user.email = f"deleted_{user_id}@deleted.user"
        
        # Clear any sensitive data
        user.last_login = None
        
        current_app.logger.info("About to commit changes to database")
        
        # Commit the changes
        db.session.commit()
        
        # Log successful deletion
        current_app.logger.info(f"Account successfully deleted for user {user_id}")
        
        return jsonify({
            'message': 'Account deleted successfully',
            'note': 'Your data has been anonymized and will be permanently deleted after 30 days in accordance with our data retention policy.'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Account deletion error: {e}")
        current_app.logger.error(f"Error type: {type(e)}")
        current_app.logger.error(f"Error details: {str(e)}")
        import traceback
        current_app.logger.error(f"Traceback: {traceback.format_exc()}")
        db.session.rollback()
        return jsonify({
            'error': 'Failed to delete account',
            'message': 'Please try again later or contact support.'
        }), 500

@customer_auth_bp.route('/test-delete', methods=['POST'])
@require_customer_auth
def test_delete():
    """Test endpoint to debug delete account functionality"""
    try:
        current_app.logger.info("Test delete endpoint called")
        
        user_id = request.user_id
        current_app.logger.info(f"User ID: {user_id}")
        
        user = CustomerUser.query.get(user_id)
        current_app.logger.info(f"User found: {user is not None}")
        
        if user:
            current_app.logger.info(f"User email: {user.email}")
            current_app.logger.info(f"User is_active: {user.is_active}")
            current_app.logger.info(f"User deleted_at: {user.deleted_at}")
        
        return jsonify({
            'message': 'Test successful',
            'user_id': user_id,
            'user_found': user is not None,
            'user_email': user.email if user else None
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Test delete error: {e}")
        import traceback
        current_app.logger.error(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            'error': 'Test failed',
            'message': str(e)
        }), 500

@customer_auth_bp.route('/export-data', methods=['GET'])
@require_customer_auth
def export_user_data():
    """Export user data (GDPR compliance)"""
    try:
        user_id = request.user_id
        user = CustomerUser.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Prepare user data for export
        user_data = {
            'user_id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'last_login': user.last_login.isoformat() if user.last_login else None,
            'is_active': user.is_active,
            'email_verified': user.email_verified,
            'exported_at': datetime.utcnow().isoformat()
        }
        
        # Log data export for audit
        current_app.logger.info(f"Data export requested for user {user_id}")
        
        return jsonify({
            'message': 'Data export successful',
            'data': user_data
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Data export error: {e}")
        return jsonify({
            'error': 'Failed to export data'
        }), 500
