# Wega Kitchenware Backend

This is the backend API for the Wega Kitchenware e-commerce platform.

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- On Windows:
```bash
.\venv\Scripts\activate
```
- On macOS/Linux:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Initialize the database:
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

5. Run the development server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Documentation

The API provides the following main endpoints:

- `/api/products` - Product management
- `/api/categories` - Category management
- `/api/brands` - Brand management

For detailed API documentation, refer to the API endpoints in the code. 