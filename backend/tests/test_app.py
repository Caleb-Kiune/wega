import pytest
from app import app, db
from models import Product, Category, Brand, ProductImage, ProductSpecification, ProductFeature, Review
import json

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            # Create test data
            category = Category(name='Test Category', slug='test-category', description='Test Description')
            brand = Brand(name='Test Brand', slug='test-brand', description='Test Brand Description')
            db.session.add(category)
            db.session.add(brand)
            db.session.commit()
            
            product = Product(
                name='Test Product',
                description='Test Description',
                price=99.99,
                original_price=129.99,
                sku='TEST123',
                stock=10,
                rating=4.5,
                review_count=1,
                is_new=True,
                is_sale=True,
                category_id=category.id,
                brand_id=brand.id
            )
            db.session.add(product)
            db.session.commit()
            
            yield client
            
            db.session.remove()
            db.drop_all()

def test_index(client):
    """Test the index endpoint"""
    response = client.get('/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'message' in data
    assert 'endpoints' in data
    assert 'products' in data['endpoints']
    assert 'categories' in data['endpoints']
    assert 'brands' in data['endpoints']

def test_get_products(client):
    """Test getting all products"""
    response = client.get('/api/products')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'products' in data
    assert 'total' in data
    assert 'pages' in data

def test_get_product(client):
    """Test getting a single product"""
    response = client.get('/api/products/1')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['name'] == 'Test Product'

def test_create_product(client):
    """Test creating a new product"""
    product_data = {
        'name': 'New Product',
        'description': 'New Description',
        'price': 149.99,
        'category_id': 1,
        'brand_id': 1,
        'images': [{'image_url': 'test.jpg', 'is_primary': True}],
        'specifications': [{'name': 'Color', 'value': 'Red'}],
        'features': [{'feature': 'Durable'}]
    }
    response = client.post('/api/products',
                          data=json.dumps(product_data),
                          content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['name'] == 'New Product'

def test_update_product(client):
    """Test updating a product"""
    update_data = {
        'name': 'Updated Product',
        'price': 199.99
    }
    response = client.put('/api/products/1',
                         data=json.dumps(update_data),
                         content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['name'] == 'Updated Product'
    assert data['price'] == 199.99

def test_delete_product(client):
    """Test deleting a product"""
    response = client.delete('/api/products/1')
    assert response.status_code == 204

def test_get_categories(client):
    """Test getting all categories"""
    response = client.get('/api/categories')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) > 0
    assert data[0]['name'] == 'Test Category'

def test_get_category_products(client):
    """Test getting products for a category"""
    response = client.get('/api/categories/1/products')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'products' in data
    assert 'total' in data

def test_get_brands(client):
    """Test getting all brands"""
    response = client.get('/api/brands')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) > 0
    assert data[0]['name'] == 'Test Brand'

def test_get_brand_products(client):
    """Test getting products for a brand"""
    response = client.get('/api/brands/1/products')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'products' in data
    assert 'total' in data

def test_product_reviews(client):
    """Test product review operations"""
    # Create a review
    review_data = {
        'user': 'Test User',
        'title': 'Great Product',
        'comment': 'Really enjoyed this product',
        'rating': 5
    }
    response = client.post('/api/products/1/reviews',
                          data=json.dumps(review_data),
                          content_type='application/json')
    assert response.status_code == 201
    
    # Get reviews
    response = client.get('/api/products/1/reviews')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'reviews' in data
    assert len(data['reviews']) > 0
    
    # Update review
    update_data = {'rating': 4}
    response = client.put('/api/products/1/reviews/1',
                         data=json.dumps(update_data),
                         content_type='application/json')
    assert response.status_code == 200
    
    # Delete review
    response = client.delete('/api/products/1/reviews/1')
    assert response.status_code == 204

def test_product_images(client):
    """Test product image operations"""
    # Create image
    image_data = {
        'image_url': 'test.jpg',
        'is_primary': True
    }
    response = client.post('/api/products/1/images',
                          data=json.dumps(image_data),
                          content_type='application/json')
    assert response.status_code == 201
    
    # Get images
    response = client.get('/api/products/1/images')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) > 0
    
    # Update image
    update_data = {'is_primary': False}
    response = client.put('/api/products/1/images/1',
                         data=json.dumps(update_data),
                         content_type='application/json')
    assert response.status_code == 200
    
    # Delete image
    response = client.delete('/api/products/1/images/1')
    assert response.status_code == 204

def test_product_specifications(client):
    """Test product specification operations"""
    # Create specification
    spec_data = {
        'name': 'Color',
        'value': 'Red'
    }
    response = client.post('/api/products/1/specifications',
                          data=json.dumps(spec_data),
                          content_type='application/json')
    assert response.status_code == 201
    
    # Get specifications
    response = client.get('/api/products/1/specifications')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) > 0
    
    # Update specification
    update_data = {'value': 'Blue'}
    response = client.put('/api/products/1/specifications/1',
                         data=json.dumps(update_data),
                         content_type='application/json')
    assert response.status_code == 200
    
    # Delete specification
    response = client.delete('/api/products/1/specifications/1')
    assert response.status_code == 204

