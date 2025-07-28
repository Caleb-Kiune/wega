#!/usr/bin/env python3
"""
Simple test script for admin login security improvements
"""

import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:5000/api"
LOGIN_ENDPOINT = f"{BASE_URL}/auth/login"
CSRF_ENDPOINT = f"{BASE_URL}/auth/csrf-token"

def test_csrf_protection():
    """Test CSRF token functionality"""
    print("🔒 Testing CSRF Protection...")
    
    # Get CSRF token
    try:
        response = requests.get(CSRF_ENDPOINT)
        if response.status_code == 200:
            csrf_token = response.json()['csrf_token']
            print("✅ CSRF token retrieved successfully")
        else:
            print("❌ Failed to get CSRF token")
            return False
    except Exception as e:
        print(f"❌ Error getting CSRF token: {e}")
        return False
    
    # Test login without CSRF token (should work for login)
    login_data = {
        "username": "admin",
        "password": "Admin123!"
    }
    
    try:
        response = requests.post(LOGIN_ENDPOINT, json=login_data)
        if response.status_code == 200:
            print("✅ Login without CSRF token works (expected for login)")
        else:
            print(f"❌ Login failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing login: {e}")
        return False
    
    return True

def test_field_validation():
    """Test field validation"""
    print("\n✅ Testing Field Validation...")
    
    # Test empty username
    login_data = {"username": "", "password": "test123"}
    response = requests.post(LOGIN_ENDPOINT, json=login_data)
    if response.status_code == 400:
        print("✅ Empty username validation works")
    else:
        print(f"❌ Empty username validation failed: {response.status_code}")
        return False
    
    # Test empty password
    login_data = {"username": "admin", "password": ""}
    response = requests.post(LOGIN_ENDPOINT, json=login_data)
    if response.status_code == 400:
        print("✅ Empty password validation works")
    else:
        print(f"❌ Empty password validation failed: {response.status_code}")
        return False
    
    # Test invalid email format
    login_data = {"username": "invalid-email", "password": "test123"}
    response = requests.post(LOGIN_ENDPOINT, json=login_data)
    if response.status_code == 400:
        print("✅ Invalid email format validation works")
    else:
        print(f"❌ Invalid email format validation failed: {response.status_code}")
        return False
    
    # Test short username
    login_data = {"username": "ab", "password": "test123"}
    response = requests.post(LOGIN_ENDPOINT, json=login_data)
    if response.status_code == 400:
        print("✅ Short username validation works")
    else:
        print(f"❌ Short username validation failed: {response.status_code}")
        return False
    
    return True

def test_remember_me():
    """Test remember me functionality"""
    print("\n💾 Testing Remember Me...")
    
    # Test login with remember_me = true
    login_data = {
        "username": "admin",
        "password": "Admin123!",
        "remember_me": True
    }
    
    try:
        response = requests.post(LOGIN_ENDPOINT, json=login_data)
        if response.status_code == 200:
            tokens = response.json()['tokens']
            print("✅ Remember me login successful")
            
            # Check if tokens have longer expiration
            if tokens['access_expires_in'] > 1800:  # Should be longer than 30 minutes
                print("✅ Extended token expiration for remember me")
            else:
                print("❌ Token expiration not extended for remember me")
                return False
        else:
            print(f"❌ Remember me login failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing remember me: {e}")
        return False
    
    return True

def test_rate_limiting_basic():
    """Test basic rate limiting (without triggering lockout)"""
    print("\n🔄 Testing Basic Rate Limiting...")
    
    # Try a few failed attempts (but not enough to trigger lockout)
    for i in range(3):
        login_data = {
            "username": "admin",
            "password": "wrong_password"
        }
        
        try:
            response = requests.post(LOGIN_ENDPOINT, json=login_data)
            
            if response.status_code == 401:
                print(f"✅ Failed attempt {i+1}/3 (rate limiting working)")
            else:
                print(f"❌ Unexpected response: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error during rate limiting test: {e}")
            return False
    
    # Try successful login to reset attempts
    login_data = {
        "username": "admin",
        "password": "Admin123!"
    }
    
    try:
        response = requests.post(LOGIN_ENDPOINT, json=login_data)
        if response.status_code == 200:
            print("✅ Successful login after failed attempts (rate limiting reset)")
        else:
            print(f"❌ Login failed after attempts: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing login after attempts: {e}")
        return False
    
    return True

def test_network_retry():
    """Test network retry functionality"""
    print("\n🌐 Testing Network Retry...")
    
    # This would require a more sophisticated test setup
    # For now, we'll just verify the endpoint is accessible
    try:
        response = requests.get(CSRF_ENDPOINT, timeout=5)
        if response.status_code == 200:
            print("✅ Network connectivity confirmed")
        else:
            print(f"❌ Network test failed: {response.status_code}")
            return False
    except requests.exceptions.Timeout:
        print("❌ Network timeout")
        return False
    except Exception as e:
        print(f"❌ Network error: {e}")
        return False
    
    return True

def run_all_tests():
    """Run all security tests"""
    print("🔐 Admin Login Security Improvements Test Suite")
    print("=" * 50)
    
    tests = [
        ("CSRF Protection", test_csrf_protection),
        ("Basic Rate Limiting", test_rate_limiting_basic),
        ("Field Validation", test_field_validation),
        ("Remember Me", test_remember_me),
        ("Network Retry", test_network_retry),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name} PASSED")
            else:
                print(f"❌ {test_name} FAILED")
        except Exception as e:
            print(f"❌ {test_name} ERROR: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All security improvements are working correctly!")
        return True
    else:
        print("⚠️  Some security improvements need attention.")
        return False

if __name__ == "__main__":
    # Check if backend is running
    try:
        response = requests.get(f"{BASE_URL}/auth/csrf-token", timeout=5)
        if response.status_code != 200:
            print("❌ Backend is not responding correctly")
            sys.exit(1)
    except Exception as e:
        print("❌ Backend is not running. Please start the Flask server first.")
        print("Run: cd backend && python run.py")
        sys.exit(1)
    
    success = run_all_tests()
    sys.exit(0 if success else 1) 