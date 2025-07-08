#!/usr/bin/env python3
"""
Test script for delivery locations functionality
"""

import requests
import json

def test_delivery_locations():
    """Test the delivery locations endpoint"""
    
    base_url = "http://localhost:5000/api"
    
    print("🧪 Testing Delivery Locations API")
    print("=" * 50)
    
    # Test delivery locations endpoint
    print("\n📍 Testing Delivery Locations Endpoint...")
    try:
        response = requests.get(f"{base_url}/delivery-locations")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            locations = response.json()
            print(f"✅ Found {len(locations)} delivery locations:")
            for location in locations:
                print(f"   - {location['name']}: KES {location['shippingPrice']}")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Test completed!")

if __name__ == "__main__":
    test_delivery_locations() 