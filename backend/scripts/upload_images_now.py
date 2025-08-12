#!/usr/bin/env python3
"""
Quick Upload Script for Cloudinary
Uploads all local images to match the database URLs
"""

import os
import cloudinary
import cloudinary.uploader
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def setup_cloudinary():
    """Setup Cloudinary with your credentials"""
    # You'll need to set these environment variables
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME', 'dy082ykuf')
    api_key = os.getenv('CLOUDINARY_API_KEY')
    api_secret = os.getenv('CLOUDINARY_API_SECRET')
    
    if not api_key or not api_secret:
        print("❌ Please set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET environment variables")
        print("   export CLOUDINARY_API_KEY=your_api_key")
        print("   export CLOUDINARY_API_SECRET=your_api_secret")
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
    print("🚀 Starting Cloudinary image upload...")
    
    if not setup_cloudinary():
        return
    
    # Path to local images
    uploads_dir = Path("static/uploads")
    
    if not uploads_dir.exists():
        print(f"❌ Directory {uploads_dir} not found!")
        return
    
    # Mapping of local filenames to Cloudinary names
    filename_mapping = {
        "dutch oven.jpg": "dutch-oven",
        "coffee maker electric.jpg": "coffee-maker-electric", 
        "stock pot.jpg": "stock-pot",
        "ceramic plates.jpg": "ceramic-plates",
        "5 piece cooking set.jpg": "5-piece-cooking-set",
        "electric kettle.jpg": "electric-kettle",
        "oval baking pan.jpg": "oval-baking-pan",
        "food container set.jpg": "food-container-set",
        "steak knife set.jpg": "steak-knife-set",
        "toaster.jpg": "toaster",
        "microwave.jpg": "microwave",
        "black electric kettle.jpg": "black-electric-kettle",
        "clothes iron.jpeg": "clothes-iron",
        "casserole.jpg": "casserole",
        "plate set.jpg": "plate-set",
        "plates and cups set.jpg": "plates-and-cups-set",
        "plastic dishes.jpg": "plastic-dishes",
        "cups.jpg": "cups",
        "cup set.jpg": "cup-set",
        "water glass.jpeg": "water-glass",
        "wine glasses.jpg": "wine-glasses",
        "kitchen towels.jpeg": "kitchen-towels",
        "ceramic mug.jpeg": "ceramic-mug",
        "stainless steel knife.jpg": "stainless-steel-knife",
        "bamboo spatulas.jpg": "bamboo-spatulas",
        "2 bowl set.jpg": "2-bowl-set",
        "3 knife set.jpg": "3-knife-set",
        "4 nesting bowl set.jpg": "4-nesting-bowl-set",
        "5 piece cooking set 2.jpg": "5-piece-cooking-set-2",
        "6 bowl set.jpg": "6-bowl-set",
        "7 small plate set.jpg": "7-small-plate-set",
        "aromatic scent dispenser.jpeg": "aromatic-scent-dispenser",
        "iron kettle.jpg": "iron-kettle",
        "plate cup and spoon set.jpg": "plate-cup-and-spoon-set",
        "plate set 2.jpg": "plate-set-2",
        "premium spoon and fork.jpg": "premium-spoon-and-fork",
        "scissors.jpg": "scissors",
        "small bamboo chair.jpeg": "small-bamboo-chair",
        "spice jars.jpg": "spice-jars",
        "spice jars 2.jpg": "spice-jars-2",
        "spoons and forks.jpg": "spoons-and-forks",
        "spoons kives forks.jpg": "spoons-knives-forks",
        "stainless steel fork and knife.jpg": "stainless-steel-fork-and-knife",
        "chopstick and fork and knife.jpg": "chopstick-and-fork-and-knife",
        "chopsticks and plate and spoon.jpg": "chopsticks-and-plate-and-spoon",
        "chopsticks and soup spoon.jpg": "chopsticks-and-soup-spoon",
        "coffee maker set.jpg": "coffee-maker-set",
        "electric kettle.jpeg": "electric-kettle-alt",
        "tea pot.jpg": "tea-pot",
        "table oven.jpg": "table-oven",
        "wood spatulas.jpg": "wood-spatulas",
        "wooden flower pot 5.jpg": "wooden-flower-pot-5",
        "woven basket.jpeg": "woven-basket",
        "ceramic black flower pot.jpg": "ceramic-black-flower-pot",
        "black handle knive set.jpg": "black-handle-knife-set",
        "butcher knife set.jpg": "butcher-knife-set",
    }
    
    # Upload each image
    uploaded_count = 0
    total_count = len(filename_mapping)
    
    for local_filename, cloudinary_name in filename_mapping.items():
        local_path = uploads_dir / local_filename
        
        if local_path.exists():
            result = upload_image(str(local_path), cloudinary_name)
            if result:
                uploaded_count += 1
        else:
            print(f"⚠️  File not found: {local_filename}")
    
    print(f"\n🎉 Upload complete! {uploaded_count}/{total_count} images uploaded successfully")
    print("💡 Your Cloudinary URLs should now work!")

if __name__ == "__main__":
    main()
