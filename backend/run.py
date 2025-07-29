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

# Auto-run migrations and database initialization in production
if env == 'production':
    with app.app_context():
        try:
            # Test database connection
            print("🔍 Testing database connection...")
            db.engine.execute("SELECT 1")
            print("✅ Database connection successful")
            
            # Create all tables if they don't exist
            print("🔧 Creating database tables...")
            db.create_all()
            print("✅ Database tables created/verified successfully")
            
            # Import and create admin user if needed
            from models import AdminUser
            from datetime import datetime
            
            admin_user = AdminUser.query.filter_by(username='admin').first()
            if not admin_user:
                print("👤 Creating default admin user...")
                admin_user = AdminUser(
                    username='admin',
                    email='admin@wega-kitchenware.com',
                    role='super_admin',
                    is_active=True,
                    created_at=datetime.utcnow()
                )
                admin_user.set_password('Admin123!')
                db.session.add(admin_user)
                db.session.commit()
                print("✅ Default admin user created")
                print("   Username: admin")
                print("   Password: Admin123!")
                print("   ⚠️  Remember to change the password after first login!")
            else:
                print("✅ Admin user already exists")
                
        except Exception as e:
            print(f"⚠️  Database initialization warning: {e}")
            print("Database tables will be created automatically if they don't exist")
            print("If this is a fresh deployment, the admin user will be created on first request")

if __name__ == '__main__':
    # Run the application
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000)),
        debug=app.config.get('DEBUG', True)
    ) 