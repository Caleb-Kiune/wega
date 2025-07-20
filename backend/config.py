import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
    
    # Upload configuration
    UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'static', 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    
    # Cloudinary configuration
    CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME', 'dy082ykuf')
    CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY', '467453488849521')
    CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET', 'hcevXMTHU3PiVjxCmRLbcqYzFNw')
    
    # CORS configuration
    CORS_ORIGINS = [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://localhost:3002',
        'http://localhost:3003',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:3002',
        'http://127.0.0.1:3003',
        # Allow all localhost origins for development
        'http://localhost:*',
        'http://127.0.0.1:*',
        # Production URLs
        'https://wega-one.vercel.app',  # Your actual Vercel frontend URL
        'https://wega-kitchenware.vercel.app',  # Alternative Vercel URL
        # Backend URLs for testing
        'https://wega-backend.onrender.com',  # Your Render backend URL
        # Railway URLs (will be added dynamically)
        'https://*.railway.app',
        'https://*.up.railway.app'
    ]
    CORS_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
    CORS_ALLOW_HEADERS = ['Content-Type', 'Authorization']
    CORS_SUPPORTS_CREDENTIALS = True

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    # Use PostgreSQL for development
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://wega_user:wega_password@localhost:5432/wega_kitchenware'
    # Set instance path to prevent Flask from using instance folder
    INSTANCE_PATH = os.path.abspath(os.path.dirname(__file__))
    BASE_URL = None  # Will use request.host_url in development

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    BASE_URL = os.environ.get('BASE_URL', 'https://wega-backend.onrender.com')
    
    # Production CORS settings - include Railway domains
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',') + [
        'https://*.railway.app',
        'https://*.up.railway.app',
        'https://wega-one.vercel.app',
        'https://wega-kitchenware.vercel.app'
    ]

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
} 