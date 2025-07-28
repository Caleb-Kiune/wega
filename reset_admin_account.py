#!/usr/bin/env python3
"""
Script to reset admin account lockout state
"""

import sqlite3
import os

def reset_admin_account():
    """Reset admin account lockout state"""
    
    # Database path
    db_path = os.path.join('backend', 'app.db')
    print(f"Resetting admin account in: {db_path}")
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Reset failed login attempts and lockout
        cursor.execute('''
            UPDATE admin_users 
            SET failed_login_attempts = 0, 
                locked_until = NULL, 
                last_failed_attempt = NULL
            WHERE username = 'admin'
        ''')
        
        # Check if update was successful
        cursor.execute('SELECT failed_login_attempts, locked_until FROM admin_users WHERE username = "admin"')
        result = cursor.fetchone()
        
        if result:
            failed_attempts, locked_until = result
            print(f"✅ Admin account reset successfully")
            print(f"   Failed attempts: {failed_attempts}")
            print(f"   Locked until: {locked_until}")
        else:
            print("❌ Admin user not found")
            return False
        
        conn.commit()
        return True
        
    except Exception as e:
        print(f"❌ Error resetting admin account: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    reset_admin_account() 