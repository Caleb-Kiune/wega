#!/usr/bin/env python3
"""
Test Simple Endpoint Script
Tests endpoints that don't require database access
"""

import requests
import json

# Railway backend URL
RAILWAY_URL = "https://wega-production.up.railway.app"

def test_simple_endpoints():
    """Test endpoints that don't require database access"""
    
    print("🔧 Testing Simple Endpoints")
    print("=" * 40)
    
    # Test endpoints that should work without database
    simple_endpoints = [
        "/",
        "/health",
        "/usage",
        "/docs"
    ]
    
    for endpoint in simple_endpoints:
        try:
            response = requests.get(f"{RAILWAY_URL}{endpoint}")
            print(f"🔍 {endpoint}: {response.status_code}")
            
            if response.status_code == 200:
                print(f"   ✅ {endpoint} is working!")
                if endpoint == "/health":
                    data = response.json()
                    print(f"   📊 Database configured: {data.get('database_configured', False)}")
            else:
                print(f"   ❌ {endpoint} returned {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ {endpoint} error: {str(e)}")
    
    print("\n✅ Simple endpoint test completed!")
    return True

if __name__ == "__main__":
    test_simple_endpoints() 