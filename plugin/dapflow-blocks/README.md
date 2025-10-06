# DapFlow Blocks

Custom Gutenberg blocks for DapFlow that integrate seamlessly with the Next.js frontend.

## Overview

This WordPress plugin provides custom Gutenberg blocks that:
- Are editable in the WordPress block editor
- Expose structured data via REST API
- Render as React components on the Next.js frontend
- Maintain design system consistency (shadcn/ui + craft + Tailwind)

## Installation

1. Upload the `dapflow-blocks` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Navigate to "DapFlow Blocks" in the admin menu to see registered blocks

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm
- WordPress 6.0+
- PHP 8.0+

### Setup

```bash
cd /path/to/wp-content/plugins/dapflow-blocks
npm install
npm run start  # Development mode with hot reload
```

### Build for Production

```bash
npm run build
```

## Architecture

### Block Flow

```
WordPress Editor → Block Attributes → Database
                                         ↓
                                   REST API
                                         ↓
                                   Next.js
                                         ↓
                                React Component
```

### File Structure

```
dapflow-blocks/
├── dapflow-blocks.php          # Main plugin file
├── includes/
│   ├── class-block-registry.php
│   ├── class-rest-api.php
│   └── class-admin.php
├── blocks/
│   └── [block-name]/
│       ├── block.json
│       ├── edit.js
│       ├── index.js
│       └── style.scss
├── src/
│   ├── index.js
│   └── styles/
└── build/                      # Compiled assets
```

## Creating New Blocks

See the template in `blocks/_template/` for reference.

1. Create a new folder in `blocks/` (e.g., `blocks/hero/`)
2. Add `block.json` with block metadata
3. Create `edit.js` with editor UI
4. Create `index.js` to register the block
5. Run `npm run build`

The block will automatically be registered and available in the WordPress editor.

## REST API

The plugin extends the WordPress REST API to include block data:

```
GET /wp-json/wp/v2/pages/{id}

Response includes:
{
  "blocks": [
    {
      "blockName": "dapflow/hero",
      "attrs": { ... },
      "innerBlocks": []
    }
  ]
}
```

## Integration with Next.js

See the Next.js codebase for the block renderer:
- `/lib/blocks/block-renderer.tsx`
- `/lib/blocks/block-registry.ts`
- `/components/blocks/`

## Version

1.0.0

## License

GPL v2 or later

