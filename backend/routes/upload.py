from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
from utils.helpers import validate_image_file, generate_unique_filename, get_base_url
import os
import cloudinary
import cloudinary.uploader
from PIL import Image
import io

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/api/upload', methods=['POST'])
def upload_image():
    """Upload an image file to Cloudinary"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Validate the file
    is_valid, error_message = validate_image_file(file)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    try:
        # Configure Cloudinary
        cloudinary.config(
            cloud_name=current_app.config['CLOUDINARY_CLOUD_NAME'],
            api_key=current_app.config['CLOUDINARY_API_KEY'],
            api_secret=current_app.config['CLOUDINARY_API_SECRET']
        )
        
        # Generate unique filename
        original_filename = secure_filename(file.filename)
        unique_filename = generate_unique_filename(original_filename)
        
        # Read file data
        file_data = file.read()
        
        # Upload to Cloudinary with optimization
        result = cloudinary.uploader.upload(
            io.BytesIO(file_data),
            public_id=f"wega-kitchenware/{unique_filename}",
            folder="wega-kitchenware",
            transformation=[
                {'width': 800, 'height': 600, 'crop': 'limit'},
                {'quality': 'auto:good'},
                {'format': 'auto'}
            ],
            resource_type="image"
        )
        
        # Return the secure URL
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': unique_filename,
            'url': result['secure_url'],
            'public_id': result['public_id'],
            'original_name': original_filename
        })
        
    except Exception as e:
        print(f"Upload error: {str(e)}")
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@upload_bp.route('/api/upload/delete', methods=['DELETE'])
def delete_image():
    """Delete an image from Cloudinary"""
    try:
        public_id = request.json.get('public_id')
        if not public_id:
            return jsonify({'error': 'Public ID is required'}), 400
        
        # Configure Cloudinary
        cloudinary.config(
            cloud_name=current_app.config['CLOUDINARY_CLOUD_NAME'],
            api_key=current_app.config['CLOUDINARY_API_KEY'],
            api_secret=current_app.config['CLOUDINARY_API_SECRET']
        )
        
        # Delete from Cloudinary
        result = cloudinary.uploader.destroy(public_id)
        
        return jsonify({
            'message': 'Image deleted successfully',
            'result': result
        })
        
    except Exception as e:
        return jsonify({'error': f'Delete failed: {str(e)}'}), 500 