#!/usr/bin/env python3
"""
Debug Database Connection Script
Helps identify the exact issue with Railway database connection
"""

import requests
import json
import time

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def debug_database_connection():
    """Debug the database connection step by step"""
    
    print("🔍 Debugging Railway Database Connection")
    print("=" * 50)
    
    # Step 1: Check if backend is responding at all
    print("1️⃣  Checking backend health...")
    try:
        response = requests.get(f"{RAILWAY_URL}/health")
        print(f"   Health endpoint: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Database configured: {data.get('database_configured', False)}")
            print(f"   Environment: {data.get('environment', 'unknown')}")
    except Exception as e:
        print(f"   ❌ Health check failed: {str(e)}")
        return False
    
    # Step 2: Check environment info
    print("\n2️⃣  Checking environment info...")
    try:
        response = requests.get(f"{RAILWAY_URL}/usage")
        print(f"   Usage endpoint: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Database configured: {data.get('environment', {}).get('database_configured', False)}")
    except Exception as e:
        print(f"   ❌ Usage check failed: {str(e)}")
    
    # Step 3: Test simple endpoints that might not require database
    print("\n3️⃣  Testing simple endpoints...")
    simple_endpoints = [
        "/",
        "/api",
        "/docs"
    ]
    
    for endpoint in simple_endpoints:
        try:
            response = requests.get(f"{RAILWAY_URL}{endpoint}")
            print(f"   {endpoint}: {response.status_code}")
        except Exception as e:
            print(f"   {endpoint}: Error - {str(e)}")
    
    # Step 4: Test database-dependent endpoints with different methods
    print("\n4️⃣  Testing database endpoints...")
    db_endpoints = [
        ("/api/categories", "GET"),
        ("/api/brands", "GET"),
        ("/api/products", "GET"),
        ("/api/categories", "POST"),
        ("/api/brands", "POST")
    ]
    
    for endpoint, method in db_endpoints:
        try:
            if method == "GET":
                response = requests.get(f"{RAILWAY_URL}{endpoint}")
            else:
                # Try POST with minimal data
                test_data = {
                    "name": "Test",
                    "slug": "test",
                    "description": "Test"
                }
                response = requests.post(f"{RAILWAY_URL}{endpoint}", 
                                      json=test_data,
                                      headers={'Content-Type': 'application/json'})
            
            print(f"   {method} {endpoint}: {response.status_code}")
            
            if response.status_code == 502:
                print(f"   ❌ 502 error - application crashed")
            elif response.status_code == 500:
                print(f"   ⚠️  500 error - internal server error")
            elif response.status_code == 400:
                print(f"   ✅ 400 error - endpoint working (validation error)")
            elif response.status_code == 200:
                print(f"   ✅ 200 success - endpoint working!")
                
        except Exception as e:
            print(f"   ❌ {method} {endpoint}: {str(e)}")
    
    print("\n🔍 ANALYSIS:")
    print("=" * 30)
    print("If you see:")
    print("✅ 400 errors = Database is working (validation errors)")
    print("❌ 502 errors = Database connection failing")
    print("❌ 500 errors = Database query errors")
    print("❌ Connection errors = Network issues")
    
    return True

if __name__ == "__main__":
    debug_database_connection() 