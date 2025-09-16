#!/bin/bash
# Render build script for frontend static site
echo "Starting frontend build..."
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Ensure we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Make sure Root Directory is set to 'frontend' in Render."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the application
echo "Building application..."
npm run build

echo "Build completed successfully!"
echo "Build output:"
ls -la dist/