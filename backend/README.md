# Wega Kitchenware Backend

A well-organized Flask-based REST API for the Wega Kitchenware e-commerce platform.

## 🏗️ Project Structure

```
backend/
├── app_factory.py          # Application factory
├── run.py                  # Main application entry point
├── config.py               # Configuration management
├── models.py               # Database models
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── routes/                 # API route modules
│   ├── __init__.py
│   ├── main.py            # Main routes (root, static files)
│   ├── products.py        # Product management
│   ├── categories.py      # Category management
│   ├── brands.py          # Brand management
│   ├── reviews.py         # Review management
│   ├── cart.py            # Shopping cart
│   ├── orders.py          # Order management
│   ├── delivery.py        # Delivery locations
│   └── upload.py          # File uploads
├── utils/                  # Utility functions
│   ├── __init__.py
│   └── helpers.py         # Helper functions
├── scripts/                # Database management scripts
│   ├── seed.py
│   ├── seed_products.py
│   ├── check_database.py
│   └── ...
├── tests/                  # Test files
│   ├── test_app.py
│   └── test_orders.py
├── migrations/             # Database migrations
├── static/                 # Static files
│   └── uploads/           # Uploaded images
└── venv/                  # Virtual environment
```

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/wega_kitchenware
# or for SQLite (development):
# DATABASE_URL=sqlite:///app.db

# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# CORS Configuration
CORS_ORIGINS=http://localhost:3000

# Production Configuration (optional)
BASE_URL=https://your-domain.com
```

### 3. Database Setup

```bash
# Initialize database migrations
flask db init

# Create initial migration
flask db migrate -m "Initial migration"

# Apply migrations
flask db upgrade

# Seed the database (optional)
python scripts/seed.py
```

### 4. Run the Application

```bash
# Development mode
python run.py

# Or using Flask CLI
export FLASK_APP=run.py
export FLASK_ENV=development
flask run
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Core Endpoints

#### Products
- `GET /api/products` - Get all products with filtering and pagination
- `GET /api/products/<id>` - Get specific product
- `POST /api/products` - Create new product
- `PUT /api/products/<id>` - Update product
- `DELETE /api/products/<id>` - Delete product

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/<id>` - Get specific category
- `POST /api/categories` - Create new category
- `PUT /api/categories/<id>` - Update category
- `DELETE /api/categories/<id>` - Delete category

#### Brands
- `GET /api/brands` - Get all brands
- `GET /api/brands/<id>` - Get specific brand
- `POST /api/brands` - Create new brand
- `PUT /api/brands/<id>` - Update brand
- `DELETE /api/brands/<id>` - Delete brand

#### Cart
- `GET /api/cart?session_id=<id>` - Get cart contents
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/<id>` - Update cart item
- `DELETE /api/cart/items/<id>` - Remove item from cart
- `DELETE /api/cart?session_id=<id>` - Clear cart

#### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/<id>` - Get specific order
- `POST /api/orders` - Create new order
- `PATCH /api/orders/<id>/status` - Update order status
- `PATCH /api/orders/<id>/payment-status` - Update payment status
- `POST /api/orders/track` - Track order
- `DELETE /api/orders/<id>` - Delete order

#### File Upload
- `POST /api/upload` - Upload image file

## 🛠️ Development

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=.

# Run specific test file
pytest tests/test_app.py
```

### Database Management

```bash
# Check database status
python scripts/check_database.py

# Clear database
python scripts/clear_database.py

# Seed database
python scripts/seed.py

# Fix database sequences
python scripts/fix_sequences.py
```

### Code Organization

The application follows a modular structure:

- **Routes**: Each resource has its own route module
- **Models**: Database models with relationships
- **Utils**: Helper functions and utilities
- **Config**: Environment-specific configurations
- **Scripts**: Database management and seeding scripts

## 🔧 Configuration

The application supports multiple environments:

- **Development**: Uses SQLite and development settings
- **Production**: Uses PostgreSQL and production settings
- **Testing**: Uses in-memory database for tests

Configuration is managed through the `config.py` file and environment variables.

## 📦 Deployment

### Production Setup

1. Set environment variables:
   ```bash
   export FLASK_ENV=production
   export DATABASE_URL=postgresql://user:pass@host:port/db
   export SECRET_KEY=your-secret-key
   ```

2. Install production dependencies:
   ```bash
   pip install gunicorn
   ```

3. Run with Gunicorn:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 run:app
   ```

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation as needed
4. Use meaningful commit messages

## 📄 License

This project is part of the Wega Kitchenware platform. # Force fresh Railway build - Mon Aug 11 11:16:27 EAT 2025
