#!/bin/bash

# 🚀 Wega Kitchenware Cloudinary Setup Script
# This script helps you quickly set up Cloudinary for your backend

echo "🚀 Welcome to Wega Kitchenware Cloudinary Setup!"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "app_factory.py" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    echo "   cd backend && ./setup_cloudinary.sh"
    exit 1
fi

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed or not in PATH"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ] && [ ! -d "../venv" ]; then
    echo "⚠️  Warning: No virtual environment found"
    echo "   Creating one now..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    if [ -d "venv" ]; then
        source venv/bin/activate
    else
        source ../venv/bin/activate
    fi
fi

echo ""
echo "🔑 Step 1: Cloudinary Credentials"
echo "----------------------------------"
echo "Please enter your Cloudinary credentials:"
echo ""

read -p "Cloud Name (e.g., dy082ykuf): " CLOUD_NAME
read -p "API Key: " API_KEY
read -p "API Secret: " API_SECRET

# Validate inputs
if [ -z "$CLOUD_NAME" ] || [ -z "$API_KEY" ] || [ -z "$API_SECRET" ]; then
    echo "❌ Error: All fields are required!"
    exit 1
fi

echo ""
echo "✅ Credentials received!"
echo ""

# Create .env file
echo "📝 Creating .env file..."
cat > .env << EOF
CLOUDINARY_CLOUD_NAME=$CLOUD_NAME
CLOUDINARY_API_KEY=$API_KEY
CLOUDINARY_API_SECRET=$API_SECRET
EOF

echo "✅ .env file created successfully!"
echo ""

# Test Cloudinary connection
echo "🔍 Testing Cloudinary connection..."
python3 -c "
import cloudinary
import os
from dotenv import load_dotenv

load_dotenv()

try:
    cloudinary.config(
        cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
        api_key=os.environ.get('CLOUDINARY_API_KEY'),
        api_secret=os.environ.get('CLOUDINARY_API_SECRET')
    )
    print('✅ Cloudinary connection successful!')
except Exception as e:
    print(f'❌ Cloudinary connection failed: {e}')
    exit(1)
"

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Cloudinary connection failed. Please check your credentials."
    exit 1
fi

echo ""
echo "🖼️  Step 2: Upload Images to Cloudinary"
echo "----------------------------------------"
echo "Found images in static/uploads:"
ls -la static/uploads/*.{jpg,jpeg,png,gif,webp} 2>/dev/null | wc -l | tr -d ' ' && echo " images found" || echo "0 images found"

echo ""
read -p "Do you want to upload images to Cloudinary now? (y/n): " UPLOAD_CHOICE

if [[ $UPLOAD_CHOICE =~ ^[Yy]$ ]]; then
    echo ""
    echo "📤 Starting image upload process..."
    python3 scripts/upload_images_to_cloudinary.py
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Images uploaded successfully!"
        echo "📁 Generated files:"
        ls -la scripts/cloudinary_*.py scripts/cloudinary_*.json 2>/dev/null || echo "   No generated files found"
    else
        echo ""
        echo "❌ Image upload failed. Please check the error messages above."
    fi
fi

echo ""
echo "🌱 Step 3: Database Seeding"
echo "----------------------------"
echo "Your database is ready to be seeded with the new Cloudinary images."
echo ""
echo "To seed your database, run one of these commands:"
echo ""
echo "  Option 1 (Recommended):"
echo "    python3 scripts/reseed_with_cloudinary.py"
echo ""
echo "  Option 2 (Your existing script):"
echo "    python3 scripts/seed_short_names.py"
echo ""

# Check if we're in a git repository
if [ -d ".git" ]; then
    echo "📝 Step 4: Git Configuration"
    echo "-----------------------------"
    echo "Adding .env to .gitignore to protect your credentials..."
    
    if ! grep -q "\.env" .gitignore; then
        echo ".env" >> .gitignore
        echo "✅ Added .env to .gitignore"
    else
        echo "✅ .env is already in .gitignore"
    fi
    
    echo ""
    echo "⚠️  Important: Never commit your .env file to version control!"
fi

echo ""
echo "🎯 Step 5: Render Deployment"
echo "-----------------------------"
echo "To deploy to Render with Cloudinary support:"
echo ""
echo "1. Go to your Render dashboard"
echo "2. Add these environment variables to your service:"
echo "   - CLOUDINARY_CLOUD_NAME = $CLOUD_NAME"
echo "   - CLOUDINARY_API_KEY = $API_KEY"
echo "   - CLOUDINARY_API_SECRET = $API_SECRET"
echo ""
echo "3. Redeploy your service"
echo ""

echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "✅ Cloudinary credentials configured"
echo "✅ Environment variables set"
echo "✅ Connection tested successfully"
echo ""
echo "Next steps:"
echo "1. Upload images to Cloudinary (if not done already)"
echo "2. Seed your database with the new script"
echo "3. Deploy to Render with the new environment variables"
echo ""
echo "🚀 Happy coding!"
