import sqlite3
import os
from app import db, app
from models import Product, Category, Brand, ProductImage, ProductSpecification, ProductFeature, Review, Cart, CartItem, DeliveryLocation, Order, OrderItem

sqlite_path = 'app.db'

with app.app_context():
    conn = sqlite3.connect(sqlite_path)
    cursor = conn.cursor()

    # Migrate products
    cursor.execute("SELECT * FROM products")
    rows = cursor.fetchall()
    for row in rows:
        product = Product(
            id=row[0],
            name=row[1],
            description=row[2],
            price=row[3],
            original_price=row[4],
            sku=row[5],
            stock=row[6],
            rating=row[7],
            review_count=row[8],
            is_new=bool(row[9]),
            is_sale=bool(row[10]),
            is_featured=bool(row[11]),
            category_id=row[12],
            brand_id=row[13],
            created_at=row[14],
            updated_at=row[15]
        )
        db.session.add(product)

    # Migrate categories
    cursor.execute("SELECT * FROM categories")
    rows = cursor.fetchall()
    for row in rows:
        category = Category(id=row[0], name=row[1], slug=row[2], description=row[3], image_url=row[4], created_at=row[5])
        db.session.add(category)

    # Migrate brands
    cursor.execute("SELECT * FROM brands")
    rows = cursor.fetchall()
    for row in rows:
        brand = Brand(id=row[0], name=row[1], slug=row[2], description=row[3], logo_url=row[4], created_at=row[5])
        db.session.add(brand)

    # Migrate product images
    cursor.execute("SELECT * FROM product_images")
    rows = cursor.fetchall()
    for row in rows:
        product_image = ProductImage(id=row[0], product_id=row[1], image_url=row[2], is_primary=row[3], display_order=row[4], created_at=row[5])
        db.session.add(product_image)

    # Migrate product specifications
    cursor.execute("SELECT * FROM product_specifications")
    rows = cursor.fetchall()
    for row in rows:
        product_specification = ProductSpecification(id=row[0], product_id=row[1], name=row[2], value=row[3], display_order=row[4])
        db.session.add(product_specification)

    # Migrate product features
    cursor.execute("SELECT * FROM product_features")
    rows = cursor.fetchall()
    for row in rows:
        product_feature = ProductFeature(id=row[0], product_id=row[1], feature=row[2], display_order=row[3])
        db.session.add(product_feature)

    # Migrate reviews
    cursor.execute("SELECT * FROM reviews")
    rows = cursor.fetchall()
    for row in rows:
        review = Review(id=row[0], product_id=row[1], user=row[2], avatar=row[3], title=row[4], comment=row[5], rating=row[6], date=row[7], created_at=row[8])
        db.session.add(review)

    # Migrate carts
    cursor.execute("SELECT * FROM carts")
    rows = cursor.fetchall()
    for row in rows:
        cart = Cart(id=row[0], session_id=row[1], created_at=row[2], updated_at=row[3])
        db.session.add(cart)

    # Migrate cart items
    cursor.execute("SELECT * FROM cart_items")
    rows = cursor.fetchall()
    for row in rows:
        cart_item = CartItem(id=row[0], cart_id=row[1], product_id=row[2], quantity=row[3], created_at=row[4], updated_at=row[5])
        db.session.add(cart_item)

    # Migrate delivery locations
    cursor.execute("SELECT * FROM delivery_locations")
    rows = cursor.fetchall()
    for row in rows:
        delivery_location = DeliveryLocation(id=row[0], name=row[1], slug=row[2], city=row[3], shipping_price=row[4], is_active=row[5], created_at=row[6], updated_at=row[7])
        db.session.add(delivery_location)

    # Migrate orders
    cursor.execute("SELECT * FROM orders")
    rows = cursor.fetchall()
    for row in rows:
        order = Order(
            id=row[0],
            order_number=row[1],
            first_name=row[2],
            last_name=row[3],
            email=row[4],
            phone=row[5],
            address=row[6],
            city=row[7],
            state=row[8],
            postal_code=row[9],
            total_amount=row[10],
            shipping_cost=row[11],
            status=row[12],
            payment_status=row[13],
            notes=row[14],
            created_at=row[15],
            updated_at=row[16]
        )
        db.session.add(order)

    # Migrate order items
    cursor.execute("SELECT * FROM order_items")
    rows = cursor.fetchall()
    for row in rows:
        order_item = OrderItem(id=row[0], order_id=row[1], product_id=row[2], quantity=row[3], price=row[4], created_at=row[5])
        db.session.add(order_item)

    db.session.commit()
    conn.close()

print("✅ Data migrated from SQLite to Railway PostgreSQL") 