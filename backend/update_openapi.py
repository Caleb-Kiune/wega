#!/usr/bin/env python3
"""
Utility script to update the OpenAPI specification in the backend static directory
"""
import os
import shutil
import sys

def update_openapi_spec():
    """Copy openapi.yaml from project root to backend/static/"""
    
    # Get the project root directory (one level up from backend)
    project_root = os.path.dirname(os.path.dirname(__file__))
    source_file = os.path.join(project_root, 'openapi.yaml')
    target_file = os.path.join(os.path.dirname(__file__), 'static', 'openapi.yaml')
    
    print(f"🔍 Looking for source file: {source_file}")
    print(f"📁 Project root: {project_root}")
    
    # Check if source file exists
    if not os.path.exists(source_file):
        print(f"❌ Error: Source file not found: {source_file}")
        # Try alternative path
        alt_source = os.path.join(os.path.dirname(__file__), '..', 'openapi.yaml')
        if os.path.exists(alt_source):
            print(f"✅ Found alternative source: {alt_source}")
            source_file = alt_source
        else:
            print(f"❌ Alternative source also not found: {alt_source}")
            sys.exit(1)
    
    # Ensure static directory exists
    static_dir = os.path.dirname(target_file)
    os.makedirs(static_dir, exist_ok=True)
    
    try:
        # Copy the file
        shutil.copy2(source_file, target_file)
        print(f"✅ Successfully updated OpenAPI spec:")
        print(f"   From: {source_file}")
        print(f"   To:   {target_file}")
        
        # Show file sizes
        source_size = os.path.getsize(source_file)
        target_size = os.path.getsize(target_file)
        print(f"   Size: {source_size} bytes")
        
        if source_size != target_size:
            print("⚠️  Warning: File sizes don't match!")
        else:
            print("✅ File sizes match - copy successful")
            
    except Exception as e:
        print(f"❌ Error copying file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    update_openapi_spec() 