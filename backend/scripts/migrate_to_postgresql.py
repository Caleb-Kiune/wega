#!/usr/bin/env python3
"""
Comprehensive SQLite to PostgreSQL Migration Script
This script migrates all data from SQLite to PostgreSQL while maintaining data integrity.
"""

import os
import sys
import sqlite3
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import json
from decimal import Decimal

# Add the parent directory to the path so we can import our models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import db, Category, Brand, Product, ProductImage, ProductSpecification, ProductFeature, Review, Cart, CartItem, DeliveryLocation, Order, OrderItem, AdminUser
from app_factory import create_app

def connect_sqlite():
    """Connect to SQLite database"""
    sqlite_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'app.db')
    if not os.path.exists(sqlite_path):
        print(f"❌ SQLite database not found at {sqlite_path}")
        return None
    
    try:
        conn = sqlite3.connect(sqlite_path)
        conn.row_factory = sqlite3.Row  # This allows accessing columns by name
        return conn
    except Exception as e:
        print(f"❌ Error connecting to SQLite: {e}")
        return None

def connect_postgresql():
    """Connect to PostgreSQL database"""
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="wega_kitchenware",
            user="wega_user",
            password="wega_password",
            port="5432"
        )
        return conn
    except Exception as e:
        print(f"❌ Error connecting to PostgreSQL: {e}")
        return None

def get_sqlite_data(conn, table_name):
    """Get all data from a SQLite table"""
    try:
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except Exception as e:
        print(f"❌ Error reading from {table_name}: {e}")
        return []

def migrate_categories(sqlite_conn, pg_conn):
    """Migrate categories table"""
    print("📦 Migrating categories...")
    
    # Get data from SQLite
    categories_data = get_sqlite_data(sqlite_conn, 'categories')
    print(f"   Found {len(categories_data)} categories")
    
    if not categories_data:
        return
    
    # Insert into PostgreSQL
    cursor = pg_conn.cursor()
    for category in categories_data:
        try:
            cursor.execute("""
                INSERT INTO categories (id, name, slug, description, image_url, created_at)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, (
                category['id'],
                category['name'],
                category['slug'],
                category['description'],
                category['image_url'],
                category['created_at']
            ))
        except Exception as e:
            print(f"   ❌ Error inserting category {category['name']}: {e}")
    
    pg_conn.commit()
    print("   ✅ Categories migrated successfully")

def migrate_brands(sqlite_conn, pg_conn):
    """Migrate brands table"""
    print("🏷️  Migrating brands...")
    
    brands_data = get_sqlite_data(sqlite_conn, 'brands')
    print(f"   Found {len(brands_data)} brands")
    
    if not brands_data:
        return
    
    cursor = pg_conn.cursor()
    for brand in brands_data:
        try:
            cursor.execute("""
                INSERT INTO brands (id, name, slug, description, logo_url, created_at)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, (
                brand['id'],
                brand['name'],
                brand['slug'],
                brand['description'],
                brand['logo_url'],
                brand['created_at']
            ))
        except Exception as e:
            print(f"   ❌ Error inserting brand {brand['name']}: {e}")
    
    pg_conn.commit()
    print("   ✅ Brands migrated successfully")

