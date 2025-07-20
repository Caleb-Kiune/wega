from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from config import config
import os

def create_app(config_name='default'):
    """Application factory function"""
    
    # Use production config if DATABASE_URL is set and is PostgreSQL (Railway deployment)
    if os.environ.get('DATABASE_URL') and 'postgresql' in os.environ.get('DATABASE_URL', ''):
        config_name = 'production'
        print(f"🔄 Using production config (PostgreSQL DATABASE_URL detected)")
    else:
        print(f"🔄 Using config: {config_name}")
    
    # Use custom instance path to force use of main database file
    instance_path = os.path.abspath(os.path.dirname(__file__))
    app = Flask(__name__, static_folder='static', instance_path=instance_path)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Check if database URI is set
    if not app.config.get('SQLALCHEMY_DATABASE_URI'):
        print("❌ ERROR: SQLALCHEMY_DATABASE_URI not configured!")
        print("   Please set DATABASE_URL environment variable")
        print("   Current environment:", os.environ.get('FLASK_ENV', 'unknown'))
        print("   Available environment variables:", list(os.environ.keys()))
        raise RuntimeError("SQLALCHEMY_DATABASE_URI not configured")
    
    print(f"✅ Database URI configured: {app.config['SQLALCHEMY_DATABASE_URI'][:50]}...")
    
    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)
    
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
    
    # Run migrations ONLY for PostgreSQL in production
    if config_name == 'production' and 'postgresql' in os.environ.get('DATABASE_URL', ''):
        print(f"🔄 Running PostgreSQL migrations...")
        with app.app_context():
            try:
                print("🔄 Starting database migration...")
                from flask_migrate import upgrade
                upgrade()
                print("✅ Database migrations completed successfully")
            except Exception as e:
                print(f"❌ Migration failed with error: {e}")
                print(f"❌ Error type: {type(e).__name__}")
                print(f"❌ Error details: {str(e)}")
                
                # Try to get more specific error information
                try:
                    import traceback
                    print(f"❌ Full traceback:")
                    traceback.print_exc()
                except:
                    pass
                
                print("⚠️  Application will continue without database tables")
                print("⚠️  API endpoints requiring database will fail")
    else:
        print(f"⚠️  Migration skipped - config: {config_name}, DATABASE_URL: {os.environ.get('DATABASE_URL', 'Not set')[:50]}...")
    
    return app 