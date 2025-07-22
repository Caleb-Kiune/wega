import cloudinary
import cloudinary.uploader
import os

# Configure Cloudinary from environment variables
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET')
)

# Path to your local images folder
images_folder = "backend/static/uploads"

for filename in os.listdir(images_folder):
    if filename.lower().endswith((".png", ".jpg", ".jpeg", ".gif", ".webp")):
        file_path = os.path.join(images_folder, filename)
        print(f"Uploading {file_path}...")
        result = cloudinary.uploader.upload(file_path)
        print(f"Uploaded: {result['secure_url']}") 