def test_product_features(client):
    """Test product feature operations"""
    # Create feature
    feature_data = {
        'feature': 'Durable'
    }
    response = client.post('/api/products/1/features',
                          data=json.dumps(feature_data),
                          content_type='application/json')
    assert response.status_code == 201
    
    # Get features
    response = client.get('/api/products/1/features')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) > 0
    
    # Update feature
    update_data = {'feature': 'Very Durable'}
    response = client.put('/api/products/1/features/1',
                         data=json.dumps(update_data),
                         content_type='application/json')
    assert response.status_code == 200
    
    # Delete feature
    response = client.delete('/api/products/1/features/1')
    assert response.status_code == 204

def test_get_products_with_filters(client):
    """Test getting products with various filters"""
    # Test with category filter
    response = client.get('/api/products?categories[]=Test%20Category')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data['products']) > 0

    # Test with brand filter
    response = client.get('/api/products?brands[]=Test%20Brand')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data['products']) > 0

    # Test with price range
    response = client.get('/api/products?minPrice=50&maxPrice=150')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data['products']) > 0

    # Test with search
    response = client.get('/api/products?search=Test')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data['products']) > 0

    # Test with sorting
    response = client.get('/api/products?sort=price_asc')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data['products']) > 0

def test_get_product_not_found(client):
    """Test getting a non-existent product"""
    response = client.get('/api/products/999')
    assert response.status_code == 404

def test_create_product_validation(client):
    """Test product creation validation"""
    # Test missing required fields
    product_data = {
        'description': 'New Description',
        'price': 149.99
    }
    response = client.post('/api/products',
                          data=json.dumps(product_data),
                          content_type='application/json')
    assert response.status_code == 400

    # Test invalid price
    product_data = {
        'name': 'New Product',
        'description': 'New Description',
        'price': -100
    }
    response = client.post('/api/products',
                          data=json.dumps(product_data),
                          content_type='application/json')
    assert response.status_code == 400

def test_update_product_validation(client):
    """Test product update validation"""
    # Test updating non-existent product
    update_data = {'name': 'Updated Product'}
    response = client.put('/api/products/999',
                         data=json.dumps(update_data),
                         content_type='application/json')
    assert response.status_code == 404

    # Test invalid update data
    update_data = {'price': -100}
    response = client.put('/api/products/1',
                         data=json.dumps(update_data),
                         content_type='application/json')
    assert response.status_code == 400

def test_delete_product_not_found(client):
    """Test deleting a non-existent product"""
    response = client.delete('/api/products/999')
    assert response.status_code == 404

def test_get_categories_with_products(client):
    """Test getting categories with their products"""
    response = client.get('/api/categories')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) > 0
    assert 'name' in data[0]
    assert 'slug' in data[0]
    assert 'description' in data[0]

def test_get_category_not_found(client):
    """Test getting a non-existent category"""
    response = client.get('/api/categories/999')
    assert response.status_code == 404

def test_get_brands_with_products(client):
    """Test getting brands with their products"""
    response = client.get('/api/brands')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) > 0
    assert 'name' in data[0]
    assert 'slug' in data[0]
    assert 'description' in data[0]

def test_get_brand_not_found(client):
    """Test getting a non-existent brand"""
    response = client.get('/api/brands/999')
    assert response.status_code == 404

def test_product_reviews_validation(client):
    """Test product review validation"""
    # Test invalid rating
    review_data = {
        'user': 'Test User',
        'title': 'Great Product',
        'comment': 'Really enjoyed this product',
        'rating': 6  # Invalid rating (should be 1-5)
    }
    response = client.post('/api/products/1/reviews',
                          data=json.dumps(review_data),
                          content_type='application/json')
    assert response.status_code == 400

    # Test missing required fields
    review_data = {
        'user': 'Test User',
        'rating': 5
    }
    response = client.post('/api/products/1/reviews',
                          data=json.dumps(review_data),
                          content_type='application/json')
    assert response.status_code == 400

def test_product_images_validation(client):
    """Test product image validation"""
    # Test missing image_url
    image_data = {
        'is_primary': True
    }
    response = client.post('/api/products/1/images',
                          data=json.dumps(image_data),
                          content_type='application/json')
    assert response.status_code == 400

    # Test invalid image_id
    response = client.get('/api/products/1/images/999')
    assert response.status_code == 404

def test_product_specifications_validation(client):
    """Test product specification validation"""
    # Test missing required fields
    spec_data = {
        'name': 'Color'
    }
    response = client.post('/api/products/1/specifications',
                          data=json.dumps(spec_data),
                          content_type='application/json')
    assert response.status_code == 400

    # Test invalid specification_id
    response = client.get('/api/products/1/specifications/999')
    assert response.status_code == 404

def test_product_features_validation(client):
    """Test product feature validation"""
    # Test missing feature
    feature_data = {
        'display_order': 1
    }
    response = client.post('/api/products/1/features',
                          data=json.dumps(feature_data),
                          content_type='application/json')
    assert response.status_code == 400

    # Test invalid feature_id
    response = client.get('/api/products/1/features/999')
    assert response.status_code == 404

def test_static_file_serving(client):
    """Test static file serving"""
    response = client.get('/static/test.txt')
    assert response.status_code == 404  # File doesn't exist

def test_cors_headers(client):
    """Test CORS headers"""
    response = client.get('/')
    assert response.headers.get('Access-Control-Allow-Origin') == '*'
    assert 'Access-Control-Allow-Methods' in response.headers
    assert 'Access-Control-Allow-Headers' in response.headers 