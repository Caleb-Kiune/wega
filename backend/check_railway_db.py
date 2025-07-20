#!/usr/bin/env python3
"""
Script to check Railway database connection and environment variables
"""

import requests
import json
import os

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def check_railway_environment():
    """Check Railway environment and database configuration"""
    
    print("🔧 Railway Environment Checker")
    print("=" * 40)
    
    # Check if backend is accessible
    try:
        response = requests.get(f"{RAILWAY_URL}/health")
        if response.status_code == 200:
            print("✅ Backend is accessible")
        else:
            print(f"❌ Backend returned status: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Backend is not accessible: {str(e)}")
        return
    
    # Check usage endpoint for database info
    try:
        response = requests.get(f"{RAILWAY_URL}/usage")
        if response.status_code == 200:
            data = response.json()
            print(f"📊 Database configured: {data.get('environment', {}).get('database_configured', 'Unknown')}")
            print(f"🔧 Debug mode: {data.get('environment', {}).get('debug', 'Unknown')}")
            print(f"🌍 Flask environment: {data.get('environment', {}).get('flask_env', 'Unknown')}")
        else:
            print(f"❌ Usage endpoint returned: {response.status_code}")
    except Exception as e:
        print(f"❌ Error checking usage: {str(e)}")
    
    # Check products endpoint
    try:
        response = requests.get(f"{RAILWAY_URL}/api/products?limit=1")
        if response.status_code == 200:
            data = response.json()
            print(f"📦 Products in database: {data.get('total', 0)}")
            
            if data.get('total', 0) == 0:
                print("⚠️  Database appears to be empty or not connected properly")
            else:
                print("✅ Database has products - connection working")
        else:
            print(f"❌ Products endpoint returned: {response.status_code}")
    except Exception as e:
        print(f"❌ Error checking products: {str(e)}")
    
    print("\n🔍 TROUBLESHOOTING GUIDE:")
    print("=" * 40)
    print("If database is not configured or empty:")
    print("1. Go to Railway Dashboard")
    print("2. Check your PostgreSQL service")
    print("3. Copy the connection string")
    print("4. Add DATABASE_URL variable to your backend service")
    print("5. Redeploy your backend service")
    print("\nExpected DATABASE_URL format:")
    print("postgresql://username:password@host:port/database")

if __name__ == "__main__":
    check_railway_environment() 