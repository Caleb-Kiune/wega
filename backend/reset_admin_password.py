#!/usr/bin/env python3
import os
import sys
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app_factory import create_app
from models import db, AdminUser

def reset_admin_password():
    """Reset admin user password to a known value"""
    app = create_app()
    
    with app.app_context():
        # Find admin user
        admin_user = AdminUser.query.filter_by(username='admin').first()
        
        if not admin_user:
            print("❌ Admin user not found!")
            return False
        
        # Reset password to a simple test password
        new_password = 'admin123'
        admin_user.set_password(new_password)
        
        try:
            db.session.commit()
            print("✅ Admin password reset successfully!")
            print(f"Username: {admin_user.username}")
            print(f"Email: {admin_user.email}")
            print(f"New password: {new_password}")
            print("\nYou can now login with these credentials.")
            return True
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error resetting password: {e}")
            return False

if __name__ == '__main__':
    print("🔧 Resetting Admin Password")
    print("=" * 30)
    
    success = reset_admin_password()
    
    if success:
        print("\n" + "=" * 30)
        print("🎉 Password reset complete!")
    else:
        print("\n❌ Password reset failed.")
        sys.exit(1)
