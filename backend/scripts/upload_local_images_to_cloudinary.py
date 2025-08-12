#!/usr/bin/env python3
"""
Upload Local Images to Cloudinary
This script uploads all local images from static/uploads/ to Cloudinary
to match the mapping in wega_cloudinary_mapping.py
"""

import os
import cloudinary
import cloudinary.uploader
from pathlib import Path

def setup_cloudinary():
    """Setup Cloudinary configuration"""
    # You'll need to set these environment variables or replace with your actual values
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME', 'dy082ykuf'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET')
    )

def upload_image_to_cloudinary(local_path, cloudinary_path):
    """Upload a single image to Cloudinary"""
    try:
        result = cloudinary.uploader.upload(
            local_path,
            public_id=cloudinary_path,
            folder="wega-kitchenware/products",
            overwrite=True
        )
        print(f"✅ Uploaded: {os.path.basename(local_path)} -> {result['secure_url']}")
        return result['secure_url']
    except Exception as e:
        print(f"❌ Failed to upload {local_path}: {e}")
        return None

def main():
    """Main upload function"""
    print("🚀 Starting Cloudinary image upload...")
    
    # Setup Cloudinary
    setup_cloudinary()
    
    # Path to local images
    uploads_dir = Path("static/uploads")
    
    if not uploads_dir.exists():
        print(f"❌ Directory {uploads_dir} not found!")
        return
    
    # Get all image files
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
    image_files = [
        f for f in uploads_dir.iterdir() 
        if f.is_file() and f.suffix.lower() in image_extensions
    ]
    
    print(f"📁 Found {len(image_files)} images to upload")
    
    # Upload each image
    uploaded_count = 0
    for image_file in image_files:
        # Convert filename to Cloudinary-friendly name
        cloudinary_name = image_file.stem.replace(' ', '-').lower()
        
        # Upload to Cloudinary
        result = upload_image_to_cloudinary(
            str(image_file),
            f"wega-kitchenware/products/{cloudinary_name}"
        )
        
        if result:
            uploaded_count += 1
    
    print(f"\n🎉 Upload complete! {uploaded_count}/{len(image_files)} images uploaded successfully")
    print("💡 You can now run: python scripts/seed_56_products_cloudinary.py")

if __name__ == "__main__":
    main()
