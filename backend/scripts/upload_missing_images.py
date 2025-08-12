#!/usr/bin/env python3
"""
Upload Missing Images to Cloudinary
Uploads images that were missed in the previous upload
"""

import os
import cloudinary
import cloudinary.uploader
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def setup_cloudinary():
    """Setup Cloudinary with your credentials"""
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME', 'dy082ykuf')
    api_key = os.getenv('CLOUDINARY_API_KEY')
    api_secret = os.getenv('CLOUDINARY_API_SECRET')
    
    if not api_key or not api_secret:
        print("❌ Please set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET environment variables")
        return False
    
    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret
    )
    return True

def upload_image(local_path, cloudinary_name):
    """Upload a single image to Cloudinary"""
    try:
        result = cloudinary.uploader.upload(
            local_path,
            public_id=f"wega-kitchenware/products/{cloudinary_name}",
            overwrite=True
        )
        print(f"✅ Uploaded: {os.path.basename(local_path)} -> {cloudinary_name}")
        return result['secure_url']
    except Exception as e:
        print(f"❌ Failed to upload {local_path}: {e}")
        return None

def main():
    """Main upload function"""
    print("🚀 Uploading missing images to Cloudinary...")
    
    if not setup_cloudinary():
        return
    
    # Path to local images
    uploads_dir = Path("static/uploads")
    
    if not uploads_dir.exists():
        print(f"❌ Directory {uploads_dir} not found!")
        return
    
    # Missing images that need to be uploaded
    missing_images = [
        ("black electric  kettle.jpg", "black-electric-kettle"),
        ("black handle knive set.jpg", "black-handle-knife-set"),
        ("ceramic black flower pot.jpg", "ceramic-black-flower-pot"),
        ("table oven.jpg", "table-oven"),
        ("wood spatulas.jpg", "wood-spatulas"),
        ("wooden flower pot 5.jpg", "wooden-flower-pot-5"),
        ("woven basket.jpeg", "woven-basket"),
        ("butcher knife set.jpg", "butcher-knife-set"),
    ]
    
    # Upload each missing image
    uploaded_count = 0
    for local_filename, cloudinary_name in missing_images:
        local_path = uploads_dir / local_filename
        
        if local_path.exists():
            result = upload_image(str(local_path), cloudinary_name)
            if result:
                uploaded_count += 1
        else:
            print(f"⚠️  File not found: {local_filename}")
    
    print(f"\n🎉 Upload complete! {uploaded_count}/{len(missing_images)} missing images uploaded successfully")

if __name__ == "__main__":
    main()
