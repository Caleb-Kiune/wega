#!/bin/bash

echo "🔧 Testing Railway Connection After Redeployment"
echo "================================================"
echo ""

echo "📊 Checking backend health..."
curl -s "https://wega-production.up.railway.app/health" | jq '.'

echo ""
echo "📦 Checking products endpoint..."
curl -s "https://wega-production.up.railway.app/api/products?limit=1" | jq '.'

echo ""
echo "📂 Checking categories endpoint..."
curl -s "https://wega-production.up.railway.app/api/categories" | jq '.'

echo ""
echo "🏷️  Checking brands endpoint..."
curl -s "https://wega-production.up.railway.app/api/brands" | jq '.'

echo ""
echo "✅ Test completed!"
echo ""
echo "If you see data instead of errors, the connection is working!" 