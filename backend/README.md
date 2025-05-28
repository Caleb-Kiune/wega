# Backend API with SQLite

This is a Flask-based REST API with SQLite database integration.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Initialize the database:
```bash
flask db init
flask db migrate
flask db upgrade
```

4. Run the application:
```bash
python app.py
```

The server will start at `http://localhost:5000`

## API Endpoints

- `GET /api/items` - Get all items
- `POST /api/items` - Create a new item
- `GET /api/items/<id>` - Get a specific item
- `PUT /api/items/<id>` - Update an item
- `DELETE /api/items/<id>` - Delete an item

## Example Usage

Create a new item:
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Example Item", "description": "This is an example item"}'
```

Get all items:
```bash
curl http://localhost:5000/api/items
``` 