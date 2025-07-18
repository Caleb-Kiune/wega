#!/usr/bin/env python3
"""
Comprehensive test for order backend integration
Tests all the critical integration points between frontend and backend
"""

import requests
import json
import sys
from datetime import datetime

# Configuration
API_BASE_URL = "http://localhost:5000/api"

def test_order_creation():
    """Test order creation with all required fields"""
    
    # Test order creation with COD payment
    print("🧪 Testing order creation with COD payment...")
    cod_order_data = {
        "session_id": "test_session_cod",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone": "+254700000000",
        "address": "123 Test Street",
        "city": "Nairobi",
        "state": "Nairobi",
        "postal_code": "00100",
        "payment_method": "cod",
        "cart_items": [
            {
                "product_id": 1,
                "quantity": 2,
                "price": 1500.00
            }
        ]
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/orders", json=cod_order_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            order = response.json()
            print("✅ Order created successfully!")
            print(f"Order Number: {order.get('order_number')}")
            print(f"Payment Method: {order.get('payment_method')}")
            print(f"Payment Status: {order.get('payment_status')}")
            print(f"Total Amount: {order.get('total_amount')}")
            print(f"Shipping Cost: {order.get('shipping_cost')}")
            return True
        else:
            print(f"❌ Failed to create order: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing order creation: {e}")
        return False

def test_order_with_delivery():
    """Test order creation with delivery location"""
    
    # Test order creation with delivery and M-Pesa payment
    print("🧪 Testing order creation with delivery and M-Pesa payment...")
    mpesa_order_data = {
        "session_id": "test_session_mpesa",
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@example.com",
        "phone": "+254711111111",
        "address": "456 Delivery Avenue",
        "city": "Mombasa",
        "state": "Mombasa",
        "postal_code": "80100",
        "delivery_location_id": 1,  # Assuming location ID 1 exists
        "payment_method": "mpesa",
        "cart_items": [
            {
                "product_id": 1,
                "quantity": 1,
                "price": 1500.00
            }
        ]
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/orders", json=mpesa_order_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            order = response.json()
            print("✅ Order with delivery created successfully!")
            print(f"Order Number: {order.get('order_number')}")
            print(f"Payment Method: {order.get('payment_method')}")
            print(f"Payment Status: {order.get('payment_status')}")
            print(f"Total Amount: {order.get('total_amount')}")
            print(f"Shipping Cost: {order.get('shipping_cost')}")
            return True
        else:
            print(f"❌ Failed to create order with delivery: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing order with delivery: {e}")
        return False

def test_validation_errors():
    """Test validation error handling"""
    
    print("\n🧪 Testing validation errors...")
    
    # Test missing required fields
    invalid_order = {
        "session_id": "test_session_789",
        "first_name": "",  # Missing required field
        "last_name": "Test",
        "email": "test@example.com",
        "phone": "0734567890",
        "address": "789 Test Street",
        "city": "Nairobi",
        "state": "Nairobi",
        "postal_code": "00100",
        "payment_method": "cod"
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/orders", json=invalid_order)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 400:
            print("✅ Validation error correctly returned for missing required field")
            return True
        else:
            print(f"❌ Expected validation error, got: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing validation: {e}")
        return False

def test_payment_status_logic():
    """Test that payment status is set correctly based on payment method"""
    
    print("\n🧪 Testing payment status logic...")
    
    # Test COD order (should be 'paid')
    cod_order = {
        "session_id": "test_session_cod",
        "first_name": "COD",
        "last_name": "Test",
        "email": "cod@example.com",
        "phone": "0745678901",
        "address": "COD Test Street",
        "city": "Nairobi",
        "state": "Nairobi",
        "postal_code": "00100",
        "payment_method": "cod",
        "cart_items": [{"product_id": 1, "quantity": 1, "price": 1000.00}]
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/orders", json=cod_order)
        if response.status_code == 201:
            order = response.json()
            if order.get('payment_status') == 'paid':
                print("✅ COD orders correctly set to 'paid' status")
            else:
                print(f"❌ COD order payment status incorrect: {order.get('payment_status')}")
                return False
        else:
            print(f"❌ Failed to create COD order: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing COD payment status: {e}")
        return False
    
    # Test M-Pesa order (should be 'pending')
    mpesa_order = {
        "session_id": "test_session_mpesa",
        "first_name": "M-Pesa",
        "last_name": "Test",
        "email": "mpesa@example.com",
        "phone": "0756789012",
        "address": "M-Pesa Test Street",
        "city": "Nairobi",
        "state": "Nairobi",
        "postal_code": "00100",
        "payment_method": "mpesa",
        "cart_items": [{"product_id": 1, "quantity": 1, "price": 1000.00}]
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/orders", json=mpesa_order)
        if response.status_code == 201:
            order = response.json()
            if order.get('payment_status') == 'pending':
                print("✅ M-Pesa orders correctly set to 'pending' status")
                return True
            else:
                print(f"❌ M-Pesa order payment status incorrect: {order.get('payment_status')}")
                return False
        else:
            print(f"❌ Failed to create M-Pesa order: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing M-Pesa payment status: {e}")
        return False

def main():
    """Run all integration tests"""
    print("🚀 Starting comprehensive backend integration tests...")
    print("=" * 60)
    
    tests = [
        test_order_creation,
        test_order_with_delivery,
        test_validation_errors,
        test_payment_status_logic
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
    
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Backend integration is working correctly.")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the backend integration.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 