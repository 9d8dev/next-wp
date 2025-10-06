#!/bin/bash

# DapFlow Blocks - Build Plugin for Distribution
# Creates a clean version without development dependencies

echo "🔨 Building DapFlow Blocks plugin for distribution..."

# Build the plugin
echo "Building JavaScript..."
npm run build

# Create distribution directory
DIST_DIR="../dapflow-blocks-dist"
rm -rf $DIST_DIR
mkdir -p $DIST_DIR

echo "📦 Copying files..."

# Copy necessary files
cp dapflow-blocks.php $DIST_DIR/
cp README.md $DIST_DIR/
cp -r includes $DIST_DIR/
cp -r blocks $DIST_DIR/
cp -r build $DIST_DIR/

echo "📊 Distribution size:"
du -sh $DIST_DIR

echo ""
echo "✅ Distribution ready at: $DIST_DIR"
echo ""
echo "To deploy to WordPress:"
echo "1. Zip the distribution: cd $DIST_DIR && zip -r dapflow-blocks.zip ."
echo "2. Upload to WordPress: wp-content/plugins/"
echo "3. Or rsync: rsync -av $DIST_DIR/ user@server:/path/to/wp-content/plugins/dapflow-blocks/"

