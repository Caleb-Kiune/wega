from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from config import config
import os

def create_app(config_name='default'):
    """Application factory function"""
    # Use custom instance path to force use of main database file
    instance_path = os.path.abspath(os.path.dirname(__file__))
    app = Flask(__name__, static_folder='static', instance_path=instance_path)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    # migrate = Migrate(app, db)  # Removed, now handled in run.py
    
    # Configure CORS
    if app.config['DEBUG']:
        # In development, allow all origins for easy local testing
        CORS(app, resources={r"/*": {"origins": "*"}})
    else:
        # In production, use the strict list
        CORS(app, resources={r"/*": {
            "origins": app.config['CORS_ORIGINS'],
            "methods": app.config['CORS_METHODS'],
            "allow_headers": app.config['CORS_ALLOW_HEADERS'],
            "supports_credentials": app.config['CORS_SUPPORTS_CREDENTIALS']
        }})
    
    # Ensure upload directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Register blueprints
    from routes.products import products_bp
    from routes.categories import categories_bp
    from routes.brands import brands_bp
    from routes.reviews import reviews_bp
    from routes.cart import cart_bp
    from routes.orders import orders_bp
    from routes.delivery import delivery_bp
    from routes.upload import upload_bp
    from routes.docs import docs_bp
    from routes.admin import admin_bp
    from routes.auth import auth_bp
    from routes.order_tracking import order_tracking_bp
    from routes.customer_auth import customer_auth_bp

    
    app.register_blueprint(products_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(brands_bp)
    app.register_blueprint(reviews_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(delivery_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(docs_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(order_tracking_bp)
    app.register_blueprint(customer_auth_bp)

    
    # Register main routes
    from routes.main import main_bp
    app.register_blueprint(main_bp)
    
    # Add request logging
    @app.before_request
    def log_request_info():
        print('Headers:', dict(request.headers))
        print('Body:', request.get_data())
        print('Args:', request.args)
        print('Method:', request.method)
        print('URL:', request.url)
    
    # Add error handling
    @app.errorhandler(Exception)
    def handle_error(error):
        response = {
            "error": str(error),
            "message": "An error occurred while processing your request"
        }
        return jsonify(response), getattr(error, 'code', 500)
    
    return app 