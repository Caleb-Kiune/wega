#!/usr/bin/env python3
"""
Test script to check backend and database
"""

import requests
import time

def test_backend():
    """Test if backend is running and database is working"""
    
    print("🔍 Testing backend server...")
    
    # Test if backend is running
    try:
        response = requests.get('http://localhost:5000/api/health', timeout=5)
        print(f"✅ Backend is running! Status: {response.status_code}")
        print(f"Response: {response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running on http://localhost:5000")
        print("Please start the backend server with: cd backend && python3 run.py")
        return False
    except Exception as e:
        print(f"❌ Error testing backend: {e}")
        return False
    
    # Test admin login endpoint
    try:
        login_data = {
            "username": "admin",
            "password": "Admin123!"
        }
        
        response = requests.post('http://localhost:5000/api/auth/login', 
                               json=login_data, timeout=10)
        
        print(f"\n🔐 Testing admin login...")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Admin login successful!")
            data = response.json()
            print(f"User: {data.get('user', {}).get('username', 'Unknown')}")
        elif response.status_code == 401:
            print("❌ Admin login failed - invalid credentials")
        else:
            print(f"❌ Admin login failed - Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing admin login: {e}")
    
    return True

if __name__ == '__main__':
    print("🚀 Testing Wega Kitchenware Backend")
    print("=" * 40)
    
    # Wait a moment for backend to start
    time.sleep(2)
    
    test_backend()
    
    print("\n" + "=" * 40)
    print("Test complete!") 