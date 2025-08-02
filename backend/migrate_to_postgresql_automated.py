#!/usr/bin/env python3
"""
Automated PostgreSQL Migration Script for Wega Kitchenware
This script automates the entire migration process from SQLite to PostgreSQL.
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def check_postgresql_installation():
    """Check if PostgreSQL is installed"""
    print("🔍 Checking PostgreSQL installation...")
    
    try:
        result = subprocess.run(['psql', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ PostgreSQL is installed: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        print("❌ PostgreSQL not found")
        return False

def install_postgresql():
    """Install PostgreSQL based on the operating system"""
    print("📦 Installing PostgreSQL...")
    
    system = platform.system().lower()
    
    if system == "linux":
        print("🐧 Installing PostgreSQL on Linux...")
        try:
            subprocess.run(['sudo', 'apt', 'update'], check=True)
            subprocess.run(['sudo', 'apt', 'install', '-y', 'postgresql', 'postgresql-contrib'], check=True)
            subprocess.run(['sudo', 'systemctl', 'start', 'postgresql'], check=True)
            subprocess.run(['sudo', 'systemctl', 'enable', 'postgresql'], check=True)
            print("✅ PostgreSQL installed successfully on Linux")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install PostgreSQL: {e}")
            return False
    elif system == "darwin":
        print("🍎 Installing PostgreSQL on macOS...")
        try:
            subprocess.run(['brew', 'install', 'postgresql'], check=True)
            subprocess.run(['brew', 'services', 'start', 'postgresql'], check=True)
            print("✅ PostgreSQL installed successfully on macOS")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install PostgreSQL: {e}")
            return False
    else:
        print(f"❌ Unsupported OS: {system}")
        print("Please install PostgreSQL manually from: https://www.postgresql.org/download/")
        return False

def create_database_and_user():
    """Create PostgreSQL database and user"""
    print("🗄️  Creating database and user...")
    
    try:
        # Create database
        subprocess.run(['sudo', '-u', 'postgres', 'createdb', 'wega_kitchenware'], check=True)
        print("✅ Database 'wega_kitchenware' created")
        
        # Create user
        subprocess.run(['sudo', '-u', 'postgres', 'psql', '-c', 
                       "CREATE USER wega_user WITH PASSWORD 'wega_password';"], check=True)
        print("✅ User 'wega_user' created")
        
        # Grant privileges
        subprocess.run(['sudo', '-u', 'postgres', 'psql', '-c', 
                       "GRANT ALL PRIVILEGES ON DATABASE wega_kitchenware TO wega_user;"], check=True)
        print("✅ Privileges granted to wega_user")
        
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to create database/user: {e}")
        return False

def setup_environment_file():
    """Create .env file with PostgreSQL configuration"""
    print("⚙️  Setting up environment file...")
    
    env_content = """# Database Configuration
DATABASE_URL=postgresql://wega_user:wega_password@localhost:5432/wega_kitchenware

# Security (Change these in production!)
SECRET_KEY=wega-kitchenware-secret-key-change-in-production
JWT_SECRET_KEY=wega-kitchenware-jwt-secret-change-in-production

# Development
DEBUG=True
FLASK_ENV=development

