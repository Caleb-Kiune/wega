# PostgreSQL Migration Guide for Wega Kitchenware

## 🎯 Goal: Migrate from SQLite to PostgreSQL

### Current Status
- ✅ PostgreSQL dependencies installed (`psycopg2-binary`)
- ✅ Configuration ready for PostgreSQL
- ✅ Migration scripts available
- ❌ PostgreSQL server not installed
- ❌ Database not created
- ❌ Environment variables not set

---

## 📋 Step-by-Step Migration Plan

### Step 1: Install PostgreSQL Server

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS (using Homebrew):
```bash
brew install postgresql
brew services start postgresql
```

#### Windows:
Download and install from: https://www.postgresql.org/download/windows/

### Step 2: Create Database and User

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database and user
CREATE DATABASE wega_kitchenware;
CREATE USER wega_user WITH PASSWORD 'wega_password';
GRANT ALL PRIVILEGES ON DATABASE wega_kitchenware TO wega_user;
\q
```

### Step 3: Set Environment Variables

Create a `.env` file in the backend directory:

```bash
# Backend/.env
DATABASE_URL=postgresql://wega_user:wega_password@localhost:5432/wega_kitchenware
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
```

### Step 4: Run Migration Scripts

```bash
cd backend

# 1. Setup PostgreSQL database
python scripts/setup_postgresql.py

# 2. Migrate existing data (if any)
python scripts/migrate_to_postgresql.py

# 3. Seed with fresh data
python scripts/seed_postgresql.py
```

### Step 5: Test the Migration

```bash
# Test database connection
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
print('DATABASE_URL:', os.environ.get('DATABASE_URL'))
"

# Test backend endpoints
python test_postgresql_integration.py
```

---

## 🔧 Implementation Scripts

### Database Setup Script
```python
#!/usr/bin/env python3
"""
PostgreSQL Database Setup Script
"""

import os
import sys
import subprocess

