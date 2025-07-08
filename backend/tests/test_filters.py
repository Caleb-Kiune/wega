#!/usr/bin/env python3

import requests
import json

# Test the products API with different filters
BASE_URL = "http://localhost:5000/api"

def test_products_api():
    print("Testing Products API Filters...")
    print("=" * 50)
    
    # Test 1: Get all products
    print("\n1. Testing: Get all products")
    response = requests.get(f"{BASE_URL}/products")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success: Found {len(data.get('products', []))} products")
        print(f"   Total: {data.get('total', 0)}")
        print(f"   Pages: {data.get('pages', 0)}")
        
        # Check what categories and brands are available
        products = data.get('products', [])
        categories = set()
        brands = set()
        prices = []
        
        for product in products:
            if product.get('category'):
                categories.add(product['category'])
            if product.get('brand'):
                brands.add(product['brand'])
            if product.get('price'):
                prices.append(product['price'])
        
        print(f"   Available categories: {list(categories)}")
        print(f"   Available brands: {list(brands)}")
        if prices:
            print(f"   Price range: ${min(prices):.2f} - ${max(prices):.2f}")
    else:
        print(f"❌ Failed: {response.status_code} - {response.text}")
    
    # Test 2: Test categories filter with actual category
    if categories:
        print(f"\n2. Testing: Categories filter with '{list(categories)[0]}'")
        response = requests.get(f"{BASE_URL}/products?categories[]={list(categories)[0]}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: Found {len(data.get('products', []))} products in {list(categories)[0]} category")
        else:
            print(f"❌ Failed: {response.status_code} - {response.text}")
    
    # Test 3: Test brands filter with actual brand
    if brands:
        print(f"\n3. Testing: Brands filter with '{list(brands)[0]}'")
        response = requests.get(f"{BASE_URL}/products?brands[]={list(brands)[0]}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: Found {len(data.get('products', []))} products from {list(brands)[0]} brand")
        else:
            print(f"❌ Failed: {response.status_code} - {response.text}")
    
    # Test 4: Test price filter with actual price range
    if prices:
        min_price = min(prices)
        max_price = max(prices)
        mid_price = (min_price + max_price) / 2
        print(f"\n4. Testing: Price filter with range ${min_price:.2f}-${mid_price:.2f}")
        response = requests.get(f"{BASE_URL}/products?min_price={min_price}&max_price={mid_price}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: Found {len(data.get('products', []))} products in price range ${min_price:.2f}-${mid_price:.2f}")
        else:
            print(f"❌ Failed: {response.status_code} - {response.text}")
    
    # Test 5: Test boolean filters
    print("\n5. Testing: Boolean filters")
    response = requests.get(f"{BASE_URL}/products?is_featured=true")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success: Found {len(data.get('products', []))} featured products")
    else:
        print(f"❌ Failed: {response.status_code} - {response.text}")
    
    # Test 6: Test search
    print("\n6. Testing: Search filter")
    response = requests.get(f"{BASE_URL}/products?search=pan")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success: Found {len(data.get('products', []))} products matching 'pan'")
    else:
        print(f"❌ Failed: {response.status_code} - {response.text}")
    
    # Test 7: Test combined filters
    if categories and brands:
        print(f"\n7. Testing: Combined filters")
        response = requests.get(f"{BASE_URL}/products?categories[]={list(categories)[0]}&brands[]={list(brands)[0]}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: Found {len(data.get('products', []))} products with combined filters")
        else:
            print(f"❌ Failed: {response.status_code} - {response.text}")

if __name__ == "__main__":
    test_products_api() 