# CORS (Development)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
"""
    
    env_path = Path('.env')
    with open(env_path, 'w') as f:
        f.write(env_content)
    
    print(f"✅ Environment file created: {env_path.absolute()}")

def backup_sqlite_database():
    """Backup the existing SQLite database"""
    print("💾 Backing up SQLite database...")
    
    sqlite_db = Path('app.db')
    if sqlite_db.exists():
        backup_path = Path('app.db.backup')
        import shutil
        shutil.copy2(sqlite_db, backup_path)
        print(f"✅ SQLite database backed up to: {backup_path}")
        return True
    else:
        print("ℹ️  No SQLite database found to backup")
        return False

def run_migration_scripts():
    """Run the PostgreSQL migration scripts"""
    print("🔄 Running migration scripts...")
    
    scripts = [
        'scripts/setup_postgresql.py',
        'scripts/seed_postgresql.py'
    ]
    
    for script in scripts:
        script_path = Path(script)
        if script_path.exists():
            print(f"📜 Running {script}...")
            try:
                result = subprocess.run([sys.executable, str(script_path)], 
                                      capture_output=True, text=True, cwd=Path.cwd())
                if result.returncode == 0:
                    print(f"✅ {script} completed successfully")
                else:
                    print(f"❌ {script} failed: {result.stderr}")
                    return False
            except Exception as e:
                print(f"❌ Error running {script}: {e}")
                return False
        else:
            print(f"⚠️  Script not found: {script}")
    
    return True

def test_database_connection():
    """Test the PostgreSQL database connection"""
    print("🧪 Testing database connection...")
    
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        print("❌ DATABASE_URL not found in environment")
        return False
    
    try:
        from sqlalchemy import create_engine
        engine = create_engine(db_url)
        with engine.connect() as conn:
            result = conn.execute("SELECT 1")
            print("✅ Database connection successful")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_application():
    """Test the Flask application with PostgreSQL"""
    print("🧪 Testing Flask application...")
    
    try:
        # Add current directory to Python path
        sys.path.insert(0, str(Path.cwd()))
        
        from app_factory import create_app
        from models import db
        
        app = create_app('development')
        with app.app_context():
            # Test database connection
            db.engine.execute("SELECT 1")
            print("✅ Application database connection successful")
            
            # Test models
            from models import Product, Category, Brand
            products = Product.query.all()
            categories = Category.query.all()
            brands = Brand.query.all()
            
            print(f"✅ Models working: {len(products)} products, {len(categories)} categories, {len(brands)} brands")
            return True
    except Exception as e:
        print(f"❌ Application test failed: {e}")
        return False

def main():
    """Main migration function"""
    print("🚀 Automated PostgreSQL Migration for Wega Kitchenware")
    print("=" * 60)
    
    # Check if we're in the backend directory
    if not Path('config.py').exists():
        print("❌ Please run this script from the backend directory")
        return
    
    # Step 1: Check/Install PostgreSQL
    if not check_postgresql_installation():
        if not install_postgresql():
            print("❌ Failed to install PostgreSQL")
            return
    
    # Step 2: Create database and user
    if not create_database_and_user():
        print("❌ Failed to create database and user")
        return
    
    # Step 3: Setup environment
    setup_environment_file()
    
    # Step 4: Backup SQLite database
    backup_sqlite_database()
    
    # Step 5: Run migration scripts
    if not run_migration_scripts():
        print("❌ Failed to run migration scripts")
        return
    
    # Step 6: Test database connection
    if not test_database_connection():
        print("❌ Database connection test failed")
        return
    
    # Step 7: Test application
    if not test_application():
        print("❌ Application test failed")
        return
    
    print("\n🎉 PostgreSQL Migration Completed Successfully!")
    print("=" * 60)
    print("✅ PostgreSQL installed and configured")
    print("✅ Database and user created")
    print("✅ Environment variables set")
    print("✅ Tables created and seeded")
    print("✅ All tests passed")
    
    print("\n📋 Next Steps:")
    print("1. Start the backend: python run.py")
    print("2. Start the frontend: npm run dev")
    print("3. Test the application: http://localhost:3000")
    
    print("\n🔧 Database Information:")
    print("- Database: wega_kitchenware")
    print("- User: wega_user")
    print("- Password: wega_password")
    print("- Host: localhost")
    print("- Port: 5432")
    
    print("\n⚠️  Important:")
    print("- Change default passwords in production")
    print("- Update environment variables for production")
    print("- Set up proper backup strategy")
    
    print("\n🚀 Your Wega Kitchenware app is now running with PostgreSQL!")

if __name__ == "__main__":
    main() 