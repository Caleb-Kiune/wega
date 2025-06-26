#!/usr/bin/env python3
"""
Main application entry point for Wega Kitchenware Backend
"""
import os
from app_factory import create_app

# Get environment from environment variable
env = os.environ.get('FLASK_ENV', 'development')

# Create the application
app = create_app(env)

if __name__ == '__main__':
    # Run the application
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000)),
        debug=app.config.get('DEBUG', True)
    ) 