def install_postgresql():
    """Install PostgreSQL if not already installed"""
    print("🔧 Checking PostgreSQL installation...")
    
    try:
        # Check if PostgreSQL is installed
        result = subprocess.run(['psql', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ PostgreSQL is already installed")
            return True
    except FileNotFoundError:
        print("❌ PostgreSQL not found")
    
    print("📦 Installing PostgreSQL...")
    
    # Detect OS and install accordingly
    import platform
    system = platform.system().lower()
    
    if system == "linux":
        # Ubuntu/Debian
        subprocess.run(['sudo', 'apt', 'update'])
        subprocess.run(['sudo', 'apt', 'install', '-y', 'postgresql', 'postgresql-contrib'])
        subprocess.run(['sudo', 'systemctl', 'start', 'postgresql'])
        subprocess.run(['sudo', 'systemctl', 'enable', 'postgresql'])
    elif system == "darwin":
        # macOS
        subprocess.run(['brew', 'install', 'postgresql'])
        subprocess.run(['brew', 'services', 'start', 'postgresql'])
    else:
        print("❌ Unsupported OS. Please install PostgreSQL manually.")
        return False
    
    print("✅ PostgreSQL installed successfully")
    return True

def create_database():
    """Create PostgreSQL database and user"""
    print("🗄️  Creating database and user...")
    
    # Create database and user
    commands = [
        "CREATE DATABASE wega_kitchenware;",
        "CREATE USER wega_user WITH PASSWORD 'wega_password';",
        "GRANT ALL PRIVILEGES ON DATABASE wega_kitchenware TO wega_user;",
        "\\q"
    ]
    
    # Execute commands
    for cmd in commands:
        subprocess.run(['sudo', '-u', 'postgres', 'psql', '-c', cmd])
    
    print("✅ Database and user created successfully")

def setup_environment():
    """Create .env file with database configuration"""
    print("⚙️  Setting up environment variables...")
    
    env_content = """# Database Configuration
DATABASE_URL=postgresql://wega_user:wega_password@localhost:5432/wega_kitchenware

# Security
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production

# Development
DEBUG=True
FLASK_ENV=development
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("✅ Environment file created")

def main():
    """Main migration function"""
    print("🚀 PostgreSQL Migration Setup")
    print("=" * 50)
    
    # Install PostgreSQL
    if not install_postgresql():
        return
    
    # Create database
    create_database()
    
    # Setup environment
    setup_environment()
    
    print("\n🎉 PostgreSQL setup completed!")
    print("Next steps:")
    print("1. Run: python scripts/setup_postgresql.py")
    print("2. Run: python scripts/seed_postgresql.py")
    print("3. Test: python test_postgresql_integration.py")

if __name__ == "__main__":
    main()
```

---

## 🧪 Testing and Verification

### 1. Database Connection Test
```python
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()

def test_connection():
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        print("❌ DATABASE_URL not set")
        return False
    
    try:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            result = conn.execute("SELECT 1")
            print("✅ Database connection successful")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
```

### 2. Application Test
```python
from app_factory import create_app
from models import db

def test_app():
    app = create_app('development')
    with app.app_context():
        try:
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
```

---

## 📊 Performance Comparison

### SQLite vs PostgreSQL

| Metric | SQLite | PostgreSQL |
|--------|--------|------------|
| **Concurrency** | Single writer | Multiple concurrent users |
| **Scalability** | Limited | High |
| **Performance** | Good for small apps | Excellent for production |
| **Features** | Basic | Advanced (JSON, Full-text search, etc.) |
| **Backup** | File copy | pg_dump |
| **Replication** | None | Built-in |

---

## 🔄 Rollback Plan

If you need to rollback to SQLite:

1. **Update config.py**:
```python
SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
```

2. **Restore SQLite database**:
```bash
cp app.db.backup app.db
```

3. **Remove PostgreSQL environment**:
```bash
unset DATABASE_URL
```

---

## 🚀 Production Deployment

### Environment Variables for Production:
```bash
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-production-secret-key
JWT_SECRET_KEY=your-production-jwt-secret
DEBUG=False
```

### Database Backup Strategy:
```bash
# Create backup
pg_dump wega_kitchenware > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql wega_kitchenware < backup_file.sql
```

---

## ✅ Success Criteria

- [ ] PostgreSQL server installed and running
- [ ] Database and user created
- [ ] Environment variables configured
- [ ] Tables created successfully
- [ ] Data migrated (if applicable)
- [ ] All endpoints working
- [ ] Frontend-backend integration verified
- [ ] Performance acceptable

---

## 📞 Troubleshooting

### Common Issues:

1. **Connection refused**: PostgreSQL service not running
   ```bash
   sudo systemctl status postgresql
   sudo systemctl start postgresql
   ```

2. **Authentication failed**: Check user credentials
   ```bash
   sudo -u postgres psql -c "SELECT usename, usesysid FROM pg_user;"
   ```

3. **Database not found**: Create database
   ```bash
   sudo -u postgres createdb wega_kitchenware
   ```

4. **Permission denied**: Grant privileges
   ```bash
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE wega_kitchenware TO wega_user;"
   ```

---

## 🎉 Benefits of PostgreSQL Migration

### Technical Benefits:
- **Better Concurrency**: Handle multiple users simultaneously
- **Scalability**: Grow with your business needs
- **Reliability**: ACID compliance and crash recovery
- **Performance**: Optimized for complex queries
- **Features**: JSON support, full-text search, etc.

### Business Benefits:
- **Production Ready**: Industry-standard database
- **Future-Proof**: Can handle increased traffic
- **Maintainable**: Better database management tools
- **Professional**: Enterprise-grade solution

---

## 📋 Next Steps

1. **Install PostgreSQL** using the provided scripts
2. **Create database and user**
3. **Set environment variables**
4. **Run migration scripts**
5. **Test the application**
6. **Deploy to production**

Your Wega Kitchenware application will be ready for production with PostgreSQL! 🚀 