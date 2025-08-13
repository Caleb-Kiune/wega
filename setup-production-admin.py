#!/usr/bin/env python3
"""
Production Admin Setup Script
This script helps create admin accounts for production deployment.
"""

import os
import sys
import getpass
from werkzeug.security import generate_password_hash

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

def setup_admin_account():
    """Create an admin account for production"""
    
    print("🔧 WEGA Kitchenware - Production Admin Setup")
    print("=" * 50)
    
    # Get admin details
    print("\n📝 Enter admin account details:")
    username = input("Username: ").strip()
    email = input("Email: ").strip()
    
    # Get password securely
    while True:
        password = getpass.getpass("Password: ")
        confirm_password = getpass.getpass("Confirm Password: ")
        
        if password == confirm_password:
            if len(password) >= 8:
                break
            else:
                print("❌ Password must be at least 8 characters long")
        else:
            print("❌ Passwords don't match. Please try again.")
    
    # Generate password hash
    password_hash = generate_password_hash(password)
    
    # Create admin user data
    admin_data = {
        'username': username,
        'email': email,
        'password_hash': password_hash,
        'role': 'admin',
        'is_active': True
    }
    
    print(f"\n✅ Admin account created successfully!")
    print(f"Username: {username}")
    print(f"Email: {email}")
    print(f"Role: {admin_data['role']}")
    
    # Show SQL insert statement
    print(f"\n📋 SQL Insert Statement:")
    print(f"INSERT INTO admin_users (username, email, password_hash, role, is_active, created_at) VALUES (")
    print(f"  '{username}',")
    print(f"  '{email}',")
    print(f"  '{password_hash}',")
    print(f"  'admin',")
    print(f"  true,")
    print(f"  CURRENT_TIMESTAMP")
    print(f");")
    
    # Show Python code
    print(f"\n🐍 Python Code:")
    print(f"from backend.models import db, AdminUser")
    print(f"from werkzeug.security import generate_password_hash")
    print(f"")
    print(f"admin = AdminUser(")
    print(f"    username='{username}',")
    print(f"    email='{email}',")
    print(f"    password_hash=generate_password_hash('{password}'),")
    print(f"    role='admin',")
    print(f"    is_active=True")
    print(f")")
    print(f"")
    print(f"db.session.add(admin)")
    print(f"db.session.commit()")
    
    return admin_data

def check_environment():
    """Check if environment variables are set correctly"""
    
    print("\n🔍 Environment Check:")
    print("=" * 30)
    
    # Check common environment variables
    env_vars = [
        'DATABASE_URL',
        'SECRET_KEY',
        'JWT_SECRET_KEY',
        'CORS_ORIGINS',
        'FLASK_ENV'
    ]
    
    for var in env_vars:
        value = os.environ.get(var)
        if value:
            # Mask sensitive values
            if 'SECRET' in var or 'PASSWORD' in var:
                display_value = value[:8] + '***' if len(value) > 8 else '***'
            else:
                display_value = value
            print(f"✅ {var}: {display_value}")
        else:
            print(f"❌ {var}: Not set")
    
    print(f"\n💡 Tip: Set missing environment variables in your deployment platform")

def main():
    """Main function"""
    
    try:
        # Check environment
        check_environment()
        
        # Setup admin account
        admin_data = setup_admin_account()
        
        print(f"\n🎉 Setup complete!")
        print(f"Next steps:")
        print(f"1. Deploy your backend with the environment variables")
        print(f"2. Run the SQL insert statement or Python code above")
        print(f"3. Deploy your frontend with NEXT_PUBLIC_API_URL set")
        print(f"4. Test admin login at your-domain.com/admin/login")
        
    except KeyboardInterrupt:
        print(f"\n\n❌ Setup cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error during setup: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
