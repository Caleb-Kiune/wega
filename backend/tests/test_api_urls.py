#!/usr/bin/env python3
"""
Test script to check what URLs the API is returning
"""

import os
import sys
import requests
import json

def test_api_urls():
    """Test what URLs the API is returning"""
    
    print("🧪 Testing API URLs")
    print("=" * 40)
    
    try:
        # Test the products API
        print("\n📦 Testing /api/products endpoint...")
        response = requests.get('http://localhost:5000/api/products?limit=3')
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API responded successfully")
            print(f"📊 Total products: {data.get('total', 'N/A')}")
            
            # Check the first product's image URLs
            if data.get('products'):
                first_product = data['products'][0]
                print(f"\n🔍 First product: {first_product.get('name', 'N/A')}")
                print(f"   Main image: {first_product.get('image_url', 'N/A')}")
                
                if first_product.get('images'):
                    print(f"   All images:")
                    for i, img in enumerate(first_product['images'][:3]):
                        print(f"     {i+1}. {img.get('image_url', 'N/A')}")
        else:
            print(f"❌ API error: {response.status_code}")
            print(f"Response: {response.text}")
    
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend API")
        print("   Make sure the backend is running on http://localhost:5000")
    except Exception as e:
        print(f"❌ Error testing API: {e}")
    
    print("\n" + "=" * 40)

if __name__ == '__main__':
    test_api_urls() 