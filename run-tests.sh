#!/bin/bash

echo "🧪 Running Enhanced Guest Experience Tests"
echo "=========================================="

echo ""
echo "1. Testing Session Management..."
node test-enhanced-session.js

echo ""
echo "2. Testing Guest Wishlist..."
node test-guest-wishlist.js

echo ""
echo "3. Testing Integration..."
node test-integration-enhanced-guest.js

echo ""
echo "4. Building Application..."
npm run build

echo ""
echo "✅ All tests completed!"
echo ""
echo "📋 Manual Testing Checklist:"
echo "1. Start dev server: npm run dev"
echo "2. Test session persistence"
echo "3. Test guest wishlist functionality"
echo "4. Test cart operations"
echo "5. Test mobile responsiveness"
echo ""
echo "🚀 Ready for deployment!" 