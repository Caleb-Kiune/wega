#!/usr/bin/env python3
"""
Test Database Connection Script
Tests the Railway database connection with proper data format
"""

import requests
import json

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def test_database_connection():
    """Test database connection with proper data format"""
    
    print("🔧 Testing Railway Database Connection")
    print("=" * 50)
    
    # Test GET endpoints first
    print("📊 Testing GET endpoints...")
    
    endpoints = [
        "/api/categories",
        "/api/brands", 
        "/api/products"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{RAILWAY_URL}{endpoint}")
            print(f"🔍 {endpoint}: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if endpoint == "/api/products":
                    print(f"   📦 Products count: {data.get('total', 0)}")
                elif endpoint == "/api/categories":
                    print(f"   📂 Categories count: {len(data.get('categories', []))}")
                elif endpoint == "/api/brands":
                    print(f"   🏷️  Brands count: {len(data.get('brands', []))}")
            else:
                print(f"   ❌ Status: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
    
    print("\n✅ Database connection test completed!")
    print("📊 If you see data counts above, the database is working!")
    
    return True

if __name__ == "__main__":
    test_database_connection() 