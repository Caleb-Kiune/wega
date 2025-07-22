from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
from utils.helpers import validate_image_file, generate_unique_filename, get_base_url
import os
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET')
)

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/api/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Upload to Cloudinary
    try:
        result = cloudinary.uploader.upload(file)
        return jsonify({
            'message': 'File uploaded successfully',
            'url': result['secure_url'],
            'public_id': result['public_id'],
            'original_name': file.filename
        })
    except Exception as e:
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500 