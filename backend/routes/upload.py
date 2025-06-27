from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
from utils.helpers import validate_image_file, generate_unique_filename, get_base_url
import os

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/api/upload', methods=['POST'])
def upload_image():
    """Upload an image file"""
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
        # Generate unique filename
        original_filename = secure_filename(file.filename)
        unique_filename = generate_unique_filename(original_filename)
        
        # Save the file
        upload_folder = current_app.config['UPLOAD_FOLDER']
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)
        
        # Return the full file URL
        file_url = f"{get_base_url()}/static/uploads/{unique_filename}"
        
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': unique_filename,
            'url': file_url,
            'original_name': original_filename
        })
        
    except Exception as e:
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500 