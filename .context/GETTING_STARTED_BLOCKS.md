# Getting Started with DapFlow Blocks

**Quick Start Guide for the Gutenberg Block System**

---

## What Was Built

A system that lets you:
1. **Create** React components with your design system (shadcn/ui + craft + Tailwind)
2. **Make them editable** in WordPress Gutenberg editor
3. **Render them** on your Next.js frontend with full design control

---

## How It Works (Simple Explanation)

```
You build React component → We make it editable in WordPress → Renders on your site
```

**Example**:
- You have a Hero section component
- Content editors can change text, colors, buttons in WordPress
- It renders on the frontend with your exact styling

---

## Installation

### 1. Install WordPress Plugin

```bash
# Go to WordPress plugins directory
cd /path/to/wordpress/wp-content/plugins/

# Copy plugin from your DapFlow project
cp -r /path/to/DapFlow/plugin/dapflow-blocks/ ./

# Install dependencies
cd dapflow-blocks
npm install

# Build plugin
npm run build
```

### 2. Activate Plugin

1. Go to WordPress Admin → Plugins
2. Find "DapFlow Blocks"
3. Click "Activate"
4. Go to "DapFlow Blocks" menu to verify installation

### 3. Test Next.js Integration

```bash
# From your DapFlow project root
npm run dev

# Visit http://localhost:3000/pages/about
# Should work (though no custom blocks yet)
```

---

## Next Steps

### Option 1: Implement Your Hero Block

We have your Hero component code. Next session, we'll:
1. Convert it to prop-driven version (small changes)
2. Create WordPress block for it
3. Test end-to-end
4. Document the pattern

**Timeline**: 2-3 hours

### Option 2: Add More Components

Give me more React components (Hero, CTA, Features, etc.) and I'll convert them to blocks.

**Timeline per block**: 2-4 hours once pattern is established

---

## Workflow (Once Setup)

### As a Developer:

1. **Give me a React component**:
   ```tsx
   // Your component from Tailwind UI, etc.
   export default function MySection() {
     return <div>...</div>
   }
   ```

2. **I convert it**:
   - Make it prop-driven
   - Create WordPress block
   - Register in system
   - Test it

3. **You review and approve**

### As a Content Editor:

1. Open page in WordPress
2. Click "+" to add block
3. Search "DapFlow"
4. Insert block (Hero, CTA, etc.)
5. Edit content in sidebar
6. Publish
7. See it live on your site

---

## Current Status

✅ **Phase 1 Complete**: Foundation
- WordPress plugin infrastructure
- Next.js block system
- REST API extension
- Type definitions
- Documentation

⏳ **Phase 2 Next**: Your Hero Block
- Convert your Hero component
- Create WordPress block
- Test complete flow

⏸️ **Phase 3 Later**: More Blocks
- As you provide components
- Repeatable pattern established

---

## File Locations

### WordPress Plugin
```
/plugin/dapflow-blocks/
├── dapflow-blocks.php        # Main file
├── includes/                 # PHP classes
├── blocks/                   # Block definitions (empty for now)
├── src/                      # JavaScript source
└── build/                    # Compiled JavaScript
```

### Next.js
```
/lib/blocks/
├── block-renderer.tsx        # Main renderer
├── block-registry.ts         # Component mapping
└── types.ts                  # TypeScript types

/components/blocks/
└── (your block components)   # To be added
```

---

## Testing

### Test WordPress Plugin

```bash
# Check if plugin is active
wp plugin list

# Check REST API
curl https://cms.dapflow.com/wp-json/wp/v2/pages/123
# Should include "blocks" field
```

### Test Next.js

```bash
npm run dev

# Visit any page
# Should render without errors
# HTML fallback working for existing content
```

---

## Troubleshooting

### WordPress plugin won't activate

```bash
# Check PHP errors
tail -f /path/to/wordpress/wp-content/debug.log

# Check PHP version
php -v
# Need PHP 8.0+
```

### Build fails

```bash
# Reinstall dependencies
cd /path/to/plugin/dapflow-blocks
rm -rf node_modules
npm install
npm run build
```

### Next.js errors

```bash
# Check TypeScript
npm run build

# Check for type errors
# Fix any import issues
```

---

## Documentation

### Full Documentation

- [ADR-2025-001](.context/decisions/ADR-2025-001-gutenberg-block-system.md) - Architecture decisions
- [Feature Spec](.context/features/gutenberg_blocks.md) - Detailed feature specification
- [Session SES-2025-001](.context/sessions/SES-2025-001-gutenberg-block-system-foundation.md) - Implementation session notes

### Quick References

- [WordPress Block API](https://developer.wordpress.org/block-editor/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Your site.config.ts](./site.config.ts) - Site configuration

---

## Support

Questions? Issues? Ask in your next session:
- How to add new blocks
- How to modify existing blocks
- How to debug issues
- How to extend the system

---

## What's Next?

**Ready to implement your Hero block?**

Just say "let's do the Hero block" and I'll:
1. Convert your Hero component to prop-driven
2. Create WordPress Hero block with full editing controls
3. Test it end-to-end
4. Show you how to add more blocks yourself

**Or:**

Give me more React components and I'll convert them all!

---

**Status**: ✅ Foundation complete. Ready for block implementation.

