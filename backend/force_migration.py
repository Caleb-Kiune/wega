#!/usr/bin/env python3
"""
Force Database Migration Script
Triggers database migration by making specific requests
"""

import requests
import json
import time

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def force_migration():
    """Force database migration by triggering specific endpoints"""
    
    print("🔧 Force Database Migration")
    print("=" * 40)
    
    # Method 1: Try to trigger migration by accessing admin endpoints
    print("🔄 Method 1: Admin migration triggers...")
    admin_endpoints = [
        "/admin/migrate",
        "/admin/init-db",
        "/admin/setup"
    ]
    
    for endpoint in admin_endpoints:
        try:
            response = requests.get(f"{RAILWAY_URL}{endpoint}")
            print(f"   {endpoint}: {response.status_code}")
        except Exception as e:
            print(f"   {endpoint}: Error - {str(e)}")
    
    # Method 2: Try POST requests that might trigger table creation
    print("\n🔄 Method 2: POST requests to trigger tables...")
    
    # Try to add data that might trigger table creation
    test_data = [
        {
            "endpoint": "/api/categories",
            "data": {
                "name": "Test Category",
                "slug": "test-category",
                "description": "Test category for migration"
            }
        },
        {
            "endpoint": "/api/brands", 
            "data": {
                "name": "Test Brand",
                "slug": "test-brand", 
                "description": "Test brand for migration"
            }
        }
    ]
    
    for test in test_data:
        try:
            response = requests.post(f"{RAILWAY_URL}{test['endpoint']}", 
                                  json=test['data'],
                                  headers={'Content-Type': 'application/json'})
            print(f"   POST {test['endpoint']}: {response.status_code}")
            
            if response.status_code == 201:
                print(f"   ✅ {test['endpoint']} created successfully!")
            elif response.status_code == 400:
                print(f"   ⚠️  {test['endpoint']} validation error (tables might exist)")
            elif response.status_code == 502:
                print(f"   ❌ {test['endpoint']} application crashed")
                
        except Exception as e:
            print(f"   ❌ {test['endpoint']} error: {str(e)}")
    
    # Method 3: Wait and retry GET requests
    print("\n⏳ Method 3: Waiting for migration to complete...")
    time.sleep(30)
    
    print("\n🔄 Testing GET endpoints after migration...")
    get_endpoints = [
        "/api/categories",
        "/api/brands",
        "/api/products"
    ]
    
    for endpoint in get_endpoints:
        try:
            response = requests.get(f"{RAILWAY_URL}{endpoint}")
            print(f"   GET {endpoint}: {response.status_code}")
            
            if response.status_code == 200:
                print(f"   ✅ {endpoint} is working!")
                data = response.json()
                if endpoint == "/api/products":
                    print(f"   📦 Products count: {data.get('total', 0)}")
                elif endpoint == "/api/categories":
                    print(f"   📂 Categories count: {len(data.get('categories', []))}")
                elif endpoint == "/api/brands":
                    print(f"   🏷️  Brands count: {len(data.get('brands', []))}")
            else:
                print(f"   ❌ {endpoint} still failing: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ {endpoint} error: {str(e)}")
    
    return True

if __name__ == "__main__":
    force_migration() 