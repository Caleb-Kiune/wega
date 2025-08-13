import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'your-secret-key-here'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # File Upload Configuration
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME') or 'dy082ykuf'
    CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET')
    
    # WhatsApp Configuration
    WHATSAPP_PHONE_NUMBER = os.environ.get('WHATSAPP_PHONE_NUMBER') or '254774639253'
    WHATSAPP_BUSINESS_HOURS = {
        'START': '8:00 AM',
        'END': '6:00 PM',
        'TIMEZONE': 'EAT'
    }
    
    # Email Configuration (for future use)
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    
    # Security Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')
    
    # Pagination Configuration
    DEFAULT_PAGE_SIZE = 10
    MAX_PAGE_SIZE = 100
    
    # Order Configuration
    DEFAULT_CURRENCY = 'KES'
    DEFAULT_COUNTRY = 'Kenya'
    
    # Development Configuration
    DEBUG = os.environ.get('FLASK_ENV') == 'development'
    
    # Logging Configuration
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    
    # Cache Configuration (for future use)
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = 300
    
    # Rate Limiting (for future use)
    RATELIMIT_ENABLED = True
    RATELIMIT_STORAGE_URL = 'memory://'
    
    # Session Configuration
    SESSION_COOKIE_SECURE = os.environ.get('FLASK_ENV') == 'production'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # File Storage Configuration
    STORAGE_TYPE = os.environ.get('STORAGE_TYPE', 'local')  # 'local' or 'cloudinary'
    
    # API Configuration
    API_TITLE = 'WEGA Kitchenware API'
    API_VERSION = 'v1'
    OPENAPI_VERSION = '3.0.2'
    OPENAPI_URL_PREFIX = '/'
    OPENAPI_SWAGGER_UI_PATH = '/swagger-ui'
    OPENAPI_SWAGGER_UI_URL = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/'

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
        # Default production origins - comprehensive list
        CORS_ORIGINS = [
            # Vercel deployments
            'https://wega-chi.vercel.app',
            'https://wega-one.vercel.app',
            'https://wega-kitchenware.vercel.app',
            'https://wega-kitchenware-frontend.vercel.app',
            # Netlify deployments
            'https://wega-kitchenware.netlify.app',
            # Railway deployments
            'https://wega-frontend.railway.app',
            # Custom domains
            'https://wega-kitchenware.com',
            'https://www.wega-kitchenware.com',
            # Development
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001'
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