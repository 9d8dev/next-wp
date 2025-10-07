#!/bin/bash

# DapFlow Blocks - Deploy to Hostinger
# Uploads the plugin to WordPress on Hostinger

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "🚀 DapFlow Blocks - Deploy to Hostinger"
echo "========================================"
echo ""

# Configuration
HOSTINGER_USER="u703913049"
HOSTINGER_HOST="cms.dapflow.com"
REMOTE_PATH="/home/u703913049/domains/cms.dapflow.com/public_html/wp-content/plugins/"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOCAL_ZIP="$PROJECT_ROOT/plugin/dapflow-blocks-dist/dapflow-blocks-v3-safe.zip"

# Check if zip file exists
if [ ! -f "$LOCAL_ZIP" ]; then
    echo -e "${RED}❌ Error: Plugin zip not found at $LOCAL_ZIP${NC}"
    echo "Run: cd plugin/dapflow-blocks && ./build-plugin.sh"
    exit 1
fi

echo -e "${GREEN}✓${NC} Found plugin zip: $LOCAL_ZIP"
echo ""

# Ask for confirmation
echo "This will:"
echo "  1. Upload plugin to: $HOSTINGER_HOST"
echo "  2. Extract to: $REMOTE_PATH"
echo "  3. Set correct permissions"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "📤 Uploading plugin to Hostinger..."

# Upload zip file
scp "$LOCAL_ZIP" "$HOSTINGER_USER@$HOSTINGER_HOST:/tmp/dapflow-blocks.zip"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Upload failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Upload complete"
echo ""

echo "📦 Installing plugin on server..."

# SSH to server and install
ssh "$HOSTINGER_USER@$HOSTINGER_HOST" << 'ENDSSH'
set -e

cd /home/u703913049/domains/cms.dapflow.com/public_html/wp-content/plugins/

# Backup old plugin if it exists
if [ -d "dapflow-blocks" ]; then
    echo "  → Backing up old plugin..."
    mv dapflow-blocks dapflow-blocks-backup-$(date +%Y%m%d-%H%M%S)
fi

# Create directory and extract
echo "  → Extracting plugin..."
mkdir -p dapflow-blocks
cd dapflow-blocks
unzip -q /tmp/dapflow-blocks.zip

# Set permissions
echo "  → Setting permissions..."
chmod 755 /home/u703913049/domains/cms.dapflow.com/public_html/wp-content/plugins/dapflow-blocks
find . -type f -name "*.php" -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;

# Clean up
rm /tmp/dapflow-blocks.zip

echo "  ✓ Installation complete!"
ENDSSH

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Installation failed!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Plugin deployed successfully!${NC}"
echo ""
echo "Next steps:"
echo "  1. Go to WordPress Admin: https://cms.dapflow.com/wp-admin"
echo "  2. Navigate to Plugins"
echo "  3. Activate 'DapFlow Blocks'"
echo "  4. Test by creating a page with Hero blocks"
echo ""
echo "Available blocks:"
echo "  - Hero Section (Full) - Complete with all features"
echo "  - Hero Basic - Simplified version"
echo "  - Hero Ultra Simple - Minimal version"
echo ""

