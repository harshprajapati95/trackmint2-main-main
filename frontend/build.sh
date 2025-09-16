#!/bin/bash
# Render build script for frontend static site

# Set Node environment
export NODE_ENV=production

# Print environment info for debugging
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Make sure Root Directory is set to 'frontend' in Render settings."
    exit 1
fi

# Clean install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production --legacy-peer-deps

# Install dev dependencies needed for build
echo "🔧 Installing dev dependencies..."
npm install --only=dev --legacy-peer-deps

# Build the application
echo "🏗️ Building application..."
npm run build

# Verify build output
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output:"
    ls -la dist/
else
    echo "❌ Build failed - dist directory not found"
    exit 1
fi