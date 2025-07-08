#!/usr/bin/env python3
"""
Test script to verify admin orders functionality
"""

import os
import sys
import requests
import json

def test_admin_orders():
    """Test admin orders functionality"""
    
    print("🧪 Testing Admin Orders Functionality")
    print("=" * 50)
    
    try:
        # Test 1: Get all orders
        print("\n1️⃣ Testing GET /api/orders...")
        response = requests.get('http://localhost:5000/api/orders')
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Found {len(data.get('orders', []))} orders")
            print(f"   Total orders: {data.get('total', 0)}")
            print(f"   Pages: {data.get('pages', 0)}")
            print(f"   Current page: {data.get('current_page', 0)}")
            
            if data.get('orders'):
                first_order = data['orders'][0]
                print(f"   First order: #{first_order.get('order_number')} - {first_order.get('status')}")
        else:
            print(f"❌ Failed: {response.status_code}")
            print(f"Response: {response.text}")
    
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend API")
        print("   Make sure the backend is running on http://localhost:5000")
        return
    except Exception as e:
        print(f"❌ Error testing orders: {e}")
        return
    
    # Test 2: Get orders with filters
    print("\n2️⃣ Testing GET /api/orders with filters...")
    try:
        response = requests.get('http://localhost:5000/api/orders?status=pending&page=1&per_page=5')
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Filtered orders: {len(data.get('orders', []))} pending orders")
        else:
            print(f"❌ Filter failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing filters: {e}")
    
    # Test 3: Get specific order
    print("\n3️⃣ Testing GET /api/orders/{id}...")
    try:
        # First get a list to find an order ID
        response = requests.get('http://localhost:5000/api/orders?per_page=1')
        if response.status_code == 200:
            data = response.json()
            if data.get('orders'):
                order_id = data['orders'][0]['id']
                
                # Now get the specific order
                response = requests.get(f'http://localhost:5000/api/orders/{order_id}')
                if response.status_code == 200:
                    order = response.json()
                    print(f"✅ Order details: #{order.get('order_number')} - {order.get('status')}")
                else:
                    print(f"❌ Failed to get order {order_id}: {response.status_code}")
            else:
                print("❌ No orders found to test with")
        else:
            print(f"❌ Failed to get orders list: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing specific order: {e}")
    
    # Test 4: Update order status
    print("\n4️⃣ Testing PATCH /api/orders/{id}/status...")
    try:
        # First get a list to find an order ID
        response = requests.get('http://localhost:5000/api/orders?per_page=1')
        if response.status_code == 200:
            data = response.json()
            if data.get('orders'):
                order_id = data['orders'][0]['id']
                current_status = data['orders'][0]['status']
                
                # Update status
                new_status = 'processing' if current_status == 'pending' else 'pending'
                response = requests.patch(
                    f'http://localhost:5000/api/orders/{order_id}/status',
                    json={'status': new_status},
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code == 200:
                    updated_order = response.json()
                    print(f"✅ Status updated: {current_status} → {updated_order.get('status')}")
                    
                    # Revert the change
                    response = requests.patch(
                        f'http://localhost:5000/api/orders/{order_id}/status',
                        json={'status': current_status},
                        headers={'Content-Type': 'application/json'}
                    )
                    if response.status_code == 200:
                        print(f"✅ Status reverted: {new_status} → {current_status}")
                else:
                    print(f"❌ Failed to update status: {response.status_code}")
                    print(f"Response: {response.text}")
            else:
                print("❌ No orders found to test with")
        else:
            print(f"❌ Failed to get orders list: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing status update: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Admin orders functionality test completed!")

if __name__ == '__main__':
    test_admin_orders() 