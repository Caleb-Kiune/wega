from flask import Blueprint, jsonify, send_from_directory, current_app
import os

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

@main_bp.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Wega Kitchenware API is running'
    })

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