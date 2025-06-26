from app import app, db
from models import Product
from sqlalchemy import text

def reset_product_sequence():
    with app.app_context():
        # Get the current max ID
        max_id = db.session.query(db.func.max(Product.id)).scalar() or 0
        print(f"Current max product ID: {max_id}")
        
        # Reset the sequence to the next value after max_id
        db.session.execute(text(f"ALTER SEQUENCE products_id_seq RESTART WITH {max_id + 1}"))
        db.session.commit()
        print("Product ID sequence has been reset")

if __name__ == "__main__":
    reset_product_sequence() 