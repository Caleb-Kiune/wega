#!/usr/bin/env python3
"""
Main application entry point for Wega Kitchenware Backend
"""
import os
from app_factory import create_app
from models import db
from flask_migrate import Migrate

# Get environment from environment variable
env = os.environ.get('FLASK_ENV', 'development')

# Create the application
app = create_app(env)

# Register Flask-Migrate with the Flask CLI
migrate = Migrate(app, db)

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
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000)),
        debug=app.config.get('DEBUG', True)
    ) 