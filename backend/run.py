#!/usr/bin/env python3
"""
Main application entry point for Wega Kitchenware Backend
"""
import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app_factory import create_app
    print("✅ App factory imported successfully")
except Exception as e:
    print(f"❌ Error importing app factory: {e}")
    sys.exit(1)

# Get environment from environment variable
env = os.environ.get('FLASK_ENV', 'development')
print(f"🌍 Environment: {env}")

# Create the application
try:
    app = create_app(env)
    print("✅ App created successfully")
except Exception as e:
    print(f"❌ Error creating app: {e}")
    sys.exit(1)

# Auto-run migrations in production (but don't fail if it doesn't work)
if env == 'production':
    try:
        with app.app_context():
            from flask_migrate import upgrade
            upgrade()
            print("✅ Database migrations completed successfully")
    except Exception as e:
        print(f"⚠️  Migration warning: {e}")
        print("Database tables will be created automatically if they don't exist")

if __name__ == '__main__':
    # Run the application
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 Starting Flask app on port {port}")
    print(f"🔗 Database URL: {os.environ.get('DATABASE_URL', 'Not set')}")
    
    try:
        app.run(
            host='0.0.0.0',
            port=port,
            debug=False
        )
    except Exception as e:
        print(f"❌ Error starting app: {e}")
        sys.exit(1) 