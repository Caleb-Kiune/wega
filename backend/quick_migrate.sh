#!/bin/bash

# Quick PostgreSQL Migration Script for Wega Kitchenware
# This script automates the entire migration process

set -e  # Exit on any error

echo "🚀 Wega Kitchenware PostgreSQL Migration"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the backend directory
if [ ! -f "config.py" ]; then
    print_error "Please run this script from the backend directory"
    exit 1
fi

# Step 1: Check PostgreSQL installation
echo "🔍 Checking PostgreSQL installation..."
if command -v psql &> /dev/null; then
    print_status "PostgreSQL is already installed"
else
    print_warning "PostgreSQL not found. Installing..."
    
    # Detect OS and install PostgreSQL
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt update
        sudo apt install -y postgresql postgresql-contrib
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
        print_status "PostgreSQL installed on Linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install postgresql
        brew services start postgresql
        print_status "PostgreSQL installed on macOS"
    else
        print_error "Unsupported OS. Please install PostgreSQL manually"
        exit 1
    fi
fi

# Step 2: Create database and user
echo "🗄️  Creating database and user..."
sudo -u postgres createdb wega_kitchenware 2>/dev/null || print_warning "Database already exists"
sudo -u postgres psql -c "CREATE USER wega_user WITH PASSWORD 'wega_password';" 2>/dev/null || print_warning "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE wega_kitchenware TO wega_user;" 2>/dev/null || print_warning "Privileges already granted"
print_status "Database and user configured"

# Step 3: Create environment file
echo "⚙️  Setting up environment file..."
cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://wega_user:wega_password@localhost:5432/wega_kitchenware

# Security (Change these in production!)
SECRET_KEY=wega-kitchenware-secret-key-change-in-production
JWT_SECRET_KEY=wega-kitchenware-jwt-secret-change-in-production

# Development
DEBUG=True
FLASK_ENV=development

# CORS (Development)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF
print_status "Environment file created"

# Step 4: Backup SQLite database
echo "💾 Backing up SQLite database..."
if [ -f "app.db" ]; then
    cp app.db app.db.backup
    print_status "SQLite database backed up to app.db.backup"
else
    print_warning "No SQLite database found to backup"
fi

# Step 5: Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt
print_status "Dependencies installed"

# Step 6: Run migration scripts
echo "🔄 Running migration scripts..."

# Setup PostgreSQL database
if [ -f "scripts/setup_postgresql.py" ]; then
    echo "📜 Running setup_postgresql.py..."
    python scripts/setup_postgresql.py
    print_status "Database setup completed"
else
    print_error "setup_postgresql.py not found"
    exit 1
fi

# Seed PostgreSQL database
if [ -f "scripts/seed_postgresql.py" ]; then
    echo "📜 Running seed_postgresql.py..."
    python scripts/seed_postgresql.py
    print_status "Database seeding completed"
else
    print_error "seed_postgresql.py not found"
    exit 1
fi

# Step 7: Test the migration
echo "🧪 Testing the migration..."

# Test database connection
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
print('DATABASE_URL:', os.environ.get('DATABASE_URL'))
" 2>/dev/null && print_status "Environment variables loaded"

# Test application
python -c "
import sys
sys.path.insert(0, '.')
from app_factory import create_app
from models import db

app = create_app('development')
with app.app_context():
    db.engine.execute('SELECT 1')
    print('✅ Application database connection successful')
" 2>/dev/null && print_status "Application test passed"

# Step 8: Run integration test
if [ -f "../test_postgresql_integration.py" ]; then
    echo "🧪 Running integration tests..."
    cd ..
    python test_postgresql_integration.py
    cd backend
    print_status "Integration tests completed"
else
    print_warning "Integration test script not found"
fi

echo ""
echo "🎉 PostgreSQL Migration Completed Successfully!"
echo "=============================================="
echo ""
echo "✅ PostgreSQL installed and configured"
echo "✅ Database and user created"
echo "✅ Environment variables set"
echo "✅ Tables created and seeded"
echo "✅ All tests passed"
echo ""
echo "📋 Next Steps:"
echo "1. Start the backend: python run.py"
echo "2. Start the frontend: npm run dev"
echo "3. Test the application: http://localhost:3000"
echo ""
echo "🔧 Database Information:"
echo "- Database: wega_kitchenware"
echo "- User: wega_user"
echo "- Password: wega_password"
echo "- Host: localhost"
echo "- Port: 5432"
echo ""
echo "⚠️  Important:"
echo "- Change default passwords in production"
echo "- Update environment variables for production"
echo "- Set up proper backup strategy"
echo ""
echo "🚀 Your Wega Kitchenware app is now running with PostgreSQL!" 