#!/usr/bin/env python3
"""
Manual Database Setup Script
Attempts to create database tables by adding initial data
"""

import requests
import json
import time

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def try_add_initial_data():
    """Try to add initial data to trigger table creation"""
    
    print("🔧 Manual Database Setup")
    print("=" * 30)
    
    # Try to add a category first
    print("🔄 Adding initial category...")
    category_data = {
        "name": "Test Category",
        "description": "Test category for database setup"
    }
    
    try:
        response = requests.post(f"{RAILWAY_URL}/api/categories", 
                               json=category_data, 
                               headers={'Content-Type': 'application/json'})
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 201:
            print("   ✅ Category added successfully!")
            return True
        else:
            print(f"   ❌ Failed to add category: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error adding category: {str(e)}")
    
    # Try to add a brand
    print("\n🔄 Adding initial brand...")
    brand_data = {
        "name": "Test Brand",
        "description": "Test brand for database setup"
    }
    
    try:
        response = requests.post(f"{RAILWAY_URL}/api/brands", 
                               json=brand_data, 
                               headers={'Content-Type': 'application/json'})
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 201:
            print("   ✅ Brand added successfully!")
            return True
        else:
            print(f"   ❌ Failed to add brand: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error adding brand: {str(e)}")
    
    return False

def check_railway_logs():
    """Provide guidance on checking Railway logs"""
    
    print("\n🔍 TROUBLESHOOTING GUIDE:")
    print("=" * 40)
    print("1. Go to Railway Dashboard")
    print("2. Click on your backend service")
    print("3. Go to 'Logs' tab")
    print("4. Look for database connection errors")
    print("5. Check if DATABASE_URL is correct")
    print("\nCommon issues:")
    print("- Database URL format incorrect")
    print("- Database not accessible")
    print("- Migration failing silently")
    print("- Tables not being created")

def main():
    """Main function to manually set up database"""
    
    print("🚀 Manual Database Setup")
    print("=" * 40)
    
    # Try to add initial data
    if try_add_initial_data():
        print("\n✅ Database setup successful!")
        print("📦 Tables should now exist")
        return True
    
    # If that fails, provide troubleshooting guidance
    check_railway_logs()
    return False

if __name__ == "__main__":
    main() 