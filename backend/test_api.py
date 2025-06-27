#!/usr/bin/env python3
"""
Simple API testing script for Wega Kitchenware API
This script demonstrates how to use the documented endpoints
"""
import requests
import json
import time

# API base URL
BASE_URL = "http://localhost:5000/api"

def test_products_api():
    """Test the products API endpoints"""
    print("🔍 Testing Products API...")
    
    # Test GET /products
    print("\n1. Getting all products...")
    response = requests.get(f"{BASE_URL}/products")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success! Found {len(data.get('products', []))} products")
        if data.get('products'):
            print(f"   First product: {data['products'][0]['name']}")
    else:
        print(f"❌ Failed: {response.status_code} - {response.text}")
    
    # Test GET /products/{id}
    print("\n2. Getting product by ID...")
    response = requests.get(f"{BASE_URL}/products/1")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success! Product: {data.get('name', 'Unknown')}")
    else:
        print(f"❌ Failed: {response.status_code} - {response.text}")

def test_cart_api():
    """Test the cart API endpoints"""
    print("\n🛒 Testing Cart API...")
    
    session_id = f"test_session_{int(time.time())}"
    
    # Test GET /cart
    print("\n1. Getting cart...")
    response = requests.get(f"{BASE_URL}/cart?session_id={session_id}")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success! Cart total: ${data.get('total', 0)}")
    else:
        print(f"❌ Failed: {response.status_code} - {response.text}")
    
    # Test POST /cart/items
    print("\n2. Adding item to cart...")
    cart_data = {
        "session_id": session_id,
        "product_id": 1,
        "quantity": 2
    }
    response = requests.post(f"{BASE_URL}/cart/items", json=cart_data)
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success! Cart total: ${data.get('total', 0)}")
    else:
        print(f"❌ Failed: {response.status_code} - {response.text}")

def test_delivery_locations_api():
    """Test the delivery locations API endpoints"""
    print("\n🚚 Testing Delivery Locations API...")
    
    # Test GET /delivery-locations
    print("\n1. Getting delivery locations...")
    response = requests.get(f"{BASE_URL}/delivery-locations")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success! Found {len(data)} delivery locations")
        if data:
            print(f"   First location: {data[0]['name']} - ${data[0]['shipping_price']}")
    else:
        print(f"❌ Failed: {response.status_code} - {response.text}")

def test_orders_api():
    """Test the orders API endpoints"""
    print("\n📦 Testing Orders API...")
    
    # Test GET /orders
    print("\n1. Getting all orders...")
    response = requests.get(f"{BASE_URL}/orders")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success! Found {len(data.get('orders', []))} orders")
    else:
        print(f"❌ Failed: {response.status_code} - {response.text}")

def main():
    """Run all API tests"""
    print("🚀 Starting Wega Kitchenware API Tests")
    print("=" * 50)
    
    try:
        test_products_api()
        test_cart_api()
        test_delivery_locations_api()
        test_orders_api()
        
        print("\n" + "=" * 50)
        print("✅ All tests completed!")
        print("\n📖 API Documentation available at: http://localhost:5000/docs")
        print("🔗 OpenAPI spec available at: http://localhost:5000/api/openapi.yaml")
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the API server.")
        print("   Make sure the Flask server is running on http://localhost:5000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main() 