def migrate_products(sqlite_conn, pg_conn):
    """Migrate products table"""
    print("🛍️  Migrating products...")
    
    products_data = get_sqlite_data(sqlite_conn, 'products')
    print(f"   Found {len(products_data)} products")
    
    if not products_data:
        return
    
    cursor = pg_conn.cursor()
    for product in products_data:
        try:
            cursor.execute("""
                INSERT INTO products (id, name, description, price, original_price, sku, stock, 
                                   rating, review_count, is_new, is_sale, is_featured, 
                                   category_id, brand_id, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, (
                product['id'],
                product['name'],
                product['description'],
                product['price'],
                product['original_price'],
                product['sku'],
                product['stock'],
                product['rating'],
                product['review_count'],
                product['is_new'],
                product['is_sale'],
                product['is_featured'],
                product['category_id'],
                product['brand_id'],
                product['created_at'],
                product['updated_at']
            ))
        except Exception as e:
            print(f"   ❌ Error inserting product {product['name']}: {e}")
    
    pg_conn.commit()
    print("   ✅ Products migrated successfully")

def migrate_product_images(sqlite_conn, pg_conn):
    """Migrate product_images table"""
    print("🖼️  Migrating product images...")
    
    images_data = get_sqlite_data(sqlite_conn, 'product_images')
    print(f"   Found {len(images_data)} product images")
    
    if not images_data:
        return
    
    cursor = pg_conn.cursor()
    for image in images_data:
        try:
            cursor.execute("""
                INSERT INTO product_images (id, product_id, image_url, is_primary, display_order, created_at)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, (
                image['id'],
                image['product_id'],
                image['image_url'],
                image['is_primary'],
                image['display_order'],
                image['created_at']
            ))
        except Exception as e:
            print(f"   ❌ Error inserting image {image['id']}: {e}")
    
    pg_conn.commit()
    print("   ✅ Product images migrated successfully")

def migrate_product_specifications(sqlite_conn, pg_conn):
    """Migrate product_specifications table"""
    print("📋 Migrating product specifications...")
    
    specs_data = get_sqlite_data(sqlite_conn, 'product_specifications')
    print(f"   Found {len(specs_data)} product specifications")
    
    if not specs_data:
        return
    
    cursor = pg_conn.cursor()
    for spec in specs_data:
        try:
            cursor.execute("""
                INSERT INTO product_specifications (id, product_id, name, value, display_order)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, (
                spec['id'],
                spec['product_id'],
                spec['name'],
                spec['value'],
                spec['display_order']
            ))
        except Exception as e:
            print(f"   ❌ Error inserting specification {spec['id']}: {e}")
    
    pg_conn.commit()
    print("   ✅ Product specifications migrated successfully")

def migrate_product_features(sqlite_conn, pg_conn):
    """Migrate product_features table"""
    print("✨ Migrating product features...")
    
    features_data = get_sqlite_data(sqlite_conn, 'product_features')
    print(f"   Found {len(features_data)} product features")
    
    if not features_data:
        return
    
    cursor = pg_conn.cursor()
    for feature in features_data:
        try:
            cursor.execute("""
                INSERT INTO product_features (id, product_id, feature, display_order)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, (
                feature['id'],
                feature['product_id'],
                feature['feature'],
                feature['display_order']
            ))
        except Exception as e:
            print(f"   ❌ Error inserting feature {feature['id']}: {e}")
    
    pg_conn.commit()
    print("   ✅ Product features migrated successfully")

