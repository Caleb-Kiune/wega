#!/usr/bin/env python3
"""
Test script to check image URL generation
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app_factory import create_app
from utils.helpers import get_base_url, format_image_url

def test_image_urls():
    """Test image URL generation"""
    
    print("🔍 Testing image URL generation...")
    
    app = create_app('development')
    
    with app.app_context():
        print(f"Environment: {app.config.get('ENV', 'development')}")
        print(f"DEBUG: {app.config.get('DEBUG')}")
        print(f"BASE_URL config: {app.config.get('BASE_URL')}")
        
        # Test get_base_url
        base_url = get_base_url()
        print(f"get_base_url(): {base_url}")
        
        # Test format_image_url with different inputs
        test_urls = [
            "test_image.jpg",
            "/static/uploads/test_image.jpg",
            "https://your-domain.com/static/uploads/test_image.jpg",
            "http://localhost:5000/static/uploads/test_image.jpg"
        ]
        
        print("\nTesting format_image_url:")
        for url in test_urls:
            formatted = format_image_url(url)
            print(f"  Input: {url}")
            print(f"  Output: {formatted}")
            print()

if __name__ == '__main__':
    test_image_urls() 