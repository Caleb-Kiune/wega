#!/usr/bin/env python3
"""
Complete test script to verify the entire order flow
"""

import os
import sys
import requests
import json

def test_complete_flow():
    """Test the complete order flow"""
    
    print("🧪 Testing Complete Order Flow")
    print("=" * 50)
    
    # Step 1: Check if backend is running
    print("\n1️⃣ Checking backend availability...")
    try:
        response = requests.get('http://localhost:5000/api/products?limit=1')
        if response.status_code == 200:
            print("✅ Backend is running")
        else:
            print(f"❌ Backend responded with status: {response.status_code}")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running. Start it with: python run.py")
        return
    
    # Step 2: Check delivery locations
    print("\n2️⃣ Checking delivery locations...")
    try:
        response = requests.get('http://localhost:5000/api/delivery-locations')
        if response.status_code == 200:
            locations = response.json()
            print(f"✅ Found {len(locations)} delivery locations")
            if locations:
                print(f"   First location: {locations[0]['name']} - KES {locations[0]['shippingPrice']}")
        else:
            print(f"❌ Failed to get delivery locations: {response.status_code}")
            print("   Run: python scripts/seed_delivery_locations.py")
            return
    except Exception as e:
        print(f"❌ Error checking delivery locations: {e}")
        return
    
    # Step 3: Check products
    print("\n3️⃣ Checking products...")
    try:
        response = requests.get('http://localhost:5000/api/products?limit=3')
        if response.status_code == 200:
            data = response.json()
            products = data.get('products', [])
            print(f"✅ Found {len(products)} products")
            if products:
                print(f"   First product: {products[0]['name']} - KES {products[0]['price']}")
        else:
            print(f"❌ Failed to get products: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Error checking products: {e}")
        return
    
    # Step 4: Test order submission
    print("\n4️⃣ Testing order submission...")
    
    # Get first product and location for testing
    product_id = 1
    location_id = 1
    
    test_order = {
        "session_id": "test-session-" + str(hash("test") % 10000),
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "phone": "0712345678",
        "address": "123 Test Street",
        "city": "Nairobi",
        "state": "Nairobi",
        "postal_code": "00100",
        "delivery_location_id": location_id,
        "notes": "Test order from complete flow script",
        "cart_items": [
            {
                "product_id": product_id,
                "quantity": 2,
                "price": 1500.00
            }
        ]
    }
    
    try:
        response = requests.post(
            'http://localhost:5000/api/orders',
            json=test_order,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Response Status: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print(f"✅ Order created successfully!")
            print(f"   Order ID: {data.get('id')}")
            print(f"   Order Number: {data.get('order_number')}")
            print(f"   Total Amount: KES {data.get('total_amount')}")
            print(f"   Status: {data.get('status')}")
            
            # Step 5: Test order retrieval
            print("\n5️⃣ Testing order retrieval...")
            order_id = data.get('id')
            if order_id:
                response = requests.get(f'http://localhost:5000/api/orders/{order_id}')
                if response.status_code == 200:
                    order_data = response.json()
                    print(f"✅ Order retrieved successfully!")
                    print(f"   Items count: {len(order_data.get('items', []))}")
                else:
                    print(f"❌ Failed to retrieve order: {response.status_code}")
            
        else:
            print(f"❌ Failed to create order: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data}")
            except:
                print(f"   Response: {response.text}")
    
    except Exception as e:
        print(f"❌ Error testing order submission: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Complete flow test finished!")

if __name__ == '__main__':
    test_complete_flow() 