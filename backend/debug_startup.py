#!/usr/bin/env python3
"""
Debug Startup Script
This script helps identify startup issues in the backend application.
"""

import os
import sys
from datetime import datetime

def check_environment():
    """Check if all required environment variables are set"""
    print("🔍 Checking environment variables...")
    
    required_vars = [
        'DATABASE_URL',
        'SECRET_KEY',
        'JWT_SECRET_KEY',
        'DEFAULT_ADMIN_USERNAME',
        'DEFAULT_ADMIN_PASSWORD',
        'FLASK_ENV'
    ]
    
    missing_vars = []
    for var in required_vars:
        value = os.environ.get(var)
        if value:
            # Mask sensitive values
            if 'SECRET' in var or 'PASSWORD' in var or 'DATABASE' in var:
                display_value = value[:8] + '***' if len(value) > 8 else '***'
            else:
                display_value = value
            print(f"✅ {var}: {display_value}")
        else:
            print(f"❌ {var}: Not set")
            missing_vars.append(var)
    
    return missing_vars

def test_imports():
    """Test if all required modules can be imported"""
    print("\n🔍 Testing imports...")
    
    try:
        import flask
        print("✅ Flask imported successfully")
    except ImportError as e:
        print(f"❌ Flask import failed: {e}")
        return False
    
    try:
        from flask_sqlalchemy import SQLAlchemy
        print("✅ Flask-SQLAlchemy imported successfully")
    except ImportError as e:
        print(f"❌ Flask-SQLAlchemy import failed: {e}")
        return False
    
    try:
        from flask_cors import CORS
        print("✅ Flask-CORS imported successfully")
    except ImportError as e:
        print(f"❌ Flask-CORS import failed: {e}")
        return False
    
    try:
        import jwt
        print("✅ PyJWT imported successfully")
    except ImportError as e:
        print(f"❌ PyJWT import failed: {e}")
        return False
    
    try:
        import psycopg2
        print("✅ psycopg2 imported successfully")
    except ImportError as e:
        print(f"❌ psycopg2 import failed: {e}")
        return False
    
    return True

def test_database_connection():
    """Test database connection"""
    print("\n🔍 Testing database connection...")
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL not set")
        return False
    
    try:
        import psycopg2
        conn = psycopg2.connect(database_url)
        conn.close()
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_app_creation():
    """Test if the Flask app can be created"""
    print("\n🔍 Testing Flask app creation...")
    
    try:
        # Add the current directory to Python path
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        
        from app_factory import create_app
        
        # Get environment
        env = os.environ.get('FLASK_ENV', 'development')
        print(f"Creating app with environment: {env}")
        
        app = create_app(env)
        print("✅ Flask app created successfully")
        
        # Test basic app functionality
        with app.app_context():
            print("✅ App context works")
            
        return True
        
    except Exception as e:
        print(f"❌ Flask app creation failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main diagnostic function"""
    print("🔧 WEGA Kitchenware - Backend Startup Diagnostic")
    print("=" * 50)
    print(f"Timestamp: {datetime.now()}")
    print(f"Python version: {sys.version}")
    print(f"Working directory: {os.getcwd()}")
    
    # Check environment variables
    missing_vars = check_environment()
    
    # Test imports
    imports_ok = test_imports()
    
    # Test database connection
    db_ok = test_database_connection()
    
    # Test app creation
    app_ok = test_app_creation()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Diagnostic Summary:")
    print(f"Environment Variables: {'✅ PASS' if not missing_vars else '❌ FAIL'}")
    print(f"Import Tests: {'✅ PASS' if imports_ok else '❌ FAIL'}")
    print(f"Database Connection: {'✅ PASS' if db_ok else '❌ FAIL'}")
    print(f"App Creation: {'✅ PASS' if app_ok else '❌ FAIL'}")
    
    if missing_vars:
        print(f"\n❌ Missing environment variables: {', '.join(missing_vars)}")
    
    if not imports_ok:
        print(f"\n❌ Import tests failed - check requirements.txt")
    
    if not db_ok:
        print(f"\n❌ Database connection failed - check DATABASE_URL")
    
    if not app_ok:
        print(f"\n❌ App creation failed - check your code for errors")
    
    if all([not missing_vars, imports_ok, db_ok, app_ok]):
        print(f"\n🎉 All tests passed! Your app should start successfully.")
    else:
        print(f"\n❌ Some tests failed. Fix the issues above before deploying.")

if __name__ == "__main__":
    main()
