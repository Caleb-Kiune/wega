#!/usr/bin/env python3
"""
Test script for track order functionality
"""

import requests
import json
import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app_factory import create_app
from models import db, Order, OrderItem, Product, DeliveryLocation

def test_track_order():
    """Test the track order functionality"""
    
    # Create test app
    app = create_app()
    
    with app.app_context():
        # Create test data
        print("🔧 Setting up test data...")
        
        # Create a delivery location
        delivery_location = DeliveryLocation(
            name="Test Location",
            shipping_price=500.0
        )
        db.session.add(delivery_location)
        db.session.flush()
        
        # Create a test product
        product = Product(
            name="Test Product",
            description="Test product for order tracking",
            price=1000.0,
            stock=10,
            sku="TEST-001"
        )
        db.session.add(product)
        db.session.flush()
        
        # Create a test order
        order = Order(
            order_number="TEST-ORDER-123",
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            phone="1234567890",
            address="123 Test St",
            city="Test City",
            state="Test State",
            postal_code="12345",
            total_amount=1500.0,
            shipping_cost=500.0,
            status="pending",
            payment_status="pending"
        )
        db.session.add(order)
        db.session.flush()
        
        # Create order item
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=1,
            price=1000.0
        )
        db.session.add(order_item)
        
        db.session.commit()
        
        print(f"✅ Created test order: {order.order_number}")
        print(f"📧 Email: {order.email}")
        
        # Test the track endpoint
        print("\n🧪 Testing track order endpoint...")
        
        # Test with order number and email
        track_data = {
            "order_number": order.order_number,
            "email": order.email
        }
        
        response = requests.post(
            "http://localhost:5000/api/orders/track",
            json=track_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"📊 Response status: {response.status_code}")
        
        if response.status_code == 200:
            orders = response.json()
            print(f"✅ Found {len(orders)} order(s)")
            for order_data in orders:
                print(f"   Order: {order_data['order_number']}")
                print(f"   Status: {order_data['status']}")
                print(f"   Total: {order_data['total_amount']}")
        else:
            print(f"❌ Error: {response.text}")
        
        # Test with just order number
        print("\n🧪 Testing with just order number...")
        track_data = {
            "order_number": order.order_number
        }
        
        response = requests.post(
            "http://localhost:5000/api/orders/track",
            json=track_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"📊 Response status: {response.status_code}")
        
        if response.status_code == 200:
            orders = response.json()
            print(f"✅ Found {len(orders)} order(s)")
        else:
            print(f"❌ Error: {response.text}")
        
        # Test with just email
        print("\n🧪 Testing with just email...")
        track_data = {
            "email": order.email
        }
        
        response = requests.post(
            "http://localhost:5000/api/orders/track",
            json=track_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"📊 Response status: {response.status_code}")
        
        if response.status_code == 200:
            orders = response.json()
            print(f"✅ Found {len(orders)} order(s)")
        else:
            print(f"❌ Error: {response.text}")
        
        # Test with non-existent order
        print("\n🧪 Testing with non-existent order...")
        track_data = {
            "order_number": "NON-EXISTENT-ORDER",
            "email": "nonexistent@example.com"
        }
        
        response = requests.post(
            "http://localhost:5000/api/orders/track",
            json=track_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"📊 Response status: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Correctly returned 404 for non-existent order")
        else:
            print(f"❌ Unexpected response: {response.text}")
        
        # Clean up
        print("\n🧹 Cleaning up test data...")
        db.session.delete(order_item)
        db.session.delete(order)
        db.session.delete(product)
        db.session.delete(delivery_location)
        db.session.commit()
        
        print("✅ Test completed!")

if __name__ == "__main__":
    test_track_order() 