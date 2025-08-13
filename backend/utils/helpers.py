import os
import uuid
import datetime
from decimal import Decimal
from flask import current_app

def validate_image_file(file):
    """Validate image file more thoroughly"""
    # Check file extension
    if not ('.' in file.filename and 
            file.filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']):
        return False, f"Invalid file type. Allowed types: {', '.join(current_app.config['ALLOWED_EXTENSIONS'])}"
    
    # Check file size
    file.seek(0, 2)  # Seek to end
    file_size = file.tell()
    file.seek(0)  # Reset to beginning
    
    if file_size > current_app.config['MAX_FILE_SIZE']:
        return False, f"File too large. Maximum size is {current_app.config['MAX_FILE_SIZE'] // (1024*1024)}MB"
    
    if file_size == 0:
        return False, "File is empty"
    
    # Check MIME type (additional security)
    if file.content_type:
        allowed_mimes = {
            'image/jpeg', 'image/jpg', 'image/png', 
            'image/gif', 'image/webp'
        }
        if file.content_type not in allowed_mimes:
            return False, f"Invalid MIME type: {file.content_type}"
    
    return True, None

def generate_unique_filename(original_filename):
    """Generate a unique filename to prevent conflicts"""
    # Get the file extension
    ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''
    
    # Generate a unique filename with timestamp and UUID
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    unique_id = str(uuid.uuid4())[:8]
    
    if ext:
        return f"{timestamp}_{unique_id}.{ext}"
    else:
        return f"{timestamp}_{unique_id}"

def validate_product_data(data):
    """Validate product data"""
    if not data.get('name'):
        return False, "Product name is required"
    if not data.get('price'):
        return False, "Product price is required"
    try:
        price = Decimal(str(data['price']))
        if price < 0:
            return False, "Price cannot be negative"
    except (ValueError, TypeError):
        return False, "Invalid price format"
    return True, None

def validate_review_data(data):
    """Validate review data"""
    if not data.get('user'):
        return False, "User name is required"
    if not data.get('title'):
        return False, "Review title is required"
    if not data.get('comment'):
        return False, "Review comment is required"
    if not data.get('rating'):
        return False, "Rating is required"
    try:
        rating = int(data['rating'])
        if rating < 1 or rating > 5:
            return False, "Rating must be between 1 and 5"
    except (ValueError, TypeError):
        return False, "Invalid rating format"
    return True, None

def validate_image_data(data):
    """Validate image data"""
    if not data.get('image_url'):
        return False, "Image URL is required"
    return True, None

def validate_specification_data(data):
    """Validate specification data"""
    if not data.get('name'):
        return False, "Specification name is required"
    if not data.get('value'):
        return False, "Specification value is required"
    return True, None

def validate_feature_data(data):
    """Validate feature data"""
    if not data.get('feature'):
        return False, "Feature description is required"
    return True, None

def paginate(query, page=1, per_page=10):
    """Paginate a query"""
    return query.paginate(page=page, per_page=per_page, error_out=False)

def get_base_url():
    """Get the base URL for the application"""
    if current_app.config.get('BASE_URL'):
        return current_app.config['BASE_URL']
    else:
        # In development, use request.host_url if available
        try:
            from flask import request
            return request.host_url.rstrip('/')
        except RuntimeError:
            # No request context, use default
            return 'http://localhost:5000'

def format_image_url(image_url):
    """Format image URL with proper base URL"""
    if not image_url:
        return None
    
    if image_url.startswith('http'):
        return image_url
    elif image_url.startswith('/static/'):
        return f"{get_base_url()}{image_url}"
    else:
        return f"{get_base_url()}/static/uploads/{image_url}" 