# Deploy Plugin to Hostinger - Manual Instructions

## Quick Deploy (Copy/Paste These Commands)

### Step 1: Upload Plugin
```bash
scp /Users/nikhilnd/CascadeProjects/DapFlow/plugin/dapflow-blocks-dist/dapflow-blocks-with-full-hero.zip u703913049@cms.dapflow.com:/tmp/
```
*Enter your Hostinger password when prompted*

### Step 2: SSH to Server
```bash
ssh u703913049@cms.dapflow.com
```

### Step 3: Install Plugin (On Server)
```bash
cd /home/u703913049/domains/cms.dapflow.com/public_html/wp-content/plugins/

# Backup old plugin if exists
if [ -d "dapflow-blocks" ]; then
    mv dapflow-blocks dapflow-blocks-backup-$(date +%Y%m%d-%H%M%S)
fi

# Extract new plugin
mkdir -p dapflow-blocks
cd dapflow-blocks
unzip /tmp/dapflow-blocks-with-full-hero.zip

# Clean up
rm /tmp/dapflow-blocks-with-full-hero.zip

# Set permissions
chmod 755 /home/u703913049/domains/cms.dapflow.com/public_html/wp-content/plugins/dapflow-blocks
find . -type f -name "*.php" -exec chmod 644 {} \;

# Exit SSH
exit
```

### Step 4: Activate in WordPress
1. Go to: https://cms.dapflow.com/wp-admin
2. Navigate to: Plugins
3. Find: "DapFlow Blocks"
4. Click: "Activate"

### Step 5: Test
1. Pages → Add New
2. Insert "Hero Section" block
3. Edit all fields in sidebar
4. Publish
5. View on frontend

---

## Or Use the Automated Script

```bash
cd /Users/nikhilnd/CascadeProjects/DapFlow
./scripts/deploy-plugin.sh
```

This does all the steps above automatically!

