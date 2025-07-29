import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload configuration
    UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'static', 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    
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
        'https://wega-chi.vercel.app',  # Your current Vercel URL
        # Backend URLs for testing
        'https://wega-backend.onrender.com',  # Your Render backend URL
        'https://wega-production-28c0.up.railway.app'  # Your Railway backend URL
    ]
    CORS_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
    CORS_ALLOW_HEADERS = ['Content-Type', 'Authorization', 'X-CSRF-Token']
    CORS_SUPPORTS_CREDENTIALS = True
    
    # JWT configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = 1800  # 30 minutes
    JWT_REFRESH_TOKEN_EXPIRES = 604800  # 7 days
    JWT_ACCESS_TOKEN_EXPIRES_REMEMBER = 86400  # 24 hours
    JWT_REFRESH_TOKEN_EXPIRES_REMEMBER = 2592000  # 30 days

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    BASE_URL = os.environ.get('BASE_URL', 'http://localhost:5000')
    
    # SQLite doesn't support PostgreSQL-specific options
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
    }

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    
    # Handle database URL with fallback
    _database_url = os.environ.get('DATABASE_URL')
    if _database_url:
        # Handle Railway's PostgreSQL URL format
        if _database_url.startswith('postgres://'):
            _database_url = _database_url.replace('postgres://', 'postgresql://', 1)
        SQLALCHEMY_DATABASE_URI = _database_url
        # PostgreSQL supports all connection pooling options
        SQLALCHEMY_ENGINE_OPTIONS = {
            'pool_pre_ping': True,
            'pool_recycle': 300,
            'pool_timeout': 20,
            'max_overflow': 10,
        }
    else:
        # Fallback to SQLite for production if no DATABASE_URL is set
        SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
        print("⚠️  WARNING: No DATABASE_URL found, using SQLite fallback")
        # SQLite doesn't support PostgreSQL-specific options
        SQLALCHEMY_ENGINE_OPTIONS = {
            'pool_pre_ping': True,
        }
    
    BASE_URL = os.environ.get('BASE_URL', 'https://wega-production-28c0.up.railway.app')
    
    # Production CORS settings - allow multiple origins
    cors_origins = os.environ.get('CORS_ORIGINS')
    if cors_origins:
        CORS_ORIGINS = cors_origins.split(',')
    else:
        # Default production origins
        CORS_ORIGINS = [
            'https://wega-chi.vercel.app',
            'https://wega-one.vercel.app',
            'https://wega-kitchenware.vercel.app'
        ]

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False
    
    # SQLite doesn't support PostgreSQL-specific options
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
    }

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
} 