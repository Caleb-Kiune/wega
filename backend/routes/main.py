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
            'upload': '/api/upload',
            'health': '/health',
            'usage': '/usage'
        }
    })

@main_bp.route('/health')
def health():
    """Health check endpoint - no database required"""
    try:
        # Basic health check without database
        return jsonify({
            'status': 'healthy',
            'message': 'Wega Kitchenware API is running',
            'environment': current_app.config.get('ENV', 'unknown'),
            'debug': current_app.config.get('DEBUG', False),
            'database_configured': bool(current_app.config.get('SQLALCHEMY_DATABASE_URI'))
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'message': f'Health check failed: {str(e)}',
            'environment': current_app.config.get('ENV', 'unknown')
        }), 500

@main_bp.route('/usage')
def usage():
    """Usage monitoring endpoint for free tier tracking"""
    try:
        # Get basic system info
        import psutil
        memory_info = psutil.virtual_memory()
        disk_info = psutil.disk_usage('/')
        
        return jsonify({
            'status': 'success',
            'system': {
                'memory_percent': memory_info.percent,
                'disk_percent': disk_info.percent,
                'cpu_count': psutil.cpu_count()
            },
            'environment': {
                'flask_env': current_app.config.get('ENV', 'unknown'),
                'debug': current_app.config.get('DEBUG', False),
                'database_configured': bool(current_app.config.get('SQLALCHEMY_DATABASE_URI'))
            },
            'free_tier_limits': {
                'railway_credit': '$5/month',
                'cloudinary_storage': '25 GB',
                'cloudinary_bandwidth': '25 GB/month'
            }
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Could not get usage info: {str(e)}'
        }), 500

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