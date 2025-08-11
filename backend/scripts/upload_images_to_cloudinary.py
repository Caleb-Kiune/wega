#!/usr/bin/env python3
"""
Enhanced script to upload all local images to Cloudinary and generate a mapping file
This script will:
1. Upload all images from static/uploads to Cloudinary
2. Generate a JSON file with filename to Cloudinary URL mapping
3. Create a Python file with the URLs for easy import in seed scripts
"""

import os
import json
import cloudinary
import cloudinary.uploader
from datetime import datetime
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def configure_cloudinary():
    """Configure Cloudinary from environment variables"""
    # Load .env file again to ensure it's loaded
    load_dotenv()
    
    cloudinary.config(
        cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
        api_key=os.environ.get('CLOUDINARY_API_KEY'),
        api_secret=os.environ.get('CLOUDINARY_API_SECRET')
    )
    
    # Verify configuration
    if not all([os.environ.get('CLOUDINARY_CLOUD_NAME'), 
                os.environ.get('CLOUDINARY_API_KEY'), 
                os.environ.get('CLOUDINARY_API_SECRET')]):
        print("❌ Error: Missing Cloudinary environment variables!")
        print("Please set: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET")
        print(f"Current values:")
        print(f"  CLOUDINARY_CLOUD_NAME: {os.environ.get('CLOUDINARY_CLOUD_NAME')}")
        print(f"  CLOUDINARY_API_KEY: {os.environ.get('CLOUDINARY_API_KEY')}")
        print(f"  CLOUDINARY_API_SECRET: {os.environ.get('CLOUDINARY_API_SECRET')[:10]}..." if os.environ.get('CLOUDINARY_API_SECRET') else "None")
        return False
    return True

def get_local_images():
    """Get list of all images from the uploads folder"""
    upload_dir = os.path.join(os.path.dirname(__file__), '..', 'static', 'uploads')
    images = []
    
    if not os.path.exists(upload_dir):
        print(f"❌ Uploads directory not found: {upload_dir}")
        return images
    
    for filename in os.listdir(upload_dir):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
            file_path = os.path.join(upload_dir, filename)
            if os.path.isfile(file_path):
                images.append({
                    'filename': filename,
                    'file_path': file_path,
                    'size': os.path.getsize(file_path)
                })
    
    return sorted(images, key=lambda x: x['filename'])

def upload_image_to_cloudinary(file_path, filename):
    """Upload a single image to Cloudinary"""
    try:
        print(f"📤 Uploading {filename}...")
        
        # Upload with specific folder and public_id
        result = cloudinary.uploader.upload(
            file_path,
            folder="wega-kitchenware/products",
            public_id=os.path.splitext(filename)[0],  # Remove extension
            overwrite=True,
            resource_type="image"
        )
        
        print(f"✅ Uploaded: {result['secure_url']}")
        return {
            'filename': filename,
            'cloudinary_url': result['secure_url'],
            'public_id': result['public_id'],
            'format': result['format'],
            'bytes': result['bytes'],
            'width': result['width'],
            'height': result['height']
        }
        
    except Exception as e:
        print(f"❌ Failed to upload {filename}: {str(e)}")
        return None

def generate_mapping_files(upload_results):
    """Generate mapping files for easy use in seed scripts"""
    # Filter out failed uploads
    successful_uploads = [r for r in upload_results if r is not None]
    
    if not successful_uploads:
        print("❌ No successful uploads to generate mapping files")
        return
    
    # Generate JSON mapping file
    json_mapping = {
        'generated_at': datetime.now().isoformat(),
        'total_images': len(successful_uploads),
        'cloudinary_cloud_name': os.environ.get('CLOUDINARY_CLOUD_NAME'),
        'images': {r['filename']: r['cloudinary_url'] for r in successful_uploads}
    }
    
    json_file_path = os.path.join(os.path.dirname(__file__), 'cloudinary_image_mapping.json')
    with open(json_file_path, 'w') as f:
        json.dump(json_mapping, f, indent=2)
    
    print(f"📄 Generated JSON mapping: {json_file_path}")
    
    # Generate Python file with URLs
    python_file_path = os.path.join(os.path.dirname(__file__), 'cloudinary_urls.py')
    with open(python_file_path, 'w') as f:
        f.write('# Generated Cloudinary URLs for Wega Kitchenware\n')
        f.write('# This file is auto-generated - do not edit manually\n\n')
        f.write('CLOUDINARY_IMAGE_URLS = [\n')
        for result in successful_uploads:
            f.write(f'    "{result["cloudinary_url"]}",\n')
        f.write(']\n\n')
        f.write('# Mapping of filename to Cloudinary URL\n')
        f.write('FILENAME_TO_CLOUDINARY = {\n')
        for result in successful_uploads:
            f.write(f'    "{result["filename"]}": "{result["cloudinary_url"]}",\n')
        f.write('}\n')
    
    print(f"🐍 Generated Python file: {python_file_path}")
    
    return json_file_path, python_file_path

def main():
    """Main function to orchestrate the upload process"""
    print("🚀 Starting Cloudinary Image Upload Process")
    print("=" * 50)
    
    # Configure Cloudinary
    if not configure_cloudinary():
        return
    
    # Get local images
    local_images = get_local_images()
    if not local_images:
        print("❌ No images found to upload")
        return
    
    print(f"📸 Found {len(local_images)} images to upload")
    print()
    
    # Upload images
    upload_results = []
    for image_info in local_images:
        result = upload_image_to_cloudinary(image_info['file_path'], image_info['filename'])
        upload_results.append(result)
        print()  # Add spacing between uploads
    
    # Generate mapping files
    print("📝 Generating mapping files...")
    mapping_files = generate_mapping_files(upload_results)
    
    # Summary
    successful_count = len([r for r in upload_results if r is not None])
    failed_count = len(upload_results) - successful_count
    
    print("=" * 50)
    print("🎉 Upload Process Complete!")
    print(f"✅ Successfully uploaded: {successful_count} images")
    if failed_count > 0:
        print(f"❌ Failed uploads: {failed_count} images")
    print()
    print("📁 Generated files:")
    if mapping_files:
        json_file, python_file = mapping_files
        print(f"   • {os.path.basename(json_file)} - JSON mapping")
        print(f"   • {os.path.basename(python_file)} - Python URLs list")
    print()
    print("💡 Next steps:")
    print("   1. Use the generated cloudinary_urls.py in your seed scripts")
    print("   2. Update your database with the new Cloudinary URLs")
    print("   3. Test image loading on your deployed backend")

if __name__ == "__main__":
    main()
