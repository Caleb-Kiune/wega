#!/bin/bash

echo "🚀 Starting Wega Kitchenware Setup"
echo "=================================="

# Navigate to backend directory
cd backend

echo "📁 Current directory: $(pwd)"

# Check if Python is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python not found!"
    exit 1
fi

echo "🐍 Using Python: $PYTHON_CMD"

# Run the database fix
echo "🔧 Fixing admin_users table..."
$PYTHON_CMD simple_fix.py

if [ $? -eq 0 ]; then
    echo "✅ Database fix completed successfully!"
else
    echo "❌ Database fix failed!"
    exit 1
fi

# Check if the table was created
echo "🔍 Verifying database..."
$PYTHON_CMD -c "
import sqlite3
conn = sqlite3.connect('app.db')
cursor = conn.cursor()
cursor.execute('SELECT name FROM sqlite_master WHERE type=\"table\" AND name=\"admin_users\"')
result = cursor.fetchone()
if result:
    print('✅ admin_users table exists')
    cursor.execute('SELECT COUNT(*) FROM admin_users')
    count = cursor.fetchone()[0]
    print(f'Number of admin users: {count}')
else:
    print('❌ admin_users table not found')
conn.close()
"

# Start the backend server
echo "🚀 Starting backend server..."
$PYTHON_CMD run.py &

# Wait a moment for the server to start
sleep 3

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend server is running on http://localhost:5000"
else
    echo "⚠️ Backend server might not be running properly"
fi

echo ""
echo "🎉 Setup complete!"
echo "=================="
echo "Backend URL: http://localhost:5000"
echo "Admin Login: http://localhost:3000/admin/login"
echo ""
echo "Default Admin Credentials:"
echo "Username: admin"
echo "Email: admin@wega-kitchenware.com"
echo "Password: Admin123!"
echo ""
echo "⚠️ Remember to change the default password after first login!" 