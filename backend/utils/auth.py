import jwt
import os
import secrets
import re
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app, session
from models import AdminUser, db

def generate_csrf_token():
    """Generate a CSRF token"""
    if 'csrf_token' not in session:
        session['csrf_token'] = secrets.token_urlsafe(32)
    return session['csrf_token']

def validate_csrf_token(token):
    """Validate CSRF token"""
    if not token:
        return False
    return token == session.get('csrf_token')

def generate_tokens(user_id, username, role, remember_me=False):
    """Generate access and refresh tokens"""
    secret_key = os.environ.get('JWT_SECRET_KEY', 'your-jwt-secret-key-change-in-production')
    
    # Set expiration based on remember_me
    if remember_me:
        access_expires = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES_REMEMBER', 86400))  # 24 hours
        refresh_expires = int(os.environ.get('JWT_REFRESH_TOKEN_EXPIRES_REMEMBER', 2592000))  # 30 days
    else:
        access_expires = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 1800))  # 30 minutes
        refresh_expires = int(os.environ.get('JWT_REFRESH_TOKEN_EXPIRES', 604800))  # 7 days
    
    # Access token payload
    access_payload = {
        'user_id': user_id,
        'username': username,
        'role': role,
        'type': 'access',
        'remember_me': remember_me,
        'exp': datetime.utcnow() + timedelta(seconds=access_expires),
        'iat': datetime.utcnow()
    }
    
    # Refresh token payload
    refresh_payload = {
        'user_id': user_id,
        'username': username,
        'type': 'refresh',
        'remember_me': remember_me,
        'exp': datetime.utcnow() + timedelta(seconds=refresh_expires),
        'iat': datetime.utcnow()
    }
    
    # Generate tokens
    access_token = jwt.encode(access_payload, secret_key, algorithm='HS256')
    refresh_token = jwt.encode(refresh_payload, secret_key, algorithm='HS256')
    
    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'access_expires_in': access_expires,
        'refresh_expires_in': refresh_expires
    }

def verify_token(token, token_type='access'):
    """Verify JWT token and return payload"""
    try:
        secret_key = os.environ.get('JWT_SECRET_KEY', 'your-jwt-secret-key-change-in-production')
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        
        # Check token type
        if payload.get('type') != token_type:
            return None, 'Invalid token type'
        
        # Check if token is expired
        if datetime.utcnow() > datetime.fromtimestamp(payload['exp']):
            return None, 'Token expired'
        
        return payload, None
    except jwt.ExpiredSignatureError:
        return None, 'Token expired'
    except jwt.InvalidTokenError:
        return None, 'Invalid token'
    except Exception as e:
        return None, str(e)

def get_current_user():
    """Get current user from JWT token"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    payload, error = verify_token(token, 'access')
    
    if error:
        return None
    
    user = AdminUser.query.get(payload['user_id'])
    if not user or not user.is_active:
        return None
    
    return user

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({
                'error': 'Unauthorized',
                'message': 'Authentication required'
            }), 401
        return f(*args, **kwargs)
    return decorated_function

def require_role(required_role):
    """Decorator to require specific role"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = get_current_user()
            if not user:
                return jsonify({
                    'error': 'Unauthorized',
                    'message': 'Authentication required'
                }), 401
            
            if user.role != required_role and user.role != 'super_admin':
                return jsonify({
                    'error': 'Forbidden',
                    'message': f'Role {required_role} required'
                }), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def require_csrf(f):
    """Decorator to require CSRF token"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        csrf_token = request.headers.get('X-CSRF-Token')
        if not validate_csrf_token(csrf_token):
            return jsonify({
                'error': 'Forbidden',
                'message': 'Invalid CSRF token'
            }), 403
        return f(*args, **kwargs)
    return decorated_function

def update_last_login(user_id):
    """Update user's last login timestamp"""
    try:
        user = AdminUser.query.get(user_id)
        if user:
            user.last_login = datetime.utcnow()
            db.session.commit()
    except Exception as e:
        current_app.logger.error(f"Error updating last login: {e}")
        db.session.rollback()

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"
    
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter"
    
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one number"
    
    if not any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password):
        return False, "Password must contain at least one special character"
    
    return True, None

def validate_username(username):
    """Validate username format"""
    if len(username) < 3:
        return False, "Username must be at least 3 characters long"
    
    if len(username) > 30:
        return False, "Username must be no more than 30 characters long"
    
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return False, "Username can only contain letters, numbers, and underscores"
    
    return True, None

def validate_email(email):
    """Validate email format"""
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return False, "Invalid email format"
    
    return True, None

def check_rate_limit(user):
    """Check if user is rate limited"""
    if user.is_locked():
        remaining = user.get_lockout_remaining()
        return False, f"Account is locked. Please try again in {remaining} seconds."
    
    return True, None 