#!/usr/bin/env python3
"""
WSGI entry point for Railway deployment
"""
import os
from app_factory import create_app

# Create the application (migration will be handled in app_factory.py)
app = create_app()

# This is the app that Gunicorn will use
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 Starting Flask app on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False) 