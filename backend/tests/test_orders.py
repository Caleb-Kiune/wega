import pytest
from app import app, db
from models import Order, OrderItem, Product
from datetime import datetime

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

@pytest.fixture
def sample_product():
    product = Product(
        name='Test Product',
        description='Test Description',
        price=1000.00,
        image_url='http://example.com/image.jpg',
        category='test',
        stock=10
    )
    db.session.add(product)
    db.session.commit()
    return product

@pytest.fixture
def sample_order(sample_product):
    order = Order(
        order_number='TEST-001',
        first_name='John',
        last_name='Doe',
        email='john@example.com',
        phone='1234567890',
        address='123 Test St',
        city='Test City',
        state='Test State',
        postal_code='12345',
        total_amount=1000.00,
        shipping_cost=100.00,
        status='pending',
        payment_status='pending',
        created_at=datetime.utcnow()
    )
    db.session.add(order)
    
    order_item = OrderItem(
        order=order,
        product=sample_product,
        quantity=1,
        price=1000.00
    )
    db.session.add(order_item)
    db.session.commit()
    return order

def test_get_all_orders(client, sample_order):
    response = client.get('/api/orders')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['orders']) == 1
    assert data['orders'][0]['order_number'] == 'TEST-001'

def test_get_order_by_id(client, sample_order):
    response = client.get(f'/api/orders/{sample_order.id}')
    assert response.status_code == 200
    data = response.get_json()
    assert data['order_number'] == 'TEST-001'
    assert len(data['items']) == 1

def test_update_order_status(client, sample_order):
    response = client.put(f'/api/orders/{sample_order.id}/status', json={'status': 'processing'})
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'processing'

def test_update_payment_status(client, sample_order):
    response = client.put(f'/api/orders/{sample_order.id}/payment-status', json={'payment_status': 'paid'})
    assert response.status_code == 200
    data = response.get_json()
    assert data['payment_status'] == 'paid'

def test_get_nonexistent_order(client):
    response = client.get('/api/orders/999')
    assert response.status_code == 404

def test_update_nonexistent_order_status(client):
    response = client.put('/api/orders/999/status', json={'status': 'processing'})
    assert response.status_code == 404

def test_update_nonexistent_order_payment_status(client):
    response = client.put('/api/orders/999/payment-status', json={'payment_status': 'paid'})
    assert response.status_code == 404

def test_invalid_order_status(client, sample_order):
    response = client.put(f'/api/orders/{sample_order.id}/status', json={'status': 'invalid_status'})
    assert response.status_code == 400

def test_invalid_payment_status(client, sample_order):
    response = client.put(f'/api/orders/{sample_order.id}/payment-status', json={'payment_status': 'invalid_status'})
    assert response.status_code == 400 