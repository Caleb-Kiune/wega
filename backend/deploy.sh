#!/bin/bash

echo "🚀 Deploying Wega Kitchenware Backend"
echo "====================================="

# Check if we're in production environment
if [ "$FLASK_ENV" = "production" ]; then
    echo "🔧 Production environment detected"
    
    # Check if DATABASE_URL is set
    if [ -z "$DATABASE_URL" ]; then
        echo "⚠️  WARNING: DATABASE_URL not set, will use SQLite fallback"
    else
        echo "✅ DATABASE_URL is configured"
    fi
    
    # Check if SECRET_KEY is set
    if [ -z "$SECRET_KEY" ]; then
        echo "⚠️  WARNING: SECRET_KEY not set, using default (not secure for production)"
    else
        echo "✅ SECRET_KEY is configured"
    fi
    
    # Check if JWT_SECRET_KEY is set
    if [ -z "$JWT_SECRET_KEY" ]; then
        echo "⚠️  WARNING: JWT_SECRET_KEY not set, using default (not secure for production)"
    else
        echo "✅ JWT_SECRET_KEY is configured"
    fi
    
    # Initialize database
    echo "🗄️  Initializing database..."
    python scripts/init_production_db.py
    
    if [ $? -eq 0 ]; then
        echo "✅ Database initialization completed"
    else
        echo "⚠️  Database initialization had issues, trying to fix table structure..."
        python scripts/fix_admin_users_table.py
    fi
else
    echo "🔧 Development environment detected"
fi

# Start the application
echo "🚀 Starting application..."
exec gunicorn -w 4 -b 0.0.0.0:$PORT run:app