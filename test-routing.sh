#!/usr/bin/env bash
set -Eeuo pipefail

# Test script to verify GitHub Pages routing works correctly
# This simulates accessing a deep link directly

echo "🧪 Testing GitHub Pages SPA Routing Solution"
echo "============================================"
echo ""

# Check if dist exists
if [ ! -d "dist" ]; then
  echo "❌ Error: dist directory not found. Run 'npm run build' first."
  exit 1
fi

# Check if 404.html exists
if [ ! -f "dist/404.html" ]; then
  echo "❌ Error: dist/404.html not found."
  exit 1
fi

echo "✅ dist/404.html exists"

# Check if index.html exists
if [ ! -f "dist/index.html" ]; then
  echo "❌ Error: dist/index.html not found."
  exit 1
fi

echo "✅ dist/index.html exists"

# Check if 404.html contains the redirect script
if grep -q "sessionStorage.redirect" dist/404.html; then
  echo "✅ 404.html contains redirect script"
else
  echo "❌ Error: 404.html missing redirect script"
  exit 1
fi

# Check if index.html contains the restore script
if grep -q "sessionStorage.redirect" dist/index.html; then
  echo "✅ index.html contains restore script"
else
  echo "❌ Error: index.html missing restore script"
  exit 1
fi

echo ""
echo "✨ All routing checks passed!"
echo ""
echo "📝 To test in production:"
echo "   1. Commit and push your changes"
echo "   2. Wait for GitHub Actions to deploy"
echo "   3. Try accessing a direct URL like:"
echo "      https://own3dh2so4.github.io/cursor-beer-glasses/heineken"
echo ""
echo "🚀 In development, Vite handles routing automatically."

