#!/usr/bin/env python3
"""
Check Database Connection Script
Helps identify the exact database connection issue
"""

import requests
import json

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def check_database_connection():
    """Check database connection and identify issues"""
    
    print("🔍 Database Connection Diagnostics")
    print("=" * 50)
    
    # Check if we can get more detailed error information
    print("1️⃣  Checking for detailed error responses...")
    
    # Try to get error details from different endpoints
    test_endpoints = [
        "/api/categories",
        "/api/brands",
        "/api/products"
    ]
    
    for endpoint in test_endpoints:
        try:
            response = requests.get(f"{RAILWAY_URL}{endpoint}")
            print(f"   {endpoint}: {response.status_code}")
            
            if response.status_code == 502:
                print(f"   ❌ 502 error - application crashed")
                # Try to get response body for more details
                try:
                    error_data = response.json()
                    print(f"   📄 Error details: {error_data}")
                except:
                    print(f"   📄 No JSON error details available")
            elif response.status_code == 500:
                print(f"   ⚠️  500 error - internal server error")
                try:
                    error_data = response.json()
                    print(f"   📄 Error details: {error_data}")
                except:
                    print(f"   📄 No JSON error details available")
                    
        except Exception as e:
            print(f"   ❌ {endpoint} connection error: {str(e)}")
    
    print("\n2️⃣  Checking environment configuration...")
    try:
        response = requests.get(f"{RAILWAY_URL}/usage")
        if response.status_code == 200:
            data = response.json()
            print(f"   📊 Database configured: {data.get('environment', {}).get('database_configured', False)}")
            print(f"   🔧 Flask environment: {data.get('environment', {}).get('flask_env', 'unknown')}")
            print(f"   🐛 Debug mode: {data.get('environment', {}).get('debug', False)}")
    except Exception as e:
        print(f"   ❌ Usage endpoint error: {str(e)}")
    
    print("\n🔍 DIAGNOSIS:")
    print("=" * 30)
    print("Based on the 502 errors, the issue is likely:")
    print("1. Database connection failing during migration")
    print("2. Database permissions issue")
    print("3. Network connectivity problem")
    print("4. Migration script failing silently")
    
    print("\n💡 RECOMMENDED ACTIONS:")
    print("=" * 40)
    print("1. Check Railway backend logs for database errors")
    print("2. Verify PostgreSQL service is running")
    print("3. Check if DATABASE_URL has correct permissions")
    print("4. Try redeploying with better error logging")
    
    return True

if __name__ == "__main__":
    check_database_connection() 