def migrate_reviews(sqlite_conn, pg_conn):
    """Migrate reviews table"""
    print("⭐ Migrating reviews...")
    
    reviews_data = get_sqlite_data(sqlite_conn, 'reviews')
    print(f"   Found {len(reviews_data)} reviews")
    
    if not reviews_data:
        return
    
    cursor = pg_conn.cursor()
    for review in reviews_data:
        try:
            cursor.execute("""
                INSERT INTO reviews (id, product_id, user, avatar, title, comment, rating, date, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, (
                review['id'],
                review['product_id'],
                review['user'],
                review['avatar'],
                review['title'],
                review['comment'],
                review['rating'],
                review['date'],
                review['created_at']
            ))
        except Exception as e:
            print(f"   ❌ Error inserting review {review['id']}: {e}")
    
    pg_conn.commit()
    print("   ✅ Reviews migrated successfully")

def migrate_delivery_locations(sqlite_conn, pg_conn):
    """Migrate delivery_locations table"""
    print("🚚 Migrating delivery locations...")
    
    locations_data = get_sqlite_data(sqlite_conn, 'delivery_locations')
    print(f"   Found {len(locations_data)} delivery locations")
    
    if not locations_data:
        return
    
    cursor = pg_conn.cursor()
    for location in locations_data:
        try:
            cursor.execute("""
                INSERT INTO delivery_locations (id, name, slug, city, shipping_price, is_active, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, (
                location['id'],
                location['name'],
                location['slug'],
                location['city'],
                location['shipping_price'],
                location['is_active'],
                location['created_at'],
                location['updated_at']
            ))
        except Exception as e:
            print(f"   ❌ Error inserting location {location['name']}: {e}")
    
    pg_conn.commit()
    print("   ✅ Delivery locations migrated successfully")

def migrate_carts(sqlite_conn, pg_conn):
    """Migrate carts table"""
    print("🛒 Migrating carts...")
    
    carts_data = get_sqlite_data(sqlite_conn, 'carts')
    print(f"   Found {len(carts_data)} carts")
    
    if not carts_data:
        return
    
    cursor = pg_conn.cursor()
    for cart in carts_data:
        try:
            cursor.execute("""
                INSERT INTO carts (id, session_id, created_at, updated_at)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, (
                cart['id'],
                cart['session_id'],
                cart['created_at'],
                cart['updated_at']
            ))
        except Exception as e:
            print(f"   ❌ Error inserting cart {cart['id']}: {e}")
    
    pg_conn.commit()
    print("   ✅ Carts migrated successfully")

def migrate_cart_items(sqlite_conn, pg_conn):
    """Migrate cart_items table"""
    print("🛍️  Migrating cart items...")
    
    items_data = get_sqlite_data(sqlite_conn, 'cart_items')
    print(f"   Found {len(items_data)} cart items")
    
    if not items_data:
        return
    
    cursor = pg_conn.cursor()
    for item in items_data:
        try:
            cursor.execute("""
                INSERT INTO cart_items (id, cart_id, product_id, quantity, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, (
                item['id'],
                item['cart_id'],
                item['product_id'],
                item['quantity'],
                item['created_at'],
                item['updated_at']
            ))
        except Exception as e:
            print(f"   ❌ Error inserting cart item {item['id']}: {e}")
    
    pg_conn.commit()
    print("   ✅ Cart items migrated successfully")

def migrate_orders(sqlite_conn, pg_conn):
    """Migrate orders table"""
    print("📦 Migrating orders...")
    
    orders_data = get_sqlite_data(sqlite_conn, 'orders')
    print(f"   Found {len(orders_data)} orders")
    
    if not orders_data:
        return
    
    cursor = pg_conn.cursor()
    for order in orders_data:
        try:
            cursor.execute("""
                INSERT INTO orders (id, order_number, first_name, last_name, email, phone, address, city, state, 
                                 postal_code, total_amount, shipping_cost, status, payment_status, payment_method,
                                 notes, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, (
                order['id'],
                order['order_number'],
                order['first_name'],
                order['last_name'],
                order['email'],
                order['phone'],
                order['address'],
                order['city'],
                order['state'],
                order['postal_code'],
                order['total_amount'],
                order['shipping_cost'],
                order['status'],
                order['payment_status'],
                order.get('payment_method'),
                order['notes'],
                order['created_at'],
                order['updated_at']
            ))
        except Exception as e:
            print(f"   ❌ Error inserting order {order['order_number']}: {e}")
    
    pg_conn.commit()
    print("   ✅ Orders migrated successfully")

def migrate_order_items(sqlite_conn, pg_conn):
    """Migrate order_items table"""
    print("📋 Migrating order items...")
    
    items_data = get_sqlite_data(sqlite_conn, 'order_items')
    print(f"   Found {len(items_data)} order items")
    
    if not items_data:
        return
    
    cursor = pg_conn.cursor()
    for item in items_data:
        try:
            cursor.execute("""
                INSERT INTO order_items (id, order_id, product_id, quantity, price, created_at)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, (
                item['id'],
                item['order_id'],
                item['product_id'],
                item['quantity'],
                item['price'],
                item['created_at']
            ))
        except Exception as e:
            print(f"   ❌ Error inserting order item {item['id']}: {e}")
    
    pg_conn.commit()
    print("   ✅ Order items migrated successfully")

def migrate_admin_users(sqlite_conn, pg_conn):
    """Migrate admin_users table"""
    print("👤 Migrating admin users...")
    
    users_data = get_sqlite_data(sqlite_conn, 'admin_users')
    print(f"   Found {len(users_data)} admin users")
    
    if not users_data:
        return
    
    cursor = pg_conn.cursor()
    for user in users_data:
        try:
            cursor.execute("""
                INSERT INTO admin_users (id, username, email, password_hash, role, is_active, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, (
                user['id'],
                user['username'],
                user['email'],
                user['password_hash'],
                user['role'],
                user['is_active'],
                user.get('created_at'),
                user.get('updated_at')
            ))
        except Exception as e:
            print(f"   ❌ Error inserting admin user {user['username']}: {e}")
    
    pg_conn.commit()
    print("   ✅ Admin users migrated successfully")

def verify_migration(sqlite_conn, pg_conn):
    """Verify that all data was migrated correctly"""
    print("\n🔍 Verifying migration...")
    
    tables = [
        ('categories', 'categories'),
        ('brands', 'brands'),
        ('products', 'products'),
        ('product_images', 'product_images'),
        ('product_specifications', 'product_specifications'),
        ('product_features', 'product_features'),
        ('reviews', 'reviews'),
        ('delivery_locations', 'delivery_locations'),
        ('carts', 'carts'),
        ('cart_items', 'cart_items'),
        ('orders', 'orders'),
        ('order_items', 'order_items'),
        ('admin_users', 'admin_users')
    ]
    
    for table_name, pg_table in tables:
        try:
            # Count SQLite records
            sqlite_cursor = sqlite_conn.cursor()
            sqlite_cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            sqlite_count = sqlite_cursor.fetchone()[0]
            
            # Count PostgreSQL records
            pg_cursor = pg_conn.cursor()
            pg_cursor.execute(f"SELECT COUNT(*) FROM {pg_table}")
            pg_count = pg_cursor.fetchone()[0]
            
            if sqlite_count == pg_count:
                print(f"   ✅ {table_name}: {sqlite_count} records migrated")
            else:
                print(f"   ❌ {table_name}: {sqlite_count} in SQLite, {pg_count} in PostgreSQL")
                
        except Exception as e:
            print(f"   ❌ Error verifying {table_name}: {e}")

def main():
    """Main migration function"""
    print("🚀 Starting SQLite to PostgreSQL Migration")
    print("=" * 50)
    
    # Connect to databases
    sqlite_conn = connect_sqlite()
    if not sqlite_conn:
        print("❌ Failed to connect to SQLite database")
        return
    
    pg_conn = connect_postgresql()
    if not pg_conn:
        print("❌ Failed to connect to PostgreSQL database")
        sqlite_conn.close()
        return
    
    try:
        # Migrate all tables
        migrate_categories(sqlite_conn, pg_conn)
        migrate_brands(sqlite_conn, pg_conn)
        migrate_products(sqlite_conn, pg_conn)
        migrate_product_images(sqlite_conn, pg_conn)
        migrate_product_specifications(sqlite_conn, pg_conn)
        migrate_product_features(sqlite_conn, pg_conn)
        migrate_reviews(sqlite_conn, pg_conn)
        migrate_delivery_locations(sqlite_conn, pg_conn)
        migrate_carts(sqlite_conn, pg_conn)
        migrate_cart_items(sqlite_conn, pg_conn)
        migrate_orders(sqlite_conn, pg_conn)
        migrate_order_items(sqlite_conn, pg_conn)
        migrate_admin_users(sqlite_conn, pg_conn)
        
        # Verify migration
        verify_migration(sqlite_conn, pg_conn)
        
        print("\n🎉 Migration completed successfully!")
        print("✅ All data has been migrated from SQLite to PostgreSQL")
        print("✅ Your application is now ready to use PostgreSQL")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        pg_conn.rollback()
    finally:
        sqlite_conn.close()
        pg_conn.close()

if __name__ == "__main__":
    main() 