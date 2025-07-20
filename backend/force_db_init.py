#!/usr/bin/env python3
"""
Force Database Initialization Script
Attempts to trigger database table creation through various methods
"""

import requests
import json
import time

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def force_database_init():
    """Force database initialization through various methods"""
    
    print("🔧 Force Database Initialization")
    print("=" * 40)
    
    # Method 1: Try to access admin endpoints that might trigger DB init
    print("🔄 Method 1: Admin endpoints...")
    admin_endpoints = [
        "/admin/health",
        "/admin/status",
        "/admin/db-status"
    ]
    
    for endpoint in admin_endpoints:
        try:
            response = requests.get(f"{RAILWAY_URL}{endpoint}")
            print(f"   {endpoint}: {response.status_code}")
        except Exception as e:
            print(f"   {endpoint}: Error - {str(e)}")
    
    # Method 2: Try to trigger migration by accessing specific endpoints
    print("\n🔄 Method 2: Migration triggers...")
    migration_endpoints = [
        "/api/categories",
        "/api/brands", 
        "/api/products",
        "/api/reviews"
    ]
    
    for endpoint in migration_endpoints:
        try:
            response = requests.get(f"{RAILWAY_URL}{endpoint}")
            print(f"   {endpoint}: {response.status_code}")
            
            if response.status_code == 200:
                print(f"   ✅ {endpoint} is working!")
                return True
            elif response.status_code == 500:
                print(f"   ⚠️  {endpoint} returned 500 - might be initializing")
            else:
                print(f"   ❌ {endpoint} returned {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ {endpoint} error: {str(e)}")
    
    # Method 3: Wait and retry
    print("\n⏳ Method 3: Waiting for background processes...")
    time.sleep(30)
    
    print("\n🔄 Retrying endpoints after wait...")
    for endpoint in migration_endpoints:
        try:
            response = requests.get(f"{RAILWAY_URL}{endpoint}")
            print(f"   {endpoint}: {response.status_code}")
            
            if response.status_code == 200:
                print(f"   ✅ {endpoint} is now working!")
                return True
                
        except Exception as e:
            print(f"   ❌ {endpoint} still failing: {str(e)}")
    
    return False

def check_postgres_tables():
    """Check if tables exist by testing specific endpoints"""
    
    print("\n🔍 Checking if tables exist...")
    
    # Test endpoints that require specific tables
    table_tests = [
        ("/api/categories", "categories table"),
        ("/api/brands", "brands table"),
        ("/api/products", "products table")
    ]
    
    working_tables = 0
    
    for endpoint, table_name in table_tests:
        try:
            response = requests.get(f"{RAILWAY_URL}{endpoint}")
            if response.status_code == 200:
                print(f"   ✅ {table_name} exists")
                working_tables += 1
            else:
                print(f"   ❌ {table_name} missing (status: {response.status_code})")
        except Exception as e:
            print(f"   ❌ {table_name} error: {str(e)}")
    
    return working_tables > 0

def main():
    """Main function to force database initialization"""
    
    print("🚀 Force Database Initialization")
    print("=" * 50)
    
    # Try to force initialization
    if force_database_init():
        print("\n✅ Database initialization successful!")
        return True
    
    # Check if tables exist
    if check_postgres_tables():
        print("\n✅ Some tables exist - database partially working")
        return True
    
    print("\n❌ Database initialization failed")
    print("💡 You may need to:")
    print("   1. Check Railway logs for errors")
    print("   2. Verify DATABASE_URL is correct")
    print("   3. Try redeploying again")
    return False

if __name__ == "__main__":
    main() 