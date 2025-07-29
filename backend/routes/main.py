from flask import Blueprint, jsonify, send_from_directory, current_app
import os
from models import db

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Root endpoint"""
    return jsonify({
        'message': 'Welcome to Wega Kitchenware API',
        'endpoints': {
            'products': '/api/products',
            'categories': '/api/categories',
            'brands': '/api/brands',
            'cart': '/api/cart',
            'orders': '/api/orders',
            'delivery': '/api/delivery-locations',
            'upload': '/api/upload'
        }
    })

@main_bp.route('/api/health')
def health_check():
    """Health check endpoint for deployment monitoring"""
    try:
        # Test database connection
        db.engine.execute("SELECT 1")
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return jsonify({
        'status': 'ok',
        'database': db_status,
        'environment': current_app.config.get('ENV', 'development'),
        'debug': current_app.config.get('DEBUG', False)
    }), 200

@main_bp.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory(current_app.static_folder, filename)

@main_bp.route('/images/products/<path:filename>')
def serve_product_image(filename):
    """Serve product images"""
    return send_from_directory(
        os.path.join(current_app.static_folder, 'images', 'products'), 
        filename
    )

@main_bp.route('/images/<path:filename>')
def serve_image(filename):
    """Serve images from the root images directory"""
    return send_from_directory(
        os.path.join(current_app.static_folder, 'images'), 
        filename
    )

@main_bp.route('/static/uploads/<path:filename>')
def serve_upload(filename):
    """Serve uploaded files"""
    return send_from_directory(
        os.path.join(current_app.static_folder, 'uploads'), 
        filename
    ) 