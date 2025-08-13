#!/usr/bin/env python3
"""
Deployment Verification Script
This script helps verify that your deployment configuration is correct.
"""

import os
import requests
import sys
from datetime import datetime

def check_backend_health(backend_url):
    """Check if backend is accessible"""
    try:
        response = requests.get(f"{backend_url}/api/health", timeout=10)
        if response.status_code == 200:
            print("✅ Backend is accessible")
            return True
        else:
            print(f"❌ Backend returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend is not accessible: {e}")
        return False

def test_admin_login(backend_url, username, password):
    """Test admin login endpoint"""
    try:
        response = requests.post(
            f"{backend_url}/api/admin/login",
            json={
                "username": username,
                "password": password
            },
            timeout=10
        )
        
        if response.status_code == 401:
            print("✅ Admin login endpoint is working (returned 401 as expected for invalid credentials)")
            return True
        elif response.status_code == 200:
            print("⚠️  Admin login succeeded - check if credentials are correct")
            return True
        else:
            print(f"❌ Admin login endpoint returned unexpected status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Admin login endpoint error: {e}")
        return False

def check_cors_configuration(backend_url, frontend_url):
    """Check CORS configuration"""
    try:
        response = requests.options(
            f"{backend_url}/api/admin/login",
            headers={
                "Origin": frontend_url,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type"
            },
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ CORS preflight request successful")
            return True
        else:
            print(f"❌ CORS preflight failed with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ CORS test failed: {e}")
        return False

def main():
    """Main verification function"""
    print("🔍 WEGA Kitchenware - Deployment Verification")
    print("=" * 50)
    
    # Get configuration from user
    print("\n📝 Enter your deployment URLs:")
    backend_url = input("Backend URL (e.g., https://wega-backend.onrender.com): ").strip()
    frontend_url = input("Frontend URL (e.g., https://wega-kitchenware.vercel.app): ").strip()
    
    # Remove trailing slash if present
    backend_url = backend_url.rstrip('/')
    frontend_url = frontend_url.rstrip('/')
    
    print(f"\n🔧 Testing configuration...")
    print(f"Backend: {backend_url}")
    print(f"Frontend: {frontend_url}")
    
    # Test backend health
    print(f"\n1. Testing backend health...")
    backend_healthy = check_backend_health(backend_url)
    
    # Test admin login endpoint
    print(f"\n2. Testing admin login endpoint...")
    admin_login_working = test_admin_login(backend_url, "admin", "test_password")
    
    # Test CORS configuration
    print(f"\n3. Testing CORS configuration...")
    cors_working = check_cors_configuration(backend_url, frontend_url)
    
    # Summary
    print(f"\n" + "=" * 50)
    print(f"📊 Verification Summary:")
    print(f"Backend Health: {'✅ PASS' if backend_healthy else '❌ FAIL'}")
    print(f"Admin Login Endpoint: {'✅ PASS' if admin_login_working else '❌ FAIL'}")
    print(f"CORS Configuration: {'✅ PASS' if cors_working else '❌ FAIL'}")
    
    if backend_healthy and admin_login_working and cors_working:
        print(f"\n🎉 All tests passed! Your deployment should work correctly.")
        print(f"\n📋 Next steps:")
        print(f"1. Try logging in at: {frontend_url}/admin/login")
        print(f"2. Use the credentials you set in your environment variables")
        print(f"3. If login fails, check your backend logs for admin user creation")
    else:
        print(f"\n❌ Some tests failed. Please check your configuration.")
        print(f"\n🔧 Troubleshooting:")
        if not backend_healthy:
            print(f"- Verify your backend is deployed and running")
            print(f"- Check if the backend URL is correct")
        if not admin_login_working:
            print(f"- Check if admin user was created during deployment")
            print(f"- Verify environment variables are set correctly")
        if not cors_working:
            print(f"- Add {frontend_url} to CORS_ORIGINS in your backend")
            print(f"- Redeploy backend after updating CORS configuration")

if __name__ == "__main__":
    main()
