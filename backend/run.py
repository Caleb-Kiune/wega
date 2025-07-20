#!/usr/bin/env python3
"""
Main application entry point for Wega Kitchenware Backend
"""
import os
from app_factory import create_app

# Get environment from environment variable
env = os.environ.get('FLASK_ENV', 'development')

# Create the application
app = create_app(env)

# Auto-run migrations in production
if env == 'production':
    with app.app_context():
        try:
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
    print(f"🌍 Environment: {env}")
    print(f"🔗 Database URL: {os.environ.get('DATABASE_URL', 'Not set')}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=app.config.get('DEBUG', False)
    ) 