#!/usr/bin/env python3
"""
Test Railway API Script
Tests the Railway backend API and tries to create initial data
"""

import requests
import json

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def test_railway_api():
    """Test Railway API and create initial data"""
    
    print("🔧 Testing Railway API")
    print("=" * 40)
    
    # Test 1: Health check
    print("1️⃣  Testing health endpoint...")
    try:
        response = requests.get(f"{RAILWAY_URL}/health")
        print(f"   Health: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Database configured: {data.get('database_configured', False)}")
    except Exception as e:
        print(f"   ❌ Health check failed: {str(e)}")
    
    # Test 2: Try to create a category
    print("\n2️⃣  Testing category creation...")
    category_data = {
        "name": "Test Category",
        "slug": "test-category",
        "description": "Test category for Railway"
    }
    
    try:
        response = requests.post(f"{RAILWAY_URL}/api/categories", 
                              json=category_data,
                              headers={'Content-Type': 'application/json'})
        print(f"   Category creation: {response.status_code}")
        
        if response.status_code == 201:
            print("   ✅ Category created successfully!")
        elif response.status_code == 400:
            print("   ⚠️  Validation error (tables might exist)")
            try:
                error_data = response.json()
                print(f"   📄 Error: {error_data}")
            except:
                pass
        elif response.status_code == 502:
            print("   ❌ Application crashed (tables don't exist)")
        else:
            print(f"   ❌ Unexpected status: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Category creation failed: {str(e)}")
    
    # Test 3: Try to create a brand
    print("\n3️⃣  Testing brand creation...")
    brand_data = {
        "name": "Test Brand",
        "slug": "test-brand",
        "description": "Test brand for Railway"
    }
    
    try:
        response = requests.post(f"{RAILWAY_URL}/api/brands", 
                              json=brand_data,
                              headers={'Content-Type': 'application/json'})
        print(f"   Brand creation: {response.status_code}")
        
        if response.status_code == 201:
            print("   ✅ Brand created successfully!")
        elif response.status_code == 400:
            print("   ⚠️  Validation error (tables might exist)")
        elif response.status_code == 502:
            print("   ❌ Application crashed (tables don't exist)")
        else:
            print(f"   ❌ Unexpected status: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Brand creation failed: {str(e)}")
    
    # Test 4: Try to get categories
    print("\n4️⃣  Testing GET categories...")
    try:
        response = requests.get(f"{RAILWAY_URL}/api/categories")
        print(f"   GET categories: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Categories endpoint working!")
            data = response.json()
            print(f"   📂 Categories count: {len(data.get('categories', []))}")
        elif response.status_code == 502:
            print("   ❌ Application crashed (tables don't exist)")
        else:
            print(f"   ❌ Unexpected status: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ GET categories failed: {str(e)}")
    
    print("\n🔍 ANALYSIS:")
    print("=" * 30)
    print("If you see:")
    print("✅ 201 responses = Tables exist and working")
    print("⚠️  400 responses = Tables exist but validation errors")
    print("❌ 502 responses = Tables don't exist")
    
    return True

if __name__ == "__main__":
    test_railway_api() 