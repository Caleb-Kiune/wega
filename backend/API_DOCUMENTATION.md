# Wega Kitchenware API Documentation

This document describes the API documentation setup and how to use the interactive Swagger UI.

## 🚀 Quick Start

### 1. Start the Flask Server

```bash
cd backend
python run.py
```

The server will start on `http://localhost:5000`

### 2. Access API Documentation

- **Interactive Documentation**: http://localhost:5000/docs
- **OpenAPI Specification**: http://localhost:5000/api/openapi.yaml
- **Alternative URL**: http://localhost:5000/api-docs (redirects to /docs)

## 📖 Swagger UI Features

The Swagger UI provides:

- **Interactive API Explorer**: Test endpoints directly from the browser
- **Request/Response Examples**: See example data for all endpoints
- **Authentication Support**: Ready for future auth implementation
- **Try It Out**: Execute API calls with real data
- **Schema Validation**: Automatic request/response validation
- **Download OpenAPI Spec**: Export the specification for other tools

## 🔧 API Endpoints

### Products API
- `GET /api/products` - Get all products with filtering and pagination
- `GET /api/products/{id}` - Get single product details

### Orders API
- `GET /api/orders` - Get all orders with filtering
- `POST /api/orders` - Create new order from cart
- `GET /api/orders/{id}` - Get single order details
- `PATCH /api/orders/{id}/status` - Update order status
- `POST /api/orders/track` - Track orders by number or email

### Cart API
- `GET /api/cart` - Get cart contents
- `DELETE /api/cart` - Clear entire cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{item_id}` - Update cart item quantity
- `DELETE /api/cart/items/{item_id}` - Remove item from cart

### Delivery Locations API
- `GET /api/delivery-locations` - Get all delivery locations
- `POST /api/delivery-locations` - Create new delivery location
- `GET /api/delivery-locations/{id}` - Get single delivery location
- `PUT /api/delivery-locations/{id}` - Update delivery location
- `DELETE /api/delivery-locations/{id}` - Delete delivery location

## 🧪 Testing the API

### Using the Test Script

A simple test script is provided to verify API functionality:

```bash
cd backend
python test_api.py
```

This script tests:
- Products API endpoints
- Cart API endpoints
- Delivery locations API endpoints
- Orders API endpoints

### Manual Testing with curl

```bash
# Get all products
curl http://localhost:5000/api/products

# Get a specific product
curl http://localhost:5000/api/products/1

# Get cart contents
curl "http://localhost:5000/api/cart?session_id=test123"

# Get delivery locations
curl http://localhost:5000/api/delivery-locations
```

## 📋 API Testing with Postman

1. **Import OpenAPI Spec**: 
   - Open Postman
   - Go to File → Import
   - Select "Link" and enter: `http://localhost:5000/api/openapi.yaml`

2. **Environment Setup**:
   - Create a new environment
   - Add variable: `base_url` = `http://localhost:5000/api`

3. **Test Collections**:
   - Postman will automatically create collections for all endpoints
   - Each endpoint will have example requests ready to test

## 🔄 Frontend Integration

### Generate TypeScript Client

You can generate a TypeScript client from the OpenAPI specification:

```bash
# Install openapi-typescript-codegen
npm install -g openapi-typescript-codegen

# Generate TypeScript client
openapi-generator-cli generate \
  -i http://localhost:5000/api/openapi.yaml \
  -g typescript-fetch \
  -o frontend/src/api-client
```

### Using the Generated Client

```typescript
import { ProductsApi, Configuration } from './api-client';

const config = new Configuration({
  basePath: 'http://localhost:5000/api'
});

const productsApi = new ProductsApi(config);

// Get all products
const products = await productsApi.getProducts();

// Get product by ID
const product = await productsApi.getProduct(1);
```

## 🛠️ Development

### Adding New Endpoints

1. **Create the endpoint** in the appropriate route file
2. **Update the OpenAPI spec** in `openapi.yaml`
3. **Add examples** and response schemas
4. **Test the endpoint** using Swagger UI

### Updating Documentation

The OpenAPI specification is stored in:
- **Source**: `openapi.yaml` (project root)
- **Served from**: `backend/static/openapi.yaml`

To update documentation:
1. Edit `openapi.yaml` in the project root
2. Copy to `backend/static/openapi.yaml`
3. Restart the Flask server

### Customizing Swagger UI

The Swagger UI is configured in `backend/routes/docs.py`. You can customize:

- **Theme colors**: Modify the CSS in `SWAGGER_UI_TEMPLATE`
- **Configuration options**: Update the JavaScript configuration
- **Additional routes**: Add more documentation endpoints

## 🔒 Security Considerations

- The API documentation is currently public
- For production, consider adding authentication to `/docs`
- The OpenAPI spec contains sensitive information (endpoints, schemas)
- Consider environment-specific documentation

## 📚 Additional Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [Flask-RESTX Documentation](https://flask-restx.readthedocs.io/)

## 🐛 Troubleshooting

### Common Issues

1. **Swagger UI not loading**:
   - Check if Flask server is running
   - Verify `/api/openapi.yaml` is accessible
   - Check browser console for errors

2. **API calls failing**:
   - Ensure database is initialized
   - Check server logs for errors
   - Verify endpoint URLs in OpenAPI spec

3. **CORS issues**:
   - Check CORS configuration in `app_factory.py`
   - Ensure frontend origin is allowed

### Getting Help

- Check server logs for detailed error messages
- Use the test script to verify basic functionality
- Test individual endpoints with curl or Postman 