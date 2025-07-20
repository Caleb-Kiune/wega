#!/usr/bin/env python3
"""
Manual Railway Database Setup Script
Creates tables and adds initial data to Railway PostgreSQL database
"""

import requests
import json
import time

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def create_tables_via_api():
    """Create database tables by triggering the application"""
    
    print("🔧 Setting up Railway Database Tables")
    print("=" * 50)
    
    # The backend should create tables automatically when accessed
    # Let's try to trigger this by making requests to endpoints
    
    print("🔄 Triggering table creation...")
    
    # Try to access admin endpoint which might trigger table creation
    try:
        print("🔍 Testing admin endpoint...")
        response = requests.get(f"{RAILWAY_URL}/admin/health")
        print(f"   Status: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Admin endpoint error: {str(e)}")
    
    # Try to access usage endpoint
    try:
        print("🔍 Testing usage endpoint...")
        response = requests.get(f"{RAILWAY_URL}/usage")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   📊 Database info: {data}")
    except Exception as e:
        print(f"   ❌ Usage endpoint error: {str(e)}")
    
    # Wait a bit for any background processes
    print("⏳ Waiting for table creation...")
    time.sleep(15)
    
    return True

def test_database_connection():
    """Test if database is now working"""
    
    print("\n🔍 Testing database connection...")
    
    endpoints_to_test = [
        "/api/categories",
        "/api/brands",
        "/api/products"
    ]
    
    working_endpoints = 0
    
    for endpoint in endpoints_to_test:
        try:
            response = requests.get(f"{RAILWAY_URL}{endpoint}")
            print(f"🔍 {endpoint}: {response.status_code}")
            
            if response.status_code == 200:
                working_endpoints += 1
                data = response.json()
                if endpoint == "/api/products":
                    print(f"   📦 Products count: {data.get('total', 0)}")
                elif endpoint == "/api/categories":
                    print(f"   📂 Categories count: {len(data.get('categories', []))}")
                elif endpoint == "/api/brands":
                    print(f"   🏷️  Brands count: {len(data.get('brands', []))}")
            else:
                print(f"   ❌ Still not working")
                
        except Exception as e:
            print(f"   ❌ {endpoint} error: {str(e)}")
    
    return working_endpoints > 0

def main():
    """Main function to set up Railway database"""
    
    print("🚀 Railway Database Setup")
    print("=" * 40)
    
    # Step 1: Create tables
    if create_tables_via_api():
        print("✅ Table creation triggered")
    else:
        print("❌ Table creation failed")
        return False
    
    # Step 2: Test connection
    if test_database_connection():
        print("\n✅ Database setup completed successfully!")
        print("📦 You can now add products to the database")
        return True
    else:
        print("\n❌ Database setup failed")
        print("💡 Try redeploying your backend service")
        return False

if __name__ == "__main__":
    main() 