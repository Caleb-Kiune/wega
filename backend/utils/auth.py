import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from models import AdminUser, db

def generate_tokens(user_id, username, role):
    """Generate access and refresh tokens"""
    secret_key = os.environ.get('JWT_SECRET_KEY', 'your-jwt-secret-key-change-in-production')
    access_expires = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 1800))  # 30 minutes
    refresh_expires = int(os.environ.get('JWT_REFRESH_TOKEN_EXPIRES', 604800))  # 7 days
    
    # Access token payload
    access_payload = {
        'user_id': user_id,
        'username': username,
        'role': role,
        'type': 'access',
        'exp': datetime.utcnow() + timedelta(seconds=access_expires),
        'iat': datetime.utcnow()
    }
    
    # Refresh token payload
    refresh_payload = {
        'user_id': user_id,
        'username': username,
        'type': 'refresh',
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
    
    return True, None 