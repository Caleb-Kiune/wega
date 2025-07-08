#!/usr/bin/env python3
"""
Test script to verify order submission functionality
"""

import os
import sys
import requests
import json

def test_order_submission():
    """Test order submission to the backend"""
    
    print("🧪 Testing Order Submission")
    print("=" * 40)
    
    # Test data with cart items
    test_order = {
        "session_id": "test-session-123",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone": "0712345678",
        "address": "123 Test Street",
        "city": "Nairobi",
        "state": "Nairobi",
        "postal_code": "00100",
        "delivery_location_id": 1,
        "notes": "Test order from script",
        "cart_items": [
            {
                "product_id": 1,
                "quantity": 2,
                "price": 1500.00
            },
            {
                "product_id": 2,
                "quantity": 1,
                "price": 2500.00
            }
        ]
    }
    
    try:
        # Test the orders API
        print("\n📦 Testing POST /api/orders endpoint...")
        response = requests.post(
            'http://localhost:5000/api/orders',
            json=test_order,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 201:
            data = response.json()
            print(f"✅ Order created successfully!")
            print(f"   Order ID: {data.get('id')}")
            print(f"   Order Number: {data.get('order_number')}")
            print(f"   Total Amount: KES {data.get('total_amount')}")
            print(f"   Status: {data.get('status')}")
        else:
            print(f"❌ Failed to create order: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data}")
            except:
                print(f"   Response: {response.text}")
    
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend API")
        print("   Make sure the backend is running on http://localhost:5000")
    except Exception as e:
        print(f"❌ Error testing order submission: {e}")
    
    print("\n" + "=" * 40)

if __name__ == '__main__':
    test_order_submission() 