#!/bin/bash

echo "🔧 Railway Data Restoration Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📊 Checking Railway backend status..."
cd backend

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed or not in PATH"
    exit 1
fi

# Check if requests module is available
if ! python3 -c "import requests" &> /dev/null; then
    echo "❌ Python requests module is not installed"
    echo "Please install it with: pip install requests"
    exit 1
fi

echo "✅ Python environment is ready"
echo ""

# Run the Railway data persistence manager
echo "🔄 Running Railway data persistence manager..."
python3 railway_data_persistence.py

echo ""
echo "✅ Railway data restoration completed!"
echo "🌐 Your website should now show products correctly" 