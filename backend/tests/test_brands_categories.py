#!/usr/bin/env python3
"""
Test script for brands and categories functionality
"""

import requests
import json
import sys
import os

def test_brands_and_categories():
    """Test the brands and categories endpoints"""
    
    base_url = "http://localhost:5000/api"
    
    print("🧪 Testing Brands and Categories API")
    print("=" * 50)
    
    # Test brands endpoint
    print("\n📋 Testing Brands Endpoint...")
    try:
        response = requests.get(f"{base_url}/brands")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            brands = response.json()
            print(f"✅ Found {len(brands)} brands:")
            for brand in brands:
                print(f"   - {brand['name']} (ID: {brand['id']})")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # Test categories endpoint
    print("\n📂 Testing Categories Endpoint...")
    try:
        response = requests.get(f"{base_url}/categories")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            categories = response.json()
            print(f"✅ Found {len(categories)} categories:")
            for category in categories:
                print(f"   - {category['name']} (ID: {category['id']})")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # Test products endpoint with brand filter
    print("\n🛍️ Testing Products with Brand Filter...")
    try:
        response = requests.get(f"{base_url}/products?brands[]=WEGA")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Found {len(data['products'])} products for WEGA brand")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # Test products endpoint with category filter
    print("\n🛍️ Testing Products with Category Filter...")
    try:
        response = requests.get(f"{base_url}/products?categories[]=Cookware")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Found {len(data['products'])} products for Cookware category")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Test completed!")

if __name__ == "__main__":
    test_brands_and_categories() 