#!/bin/bash

echo "🔧 Testing Railway Database Connection"
echo "====================================="
echo ""

echo "📊 Checking backend health..."
curl -s "https://wega-production.up.railway.app/health" | jq '.'

echo ""
echo "📦 Checking products endpoint..."
curl -s "https://wega-production.up.railway.app/api/products?limit=1" | jq '.'

echo ""
echo "✅ Test completed!"
echo ""
echo "If you see products with data, the connection is working!"
echo "If you see empty products or errors, the connection needs fixing." 