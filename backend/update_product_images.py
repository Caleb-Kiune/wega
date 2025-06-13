from app import app, db
from models import Product, ProductImage

def update_product_images():
    with app.app_context():
        # Get all products
        products = Product.query.all()
        
        # Update each product's images
        for product in products:
            # Clear existing images
            ProductImage.query.filter_by(product_id=product.id).delete()
            
            # Add new image
            new_image = ProductImage(
                product_id=product.id,
                image_url='appliances1.jpeg',  # Just the filename
                is_primary=True,
                display_order=0
            )
            db.session.add(new_image)
        
        # Commit changes
        db.session.commit()
        print("Successfully updated all product images")

if __name__ == '__main__':
    update_product_images() 