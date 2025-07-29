#!/bin/bash

echo "🔧 Running Database Fix"
echo "======================"

# Run the table fix script
python scripts/fix_admin_users_table.py

if [ $? -eq 0 ]; then
    echo "✅ Database fix completed successfully!"
    echo ""
    echo "🎉 You can now login with:"
    echo "   Username: admin"
    echo "   Password: Admin123!"
    echo ""
    echo "🌐 Frontend URL: https://wega-chi.vercel.app/admin/login"
else
    echo "❌ Database fix failed!"
    exit 1
fi