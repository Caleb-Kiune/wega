from app import app, db
from models import Cart, CartItem, Order, OrderItem

def cleanup_database():
    with app.app_context():
        try:
            # Delete all order items
            OrderItem.query.delete()
            print("Deleted all order items")

            # Delete all orders
            Order.query.delete()
            print("Deleted all orders")

            # Delete all cart items
            CartItem.query.delete()
            print("Deleted all cart items")

            # Delete all carts
            Cart.query.delete()
            print("Deleted all carts")

            # Commit the changes
            db.session.commit()
            print("Database cleanup completed successfully!")

        except Exception as e:
            db.session.rollback()
            print(f"Error during cleanup: {str(e)}")

if __name__ == "__main__":
    cleanup_database() 