#!/usr/bin/env python3
"""
Script to initialize Railway PostgreSQL database with proper schema
"""

import requests
import json
import time

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def check_database_status():
    """Check if database is properly initialized"""
    
    print("🔧 Checking Railway Database Status")
    print("=" * 40)
    
    # Check health endpoint
    try:
        response = requests.get(f"{RAILWAY_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend health: {data.get('status', 'unknown')}")
            print(f"📊 Database configured: {data.get('database_configured', False)}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {str(e)}")
        return False
    
    # Check if we can access basic endpoints
    endpoints_to_test = [
        "/api/categories",
        "/api/brands", 
        "/api/products"
    ]
    
    for endpoint in endpoints_to_test:
        try:
            response = requests.get(f"{RAILWAY_URL}{endpoint}")
            print(f"🔍 {endpoint}: {response.status_code}")
        except Exception as e:
            print(f"❌ {endpoint}: Error - {str(e)}")
    
    return True

def trigger_database_init():
    """Trigger database initialization by making a request"""
    
    print("\n🔄 Triggering database initialization...")
    
    # Try to access endpoints that might trigger DB init
    init_endpoints = [
        "/api/categories",
        "/api/brands",
        "/api/products"
    ]
    
    for endpoint in init_endpoints:
        try:
            print(f"🔍 Testing {endpoint}...")
            response = requests.get(f"{RAILWAY_URL}{endpoint}")
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                print(f"   ✅ {endpoint} is working")
            elif response.status_code == 500:
                print(f"   ⚠️  {endpoint} returned 500 - might be initializing")
            else:
                print(f"   ❌ {endpoint} returned {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ {endpoint} error: {str(e)}")
        
        time.sleep(2)  # Wait between requests
    
    print("\n⏳ Waiting for database initialization...")
    time.sleep(10)  # Wait for any background processes
    
    # Check again
    print("\n🔍 Re-checking database status...")
    return check_database_status()

def main():
    """Main function to initialize Railway database"""
    
    print("🚀 Railway Database Initialization")
    print("=" * 50)
    
    # First check current status
    if not check_database_status():
        print("❌ Cannot connect to Railway backend")
        return False
    
    # Trigger initialization
    if trigger_database_init():
        print("\n✅ Database initialization completed!")
        print("📦 You can now add products to the database")
        return True
    else:
        print("\n❌ Database initialization failed")
        return False

if __name__ == "__main__":
    main() 