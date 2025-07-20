#!/usr/bin/env python3
"""
Minimal test Flask app
"""
from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({
        'message': 'Test Flask app is running!',
        'status': 'success'
    })

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'message': 'Test app is running'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 Starting test Flask app on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False) 