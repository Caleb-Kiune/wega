import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app_factory import create_app
from models import db, AdminUser
from werkzeug.security import generate_password_hash

app = create_app('production')

def seed_admin():
    with app.app_context():
        if AdminUser.query.count() == 0:
            admin = AdminUser(
                username='admin',
                email='admin@wega-kitchenware.com',
                password_hash=generate_password_hash('Admin123!'),
                role='super_admin',
                is_active=True
            )
            db.session.add(admin)
            db.session.commit()
            print("✅ Default admin user created!")
            print("Username: admin")
            print("Email: admin@wega-kitchenware.com")
            print("Password: Admin123!")
            print("⚠️  IMPORTANT: Change this password after first login!")
        else:
            print("✅ Admin user(s) already exist.")

if __name__ == '__main__':
    seed_admin() 